import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_CONFIG = {
  gymName: 'IRONFORGE FITNESS',
  city: 'Patna',
  phone: '919876543210',
  owner: 'Vikram Singh',
  address: 'Main Road, Near City Center',
  prices: {
    monthly: '999',
    quarterly: '2,499',
    halfYearly: '4,499',
    yearly: '7,999',
  },
};

export function useGymConfig() {
  const location = useLocation();

  const config = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const hasQuery =
      params.has('gym') ||
      params.has('city') ||
      params.has('phone') ||
      params.has('owner');

    let saved = {};
    try {
      const raw = sessionStorage.getItem('gym_demo_config');
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = {};
    }

    const base = hasQuery ? DEFAULT_CONFIG : { ...DEFAULT_CONFIG, ...saved };

    const merged = {
      gymName: params.get('gym')?.trim() || base.gymName,
      city: params.get('city')?.trim() || base.city,
      phone: (params.get('phone') || base.phone).replace(/[^0-9]/g, ''),
      owner: params.get('owner')?.trim() || base.owner,
      address: params.get('address')?.trim() || base.address,
      prices: {
        monthly: params.get('m1') || base.prices?.monthly || DEFAULT_CONFIG.prices.monthly,
        quarterly: params.get('m3') || base.prices?.quarterly || DEFAULT_CONFIG.prices.quarterly,
        halfYearly: params.get('m6') || base.prices?.halfYearly || DEFAULT_CONFIG.prices.halfYearly,
        yearly: params.get('m12') || base.prices?.yearly || DEFAULT_CONFIG.prices.yearly,
      },
    };

    try {
      sessionStorage.setItem('gym_demo_config', JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }

    return merged;
  }, [location.search]);

  useEffect(() => {
    document.title = `${config.gymName} | Premium Fitness Club`;
  }, [config.gymName]);

  return config;
}
