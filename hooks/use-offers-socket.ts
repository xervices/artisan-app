import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
  OffersClientToServerEvents,
  OffersServerToClientEvents,
  NewOfferEvent,
  RequestViewedEvent,
  OfferAcceptedEvent,
  CounterOfferEvent,
} from './types';
import { BASE_URL } from '@/api/client';

const SOCKET_URL = BASE_URL;
type OffersSocket = Socket<OffersServerToClientEvents, OffersClientToServerEvents>;
interface UseOffersOptions {
  serviceRequestId?: string;
  autoConnect?: boolean;
}
export const useOffersSocket = ({
  serviceRequestId,
  autoConnect = true,
}: UseOffersOptions = {}) => {
  const socketRef = useRef<OffersSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [offers, setOffers] = useState<NewOfferEvent['data'][]>([]);
  const [views, setViews] = useState<RequestViewedEvent['data'][]>([]);
  useEffect(() => {
    if (!autoConnect) return;
    const socket: OffersSocket = io(`${SOCKET_URL}/offers`, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('Connected to /offers');
      setIsConnected(true);
      if (serviceRequestId) {
        socket.emit('join_service_request', { serviceRequestId });
        console.log(`Joined Service Request room: ${serviceRequestId}`);
      }
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from /offers');
      setIsConnected(false);
    });
    socket.on('offer:new', (event) => {
      console.log('New Offer:', event);
      setOffers((prev) => [...prev, event.data]);
    });

    socket.on('request:viewed', (event) => {
      console.log('Request Viewed:', event);
      setViews((prev) => [...prev, event.data]);
    });

    socket.on('offer:counter', (event: CounterOfferEvent) => {
      console.log('Counter Offer:', event);
    });

    socket.on('offer:accepted', (event: OfferAcceptedEvent) => {
      console.log('Offer Accepted:', event);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [autoConnect, serviceRequestId]);
  const joinServiceRequest = (serviceRequestId: string) => {
    socketRef.current?.emit('join_service_request', { serviceRequestId });
  };
  return {
    socket: socketRef.current,
    isConnected,
    offers,
    views,
    joinServiceRequest,
  };
};
