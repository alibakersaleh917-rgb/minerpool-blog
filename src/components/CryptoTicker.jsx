import React, { useEffect, useState } from 'react';

export default function CryptoTicker() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,kaspa,dogecoin,litecoin&vs_currencies=usd');
        const data = await res.json();
        
        const formattedPrices = [
          { symbol: 'BTC', price: data.bitcoin?.usd },
          { symbol: 'ETH', price: data.ethereum?.usd },
          { symbol: 'KAS', price: data.kaspa?.usd },
          { symbol: 'LTC', price: data.litecoin?.usd },
          { symbol: 'DOGE', price: data.dogecoin?.usd }
        ].filter(coin => coin.price !== undefined);

        setPrices(formattedPrices);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch crypto prices", err);
        setLoading(false);
      }
    };

    fetchPrices();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || prices.length === 0) return null;

  return (
    <div className="w-full bg-crypto-card border-b border-crypto-border overflow-hidden py-1.5 flex shadow-[0_4px_10px_rgba(0,0,0,0.5)] relative z-50">
      <div className="flex animate-[ticker_20s_linear_infinite] whitespace-nowrap min-w-full">
        {/* We duplicate the array to create a seamless infinite scroll effect easily */}
        {[...prices, ...prices, ...prices].map((coin, idx) => (
          <div key={idx} className="flex px-12 text-xs md:text-sm items-center gap-2">
            <span className="text-crypto-muted font-bold tracking-widest">{coin.symbol}</span>
            <span className="text-crypto-primary font-mono">${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
