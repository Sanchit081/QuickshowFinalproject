// Simple script to create cinemas if they don't exist
const mongoose = require('mongoose');
require('dotenv').config();

const Cinema = require('./models/Cinema');

const sampleCinemas = [
  {
    name: "PVR Cinemas - Phoenix Mall",
    city: "Mumbai",
    address: "Phoenix Mall, Kurla, Mumbai - 400070",
    location: { lat: 19.0760, lng: 72.8777 },
    amenities: ["IMAX", "Dolby Atmos", "Recliner Seats", "Food Court"],
    seatLayout: {
      rows: 10,
      seatsPerRow: 20,
      seats: []
    }
  },
  {
    name: "INOX - R City Mall",
    city: "Mumbai",
    address: "R City Mall, Ghatkopar, Mumbai - 400086",
    location: { lat: 19.0886, lng: 72.9081 },
    amenities: ["4DX", "Dolby Vision", "Premium Seating"],
    seatLayout: {
      rows: 12,
      seatsPerRow: 18,
      seats: []
    }
  },
  {
    name: "Cinepolis - Fun Republic",
    city: "Mumbai",
    address: "Fun Republic Mall, Andheri, Mumbai - 400053",
    location: { lat: 19.1136, lng: 72.8697 },
    amenities: ["Luxury Seating", "Gourmet Food"],
    seatLayout: {
      rows: 8,
      seatsPerRow: 22,
      seats: []
    }
  },
  {
    name: "PVR Select City Walk",
    city: "Delhi",
    address: "Select City Walk, Saket, New Delhi - 110017",
    location: { lat: 28.5275, lng: 77.2189 },
    amenities: ["IMAX", "VIP Lounge", "Premium Food"],
    seatLayout: {
      rows: 10,
      seatsPerRow: 20,
      seats: []
    }
  },
  {
    name: "INOX - Saket",
    city: "Delhi",
    address: "DLF Place, Saket, New Delhi - 110017",
    location: { lat: 28.5275, lng: 77.2189 },
    amenities: ["4DX", "Dolby Atmos"],
    seatLayout: {
      rows: 11,
      seatsPerRow: 19,
      seats: []
    }
  },
  {
    name: "PVR Forum Mall",
    city: "Bengaluru",
    address: "Forum Mall, Koramangala, Bengaluru - 560095",
    location: { lat: 12.9352, lng: 77.6245 },
    amenities: ["IMAX", "Recliner Seats"],
    seatLayout: {
      rows: 9,
      seatsPerRow: 21,
      seats: []
    }
  }
];

function generateSeats(rows, seatsPerRow) {
  const seats = [];
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
        isAvailable: true
      });
    }
  }
  return seats;
}

async function createCinemas() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickshow');
    console.log('✅ Connected to MongoDB');

    // Check existing cinemas
    const existingCinemas = await Cinema.find({});
    console.log(`\n📊 Found ${existingCinemas.length} existing cinemas`);

    if (existingCinemas.length > 0) {
      console.log('✅ Cinemas already exist!');
      existingCinemas.forEach(c => console.log(`  - ${c.name} (${c.city})`));
      process.exit(0);
    }

    // Generate seat layouts
    console.log('\n🎭 Creating cinemas...');
    for (const cinema of sampleCinemas) {
      cinema.seatLayout.seats = generateSeats(cinema.seatLayout.rows, cinema.seatLayout.seatsPerRow);
      console.log(`  - Prepared ${cinema.name}: ${cinema.seatLayout.seats.length} seats`);
    }

    // Insert cinemas
    const insertedCinemas = await Cinema.insertMany(sampleCinemas);
    console.log(`\n✅ Successfully created ${insertedCinemas.length} cinemas:`);
    insertedCinemas.forEach(c => {
      console.log(`  ✅ ${c.name} - ${c.city} (${c.seatLayout.seats.length} seats)`);
    });

    console.log('\n🎉 All cinemas created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating cinemas:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
}

createCinemas();

