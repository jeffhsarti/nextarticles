"use client";
import React, { useEffect, useRef, useState } from "react";

const symbols = [
  { name: "BTC", stream: "btcusdt" },
  { name: "ETH", stream: "ethusdt" },
  { name: "SOL", stream: "solusdt" },
  { name: "BNB", stream: "bnbusdt" },
  { name: "XRP", stream: "xrpusdt" },
  { name: "ADA", stream: "adausdt" },
  { name: "DOGE", stream: "dogeusdt" },
  { name: "AVAX", stream: "avaxusdt" },
  { name: "MATIC", stream: "maticusdt" },
  { name: "DOT", stream: "dotusdt" },
];

type PriceInfo = {
  name: string;
  value: string;
  change: string;
};

export default function PriceTicker() {
  const [prices, setPrices] = useState<PriceInfo[]>(
    symbols.map((s) => ({
      name: s.name,
      value: "$0",
      change: "0%",
    }))
  );
  const [paused, setPaused] = useState(false);
  const prevPrices = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    // Build the combined stream URL
    const streams = symbols.map((s) => `${s.stream}@trade`).join("/");
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const stream = data.stream;
      const trade = data.data;
      const symbol = symbols.find((s) => stream.startsWith(s.stream));
      if (!symbol) return;

      const price = parseFloat(trade.p);
      const prev = prevPrices.current[symbol.name] ?? price;
      const change = ((price - prev) / prev) * 100;

      prevPrices.current[symbol.name] = price;

      setPrices((old) =>
        old.map((item) =>
          item.name === symbol.name
            ? {
                ...item,
                value: `$${price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
              }
            : item
        )
      );
    };

    return () => ws.close();
  }, []);

  // Duplicate the ticker row for seamless looping
  const tickerItems = [...prices, ...prices];
  const itemWidthRem = 12; // w-48 = 12rem
  const totalWidthRem = tickerItems.length * itemWidthRem;

  return (
    <div className="w-full overflow-hidden bg-black text-white border-b border-gray-800">
      <div
        className={`flex gap-4 py-2 whitespace-nowrap animate-marquee ${
          paused ? "animate-marquee-paused" : ""
        }`}
        style={{
          width: `${totalWidthRem}rem`,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {tickerItems.map((item, idx) => (
          <div
            key={idx}
            className="w-48 min-w-48 max-w-48 text-center shrink-0"
          >
            <strong>{item.name}</strong>: {item.value}{" "}
            <span
              className={
                item.change.startsWith("+") ? "text-green-400" : "text-red-400"
              }
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-paused {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
