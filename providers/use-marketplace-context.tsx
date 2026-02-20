import { AppState, type AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  NewOfferEvent,
  RequestViewedEvent,
  OfferAcceptedEvent,
  CounterOfferEvent,
} from '@/hooks/types';
import { useOffersSocket } from '@/hooks/use-offers-socket';
import { useServiceRequestsSocket } from '@/hooks/use-service-requests-socket';
import React, { createContext, useContext, type ReactNode } from 'react';
import { api } from '@/api';

// Combine the return types of both hooks
interface MarketplaceContextType {
  offers: ReturnType<typeof useOffersSocket>;
  requests: ReturnType<typeof useServiceRequestsSocket>;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

interface MarketplaceProviderProps {
  children: ReactNode;
  // Options for Service Requests
  artisanId?: string;
  requestsAutoConnect?: boolean;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({
  children,
  // Options for Service Requests (defaults to true as per user request)
  artisanId,
  requestsAutoConnect = true,
}) => {
  // State for Offers socket
  const [activeServiceRequestId, setActiveServiceRequestId] = React.useState<string | undefined>(
    undefined
  );
  const [offersEnabled, setOffersEnabled] = React.useState(false);
  const queryClient = useQueryClient();

  // Offers Socket (Lazy connected)
  const offersData = useOffersSocket({
    serviceRequestId: activeServiceRequestId,
    autoConnect: offersEnabled,
  });

  // Service Requests Socket (Auto connected)
  const requestsData = useServiceRequestsSocket({
    artisanId,
    autoConnect: requestsAutoConnect,
  });

  // Helper to manually join a service request
  const joinRequest = React.useCallback((serviceRequestId: string) => {
    setActiveServiceRequestId(serviceRequestId);
    setOffersEnabled(true);
  }, []);

  // Listen for offer:accepted and remove the associated request
  React.useEffect(() => {
    const socket = offersData.socket;
    if (!socket || !activeServiceRequestId) return;

    const handleOfferAccepted = () => {
      // When an offer is accepted, remove the associated request
      requestsData.removeRequest(activeServiceRequestId);
    };

    socket.on('offer:accepted', handleOfferAccepted);

    return () => {
      socket.off('offer:accepted', handleOfferAccepted);
    };
  }, [offersData.socket, activeServiceRequestId, requestsData]);

  // Listen for new service request and update the list
  React.useEffect(() => {
    const socket = requestsData.socket;
    if (!socket) return;

    const handleNewServiceRequest = () => {
      // Invalidate the query to fetch new data
      queryClient.invalidateQueries({ queryKey: api.getAllServiceRequest().queryKey });
    };

    socket.on('service_request:new', handleNewServiceRequest);

    return () => {
      socket.off('service_request:new', handleNewServiceRequest);
    };
  }, [requestsData.socket, queryClient]);

  // Reconnect sockets when app comes to foreground
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const requestsSocket = requestsData.socket;
        const offersSocket = offersData.socket;

        if (requestsSocket && !requestsSocket.connected) {
          requestsSocket.connect();
        }

        if (offersSocket && !offersSocket.connected && offersEnabled) {
          offersSocket.connect();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [requestsData.socket, offersData.socket, offersEnabled]);

  const value: MarketplaceContextType = {
    offers: {
      ...offersData,
      joinServiceRequest: joinRequest, // Override/Wrap the join method
    },
    requests: requestsData,
  };

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

export interface UseMarketplaceContextOptions {
  onOfferEvent?: (
    eventType: 'offer:new' | 'request:viewed' | 'offer:accepted' | 'offer:counter',
    data: any
  ) => void;
}

export const useMarketplaceContext = (
  options?: UseMarketplaceContextOptions
): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }

  // Register offer event callback if provided
  React.useEffect(() => {
    if (!options?.onOfferEvent || !context.offers.socket) {
      return;
    }

    const socket = context.offers.socket;

    const handleOfferNew = (event: any) => {
      options.onOfferEvent?.('offer:new', event.data);
    };

    const handleRequestViewed = (event: any) => {
      options.onOfferEvent?.('request:viewed', event.data);
    };

    const handleOfferAccepted = (event: any) => {
      options.onOfferEvent?.('offer:accepted', event.data);
    };

    const handleOfferCounter = (event: any) => {
      options.onOfferEvent?.('offer:counter', event.data);
    };

    socket.on('offer:new', handleOfferNew);
    socket.on('request:viewed', handleRequestViewed);
    socket.on('offer:accepted', handleOfferAccepted);
    socket.on('offer:counter', handleOfferCounter);

    return () => {
      socket.off('offer:new', handleOfferNew);
      socket.off('request:viewed', handleRequestViewed);
      socket.off('offer:accepted', handleOfferAccepted);
      socket.off('offer:counter', handleOfferCounter);
    };
  }, [context.offers.socket, options?.onOfferEvent]);

  return context;
};
