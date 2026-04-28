import React from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaCalendarAlt, FaQuoteLeft, FaAward, FaTrophy, FaStar, FaRocket } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const Press = () => {
  const pressReleases = [
    {
      date: '2024-03-15',
      title: 'QuickShow Raises $50M Series C to Expand Global Cinema Network',
      summary: 'Leading cinema booking platform secures major funding to enhance technology and expand into new markets',
      category: 'Funding',
      image: 'https://picsum.photos/seed/press1/400/250'
    },
    {
      date: '2024-02-28',
      title: 'QuickShow Partners with Major Studios for Exclusive Premieres',
      summary: 'Strategic partnerships bring blockbuster premieres to QuickShow platform before general release',
      category: 'Partnership',
      image: 'https://picsum.photos/seed/press2/400/250'
    },
    {
      date: '2024-01-20',
      title: 'QuickShow Reaches 5 Million Active Users Milestone',
      summary: 'Rapid growth demonstrates strong market demand for innovative cinema booking solutions',
      category: 'Milestone',
      image: 'https://picsum.photos/seed/press3/400/250'
    },
    {
      date: '2023-12-10',
      title: 'QuickShow Launches AI-Powered Movie Recommendation Engine',
      summary: 'New technology delivers personalized movie suggestions based on viewing preferences and behavior',
      category: 'Product',
      image: 'https://picsum.photos/seed/press4/400/250'
    },
    {
      date: '2023-11-05',
      title: 'QuickShow Named "Most Innovative Cinema Platform" at Tech Awards',
      summary: 'Industry recognition for groundbreaking approach to cinema booking and user experience',
      category: 'Award',
      image: 'https://picsum.photos/seed/press5/400/250'
    },
    {
      date: '2023-10-15',
      title: 'QuickShow Expands to 50 New Cities Across North America',
      summary: 'Strategic expansion brings convenient cinema booking to millions of new customers',
      category: 'Expansion',
      image: 'https://picsum.photos/seed/press6/400/250'
    }
  ];

  const mediaCoverage = [
    {
      publication: 'TechCrunch',
      title: 'How QuickShow is Revolutionizing the Cinema Booking Experience',
      date: '2024-03-20',
      author: 'Sarah Martinez',
      excerpt: 'QuickShow\'s innovative approach to cinema booking is transforming how people discover and experience movies...',
      link: '#'
    },
    {
      publication: 'Forbes',
      title: 'The Rise of QuickShow: Cinema Booking for the Digital Age',
      date: '2024-02-25',
      author: 'Michael Chen',
      excerpt: 'In an era where digital transformation is reshaping every industry, QuickShow stands out as a leader in cinema innovation...',
      link: '#'
    },
    {
      publication: 'Variety',
      title: 'QuickShow Partners with Studios for Digital Premieres',
      date: '2024-01-15',
      author: 'Emma Thompson',
      excerpt: 'The partnership between QuickShow and major studios represents a significant shift in how movies reach audiences...',
      link: '#'
    },
    {
      publication: 'The Wall Street Journal',
      title: 'QuickShow\'s Growth Strategy Pays Off in Competitive Market',
      date: '2023-12-20',
      author: 'David Rodriguez',
      excerpt: 'Despite intense competition, QuickShow has managed to capture significant market share through innovation...',
      link: '#'
    }
  ];

  const awards = [
    {
      name: 'Most Innovative Cinema Platform',
      organization: 'Tech Innovation Awards 2023',
      category: 'Innovation',
      icon: FaTrophy
    },
    {
      name: 'Best User Experience',
      organization: 'Design Awards 2023',
      category: 'Design',
      icon: FaAward
    },
    {
      name: 'Fastest Growing Tech Company',
      organization: 'Business Weekly 2023',
      category: 'Growth',
      icon: FaRocket
    },
    {
      name: 'Customer Choice Award',
      organization: 'Cinema Industry Awards 2023',
      category: 'Customer Service',
      icon: FaStar
    }
  ];

  const testimonials = [
    {
      quote: 'QuickShow has fundamentally changed how we connect with our audience. Their platform is intuitive, reliable, and delivers exceptional results.',
      author: 'James Wilson',
      role: 'CEO, CinemaMax Theaters',
      publication: 'Cinema Business Magazine'
    },
    {
      quote: 'The AI-powered recommendations have transformed our content discovery. Users are finding movies they love and spending more time on our platform.',
      author: 'Lisa Chang',
      role: 'Head of Product, MovieStream',
      publication: 'Tech Review'
    },
    {
      quote: 'QuickShow\'s technology has streamlined our operations and improved customer satisfaction scores by 40%.',
      author: 'Robert Kumar',
      role: 'Operations Director, StarCinemas',
      publication: 'Industry Weekly'
    }
  ];

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
                <FaNewspaper className="text-purple-600" />
                <span className="text-purple-900 font-medium">Press & Media</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                QuickShow in the News
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Stay updated with the latest news, announcements, and media coverage about QuickShow's journey to revolutionize cinema booking
              </motion.p>
            </div>
          </div>
        </section>

        {/* Latest Press Releases */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Latest Press Releases
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Official announcements and company updates from QuickShow
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pressReleases.map((release, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={release.image}
                      alt={release.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-600 text-gray-800 rounded-full text-sm font-medium">
                        {release.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                      <FaCalendarAlt className="text-purple-600" />
                      <span>{new Date(release.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{release.title}</h3>
                    <p className="text-gray-600 mb-4">{release.summary}</p>
                    
                    <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300">
                      Read More →
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Media Coverage */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Media Coverage
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                What leading publications are saying about QuickShow
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {mediaCoverage.map((article, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaNewspaper className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{article.publication}</h4>
                      <div className="text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} • {article.author}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4 italic">"{article.excerpt}"</p>
                  
                  <a href={article.link} className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300">
                    Read Full Article →
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Awards & Recognition
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Honoring our commitment to innovation and excellence
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <award.icon className="text-purple-600 text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{award.name}</h3>
                  <p className="text-gray-600 text-sm">{award.organization}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Industry Voices
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                What industry leaders are saying about QuickShow
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200"
                >
                  <FaQuoteLeft className="text-purple-600 text-2xl mb-4" />
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-purple-600 text-sm">{testimonial.publication}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Media Contact
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                For media inquiries, press kits, or interview requests, please reach out to our media relations team
              </p>
              
              <div className="bg-purple-50 p-8 rounded-2xl">
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">General Media Inquiries</h3>
                    <p className="text-gray-600">media@quickshow.com</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Press Kit</h3>
                    <p className="text-gray-600">Download our latest press kit and assets</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <PremiumFooter />
    </div>
  );
};

export default Press;
