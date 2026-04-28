import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from '../utils/axios';

const TicketSummary = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef(null);

  const fetchBooking = useCallback(async () => {
    try {
      const response = await axios.get(`/bookings/${bookingId}`);
      if (response.data.success && response.data.booking) {
        setBooking(response.data.booking);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ticket-${booking.ticketNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="shimmer h-96 rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return <div className="container mx-auto px-4 py-8">Booking not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl">
              ✓
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-400">Your ticket has been booked successfully</p>
          </div>

          {/* Ticket Content for PDF */}
          <div ref={ticketRef} className="bg-white p-8 rounded-lg border-2 border-gray-300">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">🎬 QuickShow</h2>
              <p className="text-gray-600">Movie Ticket</p>
            </div>

            {/* QR Code */}
            {booking.qrCode && (
              <div className="text-center mb-6">
                <img src={booking.qrCode} alt="QR Code" className="mx-auto w-48 h-48" />
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="border-b-2 border-gray-300 pb-4">
                <p className="text-gray-600 text-sm">Ticket Number</p>
                <p className="text-2xl font-bold text-gray-900">{booking.ticketNumber}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Movie</p>
                <p className="text-xl font-semibold text-gray-900">{booking.showId?.movieId?.title}</p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Cinema</p>
                <p className="font-semibold text-gray-900">{booking.showId?.cinemaId?.name}</p>
                <p className="text-sm text-gray-600">{booking.showId?.cinemaId?.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="font-semibold text-gray-900">{new Date(booking.showId?.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Time</p>
                  <p className="font-semibold text-gray-900">{booking.showId?.time}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Seats</p>
                <p className="font-semibold text-lg text-gray-900">
                  {booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                </p>
              </div>

              <div className="border-t-2 border-gray-300 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-semibold text-gray-900">₹{booking.amountPaid}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-semibold ${
                    booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-6">
              <p>Please arrive 15 minutes before showtime</p>
              <p>Show this ticket at the cinema entrance</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={downloadPDF}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <FiDownload />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-secondary flex-1 flex items-center justify-center space-x-2"
            >
              <FiPrinter />
              <span>Print</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketSummary;
