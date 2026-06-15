'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useNotificationStore } from '@/store/notification.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const addNotification = useNotificationStore((s) => s.addNotification);

  // Keyed on uid (not the whole user object, which gets new identities on token
  // refresh / profile updates) so we don't needlessly tear down the connection.
  useEffect(() => {
    if (!user || !uid) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const socket = io(`${API_URL}/events`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', async () => {
      // Mark connected regardless of token result so consumers get the socket;
      // join:owner re-runs automatically on reconnect.
      setIsConnected(true);
      try {
        const token = await user.getIdToken();
        socket.emit('join:owner', { token });
      } catch (err) {
        console.error('[Socket] Failed to get token:', err);
      }
    });

    socket.on('new_message', (data: {
      chatbotId: string;
      chatbotName: string;
      preview: string;
      sessionId: string | null;
      isAnonymous: boolean;
      timestamp: string;
    }) => {
      addNotification({
        id: `${Date.now()}-${Math.random()}`,
        type: 'new_message',
        chatbotId: data.chatbotId,
        chatbotName: data.chatbotName,
        preview: data.preview,
        sessionId: data.sessionId,
        isAnonymous: data.isAnonymous,
        timestamp: new Date(data.timestamp),
        read: false,
      });
      toast.info(`New message on ${data.chatbotName}`, {
        description: data.preview,
        duration: 4000,
      });
    });

    socket.on('new_lead', (data: {
      chatbotName: string;
      leadName: string;
      leadEmail: string | null;
    }) => {
      addNotification({
        id: `${Date.now()}-${Math.random()}`,
        type: 'new_lead',
        chatbotId: '',
        chatbotName: data.chatbotName,
        leadName: data.leadName,
        leadEmail: data.leadEmail,
        timestamp: new Date(),
        read: false,
      });
      toast.success(`New lead: ${data.leadName}`, {
        description: data.chatbotName,
        duration: 5000,
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
