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
  likes?: number;
  comments?: Comment[];
}
