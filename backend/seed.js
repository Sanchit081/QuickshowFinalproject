const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Cinema = require('./models/Cinema');
const Show = require('./models/Show');
const Event = require('./models/Event');
require('dotenv').config();

const sampleMovies = [
  {
    title: "Avengers: Endgame",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: ["English", "Hindi"],
    cast: [
      { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man", image: "" },
      { name: "Chris Evans", role: "Steve Rogers / Captain America", image: "" },
      { name: "Mark Ruffalo", role: "Bruce Banner / Hulk", image: "" },
      { name: "Chris Hemsworth", role: "Thor", image: "" }
    ],
    crew: [
      { name: "Anthony Russo", role: "Director", image: "" },
      { name: "Joe Russo", role: "Director", image: "" },
      { name: "Christopher Markus", role: "Screenplay", image: "" }
    ],
    duration: 181,
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    releaseDate: new Date("2019-04-26"),
    rating: 8.4,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Spider-Man: No Way Home",
    description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, Peter turns to Doctor Strange to make the world forget that he is Spider-Man.",
    genres: ["Action", "Adventure", "Fantasy"],
    languages: ["English", "Hindi"],
    cast: [
      { name: "Tom Holland", role: "Peter Parker / Spider-Man", image: "" },
      { name: "Zendaya", role: "MJ", image: "" },
      { name: "Benedict Cumberbatch", role: "Doctor Strange", image: "" }
    ],
    crew: [
      { name: "Jon Watts", role: "Director", image: "" }
    ],
    duration: 148,
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    releaseDate: new Date("2021-12-17"),
    rating: 8.3,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Dune",
    description: "Paul Atreides leads a rebellion to restore his family's reign over the desert planet Arrakis while grappling with a terrible destiny.",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    languages: ["English"],
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", image: "" },
      { name: "Rebecca Ferguson", role: "Lady Jessica", image: "" },
      { name: "Oscar Isaac", role: "Duke Leto Atreides", image: "" }
    ],
    crew: [
      { name: "Denis Villeneuve", role: "Director", image: "" }
    ],
    duration: 155,
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/iopY8c8qfw1e2d0457q6huKrnlE.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=8g18jFHCLXk",
    releaseDate: new Date("2021-10-22"),
    rating: 8.0,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    genres: ["Action", "Crime", "Drama"],
    languages: ["English", "Hindi"],
    cast: [
      { name: "Robert Pattinson", role: "Bruce Wayne / Batman", image: "" },
      { name: "Zoë Kravitz", role: "Selina Kyle / Catwoman", image: "" },
      { name: "Paul Dano", role: "The Riddler", image: "" }
    ],
    crew: [
      { name: "Matt Reeves", role: "Director", image: "" }
    ],
    duration: 176,
    poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5xwxsFk8VX8w.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/4j0PNHkMr5ax3IA8tjtxcmPU3CH.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    releaseDate: new Date("2022-03-04"),
    rating: 7.8,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Top Gun: Maverick",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, training a new generation of pilots.",
    genres: ["Action", "Drama"],
    languages: ["English"],
    cast: [
      { name: "Tom Cruise", role: "Pete 'Maverick' Mitchell", image: "" },
      { name: "Miles Teller", role: "Lt. Bradley 'Rooster' Bradshaw", image: "" },
      { name: "Jennifer Connelly", role: "Penny Benjamin", image: "" }
    ],
    crew: [
      { name: "Joseph Kosinski", role: "Director", image: "" }
    ],
    duration: 130,
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/Aa9TLpNpBMyRkD8sPJ7fLgqGPLi.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=giXco2jaZ_4",
    releaseDate: new Date("2022-05-27"),
    rating: 8.2,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "RRR",
    description: "A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.",
    genres: ["Action", "Drama", "History"],
    languages: ["Telugu", "Hindi", "Tamil"],
    cast: [
      { name: "N.T. Rama Rao Jr.", role: "Komaram Bheem", image: "" },
      { name: "Ram Charan", role: "Alluri Sitarama Raju", image: "" },
      { name: "Alia Bhatt", role: "Sita", image: "" }
    ],
    crew: [
      { name: "S. S. Rajamouli", role: "Director", image: "" }
    ],
    duration: 187,
    poster: "https://image.tmdb.org/t/p/w500/y95lQLnuNKdPAzw9F9Ab8kJ80c3.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/5VTN0pR8gcqV3EPUHHfMGnJYN9D.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=foiB_4n2Zqg",
    releaseDate: new Date("2022-03-25"),
    rating: 7.8,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "KGF: Chapter 2",
    description: "Rocky takes control of the Kolar Gold Fields and his newfound power makes the government as well as his enemies jittery.",
    genres: ["Action", "Crime", "Drama"],
    languages: ["Kannada", "Hindi", "Telugu"],
    cast: [
      { name: "Yash", role: "Rocky", image: "" },
      { name: "Sanjay Dutt", role: "Adheera", image: "" },
      { name: "Raveena Tandon", role: "Ramika Sen", image: "" }
    ],
    crew: [
      { name: "Prashanth Neel", role: "Director", image: "" }
    ],
    duration: 168,
    poster: "https://image.tmdb.org/t/p/w500/sHXk9ab2L2Z1t0WWqT1l3k4jP9x.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/2RS5q8Y2w6X3Uu9y5r0Q3wZ8J9x.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=JKa05nyUmuQ",
    releaseDate: new Date("2022-04-14"),
    rating: 8.2,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Doctor Strange in the Multiverse of Madness",
    description: "Doctor Strange teams up with a mysterious teenage girl from his dreams who can travel across multiverses, to battle multiple threats.",
    genres: ["Action", "Adventure", "Fantasy"],
    languages: ["English", "Hindi"],
    cast: [
      { name: "Benedict Cumberbatch", role: "Doctor Strange", image: "" },
      { name: "Elizabeth Olsen", role: "Wanda Maximoff", image: "" },
      { name: "Chiwetel Ejiofor", role: "Karl Mordo", image: "" }
    ],
    crew: [
      { name: "Sam Raimi", role: "Director", image: "" }
    ],
    duration: 126,
    poster: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/81zlb0xQWBrH1GIhg57vdKdUo2h.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=aWzlQ2N6qqg",
    releaseDate: new Date("2022-05-06"),
    rating: 6.9,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Black Panther: Wakanda Forever",
    description: "The nation of Wakanda is pitted against intervening world powers as they mourn the loss of their king T'Challa.",
    genres: ["Action", "Adventure", "Drama"],
    languages: ["English", "Hindi"],
    cast: [
      { name: "Letitia Wright", role: "Shuri", image: "" },
      { name: "Lupita Nyong'o", role: "Nakia", image: "" },
      { name: "Danai Gurira", role: "Okoye", image: "" }
    ],
    crew: [
      { name: "Ryan Coogler", role: "Director", image: "" }
    ],
    duration: 161,
    poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=_Z3QKkl1WyM",
    releaseDate: new Date("2022-11-11"),
    rating: 6.7,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Avatar: The Way of Water",
    description: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family.",
    genres: ["Action", "Adventure", "Fantasy"],
    languages: ["English"],
    cast: [
      { name: "Sam Worthington", role: "Jake Sully", image: "" },
      { name: "Zoe Saldana", role: "Neytiri", image: "" },
      { name: "Sigourney Weaver", role: "Kiri", image: "" }
    ],
    crew: [
      { name: "James Cameron", role: "Director", image: "" }
    ],
    duration: 192,
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclICA60wsmEo1Wntx3x.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    releaseDate: new Date("2022-12-16"),
    rating: 7.6,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    genres: ["Biography", "Drama", "History"],
    languages: ["English"],
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: "" },
      { name: "Emily Blunt", role: "Kitty Oppenheimer", image: "" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", image: "" }
    ],
    crew: [
      { name: "Christopher Nolan", role: "Director", image: "" }
    ],
    duration: 180,
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxYw",
    releaseDate: new Date("2023-07-21"),
    rating: 8.3,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Barbie",
    description: "Barbie suffers a crisis that leads her to question her world and her existence.",
    genres: ["Adventure", "Comedy", "Fantasy"],
    languages: ["English"],
    cast: [
      { name: "Margot Robbie", role: "Barbie", image: "" },
      { name: "Ryan Gosling", role: "Ken", image: "" },
      { name: "America Ferrera", role: "Gloria", image: "" }
    ],
    crew: [
      { name: "Greta Gerwig", role: "Director", image: "" }
    ],
    duration: 114,
    poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/ctMserH8g2SeOAnCw5gFkQF3jCy.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=pBk4NYhWNMM",
    releaseDate: new Date("2023-07-21"),
    rating: 6.9,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Pathaan",
    description: "A soldier caught by enemies and presumed dead comes back to complete his mission, accompanied by old companions.",
    genres: ["Action", "Thriller"],
    languages: ["Hindi", "Tamil", "Telugu"],
    cast: [
      { name: "Shah Rukh Khan", role: "Pathaan", image: "" },
      { name: "Deepika Padukone", role: "Rubina", image: "" },
      { name: "John Abraham", role: "Jim", image: "" }
    ],
    crew: [
      { name: "Siddharth Anand", role: "Director", image: "" }
    ],
    duration: 146,
    poster: "https://image.tmdb.org/t/p/w500/y0xE3l0lXZJvjSX9xJvJvJvJvJv.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/y0xE3l0lXZJvJvJvJvJvJvJvJv.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=vqu4z34wENw",
    releaseDate: new Date("2023-01-25"),
    rating: 6.5,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Jawan",
    description: "A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago.",
    genres: ["Action", "Thriller"],
    languages: ["Hindi", "Tamil", "Telugu"],
    cast: [
      { name: "Shah Rukh Khan", role: "Vikram Rathore / Azad", image: "" },
      { name: "Nayanthara", role: "Kalki", image: "" },
      { name: "Vijay Sethupathi", role: "Kalee", image: "" }
    ],
    crew: [
      { name: "Atlee", role: "Director", image: "" }
    ],
    duration: 169,
    poster: "https://image.tmdb.org/t/p/w500/jFt1gS4BGHl2h5OXN4Ow6v2G8EY.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/jFt1gS4BGHl2h5OXN4Ow6v2G8EY.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=K4TOrB7at0Y",
    releaseDate: new Date("2023-09-07"),
    rating: 7.0,
    isNowShowing: true,
    isComingSoon: false
  },
  {
    title: "Dunki",
    description: "A group of friends from a small village in Punjab dream of going to England for a better life.",
    genres: ["Comedy", "Drama"],
    languages: ["Hindi"],
    cast: [
      { name: "Shah Rukh Khan", role: "Hardayal 'Hardy' Singh Dhillon", image: "" },
      { name: "Taapsee Pannu", role: "Manu Randhawa", image: "" },
      { name: "Vicky Kaushal", role: "Sukhi", image: "" }
    ],
    crew: [
      { name: "Rajkumar Hirani", role: "Director", image: "" }
    ],
    duration: 161,
    poster: "https://image.tmdb.org/t/p/w500/nn7ZR6kK2xJbLxqZQjJvJvJvJv.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/nn7ZR6kK2xJbLxqZQjJvJvJvJv.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YjNp7h7J2ok",
    releaseDate: new Date("2023-12-21"),
    rating: 7.2,
    isNowShowing: false,
    isComingSoon: true
  },
  {
    title: "Fighter",
    description: "Top IAF aviators come together in the face of imminent danger, to form Air Dragons.",
    genres: ["Action", "Drama", "Thriller"],
    languages: ["Hindi"],
    cast: [
      { name: "Hrithik Roshan", role: "Squadron Leader Shamsher Pathania", image: "" },
      { name: "Deepika Padukone", role: "Squadron Leader Minal Rathore", image: "" },
      { name: "Anil Kapoor", role: "Group Captain Rakesh Jai Singh", image: "" }
    ],
    crew: [
      { name: "Siddharth Anand", role: "Director", image: "" }
    ],
    duration: 166,
    poster: "https://image.tmdb.org/t/p/w500/8h5X2F8d7QqJvJvJvJvJvJvJv.jpg",
    banner: "https://image.tmdb.org/t/p/w1280/8h5X2F8d7QqJvJvJvJvJvJvJv.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=H3Yz7z7qZqY",
    releaseDate: new Date("2024-01-25"),
    rating: 6.8,
    isNowShowing: false,
    isComingSoon: true
  }
];

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

