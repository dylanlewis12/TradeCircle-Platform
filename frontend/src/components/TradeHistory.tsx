import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import '../styles/components/TradeHistory.css';
import { useAuth } from '../context/authContext/AuthContext';
import { Users, Handshake } from 'lucide-react';
import RatingModal from '../components/modals/trade/RatingModal.tsx';

interface Trade {
  _id: string;
  initiator: { 
    _id: string;
    userName: string; 
    profilePicture?: string 
  };
  receiver: { 
    _id: string;
    userName: string; 
    profilePicture?: string 
  };
  skillOffering: { name: string; category: string };
  skillExchange?: { name: string; category: string };
  transactionType: 'exchange' | 'volunteer';
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  timeframe: string;
  notes: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  declinedAt?: string;
  initiatorRating?: number;
  receiverRating?: number;
  initiatorFeedback?: string;
  receiverFeedback?: string;
}

interface TradeHistoryProps {
  onCompletedTradesUpdate?: (count: number) => void;
}

type TabType = 'incoming' | 'outgoing' | 'completed';

export default function TradeHistory({ onCompletedTradesUpdate }: TradeHistoryProps) {
  const { cookies, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('incoming');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratingModal, setRatingModal] = useState<{ 
    isOpen: boolean; 
    tradeId: string; 
    userName: string 
  }>({
    isOpen: false,
    tradeId: '',
    userName: ''
  });

  // Fetch trades based on active tab
  useEffect(() => {
    fetchTrades();
  }, [activeTab]);

  async function fetchTrades() {
    setLoading(true);
    try {
      let endpoint = `${API_BASE_URL}/api/trades`;
      let params = {};

      if (activeTab === 'incoming') {
        params = { status: 'pending' };
      } else if (activeTab === 'outgoing') {
        params = { status: 'pending' };
      } else if (activeTab === 'completed') {
        endpoint = `${API_BASE_URL}/api/trades`;
      }

      const response = await axios.get(endpoint, {
        params,
        headers: {
          'Authorization': `Bearer ${cookies.accessToken}`
        }
      });

      console.log('Response data:', response.data);

      const allTrades = response.data.trades || [];
      let filteredTrades: Trade[] = [];

      if (activeTab === 'incoming') {
        filteredTrades = allTrades.filter(
          (trade: Trade) => trade.receiver._id === user?.id && trade.status === 'pending'
        );
      } else if (activeTab === 'outgoing') {
        filteredTrades = allTrades.filter(
          (trade: Trade) => trade.initiator._id === user?.id && trade.status === 'pending'
        );
      } else if (activeTab === 'completed') {
        // Show both accepted and completed trades
        filteredTrades = allTrades.filter(
          (trade: Trade) => 
            (trade.status === 'accepted' || trade.status === 'completed') &&
            (trade.initiator._id === user?.id || trade.receiver._id === user?.id)
        );

        // Call callback with count of completed trades only
        if (onCompletedTradesUpdate) {
          const completedCount = filteredTrades.filter(t => t.status === 'completed').length;
          onCompletedTradesUpdate(completedCount);
        }
      }

      setTrades(filteredTrades);
    } catch (error: any) {
      console.error('Error:', error.response?.data?.message);
      toast.error('Failed to load trades');
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptTrade(tradeId: string) {
    try {
      await axios.put(
        `${API_BASE_URL}/api/trades/${tradeId}/accept`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );
      toast.success('Trade accepted!');
      fetchTrades();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept trade');
    }
  }

  async function handleDeclineTrade(tradeId: string) {
    try {
      await axios.put(
        `${API_BASE_URL}/api/trades/${tradeId}/decline`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );
      toast.success('Trade declined');
      fetchTrades();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to decline trade');
    }
  }

  // Complete trade AND open rating modal
  async function handleCompleteAndRate(tradeId: string, otherUserName: string) {
    try {
      await axios.put(
        `${API_BASE_URL}/api/trades/${tradeId}/complete`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );
      toast.success('Trade marked as completed!');
      
      // Open rating modal
      setRatingModal({ 
        isOpen: true, 
        tradeId, 
        userName: otherUserName 
      });
      
      fetchTrades();
    } catch (error: any) {
      toast.error('Failed to complete trade');
    }
  }

  // Open rating modal for already completed trades
  function handleOpenRating(tradeId: string, otherUserName: string) {
    setRatingModal({ 
      isOpen: true, 
      tradeId, 
      userName: otherUserName 
    });
  }

  // Submit rating
  async function handleSubmitRating(rating: number, review: string) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/trades/${ratingModal.tradeId}/rate`,
        { rating, review },
        {
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`
          }
        }
      );

      // ✅ Better - shows the actual object
console.log("THE RATING WAS CHANGED!!!", response.data.trade);

// ✅ Or if you want to show a specific field
console.log("Rating: " + response.data.trade.initiatorRating + " - THE RATING WAS CHANGED!!!");

