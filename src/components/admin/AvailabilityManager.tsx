import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSalonStore, type AvailabilityType, type TimeSlot } from '@/store/salonStore';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';

const AvailabilityManager = () => {
  const { availabilityRanges, addAvailabilityRange, removeAvailabilityRange } = useSalonStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'weekly' as AvailabilityType,
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '19:00',
  });

  const generateTimeSlots = (startTime: string, endTime: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    for (let hour = startHour; hour <= endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        id: `slot-${hour}`,
        time,
        isAvailable: true,
      });
    }
    return slots;
  };

  const handleSubmit = () => {
    if (formData.startDate && formData.endDate) {
      addAvailabilityRange({
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timeSlots: generateTimeSlots(formData.startTime, formData.endTime),
      });
      setIsDialogOpen(false);
      setFormData({
        type: 'weekly',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '19:00',
      });
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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground mb-1">Availability Manager</h1>
          <p className="text-muted-foreground">Create and manage booking availability periods</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Create Availability Range</DialogTitle>
              <DialogDescription>
                Set up a new time period when customers can book appointments.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Type */}
              <div className="space-y-2">
                <Label>Availability Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as AvailabilityType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="daily">Single Day</SelectItem>
                    <SelectItem value="weekly">Weekly Range</SelectItem>
                    <SelectItem value="monthly">Monthly Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Opening Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Closing Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSubmit}>
                Create Availability
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Availability Cards */}
      <div className="grid gap-6">
        {availabilityRanges.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2">No Availability Set</h3>
            <p className="text-muted-foreground mb-4">
              Create your first availability range to start accepting bookings.
            </p>
            <Button variant="gold" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </div>
        ) : (
          availabilityRanges.map((range, index) => (
            <motion.div
              key={range.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${range.type === 'daily' ? 'bg-sage/20 text-sage' :
                      range.type === 'weekly' ? 'bg-accent/20 text-accent' :
                      'bg-rose/20 text-rose'}
                  `}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`
                      inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize mb-1
                      ${range.type === 'daily' ? 'bg-sage/20 text-sage' :
                        range.type === 'weekly' ? 'bg-accent/20 text-accent' :
                        'bg-rose/20 text-rose'}
                    `}>
                      {range.type}
                    </span>
                    <p className="font-medium text-foreground">
                      {format(parseISO(range.startDate), 'MMM d')} - {format(parseISO(range.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAvailabilityRange(range.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>

              {/* Time Slots */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Clock className="w-4 h-4" />
                <span>Available Time Slots</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {range.timeSlots.map((slot) => (
                  <span
                    key={slot.id}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium
                      ${slot.isAvailable
                        ? 'bg-secondary text-foreground'
                        : 'bg-muted text-muted-foreground line-through'}
                    `}
                  >
                    {formatTimeDisplay(slot.time)}
                  </span>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailabilityManager;
