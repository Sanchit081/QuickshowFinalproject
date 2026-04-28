// Quick test script to check if shows are being created
const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('./models/Movie');
const Show = require('./models/Show');
const Cinema = require('./models/Cinema');

async function testShows() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickshow');
    console.log('✅ Connected to MongoDB');

    // Get all movies
    const movies = await Movie.find({});
    console.log(`\n📽️ Found ${movies.length} movies:`);
    
    for (const movie of movies) {
      const showCount = await Show.countDocuments({ movieId: movie._id });
      console.log(`  - ${movie.title}: ${showCount} shows`);
      
      if (showCount === 0) {
        console.log(`    ⚠️ No shows found for "${movie.title}"`);
      }
    }

    // Check cinemas
    const cinemas = await Cinema.find({});
    console.log(`\n🎭 Found ${cinemas.length} cinemas`);
    
    if (cinemas.length === 0) {
      console.log('❌ NO CINEMAS FOUND! This is why shows cannot be created.');
      console.log('   Please run: node seed.js to create cinemas');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testShows();

