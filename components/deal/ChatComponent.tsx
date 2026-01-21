'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, Send, Loader2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
    id: string;
    deal_id: string;
    sender_id: string;
    message: string;
    created_at: string;
    sender?: {
        full_name: string;
        avatar_url: string | null;
    };
}

interface ChatComponentProps {
    dealId: string;
    currentUserId: string;
}

export default function ChatComponent({ dealId, currentUserId }: ChatComponentProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('deal_messages')
                .select(`
                    *,
                    sender:profiles!sender_id(full_name, avatar_url)
                `)
                .eq('deal_id', dealId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
            scrollToBottom();
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`deal_chat:${dealId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'deal_messages',
                    filter: `deal_id=eq.${dealId}`,
                },
                async (payload) => {
                    // Check if we already have this message (deduplication)
                    setMessages((prev) => {
                        if (prev.some(m => m.id === payload.new.id)) return prev;

                        // If we just manually added it (via handleSendMessage success), it might be in `messages` already?
                        // The logic above `prev.some` handles it IF the IDs match.
                        // `handleSendMessage` uses the returned `data.id` (real ID), so it SHOULD match.
                        // So checking ID existence is sufficient.

                        // We need to fetch sender details, or if it's us, use partial known data
                        // For simplicity in realtime, we might miss the relation unless we fetch it.
                        // But if it's us, we know our ID.

                        const isMe = payload.new.sender_id === currentUserId;
                        // If it's me, I might want to remove optimistic message? 
                        // Actually, let's just add it to the valid list.

                        // We'll fetch sender async if needed, but for now let's append raw
                        // and maybe trigger a soft refresh or just live with it until refresh.
                        // Better: just fetch the profile or use what we know.

                        return [...prev, payload.new as Message];
                    });

                    // If the new message is from me, remove it from optimistic
                    if (payload.new.sender_id === currentUserId) {
                        setOptimisticMessages(prev => prev.filter(m => m.message !== payload.new.message));
                    }

                    // Fetch sender details properly to update the view
                    if (payload.new.sender_id) {
                        const { data: senderData } = await supabase
                            .from('profiles')
                            .select('full_name, avatar_url')
                            .eq('id', payload.new.sender_id)
                            .single();

                        if (senderData) {
                            setMessages(prev => prev.map(m =>
                                m.id === payload.new.id ? { ...m, sender: senderData } : m
                            ));
                        }
                    }

                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [dealId, supabase, currentUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, optimisticMessages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        const tempId = crypto.randomUUID();
        const msgContent = newMessage.trim();

        // Crate optimistic message
        const optimisticMsg: Message = {
            id: tempId,
            deal_id: dealId,
            sender_id: currentUserId,
            message: msgContent,
            created_at: new Date().toISOString(),
            sender: {
                full_name: 'You', // Placeholder
                avatar_url: null
            }
        };

        setOptimisticMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        scrollToBottom();

        try {
            const { data, error } = await supabase
                .from('deal_messages')
                .insert({
                    deal_id: dealId,
                    sender_id: currentUserId,
                    message: msgContent,
                })
                .select()
                .single();

            if (error) {
                console.error('Error sending message:', error);
                alert('Failed to send message');
                // Remove optimistic on error
                setOptimisticMessages(prev => prev.filter(m => m.id !== tempId));
                setNewMessage(msgContent); // Restore input
            } else if (data) {
                // Success: Replace optimistic with real
                // We manually construct the full message with sender info (User)
                // or just wait for subscription? 
                // Better: Update state immediately with the Real ID, removing optimistic.
                const realMsg: Message = {
                    ...data,
                    sender: {
                        full_name: 'You',
                        avatar_url: null
                    }
                };

                setMessages(prev => [...prev, realMsg]);
                setOptimisticMessages(prev => prev.filter(m => m.id !== tempId));
            }
        } catch (error) {
            console.error('Error:', error);
            setOptimisticMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setSending(false);
        }
    };

    // Combine messages for display
    const displayMessages = [...messages, ...optimisticMessages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[500px] flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-4">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Activity & Messages
            </h3>

            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : displayMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    displayMessages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;
                        const showDate = index === 0 ||
                            new Date(msg.created_at).getDate() !== new Date(displayMessages[index - 1].created_at).getDate();
                        // Check if optimistic
                        const isOptimistic = optimisticMessages.some(om => om.id === msg.id);

                        return (
                            <div key={msg.id} className={isOptimistic ? 'opacity-70' : ''}>
                                {showDate && (
                                    <div className="text-center text-xs text-gray-400 my-4">
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </div>
                                )}
                                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] ${isMe ? 'bg-emerald-100 text-emerald-900 rounded-tr-none' : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'} px-4 py-3 rounded-xl shadow-sm`}>
                                        <div className="flex items-center gap-2 mb-1 opacity-70">
                                            <span className="text-xs font-semibold">
                                                {isMe ? 'You' : msg.sender?.full_name || 'Unknown'}
                                            </span>
                                            <span className="text-[10px]">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isOptimistic && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </form>
        </div>
    );
}
