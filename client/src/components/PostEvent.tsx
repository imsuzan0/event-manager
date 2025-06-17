
import { useState } from 'react';
import { Calendar, MapPin, Phone, Upload, X } from 'lucide-react';

const PostEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    tags: 'Tech',
    phoneNumber: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Event submitted:', formData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      location: '',
      date: '',
      tags: 'Tech',
      phoneNumber: ''
    });
    setImagePreview(null);
    setIsSubmitting(false);

    // Show success message (you could use a toast here)
    alert('Event posted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create Your{' '}
          <span className="bg-gradient-to-r from-teal-600 to-coral-600 bg-clip-text text-transparent">
            Event
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Share your amazing event with the community
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Enter your event title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your event in detail"
            />
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Event location"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date *
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Tags and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="Tech">Tech</option>
                <option value="Health">Health</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
                pattern="[\+]?[0-9\s\(\)-]+"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image (Optional)
            </label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-teal-500 to-coral-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-coral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Event...
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostEvent;
