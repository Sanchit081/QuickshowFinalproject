const express = require("express");
const { protect, admin } = require("../middleware/auth");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Helper function to create shows for a movie
const createShowsForMovie = async (movieId) => {
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return { created: 0, message: "Movie not found" };
    }
    
    // ALWAYS set isNowShowing to true and create shows for ALL movies
    if (!movie.isNowShowing) {
      await Movie.findByIdAndUpdate(movieId, { isNowShowing: true });
      movie.isNowShowing = true;
    }

    const cinemas = await Cinema.find({});
    if (cinemas.length === 0) {
      return { created: 0, message: "No cinemas available" };
    }

    const inferSeatClass = (rowLabel) => {
      const row = (rowLabel || "").toUpperCase();
      const priorityRows = ["A", "B"];
      const goldRows = ["C", "D", "E"];
      if (priorityRows.includes(row)) return "platinum";
      if (goldRows.includes(row)) return "gold";
      return "silver";
    };

    // Generate dates for next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    const times = ['10:00', '13:30', '16:00', '19:00', '22:00'];
    let createdCount = 0;

    for (const cinema of cinemas) {
      // Initialize seats
      const seats = [];
      if (cinema.seatLayout && cinema.seatLayout.seats && cinema.seatLayout.seats.length > 0) {
        cinema.seatLayout.seats.forEach((seat) => {
          seats.push({
            row: seat.row,
            number: seat.number,
            class: seat.class || inferSeatClass(seat.row),
            status: "available",
          });
        });
      } else {
        const rows = cinema.seatLayout?.rows || 10;
        const seatsPerRow = cinema.seatLayout?.seatsPerRow || 20;
        const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        for (let i = 0; i < rows; i++) {
          for (let j = 1; j <= seatsPerRow; j++) {
            let seatClass = 'silver';
            if (i < 2) seatClass = 'platinum';
            else if (i < 5) seatClass = 'gold';
            
            seats.push({
              row: rowLabels[i] || String.fromCharCode(65 + i),
              number: j,
              class: seatClass,
              status: "available",
            });
          }
        }
      }

      for (const date of dates) {
        for (const time of times) {
          const existingShow = await Show.findOne({
            movieId: movie._id,
            cinemaId: cinema._id,
            date: date,
            time: time
          });

          if (!existingShow) {
            const show = await Show.create({
              movieId: movie._id,
              cinemaId: cinema._id,
              date: date,
              time: time,
              seatPricing: {
                platinum: 400,
                gold: 250,
                silver: 180,
              },
              seats: seats.map(s => ({ ...s })),
              totalSeats: seats.length,
              availableSeats: seats.length,
            });

            await Cinema.findByIdAndUpdate(cinema._id, {
              $push: { shows: show._id },
            });

            createdCount++;
          }
        }
      }
    }

    return { created: createdCount, message: `Created ${createdCount} shows` };
  } catch (error) {
    console.error("Error creating shows:", error);
    return { created: 0, message: error.message };
  }
};

// ========== MOVIES MANAGEMENT ==========

