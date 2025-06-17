
export interface Comment {
  id: string;
  author: string;
  text: string;
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date; // Keep for backward compatibility
  startDate?: Date; // New optional field
  endDate?: Date; // New optional field
  image?: string;
  tags: 'Tech' | 'Health' | 'Others';
  phoneNumber: string;
  likes: number;
  comments: Comment[];
}
