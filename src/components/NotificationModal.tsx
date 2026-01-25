import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'alert' | 'gift';
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notifications, onMarkAllRead }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'alert': return 'warning';
      case 'gift': return 'redeem';
      default: return 'info';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-[#13ec5b]';
      case 'alert': return 'text-yellow-400';
      case 'gift': return 'text-pink-500';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm h-full bg-[#102216] border-l border-white/10 shadow-2xl flex flex-col animate-slide-left">
        
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#102216]/95 backdrop-blur-xl z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#13ec5b]">notifications</span>
            Notificações
          </h2>
          <button 
            onClick={onClose}
            className="size-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/30">
              <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
              <p className="text-xs uppercase tracking-widest">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-2xl border transition-all ${notif.read ? 'bg-white/5 border-white/5 opacity-60' : 'bg-[#1c271f] border-white/10 border-l-4 border-l-[#13ec5b]'}`}
              >
                <div className="flex gap-3">
                  <div className={`mt-0.5 ${getColor(notif.type)}`}>
                    <span className="material-symbols-outlined text-xl">{getIcon(notif.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${notif.read ? 'text-white/70' : 'text-white'}`}>{notif.title}</h4>
                      <span className="text-[9px] text-white/30 font-medium">{notif.time}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-[#102216]">
          <button 
            onClick={onMarkAllRead}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Marcar todas como lidas
          </button>
        </div>

      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;
