import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
  ServiceRequestsClientToServerEvents,
  ServiceRequestsServerToClientEvents,
  ServiceRequestData,
} from './types';

// Assuming base URL from environment or constant
const SOCKET_URL = 'https://server-api-bibv.onrender.com'; // Make sure this matches your server
type ServiceRequestSocket = Socket<
  ServiceRequestsServerToClientEvents,
  ServiceRequestsClientToServerEvents
>;
interface UseServiceRequestsOptions {
  artisanId?: string; // If provided, auto-registers on connect
  autoConnect?: boolean;
}
export const useServiceRequestsSocket = ({
  artisanId,
  autoConnect = true,
}: UseServiceRequestsOptions = {}) => {
  const socketRef = useRef<ServiceRequestSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [requests, setRequests] = useState<ServiceRequestData[]>([]);
  useEffect(() => {
    if (!autoConnect) return;
    // Connect to the specific namespace
    const socket: ServiceRequestSocket = io(`${SOCKET_URL}/service-requests`, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('Connected to /service-requests');
      setIsConnected(true);
      // Auto-register if artisanId is provided
      if (artisanId) {
        socket.emit('register_artisan', { artisanId }, (response) => {
          if (response.success) {
            console.log(`Registered artisan ${artisanId} for location updates`);
          }
        });
      }
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from /service-requests');
      setIsConnected(false);
    });
    socket.on('service_request:new', (event) => {
      console.log('New Service Request:', event);
      setRequests((prev) => [...prev, event.data]);
    });
    socket.on('service_request:cancelled', (event) => {
      console.log('Service Request Cancelled:', event);
      setRequests((prev) => prev.filter((req) => req.id !== event.data.serviceRequestId));
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [artisanId, autoConnect]);
  // Helper actions
  const joinCategory = (categoryId: string) => {
    socketRef.current?.emit('join_category', { categoryId });
  };
  const leaveCategory = (categoryId: string) => {
    socketRef.current?.emit('leave_category', { categoryId });
  };
  return {
    socket: socketRef.current,
    isConnected,
    requests,
    joinCategory,
    leaveCategory,
  };
};
