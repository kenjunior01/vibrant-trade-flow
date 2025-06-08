
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Phone, Video, MoreVertical } from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sistema',
      content: 'Chat iniciado. Como posso ajudá-lo?',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
      type: 'system'
    },
    {
      id: '2',
      sender: userType === 'trader' ? 'Gestor Carlos' : 'João Silva',
      content: 'Olá! Gostaria de verificar o status das minhas automações.',
      timestamp: new Date(Date.now() - 240000),
      isOwn: false,
      type: 'text'
    },
    {
      id: '3',
      sender: 'Você',
      content: 'Claro! Suas automações estão funcionando perfeitamente. A estratégia EUR/USD gerou +$2,450 hoje.',
      timestamp: new Date(Date.now() - 180000),
      isOwn: true,
      type: 'text'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Você',
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: userType === 'trader' ? 'Gestor Carlos' : 'João Silva',
        content: 'Entendi! Estarei verificando isso para você.',
        timestamp: new Date(),
        isOwn: false,
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
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
              <p className="text-sm text-green-400">Online</p>
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
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-slate-600/50 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
