// Script to create shows for all existing movies
const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('./models/Movie');
const Show = require('./models/Show');
const Cinema = require('./models/Cinema');

async function createShowsForAllMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickshow');
    console.log('✅ Connected to MongoDB');

    const movies = await Movie.find({});
    console.log(`\n📽️ Found ${movies.length} movies`);

    const cinemas = await Cinema.find({});
    console.log(`🎭 Found ${cinemas.length} cinemas`);

    if (cinemas.length === 0) {
      console.log('\n❌ NO CINEMAS FOUND!');
      console.log('   Please run: node seed.js first to create cinemas');
      process.exit(1);
    }

    // Generate dates for next 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    const times = ['10:00', '13:30', '16:00', '19:00', '22:00'];

    let totalShowsCreated = 0;

    for (const movie of movies) {
      // Set as "Now Showing" if not set
      if (!movie.isNowShowing) {
        await Movie.findByIdAndUpdate(movie._id, { isNowShowing: true });
        console.log(`✅ Set "${movie.title}" as "Now Showing"`);
      }

      // Check existing shows
      const existingShows = await Show.countDocuments({ movieId: movie._id });
      if (existingShows > 0) {
        console.log(`⏭️  "${movie.title}" already has ${existingShows} shows, skipping...`);
        continue;
      }

      let showsCreated = 0;

      for (const cinema of cinemas) {
        // Initialize seats
        const seats = [];
        if (cinema.seatLayout?.seats?.length > 0) {
          cinema.seatLayout.seats.forEach((seat) => {
            seats.push({
              row: seat.row,
              number: seat.number,
              class: seat.class || 'silver',
              status: 'available',
            });
          });
        } else {
          // Default seats (10 rows x 20 seats)
          for (let i = 0; i < 10; i++) {
            for (let j = 1; j <= 20; j++) {
              let seatClass = 'silver';
              if (i < 2) seatClass = 'platinum';
              else if (i < 5) seatClass = 'gold';
              seats.push({
                row: String.fromCharCode(65 + i),
                number: j,
                class: seatClass,
                status: 'available',
              });
            }
          }
        }

        for (const date of dates) {
          for (const time of times) {
            try {
              const show = await Show.create({
                movieId: movie._id,
                cinemaId: cinema._id,
                date: date,
                time: time,
                seatPricing: { platinum: 400, gold: 250, silver: 180 },
                seats: seats.map(s => ({ ...s })),
                totalSeats: seats.length,
                availableSeats: seats.length,
              });

              await Cinema.findByIdAndUpdate(cinema._id, {
                $addToSet: { shows: show._id }
              });

              showsCreated++;
            } catch (error) {
              console.error(`❌ Error creating show:`, error.message);
            }
          }
        }
      }

      totalShowsCreated += showsCreated;
      console.log(`✅ Created ${showsCreated} shows for "${movie.title}"`);
    }

    console.log(`\n🎉 Done! Created ${totalShowsCreated} shows total for ${movies.length} movies`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createShowsForAllMovies();

