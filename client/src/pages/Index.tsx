
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/components/Home';
import MyEvents from '@/components/MyEvents';
import EventDetail from '@/components/EventDetail';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar />
      <main className="pt-20 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
