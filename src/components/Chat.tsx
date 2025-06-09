import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface ChatProps {
  userType: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  type: 'text' | 'system';
}

export const Chat: React.FC<ChatProps> = ({ userType }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const room = 'general'; // Pode ser ajustado para lógica de múltiplas salas

  // Scroll para o final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user || !token) return;
    const socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join_room', { room });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('receive_message', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          sender: data.user_name,
          content: data.message,
          timestamp: new Date(data.timestamp),
          isOwn: data.user_id === user.id,
          type: 'text',
        },
      ]);
    });

    socket.on('status', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: data.msg + Date.now(),
          sender: 'Sistema',
          content: data.msg,
          timestamp: new Date(),
          isOwn: false,
          type: 'system',
        },
      ]);
    });

    socket.on('user_typing', (data) => {
      setOtherTyping(true);
      setTimeout(() => setOtherTyping(false), 2000);
    });

    socket.on('connect_error', (err) => {
      setConnected(false);
      // Opcional: mostrar erro para o usuário
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;
    socketRef.current.emit('send_message', {
      room,
      message: newMessage,
    });
    setNewMessage('');
  };

  // Emitir evento de digitação
  const handleTyping = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('typing', { room });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MessageSquare className="h-6 w-6 mr-3 text-blue-400" />
          Chat ao Vivo
        </h2>
        <span className={`ml-4 text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>{connected ? 'Conectado' : 'Desconectado'}</span>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-slate-700/50 border-b border-slate-600/50 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userType === 'trader' ? 'GC' : 'JS'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {userType === 'trader' ? 'Gestor Carlos' : 'João Silva'}
              </h3>
              <p className="text-sm text-green-400">{connected ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 transition-colors">
              <Phone className="h-4 w-4 text-slate-300" />
            </button>
            <button className="p-2 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 transition-colors">
              <Video className="h-4 w-4 text-slate-300" />
            </button>
            <button className="p-2 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 transition-colors">
              <MoreVertical className="h-4 w-4 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'system'
                  ? 'bg-slate-600/50 text-slate-300 text-center text-sm'
                  : message.isOwn
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-slate-700/50 text-white'
              }`}>
                {message.type !== 'system' && !message.isOwn && (
                  <p className="text-xs text-slate-400 mb-1">{message.sender}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'system' 
                    ? 'text-slate-400' 
                    : message.isOwn 
                    ? 'text-blue-100' 
                    : 'text-slate-400'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {otherTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs px-4 py-2 rounded-lg bg-slate-600/50 text-slate-300 text-center text-sm animate-pulse">
                Digitando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-slate-600/50 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleTyping}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              disabled={!connected}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
              disabled={!connected || !newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
