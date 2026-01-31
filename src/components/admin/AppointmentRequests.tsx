import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSalonStore, type Booking, type BookingStatus } from '@/store/salonStore';
import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Scissors
} from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    class: 'status-pending',
    icon: ClipboardList,
  },
  approved: {
    label: 'Approved',
    class: 'status-approved',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    class: 'status-rejected',
    icon: XCircle,
  },
};

const AppointmentRequests = () => {
  const { bookings, updateBookingStatus, getServiceById } = useSalonStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  const filteredBookings = bookings.filter((b) =>
    filter === 'all' ? true : b.status === filter
  );

  const handleStatusChange = (id: string, status: BookingStatus) => {
    updateBookingStatus(id, status);
    setSelectedBooking(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-1">Appointment Requests</h1>
          <p className="text-muted-foreground">Review and manage booking requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                ${filter === status
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2">No Appointments Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'No booking requests have been made yet.'
                : `No ${filter} appointments.`}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking, index) => {
            const service = getServiceById(booking.serviceId);
            const config = statusConfig[booking.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Customer */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{booking.fullName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{booking.gender}</p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {format(parseISO(booking.date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">{booking.timeSlot}</p>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{service?.name}</p>
                        <p className="text-xs text-muted-foreground">${service?.price}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.class}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'approved')}
                          className="text-sage hover:text-sage hover:bg-sage/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'rejected')}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Booking Details</DialogTitle>
            <DialogDescription>
              Review the complete appointment information
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-4">
              {/* Status */}
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig[selectedBooking.status].class}`}>
                  {React.createElement(statusConfig[selectedBooking.status].icon, { className: 'w-4 h-4' })}
                  {statusConfig[selectedBooking.status].label}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <User className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedBooking.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <Phone className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {format(parseISO(selectedBooking.date), 'EEEE, MMMM d, yyyy')} at {selectedBooking.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <Scissors className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="font-medium">
                      {useSalonStore.getState().getServiceById(selectedBooking.serviceId)?.name}
                    </p>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-accent" />
                      <p className="text-xs text-muted-foreground">Notes</p>
                    </div>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}

                {selectedBooking.paymentSlip && (
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-2">Payment Slip</p>
                    <img
                      src={selectedBooking.paymentSlip}
                      alt="Payment slip"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedBooking.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleStatusChange(selectedBooking.id, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="gold"
                    className="flex-1"
                    onClick={() => handleStatusChange(selectedBooking.id, 'approved')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentRequests;
