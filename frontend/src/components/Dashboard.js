import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { eventsAPI } from '../services/api';
import { Calendar, Plus, Clock, ToggleLeft, ToggleRight, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getEvents();
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events. Please refresh the page.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await eventsAPI.createEvent(newEvent);
      setNewEvent({ title: '', startTime: '', endTime: '' });
      setShowForm(false);
      fetchEvents();
      toast.success('Event created successfully!');
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSwappable = async (event) => {
    const newStatus = event.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
    
    try {
      await eventsAPI.updateEvent(event._id, { status: newStatus });
      fetchEvents();
      toast.success(`Event marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update event status. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-icon">
              <Calendar size={32} />
            </div>
            <div>
              <h1>My Calendar</h1>
              <p>Manage your events and make them available for swapping</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {showForm && (
          <div className="event-form-card">
            <h3>Create New Event</h3>
            <form onSubmit={handleCreateEvent} className="event-form">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="input"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>
        )}

        <div className="events-grid">
          {events.map(event => (
            <div key={event._id} className={`event-card ${event.status.toLowerCase()}`}>
              <div className="event-header">
                <h3>{event.title}</h3>
                <span className={`status-badge status-${event.status.toLowerCase()}`}>
                  {event.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="event-times">
                <div className="time-item">
                  <Clock size={16} />
                  <div>
                    <span>Start</span>
                    <p>{new Date(event.startTime).toLocaleString()}</p>
                  </div>
                </div>
                <div className="time-item">
                  <Clock size={16} />
                  <div>
                    <span>End</span>
                    <p>{new Date(event.endTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {event.status !== 'SWAP_PENDING' && (
                <button
                  onClick={() => toggleSwappable(event)}
                  className={`toggle-btn ${event.status === 'SWAPPABLE' ? 'active' : ''}`}
                >
                  {event.status === 'BUSY' ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
                  {event.status === 'BUSY' ? 'Make Swappable' : 'Make Busy'}
                </button>
              )}
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>No events yet</h3>
            <p>Create your first event to get started with slot swapping.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              <Plus size={18} />
              Create Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;