// ✅ Or using template literals
console.log(`Rating changed to: ${response.data.trade.initiatorRating}★ - THE RATING WAS CHANGED!!!`);

      toast.success('Rating submitted!');
      fetchTrades();
      setRatingModal({ isOpen: false, tradeId: '', userName: '' });
    } catch (error: any) {
      toast.error('Failed to submit rating');
    }
  }

  return (
    <div className='trade-history'>
      <div className='trade-history__tabs'>
        <button
          className={`trade-history__tab ${activeTab === 'incoming' ? 'trade-history__tab--active' : ''}`}
          onClick={() => setActiveTab('incoming')}
        >
          Incoming Trades
        </button>
        <button
          className={`trade-history__tab ${activeTab === 'outgoing' ? 'trade-history__tab--active' : ''}`}
          onClick={() => setActiveTab('outgoing')}
        >
          Outgoing Trades
        </button>
        <button
          className={`trade-history__tab ${activeTab === 'completed' ? 'trade-history__tab--active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Active Trades
        </button>
      </div>

      <div className='trade-history__content'>
        {loading ? (
          <div className="trade-history__loading">Loading trades...</div>
        ) : trades.length === 0 ? (
          <div className="trade-history__empty">
            <p>
              {activeTab === 'incoming' && 'No incoming trade proposals yet'}
              {activeTab === 'outgoing' && 'No outgoing trade proposals yet'}
              {activeTab === 'completed' && 'No active trades yet'}
            </p>
          </div>
        ) : (
          <div className="trade-history__list">
            {trades.map(trade => {
              const otherUserName = activeTab === 'incoming' ? trade.initiator.userName  // Incoming: show who initiated
                  : activeTab === 'outgoing' ? trade.receiver.userName   // Outgoing: show who receives
                  : activeTab === 'completed' && user?.id === trade.initiator._id ? trade.receiver.userName : trade.initiator.userName; // Completed: show the other person

              const userIsInitiator = user?.id === trade.initiator._id;
              const userRating = userIsInitiator ? trade.initiatorRating : trade.receiverRating;
              const hasRated = userRating !== null && userRating !== undefined;

              return (
                <div key={trade._id} className="trade-card">
                  <div className="trade-card__header">
                    <div className="trade-card__user">
                      <h3 className="trade-card__name">{otherUserName}</h3>
                      <span className={`trade-card__status trade-card__status--${trade.status}`}>
                        {trade.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="trade-card__type">
                      {trade.transactionType === 'exchange' ? (
                        <>
                          <Handshake size={20} style={{ marginRight: '6px' }} />
                          Exchange
                        </>
                      ) : (
                        <>
                          <Users size={20} style={{ marginRight: '6px' }} />
                          Volunteer
                        </>
                      )}
                    </span>
                  </div>

                  <div className="trade-card__body">
                    <div className="trade-card__skills">
                      <div className="trade-card__skill">
                        <span className="trade-card__label">Offering:</span>
                        <span className="trade-card__name">{trade.skillOffering.name}</span>
                      </div>
                      {trade.skillExchange && (
                        <div className="trade-card__skill">
                          <span className="trade-card__label">In Exchange:</span>
                          <span className="trade-card__name">{trade.skillExchange.name}</span>
                        </div>
                      )}
                    </div>

                    {trade.notes && (
                      <div className="trade-card__notes">
                        <strong>Notes:</strong> {trade.notes}
                      </div>
                    )}

                    <div className="trade-card__meta">
                      <span className="trade-card__timeframe">Timeline: {trade.timeframe}</span>
                      <span className="trade-card__date" style={{ marginLeft: "auto" }}>
                        {'Created Date: ' + new Date(trade.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="trade-card__actions">
                    {activeTab === 'incoming' && trade.status === 'pending' && (
                      <>
                        <button
                          className="trade-card__btn trade-card__btn--accept"
                          onClick={() => handleAcceptTrade(trade._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="trade-card__btn trade-card__btn--decline"
                          onClick={() => handleDeclineTrade(trade._id)}
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {activeTab === 'outgoing' && trade.status === 'pending' && (
                      <button
                        className="trade-card__btn trade-card__btn--decline"
                        onClick={() => handleDeclineTrade(trade._id)}
                      >
                        Cancel
                      </button>
                    )}

                    {/* Accepted trades - show Complete & Rate button */}
                    {activeTab === 'completed' && trade.status === 'accepted' && (
                      <button
                        className="trade-card__btn trade-card__btn--complete"
                        onClick={() => handleCompleteAndRate(trade._id, otherUserName)}
                      >
                        Complete & Rate
                      </button>
                    )}

                    {/* Completed trades - show disabled button + rating button */}
                    {activeTab === 'completed' && trade.status === 'completed' && (
                      <>
                        <button
                          className="trade-card__btn trade-card__btn--complete"
                          disabled
                          title="Trade is already completed"
                        >
                          ✓ Completed
                        </button>
                        <button
                          className="trade-card__btn trade-card__btn--rate"
                          onClick={() => handleOpenRating(trade._id, otherUserName)}
                        >
                          {hasRated ? `★ ${userRating}/5` : '☆ Rate Trade'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, tradeId: '', userName: '' })}
        onSubmit={handleSubmitRating}
        userName={ratingModal.userName}
      />
    </div>
  );
}