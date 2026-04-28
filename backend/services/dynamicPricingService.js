const AIService = require('./aiService');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

class DynamicPricingService {
  async calculateOptimalPrice(showId, basePrice) {
    try {
      // Get show details
      const show = await Show.findById(showId).populate('movieId cinemaId');
      if (!show) return basePrice;

      // Calculate demand factors
      const demandFactors = await this.calculateDemandFactors(show);
      
      // Calculate AI-based price
      const aiPrice = AIService.calculateDynamicPrice(basePrice, demandFactors);
      
      // Apply business rules
      const finalPrice = this.applyBusinessRules(aiPrice, demandFactors);
      
      return {
        originalPrice: basePrice,
        dynamicPrice: finalPrice,
        factors: demandFactors,
        adjustment: ((finalPrice - basePrice) / basePrice * 100).toFixed(1)
      };
    } catch (error) {
      console.error('Dynamic pricing error:', error);
      return { originalPrice: basePrice, dynamicPrice: basePrice };
    }
  }

  async calculateDemandFactors(show) {
    try {
      // Get recent bookings for this show
      const recentBookings = await Booking.find({ 
        showId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      });

      // Get total bookings for this show
      const totalBookings = await Booking.countDocuments({ showId });
      
      // Calculate available seats
      const totalSeats = show.screen.capacity || 100;
      const seatsAvailable = totalSeats - totalBookings;
      const demandLevel = (totalBookings / totalSeats);

      // Time-based factors
      const showTime = new Date(show.date);
      const now = new Date();
      const hoursUntilShow = (showTime - now) / (1000 * 60 * 60);
      
      const dayOfWeek = showTime.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Check if it's a holiday (simplified - in production, use holiday API)
      const isHoliday = this.isHoliday(showTime);

      return {
        demandLevel,
        showTime: show.date,
        dayOfWeek,
        isWeekend,
        isHoliday,
        seatsAvailable,
        recentBookings: recentBookings.length,
        hoursUntilShow,
        movieRating: show.movieId.rating || 0,
        isPrimeTime: this.isPrimeTime(showTime)
      };
    } catch (error) {
      console.error('Error calculating demand factors:', error);
      return {};
    }
  }

  applyBusinessRules(aiPrice, factors) {
    let finalPrice = aiPrice;

    // Don't increase price if show is less than 2 hours away
    if (factors.hoursUntilShow < 2) {
      finalPrice = Math.min(finalPrice, aiPrice * 0.9);
    }

    // Cap price increase to 30%
    const maxIncrease = aiPrice * 1.3;
    finalPrice = Math.min(finalPrice, maxIncrease);

    // Don't decrease price below 70% of base price
    const minPrice = aiPrice * 0.7;
    finalPrice = Math.max(finalPrice, minPrice);

    // Round to nearest 5
    return Math.round(finalPrice / 5) * 5;
  }

  isPrimeTime(date) {
    const hour = date.getHours();
    return (hour >= 18 && hour <= 22); // 6 PM to 10 PM
  }

  isHoliday(date) {
    // Simplified holiday check - in production use proper holiday API
    const holidays = [
      '01-01', '01-26', '08-15', '10-02', '12-25' // Indian holidays
    ];
    
    const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return holidays.includes(dateStr);
  }

  async getPricingTrends(movieId, cinemaId) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const bookings = await Booking.find({
        movieId,
        cinemaId,
        createdAt: { $gte: thirtyDaysAgo }
      }).populate('showId');

      // Calculate average price trends
      const dailyPrices = {};
      
      bookings.forEach(booking => {
        const date = booking.createdAt.toISOString().split('T')[0];
        if (!dailyPrices[date]) {
          dailyPrices[date] = [];
        }
        dailyPrices[date].push(booking.totalAmount / booking.seats.length);
      });

      // Calculate daily averages
      const trends = Object.entries(dailyPrices).map(([date, prices]) => ({
        date,
        averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
        bookings: prices.length
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      return trends;
    } catch (error) {
      console.error('Error getting pricing trends:', error);
      return [];
    }
  }
}

module.exports = new DynamicPricingService();
