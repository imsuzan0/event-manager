import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateEvent } from  "@/contexts/event-context"

const EditEventForm = ({ event, onClose, onRefresh }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: event.title,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    description: event.description,
    images: [],
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(event._id, formData);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      onRefresh();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Event Title"
        required
      />
      <Input
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        placeholder="Location"
        required
      />
      <Input
        type="datetime-local"
        name="startDate"
        value={formData.startDate}
        onChange={handleInputChange}
        required
      />
      <Input
        type="datetime-local"
        name="endDate"
        value={formData.endDate}
        onChange={handleInputChange}
        required
      />
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
        Update Event
      </Button>
    </form>
  );
};

export default EditEventForm;