const sampleEvents = [
  {
    title: "Ed Sheeran Live Concert",
    description: "Experience the magic of Ed Sheeran's live performance with his greatest hits and new songs.",
    category: "concert",
    venue: {
      name: "DY Patil Stadium",
      address: "Nerul, Navi Mumbai",
      city: "Mumbai"
    },
    date: new Date("2024-02-15"),
    time: "19:00",
    image: "https://via.placeholder.com/400x300",
    banner: "https://via.placeholder.com/1200x400",
    price: { min: 2000, max: 15000 },
    organizer: {
      name: "Live Nation",
      contact: "+91-9876543210"
    }
  },
  {
    title: "Russell Peters Stand-up Comedy",
    description: "Laugh out loud with Russell Peters' hilarious take on life, culture, and everything in between.",
    category: "standup",
    venue: {
      name: "Jio World Garden",
      address: "BKC, Mumbai",
      city: "Mumbai"
    },
    date: new Date("2024-02-20"),
    time: "20:00",
    image: "https://via.placeholder.com/400x300",
    banner: "https://via.placeholder.com/1200x400",
    price: { min: 1500, max: 8000 },
    organizer: {
      name: "Comedy Central",
      contact: "+91-9876543211"
    }
  },
  {
    title: "Web Development Workshop",
    description: "Learn modern web development with React, Node.js, and MongoDB in this hands-on workshop.",
    category: "workshop",
    venue: {
      name: "Tech Hub",
      address: "Andheri, Mumbai",
      city: "Mumbai"
    },
    date: new Date("2024-02-25"),
    time: "10:00",
    image: "https://via.placeholder.com/400x300",
    banner: "https://via.placeholder.com/1200x400",
    price: { min: 500, max: 2000 },
    organizer: {
      name: "Tech Academy",
      contact: "+91-9876543212"
    }
  }
];

