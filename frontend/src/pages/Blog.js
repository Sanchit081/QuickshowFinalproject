import React from 'react';
import { motion } from 'framer-motion';
import { FaBlog, FaCalendarAlt, FaUser, FaTag, FaHeart, FaComment, FaShare, FaClock } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Cinema: How Technology is Transforming Movie-Going',
      excerpt: 'Explore the latest innovations shaping the cinema experience, from virtual reality screenings to AI-powered recommendations.',
      author: 'Sarah Chen',
      date: '2024-03-20',
      category: 'Technology',
      readTime: '8 min read',
      image: 'https://picsum.photos/seed/blog1/400/250',
      likes: 234,
      comments: 45
    },
    {
      id: 2,
      title: 'Behind the Scenes: What Makes a Blockbuster Hit',
      excerpt: 'Dive into the art and science of creating movies that captivate audiences worldwide, from script to screen.',
      author: 'Michael Rodriguez',
      date: '2024-03-15',
      category: 'Film Industry',
      readTime: '6 min read',
      image: 'https://picsum.photos/seed/blog2/400/250',
      likes: 189,
      comments: 32
    },
    {
      id: 3,
      title: 'QuickShow Guide: Best Movies to Watch This Weekend',
      excerpt: 'Our curated selection of must-watch films across genres, perfect for your weekend entertainment.',
      author: 'Emily Johnson',
      date: '2024-03-10',
      category: 'Recommendations',
      readTime: '5 min read',
      image: 'https://picsum.photos/seed/blog3/400/250',
      likes: 456,
      comments: 78
    },
    {
      id: 4,
      title: 'The Rise of Indie Cinema: Supporting Independent Filmmakers',
      excerpt: 'Discover how independent films are gaining traction and why they matter in today\'s entertainment landscape.',
      author: 'David Kim',
      date: '2024-03-05',
      category: 'Indie Cinema',
      readTime: '7 min read',
      image: 'https://picsum.photos/seed/blog4/400/250',
      likes: 167,
      comments: 29
    },
    {
      id: 5,
      title: 'Cinema Etiquette: A Modern Guide for Movie Lovers',
      excerpt: 'Essential tips and unwritten rules for the perfect movie theater experience in the digital age.',
      author: 'Lisa Thompson',
      date: '2024-02-28',
      category: 'Lifestyle',
      readTime: '4 min read',
      image: 'https://picsum.photos/seed/blog5/400/250',
      likes: 298,
      comments: 56
    },
    {
      id: 6,
      title: 'From Script to Screen: The Journey of Movie Production',
      excerpt: 'Follow the fascinating process of how ideas transform into the movies we love on the big screen.',
      author: 'James Wilson',
      date: '2024-02-20',
      category: 'Film Industry',
      readTime: '10 min read',
      image: 'https://picsum.photos/seed/blog6/400/250',
      likes: 345,
      comments: 67
    }
  ];

  const categories = [
    { name: 'Technology', count: 12, color: 'purple' },
    { name: 'Film Industry', count: 18, color: 'blue' },
    { name: 'Recommendations', count: 24, color: 'green' },
    { name: 'Indie Cinema', count: 8, color: 'orange' },
    { name: 'Lifestyle', count: 15, color: 'pink' },
    { name: 'Behind the Scenes', count: 10, color: 'indigo' }
  ];

  const featuredPost = {
    title: 'Exclusive Interview: Director John Smith on His Latest Masterpiece',
    excerpt: 'In an exclusive conversation, acclaimed director John Smith shares insights into his creative process and the making of his latest critically acclaimed film.',
    author: 'Sarah Chen',
    date: '2024-03-25',
    category: 'Interview',
    readTime: '12 min read',
    image: 'https://picsum.photos/seed/featured/800/400',
    likes: 567,
    comments: 89
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <PremiumNavbar />
      
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center space-x-3 px-4 py-2 bg-purple-100 rounded-full"
              >
                <FaBlog className="text-purple-600" />
                <span className="text-purple-900 font-medium">QuickShow Blog</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Stories from the Cinema World
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Dive into the latest news, insights, and stories from the world of cinema. 
                From behind-the-scenes exclusives to industry trends, we've got it all covered.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Featured Story</h2>
              <p className="text-gray-600">Our handpicked highlight of the week</p>
            </motion.div>
            
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-lg"
            >
              <div className="relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-96 object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-purple-600 text-white rounded-full font-medium">
                    Featured
                  </span>
                </div>
              </div>
              
              <div className="p-8 lg:p-12">
                <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-purple-600" />
                    <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-purple-600" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-purple-600" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaTag className="text-purple-600" />
                    <span>{featuredPost.category}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FaHeart className="text-red-500" />
                      <span>{featuredPost.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <FaComment className="text-blue-500" />
                      <span>{featuredPost.comments}</span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium">
                    Read Full Story
                  </button>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Explore by Category</h2>
              <p className="text-gray-600">Find stories that match your interests</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <button className={`w-full p-4 bg-white rounded-xl border border-gray-200 hover:border-${category.color}-300 hover:shadow-md transition-all duration-300`}>
                    <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <FaTag className={`text-${category.color}-600 text-xl`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} articles</p>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Latest Stories</h2>
              <p className="text-gray-600">Fresh insights and perspectives from the cinema world</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <FaCalendarAlt className="text-purple-600" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaClock className="text-purple-600" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <FaHeart className="text-red-500" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaComment className="text-blue-500" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300">
                        Read More →
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Stay Updated with Cinema News
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Get the latest stories, interviews, and insights delivered straight to your inbox
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <PremiumFooter />
    </div>
  );
};

export default Blog;
