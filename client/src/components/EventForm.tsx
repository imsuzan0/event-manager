
import { useState } from 'react';
import { Calendar, MapPin, Phone, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EventFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EventForm = ({ onSubmit, onCancel, isSubmitting = false }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    tags: 'Tech',
    phoneNumber: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, images });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter your event title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe your event in detail"
        />
      </div>

      <div>
        <Label htmlFor="location">
          <MapPin className="inline h-4 w-4 mr-1" />
          Location *
        </Label>
        <Input
          type="text"
          id="location"
          name="location"
          required
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Event location"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">
            <Calendar className="inline h-4 w-4 mr-1" />
            Start Date *
          </Label>
          <Input
            type="datetime-local"
            id="startDate"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="endDate">
            <Calendar className="inline h-4 w-4 mr-1" />
            End Date *
          </Label>
          <Input
            type="datetime-local"
            id="endDate"
            name="endDate"
            required
            value={formData.endDate}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tags">Category *</Label>
          <select
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <Label htmlFor="phoneNumber">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone Number *
          </Label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            pattern="[\+]?[0-9\s\(\)-]+"
          />
        </div>
      </div>

      <div>
        <Label>Event Images (Optional)</Label>
        {images.length === 0 ? (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB (Multiple files allowed)</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Carousel */}
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`Preview ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Remove current image button */}
              <button
                type="button"
                onClick={() => removeImage(currentImageIndex)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-colors ${
                      index === currentImageIndex ? 'border-teal-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Add more images button */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <p className="text-sm text-gray-500">Add more images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-teal-500 to-coral-500 hover:from-teal-600 hover:to-coral-600"
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            'Create Event'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
