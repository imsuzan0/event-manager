import { useState } from "react";
import {
  Calendar,
  MapPin,
  Phone,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEvent } from "@/contexts/event-context";
import { useToast } from "@/hooks/use-toast";
import type { EventFormData } from "@/types/Event";

interface EventFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
  initialData?: Partial<EventFormData>;
  mode?: "create" | "edit";
  eventId?: string;
  existingImages?: string[];
}

const EventForm = ({
  onSuccess,
  onCancel,
  initialData = {},
  mode = "create",
  eventId,
  existingImages = [],
}: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData.title || "",
    desc: initialData.desc || "",
    location: initialData.location || "",
    date: initialData.date || "",
    tag: initialData.tag || "Tech",
    phoneNumber: initialData.phoneNumber || "",
  });

  const [fileImages, setFileImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>(existingImages);
  const [existingImageUrls, setExistingImageUrls] =
    useState<string[]>(existingImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createEvent, updateEvent } = useEvent();
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setFileImages((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const totalExistingImages = existingImageUrls.length;

    if (index < totalExistingImages) {
      // Removing an existing image
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Removing a newly added image
      const newImageIndex = index - totalExistingImages;
      setFileImages((prev) => prev.filter((_, i) => i !== newImageIndex));
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    }

    if (currentImageIndex >= previewImages.length - 1) {
      setCurrentImageIndex(Math.max(0, previewImages.length - 2));
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % previewImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + previewImages.length) % previewImages.length
    );
  };

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.desc ||
      !formData.date ||
      !formData.location ||
      !formData.phoneNumber
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return false;
    }

    // Validate date is not in the past
    const eventDate = new Date(formData.date);
    const today = new Date();
    if (eventDate < today) {
      toast({
        title: "Validation Error",
        description: "Event date cannot be in the past",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData: EventFormData & { existingImages?: string[] } = {
        ...formData,
        images: fileImages,
        existingImages: existingImageUrls,
      };

      if (mode === "create") {
        await createEvent(eventData);
        toast({
          title: "Success",
          description: "Event created successfully!",
        });
      } else if (mode === "edit" && eventId) {
        await updateEvent(eventId, eventData);
        toast({
          title: "Success",
          description: "Event updated successfully!",
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-4">
    <div className="w-full max-w-4xl">
    <form
      id="event-form"
      onSubmit={handleSubmit}
      className="space-y-4 pb-20 w-full"
    >
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
          disabled={isSubmitting}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <Label htmlFor="desc">Description *</Label>
        <Textarea
          id="desc"
          name="desc"
          required
          rows={3}
          value={formData.desc}
          onChange={handleInputChange}
          placeholder="Describe your event in detail"
          disabled={isSubmitting}
          className="mt-1 w-full"
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
          disabled={isSubmitting}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <Label htmlFor="date">
          <Calendar className="inline h-4 w-4 mr-1" />
          Event Date *
        </Label>
        <Input
          type="datetime-local"
          id="date"
          name="date"
          required
          value={formData.date}
          onChange={handleInputChange}
          min={new Date().toISOString().slice(0, 16)}
          disabled={isSubmitting}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">
          <Phone className="inline h-4 w-4 mr-1" />
          Contact Number *
        </Label>
        <Input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          required
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Your contact number"
          disabled={isSubmitting}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <Label htmlFor="tag">Event Category *</Label>
        <select
          id="tag"
          name="tag"
          value={formData.tag}
          onChange={handleInputChange}
          className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          disabled={isSubmitting}
        >
          <option value="Tech">Tech</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Food">Food</option>
          <option value="Art">Art</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <Label>Event Images</Label>
        <div className="mt-2 space-y-4">
          {/* Image upload button */}
          <div className="flex items-center justify-center w-full">
<label className="w-full flex flex-col items-center px-4 py-6 bg-white text-indigo-600 rounded-lg shadow-lg tracking-wide border border-indigo-600 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all ">              <Upload className="w-8 h-8" />
              <span className="mt-2 text-base">Select event images</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isSubmitting}
              />
            </label>
          </div>

          {/* Image preview */}
          {previewImages.length > 0 && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={previewImages[currentImageIndex]}
                alt={`Preview ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Navigation arrows */}
              {previewImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                    disabled={isSubmitting}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(currentImageIndex)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/50 text-white text-sm">
                {currentImageIndex + 1} / {previewImages.length}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Create Event"
            : "Update Event"}
        </Button>
      </div>
    </form>
    </div>
    </div>
  );
};

export default EventForm;
