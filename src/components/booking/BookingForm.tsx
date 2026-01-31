import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSalonStore, type Gender } from '@/store/salonStore';
import { User, ArrowLeft } from 'lucide-react';

interface BookingFormProps {
  onNext: () => void;
  onBack: () => void;
}

const BookingForm = ({ onNext, onBack }: BookingFormProps) => {
  const { menServices, womenServices, setCurrentBooking, currentBooking } = useSalonStore();
  
  const [formData, setFormData] = useState({
    fullName: currentBooking.fullName || '',
    phone: currentBooking.phone || '',
    gender: currentBooking.gender || ('' as Gender | ''),
    serviceId: currentBooking.serviceId || '',
    notes: currentBooking.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const services = formData.gender === 'men' ? menServices : 
                   formData.gender === 'women' ? womenServices : 
                   [];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenderChange = (value: Gender) => {
    setFormData((prev) => ({ ...prev, gender: value, serviceId: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    if (!formData.serviceId) {
      newErrors.serviceId = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setCurrentBooking({
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender as Gender,
        serviceId: formData.serviceId,
        notes: formData.notes,
      });
      onNext();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Your Details</h2>
          <p className="text-muted-foreground text-sm">Please fill in your information</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className={errors.fullName ? 'border-destructive' : ''}
          />
          {errors.fullName && (
            <p className="text-destructive text-sm">{errors.fullName}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 234 567 8900"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-destructive text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleGenderChange(value as Gender)}
          >
            <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-destructive text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Service */}
        <div className="space-y-2">
          <Label>Service *</Label>
          <Select
            value={formData.serviceId}
            onValueChange={(value) => handleInputChange('serviceId', value)}
            disabled={!formData.gender}
          >
            <SelectTrigger className={errors.serviceId ? 'border-destructive' : ''}>
              <SelectValue placeholder={formData.gender ? 'Select a service' : 'Select gender first'} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - ${service.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceId && (
            <p className="text-destructive text-sm">{errors.serviceId}</p>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any special requests or notes..."
            rows={3}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} variant="gold" size="lg" className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
