import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaRocket, FaUsers, FaHeart, FaMapMarkerAlt, FaGraduationCap, FaAward, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import PremiumNavbar from '../components/Layout/PremiumNavbar';
import PremiumFooter from '../components/Layout/PremiumFooter';

const Careers = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const openPositions = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead the development of our next-generation cinema booking platform',
      requirements: ['React expertise', 'TypeScript', 'Node.js', 'Cloud experience'],
      salary: '$120k - $180k'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Drive product strategy and execution for our cinema ecosystem',
      requirements: ['Product management experience', 'Analytics skills', 'User research'],
      salary: '$100k - $150k'
    },
    {
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Create exceptional user experiences for cinema lovers',
      requirements: ['Figma proficiency', 'Design systems', 'Mobile-first design'],
      salary: '$80k - $120k'
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Lead marketing campaigns and brand partnerships',
      requirements: ['Digital marketing', 'Content strategy', 'Analytics'],
      salary: '$90k - $130k'
    },
    {
      title: 'Data Scientist',
      department: 'Analytics',
      location: 'Boston, MA',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Analyze user behavior and optimize cinema recommendations',
      requirements: ['Python', 'Machine learning', 'SQL', 'Statistics'],
      salary: '$110k - $160k'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Chicago, IL',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Ensure exceptional customer experiences for cinema partners',
      requirements: ['Customer service', 'Relationship management', 'Problem solving'],
      salary: '$70k - $100k'
    }
  ];

  const handleApplyNow = (position) => {
    setSelectedPosition(position);
    setShowUploadModal(true);
    setUploadSuccess(false);
    setResumeFile(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleUploadSubmit = () => {
    if (resumeFile) {
      // Simulate upload process
      setTimeout(() => {
        setUploadSuccess(true);
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
          setResumeFile(null);
          setSelectedPosition(null);
        }, 2000);
      }, 1000);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setResumeFile(null);
    setUploadSuccess(false);
    setSelectedPosition(null);
  };

  const benefits = [
    { icon: FaHeart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision insurance' },
    { icon: FaGraduationCap, title: 'Learning & Development', description: '$5,000 annual stipend for courses and conferences' },
    { icon: FaRocket, title: 'Career Growth', description: 'Clear advancement paths and internal mobility' },
    { icon: FaUsers, title: 'Team Culture', description: 'Collaborative environment with regular team events' },
    { icon: FaAward, title: 'Recognition', description: 'Quarterly awards and performance bonuses' },
    { icon: FaMapMarkerAlt, title: 'Flexible Work', description: 'Remote options and flexible scheduling' }
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
                <FaBriefcase className="text-purple-600" />
                <span className="text-purple-900 font-medium">Join Our Team</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Build the Future of Cinema with QuickShow
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Join a team of passionate innovators revolutionizing how people experience movies. 
                We're looking for talented individuals who share our vision for making cinema accessible to everyone.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <div className="flex items-center space-x-2 text-gray-700">
                  <FaUsers className="text-purple-600" />
                  <span className="font-medium">200+ Team Members</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FaMapMarkerAlt className="text-purple-600" />
                  <span className="font-medium">8 Offices Worldwide</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FaRocket className="text-purple-600" />
                  <span className="font-medium">Fast-Growing Startup</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Why Join QuickShow?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We offer more than just a job – we offer a chance to make a real impact in the entertainment industry
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <benefit.icon className="text-purple-600 text-3xl mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Open Positions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find your perfect role and help us shape the future of cinema
              </p>
            </motion.div>
            
            <div className="grid gap-6">
              {openPositions.map((position, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {position.department}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {position.type}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          {position.experience}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <FaMapMarkerAlt className="text-purple-600" />
                        <span>{position.location}</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{position.salary}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.requirements.map((req, reqIndex) => (
                        <span key={reqIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleApplyNow(position)}
                    className="px-6 py-3 bg-purple-600 text-gray-800 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium"
                  >
                    Apply Now
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Life at QuickShow
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience a workplace where innovation meets passion, and every day brings new opportunities
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Innovation Days', description: 'Monthly hackathons to explore new ideas' },
                { title: 'Team Events', description: 'Regular social gatherings and team building' },
                { title: 'Movie Nights', description: 'Free screenings of latest releases' },
                { title: 'Growth Opportunities', description: 'Mentorship programs and skill development' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRocket className="text-purple-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Apply for {selectedPosition?.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {!uploadSuccess ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">Upload your resume/CV to apply for this position.</p>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
                    <FaUpload className="text-purple-600 text-3xl mx-auto mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-purple-600 font-medium">Click to upload</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p className="text-gray-500 text-sm mt-2">PDF, DOC, DOCX (max 5MB)</p>
                    </label>
                    {resumeFile && (
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                        <p className="text-purple-700 font-medium">{resumeFile.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    disabled={!resumeFile}
                    className="flex-1 px-4 py-2 bg-purple-600 text-gray-800 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit Application
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-green-600 text-2xl" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Resume Uploaded Successfully!</h4>
                <p className="text-gray-600">Thank you for your application. We'll review your resume and get back to you soon.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      <PremiumFooter />
    </div>
  );
};

export default Careers;
