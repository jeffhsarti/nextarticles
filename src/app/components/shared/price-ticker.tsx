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
  const [prices, setPrices] = useState<PriceInfo[]>([
    { name: "BTC", value: "$0", change: "0%" },
    { name: "ETH", value: "$0", change: "0%" },
    { name: "SOL", value: "$0", change: "0%" },
    { name: "BNB", value: "$0", change: "0%" },
    { name: "XRP", value: "$0", change: "0%" },
    { name: "ADA", value: "$0", change: "0%" },
    { name: "DOGE", value: "$0", change: "0%" },
    { name: "AVAX", value: "$0", change: "0%" },
    { name: "MATIC", value: "$0", change: "0%" },
    { name: "DOT", value: "$0", change: "0%" },
  ]);
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

  return (
    <div className="w-full overflow-hidden bg-black text-white border-b border-gray-800">
      <div className="flex animate-marquee whitespace-nowrap py-2">
        {prices.map((item, idx) => (
          <span key={idx} className="mr-8">
            <strong>{item.name}</strong>: {item.value}{" "}
            <span
              className={
                item.change.startsWith("+") ? "text-green-400" : "text-red-400"
              }
            >
              {item.change}
            </span>
          </span>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
