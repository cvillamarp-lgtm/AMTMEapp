'use client';

import { X, Bell, Clock, CheckCircle, Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useNotifications, type NotificationTab } from '@/hooks/use-notifications';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const TABS: { id: NotificationTab; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'deadlines', label: 'Deadlines' },
  { id: 'approvals', label: 'Aprobaciones' },
];

export function NotificationsDrawer({ open, onClose }: NotificationsDrawerProps) {
  const { activeTab, setActiveTab, unreadCount, markAllRead, markRead, filteredNotifications } =
    useNotifications();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-[380px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eee8da] px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell size={18} weight="fill" className="text-[#001F36]" />
            <span className="font-semibold text-[#001F36]">Notificaciones</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#E8FF40] px-2 py-0.5 text-xs font-bold text-[#001F36]">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9a9384] hover:bg-[#f6f3ec] hover:text-[#001F36] transition-colors"
            aria-label="Cerrar notificaciones"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-[#eee8da]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-3 text-xs font-semibold transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-[#001F36] text-[#001F36]'
                  : 'text-[#9a9384] hover:text-[#001F36]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#9a9384]">
              <Bell size={32} className="mb-3 opacity-30" />
              <p className="text-sm">Sin notificaciones</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    'group relative cursor-pointer rounded-xl border p-4 transition-all',
                    n.read ? 'border-[#eee8da] bg-white' : 'border-[#9DC4D5]/40 bg-[#9DC4D5]/5'
                  )}
                >
                  {!n.read && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#E8FF40]" />
                  )}
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 rounded-lg p-1.5',
                        n.type === 'deadline'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      )}
                    >
                      {n.type === 'deadline' ? <Clock size={14} /> : <CheckCircle size={14} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#001F36]">{n.title}</p>
                      <p className="mt-0.5 text-xs text-[#9a9384]">{n.desc}</p>
                      <p className="mt-1 text-[10px] text-[#9a9384]/70">{n.timeAgo}</p>
                    </div>
                  </div>
                  {n.type === 'approval' && !n.read && (
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-lg bg-[#001F36] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#003D5C] transition-colors">
                        Aprobar
                      </button>
                      <button className="rounded-lg border border-[#eee8da] px-3 py-1.5 text-xs font-medium text-[#001F36] hover:bg-[#f6f3ec] transition-colors">
                        Revisar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="border-t border-[#eee8da] p-4">
            <button
              onClick={markAllRead}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#eee8da] py-2.5 text-sm text-[#9a9384] transition-colors hover:bg-[#f6f3ec] hover:text-[#001F36]"
            >
              <Check size={14} />
              Marcar todas como leídas
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
