import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { swapsAPI } from '../services/api';
import { MessageSquare, User, ArrowDown, ArrowUp, Check, X, Clock } from 'lucide-react';
import './Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [activeTab, setActiveTab] = useState('incoming');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await swapsAPI.getSwapRequests();
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch requests. Please refresh the page.');
    }
  };

  const handleResponse = async (requestId, accepted) => {
    setLoading(true);
    
    try {
      await swapsAPI.respondToSwap(requestId, accepted);
      fetchRequests();
      if (accepted) {
        toast.success('Swap request accepted! Your calendars have been updated.');
      } else {
        toast.success('Swap request rejected.');
      }
    } catch (error) {
      toast.error('Failed to respond to swap request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requests">
      <div className="container">
        <div className="requests-header">
          <div className="header-content">
            <div className="header-icon">
              <MessageSquare size={32} />
            </div>
            <div>
              <h1>Swap Requests</h1>
              <p>Manage your incoming and outgoing swap requests</p>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`tab ${activeTab === 'incoming' ? 'active' : ''}`}
          >
            Incoming ({requests.incoming.length})
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`tab ${activeTab === 'outgoing' ? 'active' : ''}`}
          >
            Outgoing ({requests.outgoing.length})
          </button>
        </div>

        <div className="requests-list">
          {activeTab === 'incoming' && (
            <>
              {requests.incoming.map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        <User size={20} />
                      </div>
                      <div>
                        <h3>From: {request.requesterUserId.name}</h3>
                        <p>{request.requesterUserId.email}</p>
                      </div>
                    </div>
                    <span className={`status-badge status-${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="swap-details">
                    <div className="swap-item offer">
                      <div className="swap-header">
                        <ArrowDown size={16} />
                        <span>They offer:</span>
                      </div>
                      <div className="swap-content">
                        <h4>{request.requesterSlotId.title}</h4>
                        <div className="time-info">
                          <Clock size={14} />
                          <span>{new Date(request.requesterSlotId.startTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="swap-item request">
                      <div className="swap-header">
                        <ArrowUp size={16} />
                        <span>For your:</span>
                      </div>
                      <div className="swap-content">
                        <h4>{request.targetSlotId.title}</h4>
                        <div className="time-info">
                          <Clock size={14} />
                          <span>{new Date(request.targetSlotId.startTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.status === 'PENDING' && (
                    <div className="request-actions">
                      <button
                        onClick={() => handleResponse(request._id, true)}
                        className="btn btn-primary accept-btn"
                        disabled={loading}
                      >
                        <Check size={16} />
                        {loading ? 'Processing...' : 'Accept Swap'}
                      </button>
                      <button
                        onClick={() => handleResponse(request._id, false)}
                        className="btn reject-btn"
                        disabled={loading}
                      >
                        <X size={16} />
                        {loading ? 'Processing...' : 'Reject Swap'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {requests.incoming.length === 0 && (
                <div className="empty-state">
                  <MessageSquare size={64} />
                  <h3>No incoming requests</h3>
                  <p>You don't have any pending swap requests at the moment.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'outgoing' && (
            <>
              {requests.outgoing.map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        <User size={20} />
                      </div>
                      <div>
                        <h3>To: {request.targetUserId.name}</h3>
                        <p>{request.targetUserId.email}</p>
                      </div>
                    </div>
                    <span className={`status-badge status-${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="swap-details">
                    <div className="swap-item offer">
                      <div className="swap-header">
                        <ArrowUp size={16} />
                        <span>You offered:</span>
                      </div>
                      <div className="swap-content">
                        <h4>{request.requesterSlotId.title}</h4>
                        <div className="time-info">
                          <Clock size={14} />
                          <span>{new Date(request.requesterSlotId.startTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="swap-item request">
                      <div className="swap-header">
                        <ArrowDown size={16} />
                        <span>For their:</span>
                      </div>
                      <div className="swap-content">
                        <h4>{request.targetSlotId.title}</h4>
                        <div className="time-info">
                          <Clock size={14} />
                          <span>{new Date(request.targetSlotId.startTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {requests.outgoing.length === 0 && (
                <div className="empty-state">
                  <MessageSquare size={64} />
                  <h3>No outgoing requests</h3>
                  <p>You haven't sent any swap requests yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;