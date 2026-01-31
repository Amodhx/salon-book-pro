import { useState } from 'react';
import { format, addDays, isWithinInterval, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useSalonStore } from '@/store/salonStore';
import { CalendarDays } from 'lucide-react';

interface DateSelectionProps {
  onNext: () => void;
}

const DateSelection = ({ onNext }: DateSelectionProps) => {
  const { availabilityRanges, setCurrentBooking, currentBooking } = useSalonStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentBooking.date ? parseISO(currentBooking.date) : undefined
  );

  // Get all available dates from ranges
  const isDateAvailable = (date: Date) => {
    return availabilityRanges.some((range) =>
      isWithinInterval(date, {
        start: parseISO(range.startDate),
        end: parseISO(range.endDate),
      })
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setCurrentBooking({ date: format(date, 'yyyy-MM-dd') });
    }
  };

  const handleContinue = () => {
    if (selectedDate) {
      onNext();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Select a Date</h2>
          <p className="text-muted-foreground text-sm">Choose your preferred appointment date</p>
        </div>
      </div>

      {/* Availability Ranges Info */}
      <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
        <p className="text-sm font-medium text-foreground mb-2">Available Booking Periods:</p>
        <div className="space-y-1">
          {availabilityRanges.map((range) => (
            <div key={range.id} className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="capitalize">{range.type}:</span>
              <span>
                {format(parseISO(range.startDate), 'MMM d')} - {format(parseISO(range.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="flex justify-center mb-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date() || !isDateAvailable(date)}
          className="rounded-xl border border-border"
        />
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="text-center mb-6 p-4 bg-accent/10 rounded-xl">
          <p className="text-sm text-muted-foreground">Selected Date</p>
          <p className="font-display text-xl text-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      )}

      <Button
        onClick={handleContinue}
        disabled={!selectedDate}
        variant="gold"
        size="lg"
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};

export default DateSelection;
