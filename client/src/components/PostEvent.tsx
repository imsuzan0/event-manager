import { useNavigate } from "react-router-dom";
import EventForm from "./EventForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const PostEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Create New Event
        </h1>

        <EventForm
          mode="create"
          onSuccess={() => {
            toast({
              title: "Success",
              description: "Your event has been created successfully!",
            });
            navigate("/my-events");
          }}
          onCancel={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
};

export default PostEvent;
