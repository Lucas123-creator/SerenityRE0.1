import React, { useState, useEffect } from 'react';
import { emailService } from '../config/services';
import { whatsappService } from '../config/services';

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Use mock data for now
      const mockBookings: Booking[] = [
        {
          id: '1',
          propertyId: '1',
          propertyName: 'Modern Apartment in City Center',
          clientName: 'Alice Smith',
          clientEmail: 'alice@example.com',
          clientPhone: '+1234567890',
          date: '2024-03-10',
          time: '14:00',
          status: 'pending',
          notes: 'First viewing',
        },
        {
          id: '2',
          propertyId: '2',
          propertyName: 'Cozy Suburban House',
          clientName: 'Bob Johnson',
          clientEmail: 'bob@example.com',
          clientPhone: '+1987654321',
          date: '2024-03-12',
          time: '11:00',
          status: 'confirmed',
          notes: 'Requested early morning',
        },
      ];
      setBookings(mockBookings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      // Update booking status
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));

      // Send notifications based on status
      if (newStatus === 'confirmed') {
        await Promise.all([
          emailService.sendBookingConfirmation(booking.clientEmail, booking),
          whatsappService.sendBookingConfirmation(booking.clientPhone, booking),
        ]);
      }
    } catch (err) {
      setError('Failed to update booking status');
      console.error(err);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  const formatDateTime = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Booking Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Viewings</h2>
          </div>
          <div className="divide-y">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedBooking?.id === booking.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleBookingSelect(booking)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{booking.propertyName}</h3>
                    <p className="text-sm text-gray-600">{booking.clientName}</p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.date, booking.time)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Details */}
        <div className="lg:col-span-2">
          {selectedBooking ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedBooking.propertyName}</h2>
                    <p className="text-gray-600">
                      {formatDateTime(selectedBooking.date, selectedBooking.time)}
                    </p>
                  </div>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleStatusUpdate(selectedBooking.id, e.target.value as Booking['status'])}
                    className="rounded-lg border-gray-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-medium">{selectedBooking.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Client Email</p>
                    <p className="font-medium">{selectedBooking.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Client Phone</p>
                    <p className="font-medium">{selectedBooking.clientPhone}</p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-gray-700">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.value = selectedBooking.clientEmail;
                      document.body.appendChild(input);
                      input.select();
                      document.execCommand('copy');
                      document.body.removeChild(input);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Copy Email
                  </button>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.value = selectedBooking.clientPhone;
                      document.body.appendChild(input);
                      input.select();
                      document.execCommand('copy');
                      document.body.removeChild(input);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Copy Phone
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Select a booking to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 