import React, { useState, useEffect } from 'react';

export default function MiningCalculator() {
  const [hashrate, setHashrate] = useState(100); // in TH/s
  const [power, setPower] = useState(3000); // Output in Watts
  const [electricityCost, setElectricityCost] = useState(0.12); // $/kWh
  const [btcPrice, setBtcPrice] = useState(60000); // Default placeholder
  
  // Hardcoded estimates for simplicity (since fetching real diff is advanced without a paid API)
  // For demonstration, let's say 1 TH/s yields 0.000001 BTC per day
  const btcPerThPerDay = 0.000001; 

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then(res => res.json())
      .then(data => {
        if (data?.bitcoin?.usd) setBtcPrice(data.bitcoin.usd);
      })
      .catch(console.error);
  }, []);

  const btcPerDay = hashrate * btcPerThPerDay;
  const revenueDay = btcPerDay * btcPrice;
  const electricityDay = (power * 24) / 1000 * electricityCost;
  const profitDay = revenueDay - electricityDay;

  const profitMonth = profitDay * 30;

  return (
    <div className="w-full max-w-4xl mx-auto glass-card p-10 font-sans border-t-4 border-t-crypto-primary">
      <h2 className="text-4xl font-extrabold text-white mb-2">BTC Mining <span className="text-crypto-primary">Calculator</span></h2>
      <p className="text-crypto-muted mb-10 text-lg">Estimate your hardware profitability based on live BTC prices.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-crypto-muted mb-2 uppercase tracking-wider">Hashrate (TH/s)</label>
            <input 
              type="number" 
              value={hashrate}
              onChange={(e) => setHashrate(Number(e.target.value))}
              className="w-full bg-crypto-bg border border-crypto-border rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-crypto-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-crypto-muted mb-2 uppercase tracking-wider">Power Consumption (Watts)</label>
            <input 
              type="number" 
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              className="w-full bg-crypto-bg border border-crypto-border rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-crypto-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-crypto-muted mb-2 uppercase tracking-wider">Electricity Cost ($/kWh)</label>
            <input 
              type="number" 
              step="0.01"
              value={electricityCost}
              onChange={(e) => setElectricityCost(Number(e.target.value))}
              className="w-full bg-crypto-bg border border-crypto-border rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-crypto-primary transition-colors"
            />
          </div>
        </div>

        <div className="bg-crypto-bg/50 border border-crypto-border rounded-xl p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-crypto-primary/10 blur-[50px] -z-10 rounded-full"></div>
          
          <h3 className="text-xl font-bold text-white mb-6 border-b border-crypto-border/50 pb-4 uppercase tracking-widest">Returns Estimate</h3>
          
          <div className="space-y-5">
            <div className="flex justify-between items-center text-lg">
              <span className="text-crypto-muted">BTC/Day</span>
              <span className="font-mono text-white font-bold">{btcPerDay.toFixed(6)} ₿</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-crypto-muted">Daily Revenue</span>
              <span className="font-mono text-white">${revenueDay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-crypto-muted">Daily Power Cost</span>
              <span className="font-mono text-red-400">-${electricityDay.toFixed(2)}</span>
            </div>
            
            <div className="pt-6 mt-4">
               <div className="flex justify-between items-center bg-crypto-primary text-black px-5 py-4 rounded-xl font-extrabold mb-4 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                 <span className="uppercase tracking-wider">Daily Profit</span>
                 <span className="text-2xl font-mono">${profitDay.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center bg-crypto-card border border-crypto-border px-5 py-4 rounded-xl font-bold">
                 <span className="text-crypto-muted uppercase tracking-wider text-sm">Monthly Profit</span>
                 <span className={`text-2xl font-mono ${profitMonth > 0 ? 'text-crypto-primary' : 'text-red-400'}`}>${profitMonth.toFixed(2)}</span>
               </div>
            </div>
          </div>
          <div className="mt-8 text-xs text-center text-crypto-muted uppercase tracking-widest border-t border-crypto-border/30 pt-4">
            Live Market BTC: <span className="text-crypto-primary font-mono ml-1">${btcPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
