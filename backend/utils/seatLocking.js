const Show = require('../models/Show');

const LOCK_DURATION_MS = 5 * 60 * 1000;

const seatKey = (seat = {}) => `${String(seat.row || '').toUpperCase()}-${Number(seat.number || 0)}`;

const normalizeSeatInput = (seat = {}) => ({
  row: String(seat.row || '').toUpperCase(),
  number: Number(seat.number),
  class: seat.class ? String(seat.class).toLowerCase() : undefined
});

const uniqueSeats = (seats = []) => {
  const seen = new Set();
  return seats
    .map(normalizeSeatInput)
    .filter((seat) => seat.row && Number.isFinite(seat.number))
    .filter((seat) => {
      const key = seatKey(seat);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const isExpired = (seat, now = new Date()) => (
  seat?.status === 'locked' &&
  seat?.lockedUntil &&
  new Date(seat.lockedUntil).getTime() <= now.getTime()
);

const cleanupExpiredLocks = async (show) => {
  if (!show?.seats?.length) {
    return show;
  }

  const now = new Date();
  let changed = false;

  show.seats.forEach((seat) => {
    if (isExpired(seat, now)) {
      seat.status = 'available';
      seat.lockedBy = undefined;
      seat.lockedUntil = undefined;
      changed = true;
    }
  });

  if (changed) {
    show.availableSeats = show.seats.filter((seat) => seat.status === 'available').length;
    await show.save();
  }

  return show;
};

const serializeShow = (show, userId) => {
  if (!show) return show;

  const now = new Date();
  const normalized = show.toObject ? show.toObject() : show;
  const currentUserId = userId ? String(userId) : null;

  normalized.seats = (normalized.seats || []).map((seat) => {
    const lockedByCurrentUser = currentUserId && seat.lockedBy && String(seat.lockedBy) === currentUserId;

    if (isExpired(seat, now)) {
      return {
        ...seat,
        status: 'available',
        lockedBy: undefined,
        lockedUntil: undefined,
        isLockedByCurrentUser: false
      };
    }

    return {
      ...seat,
      isLockedByCurrentUser: Boolean(lockedByCurrentUser)
    };
  });

  normalized.availableSeats = normalized.seats.filter((seat) => seat.status === 'available').length;

  return normalized;
};

const holdSeat = async ({ showId, userId, seat, expiresAt }) => {
  const now = new Date();

  const result = await Show.updateOne(
    {
      _id: showId,
      seats: {
        $elemMatch: {
          row: seat.row,
          number: seat.number,
          $or: [
            { status: 'available' },
            { status: 'locked', lockedBy: userId },
            { status: 'locked', lockedUntil: { $lte: now } }
          ]
        }
      }
    },
    {
      $set: {
        'seats.$.status': 'locked',
        'seats.$.lockedBy': userId,
        'seats.$.lockedUntil': expiresAt
      }
    }
  );

  return result.modifiedCount === 1;
};

const releaseSeat = async ({ showId, userId, seat, force = false }) => {
  const elemMatch = {
    row: seat.row,
    number: seat.number
  };

  if (!force) {
    elemMatch.lockedBy = userId;
  }

  const result = await Show.updateOne(
    {
      _id: showId,
      seats: { $elemMatch: elemMatch }
    },
    {
      $set: {
        'seats.$.status': 'available'
      },
      $unset: {
        'seats.$.lockedBy': 1,
        'seats.$.lockedUntil': 1
      }
    }
  );

  return result.modifiedCount === 1;
};

const bookSeat = async ({ showId, userId, seat }) => {
  const result = await Show.updateOne(
    {
      _id: showId,
      seats: {
        $elemMatch: {
          row: seat.row,
          number: seat.number,
          status: 'locked',
          lockedBy: userId,
          lockedUntil: { $gt: new Date() }
        }
      }
    },
    {
      $set: {
        'seats.$.status': 'booked'
      },
      $unset: {
        'seats.$.lockedBy': 1,
        'seats.$.lockedUntil': 1
      }
    }
  );

  return result.modifiedCount === 1;
};

const syncAvailableSeatCount = async (showId) => {
  const show = await Show.findById(showId);
  if (!show) return null;

  await cleanupExpiredLocks(show);
  const availableSeats = (show.seats || []).filter((seat) => seat.status === 'available').length;

  if (show.availableSeats !== availableSeats) {
    show.availableSeats = availableSeats;
    await show.save();
  }

  return show;
};

const holdSeats = async ({ showId, userId, seats }) => {
  const normalizedSeats = uniqueSeats(seats);
  if (!normalizedSeats.length) {
    throw new Error('At least one valid seat is required');
  }

  const show = await Show.findById(showId);
  if (!show) {
    throw new Error('Show not found');
  }

  await cleanupExpiredLocks(show);

  const expiresAt = new Date(Date.now() + LOCK_DURATION_MS);
  const heldSeats = [];

  for (const seat of normalizedSeats) {
    const locked = await holdSeat({ showId, userId, seat, expiresAt });
    if (!locked) {
      for (const heldSeat of heldSeats) {
        await releaseSeat({ showId, userId, seat: heldSeat, force: false });
      }
      throw new Error(`Seat ${seat.row}${seat.number} is no longer available`);
    }
    heldSeats.push(seat);
  }

  return syncAvailableSeatCount(showId);
};

const releaseSeats = async ({ showId, userId, seats, force = false }) => {
  const normalizedSeats = uniqueSeats(seats);
  for (const seat of normalizedSeats) {
    await releaseSeat({ showId, userId, seat, force });
  }

  return syncAvailableSeatCount(showId);
};

const bookSeats = async ({ showId, userId, seats }) => {
  const normalizedSeats = uniqueSeats(seats);
  if (!normalizedSeats.length) {
    throw new Error('At least one valid seat is required');
  }

  const show = await Show.findById(showId);
  if (!show) {
    throw new Error('Show not found');
  }

  await cleanupExpiredLocks(show);

  const bookedSeats = [];

  for (const seat of normalizedSeats) {
    const booked = await bookSeat({ showId, userId, seat });
    if (!booked) {
      throw new Error(`Seat ${seat.row}${seat.number} is not locked for this user anymore`);
    }
    bookedSeats.push(seat);
  }

  return syncAvailableSeatCount(showId);
};

module.exports = {
  LOCK_DURATION_MS,
  cleanupExpiredLocks,
  serializeShow,
  holdSeats,
  releaseSeats,
  bookSeats,
  uniqueSeats
};
