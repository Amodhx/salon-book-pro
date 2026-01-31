import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useSalonStore } from '@/store/salonStore';
import { CreditCard, ArrowLeft, Upload, X, Image } from 'lucide-react';

interface PaymentUploadProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentUpload = ({ onNext, onBack }: PaymentUploadProps) => {
  const { setCurrentBooking, currentBooking, addBooking } = useSalonStore();
  const [preview, setPreview] = useState<string | null>(currentBooking.paymentSlip || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setCurrentBooking({ paymentSlip: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setCurrentBooking({ paymentSlip: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    // Add the booking to the store
    addBooking({
      fullName: currentBooking.fullName!,
      phone: currentBooking.phone!,
      serviceId: currentBooking.serviceId!,
      gender: currentBooking.gender!,
      date: currentBooking.date!,
      timeSlot: currentBooking.timeSlot!,
      notes: currentBooking.notes,
      paymentSlip: currentBooking.paymentSlip,
    });
    onNext();
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground">Payment</h2>
          <p className="text-muted-foreground text-sm">Upload your payment slip</p>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
        <p className="text-sm font-medium text-foreground mb-2">Payment Instructions:</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Transfer the service amount to our bank account</li>
          <li>Take a screenshot or photo of your payment receipt</li>
          <li>Upload the image below for verification</li>
        </ol>
        <div className="mt-3 p-3 bg-background rounded-lg">
          <p className="text-xs text-muted-foreground">Bank: First National Bank</p>
          <p className="text-xs text-muted-foreground">Account: 1234 5678 9012</p>
          <p className="text-xs text-muted-foreground">Name: Luxe Salon Inc.</p>
        </div>
      </div>

      {/* Upload Area */}
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
            ${isDragging
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent hover:bg-secondary/50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleInputChange}
            className="hidden"
          />
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-muted-foreground text-sm">
            JPG or PNG (max. 5MB)
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-xl overflow-hidden border border-border">
            <img
              src={preview}
              alt="Payment slip preview"
              className="w-full h-64 object-contain bg-secondary/30"
            />
          </div>
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Image className="w-4 h-4" />
            <span>Payment slip uploaded</span>
          </div>
        </div>
      )}

      {/* Skip option */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        You can skip this step and submit payment later
      </p>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <Button onClick={onBack} variant="outline" size="lg" className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} variant="gold" size="lg" className="flex-1">
          Submit Booking
        </Button>
      </div>
    </div>
  );
};

export default PaymentUpload;
