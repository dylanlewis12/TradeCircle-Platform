//Only for completed trades
//Trade History header
//Trade History mapping cards using trade ._id
//Your skill:
//Their skill:
//Date:
//Rating star system or Not rated
//Leave review button that opens a modal for rating that trade
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import '../styles/components/TradeHistory.css';
import { useAuth } from '../context/authContext/AuthContext';
import { Users, HandshakeIcon } from 'lucide-react';

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
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  timeframe: string;
  notes: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

type TabType = 'incoming' | 'outgoing' | 'completed';

export default function TradeHistory() {
    const { cookies, user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('incoming');
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch trades based on active tab
    useEffect(() => {
       fetchTrades();
    }, [activeTab]);

    
    // src/components/TradeHistory.tsx
    const fetchTrades = async () => {
        setLoading(true);
        try {
            let endpoint = `${API_BASE_URL}/api/trades`;
            let params = {};

            if (activeTab === 'incoming') {
                params = { status: 'pending' };
            } else if (activeTab === 'outgoing') {
                params = { status: 'pending' };
            } else if (activeTab === 'completed') {
                endpoint = `${API_BASE_URL}/api/trades/history/user`;
            }

            console.log('🔧 Full URL:', endpoint);
            console.log('🔧 Access token:', cookies.accessToken?.substring(0, 20));

            const response = await axios.get(endpoint, {
                params,
                headers: {
                    'Authorization': `Bearer ${cookies.accessToken}`
                }
            });

            console.log('Response data:', response.data);

            const allTrades = response.data.trades || [];

            setTrades(allTrades);
        } catch (error: any) {
            console.error('Error:', error.response?.data?.message);
            toast.error('Failed to load trades');
        } finally {
            setLoading(false);
        }
    };

    //Call fetchTrades at the end of each try statement
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

    async function handleCompleteTrade(tradeId: string) {
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
            fetchTrades();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to complete trade');
        }
    }

    async function handleCancelTrade(tradeId: string) {
        try {
            await axios.put(
                `${API_BASE_URL}/api/trades/${tradeId}/cancel`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${cookies.accessToken}`
                    }
                }
            );
            toast.success('Trade cancelled');
            fetchTrades();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel trade');
        }
    }

    return (
        <div className='trade-history'>
            {/*Tab Navigation*/}
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
                    Completed Trades
                </button>
            </div>

            {/*Content*/}
            <div className='trade-history__content'>
                {loading ? (
                    <div className="trade-history__loading">Loading trades...</div>
                ) : trades.length === 0 ? (
                    <div className="trade-history__empty">
                        <p>
                            {activeTab === 'incoming' && 'No incoming trade proposals yet'}
                            {activeTab === 'outgoing' && 'No outgoing trade proposals yet'}
                            {activeTab === 'completed' && 'No completed trades yet'}
                        </p>
                    </div>
                ) : (
                    <div className="trade-history__list">
                        {trades.map(trade => (
                            <div key={trade._id} className="trade-card">
                                <div className="trade-card__header">
                                    <div className="trade-card__user">
                                        <h3 className="trade-card__name">
                                            {activeTab === 'incoming' ? trade.initiator.userName : trade.receiver.userName}
                                        </h3>
                                        <span className={`trade-card__status trade-card__status--${trade.status}`}>
                                            {trade.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="trade-card__type">
                                        {trade.transactionType === 'exchange' ? (
                                            <>
                                                <HandshakeIcon size={20} style={{ marginRight: '6px' }} />
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
                                        <span className="trade-card__date" style={{marginLeft: "auto"}}>
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
                                            className="trade-card__btn trade-card__btn--cancel"
                                            onClick={() => handleCancelTrade(trade._id)}
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    {activeTab === 'outgoing' && trade.status === 'accepted' && (
                                        <button
                                            className="trade-card__btn trade-card__btn--complete"
                                            onClick={() => handleCompleteTrade(trade._id)}
                                        >
                                            Mark Complete
                                        </button>
                                    )}

                                    {activeTab === 'completed' && (
                                        <span className="trade-card__completed">✅ Completed</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}