// Generate seat layout for cinemas
function generateSeats(rows, seatsPerRow) {
  const seats = [];
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      let seatClass = 'silver';
      if (i < 2) seatClass = 'platinum';
      else if (i < 5) seatClass = 'gold';
      
      seats.push({
        row: rowLabels[i],
        number: j,
        class: seatClass,
        isAvailable: true
      });
    }
  }
  return seats;
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickshow');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Cinema.deleteMany({});
    await Show.deleteMany({});
    await Event.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`✅ Inserted ${insertedMovies.length} movies`);

    // Generate and insert cinemas with seat layouts
    console.log('🎭 Creating cinemas...');
    for (const cinema of sampleCinemas) {
      try {
        cinema.seatLayout.seats = generateSeats(cinema.seatLayout.rows, cinema.seatLayout.seatsPerRow);
        console.log(`  - Preparing ${cinema.name} (${cinema.seatLayout.seats.length} seats)`);
      } catch (error) {
        console.error(`  ❌ Error preparing ${cinema.name}:`, error.message);
      }
    }
    
    try {
      const insertedCinemas = await Cinema.insertMany(sampleCinemas);
      console.log(`✅ Inserted ${insertedCinemas.length} cinemas`);
    } catch (error) {
      console.error('❌ Error inserting cinemas:', error.message);
      console.error('Full error:', error);
      throw error;
    }

    // Create sample shows for each movie in each cinema
    const shows = [];
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0); // Normalize to midnight for proper date matching
      dates.push(date);
    }

    const times = ['10:00', '13:30', '16:00', '19:00', '22:00'];

    for (const movie of insertedMovies) {
      for (const cinema of insertedCinemas) {
        // Only create shows for movies in matching cities or all cities
        if (movie.isNowShowing) {
          for (const date of dates) {
            for (const time of times) {
              const showSeats = cinema.seatLayout.seats.map(seat => ({
                row: seat.row,
                number: seat.number,
                class: seat.class || 'silver',
                status: 'available'
              }));

              shows.push({
                movieId: movie._id,
                cinemaId: cinema._id,
                date: date,
                time: time,
                seatPricing: {
                  platinum: 400,
                  gold: 250,
                  silver: 180
                },
                seats: showSeats,
                totalSeats: showSeats.length,
                availableSeats: showSeats.length
              });
            }
          }
        }
      }
    }

    const insertedShows = await Show.insertMany(shows);
    console.log(`✅ Inserted ${insertedShows.length} shows`);

    // Update cinemas with shows
    for (const cinema of insertedCinemas) {
      const cinemaShows = insertedShows.filter(s => s.cinemaId.toString() === cinema._id.toString());
      await Cinema.findByIdAndUpdate(cinema._id, {
        $set: { shows: cinemaShows.map(s => s._id) }
      });
    }

    // Insert events
    const insertedEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Inserted ${insertedEvents.length} events`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Movies: ${insertedMovies.length}`);
    console.log(`   Cinemas: ${insertedCinemas.length}`);
    console.log(`   Shows: ${insertedShows.length}`);
    console.log(`   Events: ${insertedEvents.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

