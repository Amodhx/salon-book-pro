import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useSalonStore } from '@/store/salonStore';
import { Clock, ArrowLeft } from 'lucide-react';

interface TimeSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

const TimeSelection = ({ onNext, onBack }: TimeSelectionProps) => {
  const { availabilityRanges, currentBooking, setCurrentBooking, bookings } = useSalonStore();
  const [selectedTime, setSelectedTime] = useState<string | null>(currentBooking.timeSlot || null);

  // Find the availability range for the selected date
  const selectedRange = availabilityRanges.find((range) => {
    if (!currentBooking.date) return false;
    const date = parseISO(currentBooking.date);
    const start = parseISO(range.startDate);
    const end = parseISO(range.endDate);
    return date >= start && date <= end;
  });

  // Get booked slots for the selected date
  const bookedSlots = bookings
    .filter((b) => b.date === currentBooking.date && b.status !== 'rejected')
    .map((b) => b.timeSlot);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentBooking({ timeSlot: time });
  };

  const handleContinue = () => {
    if (selectedTime) {
      onNext();
    }
  };

  const formatTimeDisplay = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Choose a Time</h2>
          <p className="text-muted-foreground text-sm">
            Available slots for {currentBooking.date ? format(parseISO(currentBooking.date), 'MMMM d, yyyy') : ''}
          </p>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
        {selectedRange?.timeSlots.map((slot) => {
          const isBooked = bookedSlots.includes(slot.time);
          const isUnavailable = !slot.isAvailable || isBooked;
          const isSelected = selectedTime === slot.time;

          return (
            <button
              key={slot.id}
              onClick={() => !isUnavailable && handleTimeSelect(slot.time)}
              disabled={isUnavailable}
              className={`
                py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200
                ${isSelected
                  ? 'bg-accent text-accent-foreground shadow-gold'
                  : isUnavailable
                    ? 'bg-muted text-muted-foreground/50 cursor-not-allowed line-through'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground hover:shadow-md'
                }
              `}
            >
              {formatTimeDisplay(slot.time)}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span className="text-muted-foreground">Unavailable</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedTime}
          variant="gold"
          size="lg"
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TimeSelection;
