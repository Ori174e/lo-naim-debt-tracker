import { friendService, FriendRequest } from '../../services/friend.service'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { Check, X, Clock } from 'lucide-react'
import { useState } from 'react'

interface FriendRequestListProps {
    received: FriendRequest[]
    sent: FriendRequest[]
    onUpdate: () => void
}

export default function FriendRequestList({ received, sent, onUpdate }: FriendRequestListProps) {
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
    const [processingId, setProcessingId] = useState<string | null>(null)

    const handleRespond = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
        setProcessingId(requestId)
        try {
            await friendService.respondToRequest(requestId, status)
            onUpdate()
        } catch (error) {
            console.error('Failed to respond:', error)
        } finally {
            setProcessingId(null)
        }
    }

    const requests = activeTab === 'received' ? received : sent

    return (
        <div className="space-y-4">
            <div className="flex gap-4 border-b border-slate-700 pb-2">
                <button
                    className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'received'
                            ? 'text-primary-400 border-b-2 border-primary-400'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    onClick={() => setActiveTab('received')}
                >
                    Received ({received.length})
                </button>
                <button
                    className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'sent'
                            ? 'text-primary-400 border-b-2 border-primary-400'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    onClick={() => setActiveTab('sent')}
                >
                    Sent ({sent.length})
                </button>
            </div>

            <div className="space-y-3">
                {requests.length === 0 && (
                    <p className="text-slate-500 text-sm py-4">No {activeTab} requests.</p>
                )}

                {requests.map((request) => (
                    <Card key={request.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                {activeTab === 'received'
                                    ? request.requester?.name.charAt(0).toUpperCase()
                                    : request.recipient?.name.charAt(0).toUpperCase()
                                }
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-200">
                                    {activeTab === 'received' ? request.requester?.name : request.recipient?.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {activeTab === 'received' ? request.requester?.email : request.recipient?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {activeTab === 'received' ? (
                                <>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleRespond(request.id, 'ACCEPTED')}
                                        isLoading={processingId === request.id}
                                        disabled={!!processingId}
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRespond(request.id, 'REJECTED')}
                                        isLoading={processingId === request.id}
                                        disabled={!!processingId}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <div className="flex items-center text-xs text-slate-500 gap-1 bg-slate-800/50 px-2 py-1 rounded">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
