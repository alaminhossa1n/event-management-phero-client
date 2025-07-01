import { useState, useEffect } from "react";
import { eventsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Search, Filter, Calendar, MapPin, Users, Clock } from "lucide-react";
import toast from "react-hot-toast";

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [joiningEvent, setJoiningEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filter) params.filter = filter;

      const response = await eventsAPI.getAllEvents(params);
      setEvents(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      setJoiningEvent(eventId);
      const response = await eventsAPI.joinEvent(eventId);

      // Update the event in the local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, attendeeCount: response.data.data.attendeeCount }
            : event
        )
      );

      toast.success("Successfully joined the event!");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to join event";
      toast.error(message);
    } finally {
      setJoiningEvent(null);
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const isUserJoined = (event) => {
    return event.attendees?.includes(user?._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
          <p className="text-gray-600">
            Discover and join amazing events happening around you
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Events</option>
                <option value="today">Today</option>
                <option value="currentWeek">Current Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="currentMonth">Current Month</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filter
                ? "Try adjusting your search or filter criteria"
                : "No events have been created yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const { date, time } = formatDateTime(event.dateTime);
              const userJoined = isUserJoined(event);

              return (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.eventTitle}
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Posted by {event.name}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{date}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{time}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendeeCount} attendees</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <button
                      onClick={() => handleJoinEvent(event._id)}
                      disabled={userJoined || joiningEvent === event._id}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        userJoined
                          ? "bg-green-100 text-green-800 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      }`}
                    >
                      {joiningEvent === event._id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Joining...
                        </div>
                      ) : userJoined ? (
                        "Already Joined"
                      ) : (
                        "Join Event"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
