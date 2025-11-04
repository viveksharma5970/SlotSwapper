import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { swapsAPI, eventsAPI } from '../services/api';
import { ShoppingBag, User, Clock, ArrowRight, X, AlertCircle } from 'lucide-react';
import './Marketplace.css';

const Marketplace = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableSlots();
    fetchMySwappableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await swapsAPI.getSwappableSlots();
      setAvailableSlots(response.data);
    } catch (error) {
      toast.error('Failed to fetch available slots. Please refresh the page.');
    }
  };

  const fetchMySwappableSlots = async () => {
    try {
      const response = await eventsAPI.getEvents();
      setMySwappableSlots(response.data.filter(event => event.status === 'SWAPPABLE'));
    } catch (error) {
      toast.error('Failed to fetch your slots. Please refresh the page.');
    }
  };

  const handleRequestSwap = (slot) => {
    if (mySwappableSlots.length === 0) {
      toast.error('You need to have swappable slots to request a swap.');
      return;
    }
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const submitSwapRequest = async (mySlotId) => {
    if (!selectedSlot) return;
    setLoading(true);
    
    try {
      await swapsAPI.createSwapRequest(mySlotId, selectedSlot._id);
      setShowModal(false);
      setSelectedSlot(null);
      fetchAvailableSlots();
      fetchMySwappableSlots();
      toast.success('Swap request sent successfully!');
    } catch (error) {
      toast.error('Failed to send swap request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marketplace">
      <div className="container">
        <div className="marketplace-header">
          <div className="header-content">
            <div className="header-icon">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h1>Marketplace</h1>
              <p>Discover available slots from other users and request swaps</p>
            </div>
          </div>
        </div>

        <div className="slots-grid">
          {availableSlots.map(slot => (
            <div key={slot._id} className="slot-card">
              <div className="slot-header">
                <h3>{slot.title}</h3>
                <span className="available-badge">Available</span>
              </div>
              
              <div className="slot-owner">
                <div className="owner-avatar">
                  <User size={20} />
                </div>
                <div className="owner-info">
                  <span className="owner-name">{slot.userId.name}</span>
                  <span className="owner-email">{slot.userId.email}</span>
                </div>
              </div>
              
              <div className="slot-times">
                <div className="time-item">
                  <Clock size={16} />
                  <div>
                    <span>Start</span>
                    <p>{new Date(slot.startTime).toLocaleString()}</p>
                  </div>
                </div>
                <div className="time-item">
                  <Clock size={16} />
                  <div>
                    <span>End</span>
                    <p>{new Date(slot.endTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleRequestSwap(slot)}
                className="btn btn-primary request-btn"
              >
                Request Swap <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {availableSlots.length === 0 && (
          <div className="empty-state">
            <ShoppingBag size={64} />
            <h3>No slots available</h3>
            <p>Check back later for new swappable slots from other users.</p>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Select Your Slot to Offer</h2>
                <button onClick={() => setShowModal(false)} className="close-btn">
                  <X size={20} />
                </button>
              </div>
              
              <div className="requesting-slot">
                <div className="requesting-header">
                  <AlertCircle size={20} />
                  <span>Requesting Slot</span>
                </div>
                <div className="requesting-content">
                  <h3>{selectedSlot?.title}</h3>
                  <p>{new Date(selectedSlot?.startTime).toLocaleString()} - {new Date(selectedSlot?.endTime).toLocaleString()}</p>
                </div>
              </div>

              <div className="my-slots-section">
                <h3>Your Available Slots:</h3>
                {mySwappableSlots.length > 0 ? (
                  <div className="my-slots-list">
                    {mySwappableSlots.map(slot => (
                      <div key={slot._id} className="my-slot-item">
                        <div className="slot-info">
                          <h4>{slot.title}</h4>
                          <p>{new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => submitSwapRequest(slot._id)}
                          className="btn btn-primary offer-btn"
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Offer This Slot'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-slots">
                    <AlertCircle size={48} />
                    <p>You don't have any swappable slots available.</p>
                    <span>Make some of your events swappable first.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;