import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSalonStore } from '@/store/salonStore';
import { CheckCircle, Calendar, Clock, User, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingConfirmationProps {
  onReset: () => void;
}

const BookingConfirmation = ({ onReset }: BookingConfirmationProps) => {
  const { currentBooking, getServiceById } = useSalonStore();
  const service = getServiceById(currentBooking.serviceId || '');

  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-sage" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-3xl text-foreground mb-2">
          Booking Submitted!
        </h2>
        <p className="text-muted-foreground mb-8">
          Your appointment request has been received. We'll confirm shortly.
        </p>
      </motion.div>

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full status-pending mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-sm font-medium">Pending Approval</span>
      </motion.div>

      {/* Booking Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-secondary/50 rounded-xl p-6 text-left mb-8"
      >
        <h3 className="font-display text-lg text-foreground mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{currentBooking.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <Calendar className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">
                {currentBooking.date && format(parseISO(currentBooking.date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium text-foreground">{currentBooking.timeSlot}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <Scissors className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Service</p>
              <p className="font-medium text-foreground">
                {service?.name} - ${service?.price}
              </p>
            </div>
          </div>
        </div>

        {currentBooking.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm text-foreground">{currentBooking.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button onClick={onReset} variant="outline" size="lg" className="flex-1">
          Book Another
        </Button>
        <Button asChild variant="gold" size="lg" className="flex-1">
          <Link to="/">Return Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
