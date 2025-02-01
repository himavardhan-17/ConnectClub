import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Tech Innovation Summit 2024",
    date: "March 25, 2024",
    time: "10:00 AM",
    location: "Tech Hub Auditorium",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
    description: "Join industry leaders for a day of insights into emerging technologies and future trends."
  },
  {
    id: 2,
    title: "Web Development Workshop",
    date: "April 2, 2024",
    time: "2:00 PM",
    location: "Digital Learning Center",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
    description: "Hands-on workshop covering modern web development practices and frameworks."
  }
];

const pastEvents: Event[] = [
  {
    id: 3,
    title: "AI & Machine Learning Conference",
    date: "February 15, 2024",
    time: "9:00 AM",
    location: "Innovation Center",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
    description: "A deep dive into the latest developments in AI and machine learning technologies."
  }
];

const EventCard: React.FC<{ event: Event; isUpcoming?: boolean }> = ({ event, isUpcoming = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
        <div className="space-y-2 text-gray-300">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="mt-4 text-gray-400">{event.description}</p>
        {isUpcoming && (
          <Link
            to={`/register?event=${event.id}`}
            className="mt-6 btn-primary"
          >
            Register Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

const Events = () => {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} isUpcoming={true} />
            ))}
          </div>
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Events;