// @route   POST /api/admin/movies
// @desc    Create movie
router.post(
  "/movies",
  protect,
  admin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const movieData = req.body;
      if (req.files?.poster) {
        movieData.poster = `/uploads/${req.files.poster[0].filename}`;
      }
      if (req.files?.banner) {
        movieData.banner = `/uploads/${req.files.banner[0].filename}`;
      }

      // Ensure isNowShowing is true by default if not specified
      if (movieData.isNowShowing === undefined || movieData.isNowShowing === '') {
        movieData.isNowShowing = true;
      }
      if (movieData.isNowShowing === 'true' || movieData.isNowShowing === true) {
        movieData.isNowShowing = true;
      } else {
        movieData.isNowShowing = false;
      }
      
      const movie = await Movie.create(movieData);
      
      // ALWAYS automatically create shows for new movies
      let showsCreated = 0;
      const showResult = await createShowsForMovie(movie._id);
      showsCreated = showResult.created;
      console.log(`✅ Auto-created ${showsCreated} shows for movie: ${movie.title}`);
      
      res.status(201).json({ 
        success: true, 
        movie,
        showsCreated: showsCreated,
        message: `Movie added successfully. Created ${showsCreated} shows.`
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   POST /api/admin/movies/create-all-shows
// @desc    Create shows for all movies that don't have shows
// NOTE: This must come BEFORE /movies/:id routes to avoid route matching conflicts
router.post("/movies/create-all-shows", protect, admin, async (req, res) => {
  try {
    const movies = await Movie.find({ isNowShowing: true });
    const cinemas = await Cinema.find({});
    
    if (cinemas.length === 0) {
      return res.status(400).json({ message: "No cinemas available. Please create cinemas first." });
    }

    const inferSeatClass = (rowLabel) => {
      const row = (rowLabel || "").toUpperCase();
      const priorityRows = ["A", "B"];
      const goldRows = ["C", "D", "E"];
      if (priorityRows.includes(row)) return "platinum";
      if (goldRows.includes(row)) return "gold";
      return "silver";
    };

    // Generate dates for next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    const times = ['10:00', '13:30', '16:00', '19:00', '22:00'];
    let totalCreated = 0;

    for (const movie of movies) {
      for (const cinema of cinemas) {
        // Initialize seats
        const seats = [];
        if (cinema.seatLayout && cinema.seatLayout.seats && cinema.seatLayout.seats.length > 0) {
          cinema.seatLayout.seats.forEach((seat) => {
            seats.push({
              row: seat.row,
              number: seat.number,
              class: seat.class || inferSeatClass(seat.row),
              status: "available",
            });
          });
        } else {
          const rows = cinema.seatLayout?.rows || 10;
          const seatsPerRow = cinema.seatLayout?.seatsPerRow || 20;
          const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
          
          for (let i = 0; i < rows; i++) {
            for (let j = 1; j <= seatsPerRow; j++) {
              let seatClass = 'silver';
              if (i < 2) seatClass = 'platinum';
              else if (i < 5) seatClass = 'gold';
              
              seats.push({
                row: rowLabels[i] || String.fromCharCode(65 + i),
                number: j,
                class: seatClass,
                status: "available",
              });
            }
          }
        }

        for (const date of dates) {
          for (const time of times) {
            const existingShow = await Show.findOne({
              movieId: movie._id,
              cinemaId: cinema._id,
              date: date,
              time: time
            });

            if (!existingShow) {
              const show = await Show.create({
                movieId: movie._id,
                cinemaId: cinema._id,
                date: date,
                time: time,
                seatPricing: {
                  platinum: 400,
                  gold: 250,
                  silver: 180,
                },
                seats: seats.map(s => ({ ...s })),
                totalSeats: seats.length,
                availableSeats: seats.length,
              });

              await Cinema.findByIdAndUpdate(cinema._id, {
                $push: { shows: show._id },
              });

              totalCreated++;
            }
          }
        }
      }
    }

    res.json({
      success: true,
      message: `Created ${totalCreated} shows for ${movies.length} movies`,
      count: totalCreated,
      moviesProcessed: movies.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/admin/movies/:id/create-shows
// @desc    Create default shows for a movie
router.post("/movies/:id/create-shows", protect, admin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const cinemas = await Cinema.find({});
    if (cinemas.length === 0) {
      return res.status(400).json({ message: "No cinemas available. Please create cinemas first." });
    }

    const inferSeatClass = (rowLabel) => {
      const row = (rowLabel || "").toUpperCase();
      const priorityRows = ["A", "B"];
      const goldRows = ["C", "D", "E"];
      if (priorityRows.includes(row)) return "platinum";
      if (goldRows.includes(row)) return "gold";
      return "silver";
    };

    // Generate dates for next 7 days (set to midnight for proper matching)
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    // Default show times
    const times = ['10:00', '13:30', '16:00', '19:00', '22:00'];

    const shows = [];
    let createdCount = 0;

    for (const cinema of cinemas) {
      // Initialize seats based on cinema layout
      const seats = [];
      if (cinema.seatLayout && cinema.seatLayout.seats && cinema.seatLayout.seats.length > 0) {
        cinema.seatLayout.seats.forEach((seat) => {
          seats.push({
            row: seat.row,
            number: seat.number,
            class: seat.class || inferSeatClass(seat.row),
            status: "available",
          });
        });
      } else {
        // Fallback: Generate default seats
        const rows = cinema.seatLayout?.rows || 10;
        const seatsPerRow = cinema.seatLayout?.seatsPerRow || 20;
        const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        
        for (let i = 0; i < rows; i++) {
          for (let j = 1; j <= seatsPerRow; j++) {
            let seatClass = 'silver';
            if (i < 2) seatClass = 'platinum';
            else if (i < 5) seatClass = 'gold';
            
            seats.push({
              row: rowLabels[i] || String.fromCharCode(65 + i),
              number: j,
              class: seatClass,
              status: "available",
            });
          }
        }
      }

      for (const date of dates) {
        for (const time of times) {
          // Check if show already exists
          const existingShow = await Show.findOne({
            movieId: movie._id,
            cinemaId: cinema._id,
            date: date,
            time: time
          });

          if (!existingShow) {
            const show = await Show.create({
              movieId: movie._id,
              cinemaId: cinema._id,
              date: date,
              time: time,
              seatPricing: {
                platinum: 400,
                gold: 250,
                silver: 180,
              },
              seats: seats.map(s => ({ ...s })),
              totalSeats: seats.length,
              availableSeats: seats.length,
            });

            await Cinema.findByIdAndUpdate(cinema._id, {
              $push: { shows: show._id },
            });

            createdCount++;
          }
        }
      }
    }

    res.json({
      success: true,
      message: `Created ${createdCount} shows for ${movie.title}`,
      count: createdCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/admin/movies/:id
// @desc    Update movie
router.put(
  "/movies/:id",
  protect,
  admin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const movieData = req.body;
      if (req.files?.poster) {
        movieData.poster = `/uploads/${req.files.poster[0].filename}`;
      }
      if (req.files?.banner) {
        movieData.banner = `/uploads/${req.files.banner[0].filename}`;
      }

      const oldMovie = await Movie.findById(req.params.id);
      const movie = await Movie.findByIdAndUpdate(req.params.id, movieData, {
        new: true,
      });
      
      // Automatically create shows if movie is updated to "Now Showing"
      let showsCreated = 0;
      if (movie.isNowShowing) {
        const showResult = await createShowsForMovie(movie._id);
        showsCreated = showResult.created;
        console.log(`Auto-created ${showsCreated} shows for updated movie: ${movie.title}`);
      }
      
      res.json({ 
        success: true, 
        movie,
        showsCreated: showsCreated
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   DELETE /api/admin/movies/:id
// @desc    Delete movie
router.delete("/movies/:id", protect, admin, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========== CINEMAS MANAGEMENT ==========

// @route   POST /api/admin/cinemas
// @desc    Create cinema
router.post("/cinemas", protect, admin, async (req, res) => {
  try {
    const { name, city, address, location, amenities, rows, seatsPerRow } = req.body;
    
    // Validate required fields
    if (!name || !city || !address) {
      return res.status(400).json({ message: "Name, city, and address are required" });
    }

    // Generate seat layout if not provided
    let seatLayout = req.body.seatLayout;
    if (!seatLayout || !seatLayout.seats || seatLayout.seats.length === 0) {
      const numRows = rows || seatLayout?.rows || 10;
      const numSeatsPerRow = seatsPerRow || seatLayout?.seatsPerRow || 20;
      
      const seats = [];
      const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      
      for (let i = 0; i < numRows; i++) {
        for (let j = 1; j <= numSeatsPerRow; j++) {
          let seatClass = 'silver';
          if (i < 2) seatClass = 'platinum';
          else if (i < 5) seatClass = 'gold';
          
          seats.push({
            row: rowLabels[i] || String.fromCharCode(65 + i),
            number: j,
            class: seatClass,
            isAvailable: true
          });
        }
      }
      
      seatLayout = {
        rows: numRows,
        seatsPerRow: numSeatsPerRow,
        seats: seats
      };
    }

    const cinemaData = {
      name,
      city,
      address,
      location: location || {},
      amenities: amenities || [],
      seatLayout: seatLayout,
      shows: []
    };

    const cinema = await Cinema.create(cinemaData);
    console.log(`✅ Created cinema: ${cinema.name} with ${cinema.seatLayout.seats.length} seats`);
    res.status(201).json({ success: true, cinema });
  } catch (error) {
    console.error('❌ Error creating cinema:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/admin/cinemas/:id
// @desc    Update cinema
router.put("/cinemas/:id", protect, admin, async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, cinema });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/admin/cinemas/:id
// @desc    Delete cinema
router.delete("/cinemas/:id", protect, admin, async (req, res) => {
  try {
    await Cinema.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Cinema deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========== SHOWS MANAGEMENT ==========

// @route   POST /api/admin/shows
// @desc    Create show
router.post("/shows", protect, admin, async (req, res) => {
  try {
    const { movieId, cinemaId, date, time, seatPricing } = req.body;

    // Validate movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    // Normalize date to midnight for proper matching
    let showDate = new Date(date);
    showDate.setHours(0, 0, 0, 0);

    const inferSeatClass = (rowLabel) => {
      const row = (rowLabel || "").toUpperCase();
      const priorityRows = ["A", "B"];
      const goldRows = ["C", "D", "E"];
      if (priorityRows.includes(row)) return "platinum";
      if (goldRows.includes(row)) return "gold";
      return "silver";
    };

    // Initialize seats based on cinema layout
    const seats = [];
    if (cinema.seatLayout && cinema.seatLayout.seats && cinema.seatLayout.seats.length > 0) {
      cinema.seatLayout.seats.forEach((seat) => {
        seats.push({
          row: seat.row,
          number: seat.number,
          class: seat.class || inferSeatClass(seat.row),
          status: "available",
        });
      });
    } else {
      // Fallback: Generate default seats if cinema doesn't have seat layout
      const rows = cinema.seatLayout?.rows || 10;
      const seatsPerRow = cinema.seatLayout?.seatsPerRow || 20;
      const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      
      for (let i = 0; i < rows; i++) {
        for (let j = 1; j <= seatsPerRow; j++) {
          let seatClass = 'silver';
          if (i < 2) seatClass = 'platinum';
          else if (i < 5) seatClass = 'gold';
          
          seats.push({
            row: rowLabels[i] || String.fromCharCode(65 + i),
            number: j,
            class: seatClass,
            status: "available",
          });
        }
      }
    }

    const show = await Show.create({
      movieId,
      cinemaId,
      date: showDate,
      time,
      seatPricing: seatPricing || {
        platinum: 400,
        gold: 250,
        silver: 180,
      },
      seats,
      totalSeats: seats.length,
      availableSeats: seats.length,
    });

    await Cinema.findByIdAndUpdate(cinemaId, {
      $push: { shows: show._id },
    });

    res.status(201).json({ success: true, show });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/admin/shows/:id
// @desc    Update show
router.put("/shows/:id", protect, admin, async (req, res) => {
  try {
    const { movieId, cinemaId, date, time, seatPricing } = req.body;
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const updateData = {};
    if (movieId) updateData.movieId = movieId;
    if (cinemaId) updateData.cinemaId = cinemaId;
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (seatPricing) updateData.seatPricing = seatPricing;

    const updatedShow = await Show.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .populate("movieId")
      .populate("cinemaId");

    res.json({ success: true, show: updatedShow });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/admin/shows/:id
// @desc    Delete show
router.delete("/shows/:id", protect, admin, async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Remove show from cinema
    await Cinema.findByIdAndUpdate(show.cinemaId, {
      $pull: { shows: show._id },
    });

    // Delete show
    await Show.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Show deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========== BOOKINGS MANAGEMENT ==========

// @route   GET /api/admin/bookings
// @desc    Get all bookings
router.get("/bookings", protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate({
        path: "showId",
        populate: [{ path: "movieId" }, { path: "cinemaId" }],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/admin/bookings/:id/cancel
// @desc    Cancel booking
router.put("/bookings/:id/cancel", protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "refunded";
    await booking.save();

    // Free up seats
    const show = await Show.findById(booking.showId);
    booking.seats.forEach((seat) => {
      const seatIndex = show.seats.findIndex(
        (s) => s.row === seat.row && s.number === seat.number
      );
      if (seatIndex > -1) {
        show.seats[seatIndex].status = "available";
      }
    });
    await show.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========== USERS MANAGEMENT ==========

// @route   GET /api/admin/users
// @desc    Get all users
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/admin/users/:id/block
// @desc    Block/Unblock user
router.put("/users/:id/block", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========== ANALYTICS ==========

// @route   GET /api/admin/analytics
// @desc    Get analytics
router.get("/analytics", protect, admin, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } },
    ]);

    const monthlyBookings = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: "$amountPaid" },
        },
      },
    ]);

    const popularMovies = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: "$showId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "shows",
          localField: "_id",
          foreignField: "_id",
          as: "show",
        },
      },
      { $unwind: "$show" },
      {
        $lookup: {
          from: "movies",
          localField: "show.movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
    ]);

    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.json({
      success: true,
      analytics: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyBookings,
        popularMovies,
        totalUsers,
        newUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
