export interface Comment {
  id: string;
  author: string;
  text: string;
  avatar: string;
}

export interface Event {
  _id: string;
  user_id: string;
  title: string;
  desc: string;
  date: string;
  location: string;
  tag: "Tech" | "Health" | "Others";
  phone_number: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  likes?: number;
  comments?: Comment[];
}

export interface EventFormData {
  title: string;
  desc: string;
  date: string;
  location: string;
  tag: string;
  phoneNumber: string;
  images?: File[];
}
