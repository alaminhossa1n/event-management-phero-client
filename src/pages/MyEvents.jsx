import { useState, useEffect } from "react";
import { eventsAPI } from "../utils/api";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import UpdateEventModal from "../components/UpdateEventModal";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getMyEvents();
      setEvents(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch your events");
      console.error("Error fetching my events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = (event) => {
    setSelectedEvent(event);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingEvent(eventId);
      await eventsAPI.deleteEvent(eventId);

      // Remove the event from local state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
      toast.success("Event deleted successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete event";
      toast.error(message);
    } finally {
      setDeletingEvent(null);
    }
  };

  const handleEventUpdated = (updatedEvent) => {
    // Update the event in the local state
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
    setIsUpdateModalOpen(false);
    setSelectedEvent(null);
    toast.success("Event updated successfully");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">Manage the events you've created</p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't created any events yet.
            </p>
            <a
              href="/add-event"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const { date, time } = formatDateTime(event.dateTime);

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

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateEvent(event)}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        disabled={deletingEvent === event._id}
                        className="flex-1 flex items-center justify-center px-3 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingEvent === event._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Event Modal */}
      {isUpdateModalOpen && selectedEvent && (
        <UpdateEventModal
          event={selectedEvent}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedEvent(null);
          }}
          onEventUpdated={handleEventUpdated}
        />
      )}
    </div>
  );
};

export default MyEvents;
