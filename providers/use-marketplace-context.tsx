import { NewOfferEvent, RequestViewedEvent } from '@/hooks/types';
import { useOffersSocket } from '@/hooks/use-offers-socket';
import { useServiceRequestsSocket } from '@/hooks/use-service-requests-socket';
import React, { createContext, useContext, type ReactNode } from 'react';

// Combine the return types of both hooks
interface MarketplaceContextType {
  offers: ReturnType<typeof useOffersSocket>;
  requests: ReturnType<typeof useServiceRequestsSocket>;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

interface MarketplaceProviderProps {
  children: ReactNode;
  // Callbacks for Offers
  onViewed?: (data: RequestViewedEvent['data']) => void;
  onOffered?: (data: NewOfferEvent['data']) => void;
  // Options for Service Requests
  artisanId?: string;
  requestsAutoConnect?: boolean;
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({
  children,
  // Options for Service Requests (defaults to true as per user request)
  artisanId,
  requestsAutoConnect = true,
  // Callbacks for Offers
  onViewed,
  onOffered,
}) => {
  // State for Offers socket
  const [activeServiceRequestId, setActiveServiceRequestId] = React.useState<string | undefined>(
    undefined
  );
  const [offersEnabled, setOffersEnabled] = React.useState(false);

  // Offers Socket (Lazy connected)
  const offersData = useOffersSocket({
    serviceRequestId: activeServiceRequestId,
    autoConnect: offersEnabled,
    onViewed,
    onOffered,
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

  const value: MarketplaceContextType = {
    offers: {
      ...offersData,
      joinServiceRequest: joinRequest, // Override/Wrap the join method
    },
    requests: requestsData,
  };

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

export const useMarketplaceContext = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
  }
  return context;
};
