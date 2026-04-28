const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendBookingConfirmation(bookingData) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: bookingData.userEmail,
        subject: 'Booking Confirmation - QuickShow',
        html: this.generateBookingConfirmationEmail(bookingData)
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(userData) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userData.email,
        subject: 'Welcome to QuickShow',
        html: this.generateWelcomeEmail(userData)
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  generateBookingConfirmationEmail(bookingData) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - QuickShow</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1C1C1E;
            background-color: #000000;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0A0A0A;
            border-radius: 12px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #FFFFFF;
            margin-bottom: 10px;
          }
          .booking-info {
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .booking-info h2 {
            color: #FFFFFF;
            font-size: 18px;
            margin: 0 0 15px 0;
          }
          .booking-details {
            color: #E5E5E7;
            font-size: 14px;
            line-height: 1.6;
          }
          .booking-details p {
            margin: 5px 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #FFFFFF;
            color: #000000;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .footer p {
            color: #9CA3AF;
            font-size: 12px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">QuickShow</div>
            <h1>Booking Confirmed</h1>
          </div>
          
          <div class="booking-info">
            <h2>Your Booking Details</h2>
            <div class="booking-details">
              <p><strong>Movie:</strong> ${bookingData.movieTitle}</p>
              <p><strong>Date:</strong> ${new Date(bookingData.showDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${bookingData.showTime}</p>
              <p><strong>Cinema:</strong> ${bookingData.cinemaName}</p>
              <p><strong>Seats:</strong> ${bookingData.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}</p>
              <p><strong>Total Amount:</strong> ₹${bookingData.totalAmount}</p>
              <p><strong>Booking ID:</strong> ${bookingData.bookingId}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="#" class="cta-button">View Booking Details</a>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing QuickShow. Please arrive 15 minutes before the show starts.</p>
            <p>&copy; 2024 QuickShow. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeEmail(userData) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to QuickShow</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1C1C1E;
            background-color: #000000;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0A0A0A;
            border-radius: 12px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #FFFFFF;
            margin-bottom: 10px;
          }
          .welcome-message {
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .welcome-message h2 {
            color: #FFFFFF;
            font-size: 18px;
            margin: 0 0 15px 0;
          }
          .welcome-message p {
            color: #E5E5E7;
            font-size: 14px;
            line-height: 1.6;
          }
          .cta-buttons {
            text-align: center;
            margin-top: 30px;
          }
          .cta-button {
            display: inline-block;
            background-color: #FFFFFF;
            color: #000000;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            margin: 0 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .footer p {
            color: #9CA3AF;
            font-size: 12px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">QuickShow</div>
            <h1>Welcome to QuickShow!</h1>
          </div>
          
          <div class="welcome-message">
            <h2>Hi ${userData.name},</h2>
            <div class="welcome-details">
              <p>Welcome to QuickShow, your premium cinema booking platform. We're excited to have you on board!</p>
              <p>Your account has been successfully created and you can now:</p>
              <ul>
                <li>• Browse and book movies from our extensive collection</li>
                <li>• Select your preferred seats with our interactive seat selection</li>
                <li>• Get personalized movie recommendations powered by AI</li>
                <li>• Enjoy exclusive member benefits and offers</li>
              </ul>
              <p>Get started with your first booking today!</p>
            </div>
          </div>
          
          <div class="cta-buttons">
            <a href="#" class="cta-button">Browse Movies</a>
            <a href="#" class="cta-button">View Your Profile</a>
          </div>
          
          <div class="footer">
            <p>Thank you for joining QuickShow. If you have any questions, feel free to contact our support team.</p>
            <p>&copy; 2024 QuickShow. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
