"use client";

import React, { useState, useEffect } from 'react';

interface ChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

const LineChart = ({ data, color = "#F2CA50", height = 200 }: ChartProps) => {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min;
  const padding = 20;
  const chartHeight = height - padding * 2;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,100 L ${points} L 100,100 Z`}
          fill="url(#gradient)"
          className="transition-all duration-1000"
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex justify-between items-end px-1 pt-4">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center group">
             <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-[#1A1D1D] border border-white/10 px-2 py-1 rounded text-[10px] text-white transition-opacity">
                {d.value}
             </div>
             <span className="text-[8px] text-white/20 uppercase tracking-widest mt-2">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, color = "#F2CA50", height = 200 }: ChartProps) => {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-between w-full gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
          <div className="relative w-full flex justify-center">
             <div 
               className="w-full max-w-[20px] rounded-t-full transition-all duration-1000 bg-gradient-to-t from-white/5 to-[#F2CA50]/40 group-hover:to-[#F2CA50]"
               style={{ height: `${(d.value / max) * (height - 40)}px` }}
             />
             <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-[#1A1D1D] border border-white/10 px-2 py-1 rounded text-[10px] text-white transition-opacity whitespace-nowrap">
                {d.value} clicks
             </div>
          </div>
          <span className="text-[8px] text-white/20 uppercase tracking-tight text-center truncate w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export function AnalyticsCharts() {
  const userGrowth = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 250 },
    { label: "Wed", value: 180 },
    { label: "Thu", value: 340 },
    { label: "Fri", value: 290 },
    { label: "Sat", value: 450 },
    { label: "Sun", value: 580 },
  ];

  const siteVisits = [
    { label: "Mon", value: 1200 },
    { label: "Tue", value: 1500 },
    { label: "Wed", value: 1100 },
    { label: "Thu", value: 1900 },
    { label: "Fri", value: 2100 },
    { label: "Sat", value: 2800 },
    { label: "Sun", value: 3200 },
  ];

  const topProducts = [
    { label: "Nocturnal Silk", value: 840 },
    { label: "Amber Solstice", value: 620 },
    { label: "Verdant Mist", value: 450 },
    { label: "Midnight Oud", value: 390 },
    { label: "Floral Dew", value: 310 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {/* Growth & Visits Chart */}
      <div className="bg-[#121414] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-10 space-y-8 md:space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="text-white text-xl md:text-2xl font-serif">Audience Trajectory</h3>
            <p className="text-white/20 text-[9px] md:text-[10px] font-bold tracking-[2px] uppercase">User growth vs Site Visits</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F2CA50]" />
                <span className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-widest">Growth</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-widest">Visits</span>
             </div>
          </div>
        </div>
        
        <div className="space-y-10 md:space-y-12">
          <div className="h-[180px] md:h-[200px]">
            <LineChart data={userGrowth} height={180} />
          </div>
          <div className="pt-6 md:pt-8 border-t border-white/5">
             <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-1 md:space-y-2">
                   <p className="text-white/20 text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase">Unique Visitors</p>
                   <h4 className="text-white text-2xl md:text-3xl font-serif">14,284</h4>
                </div>
                <div className="space-y-1 md:space-y-2 text-right">
                   <p className="text-white/20 text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase">Conversion Rate</p>
                   <h4 className="text-[#F2CA50] text-2xl md:text-3xl font-serif">4.2%</h4>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Top Products Chart */}
      <div className="bg-[#121414] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-10 space-y-8 md:space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="text-white text-xl md:text-2xl font-serif">Masterpiece Popularity</h3>
            <p className="text-white/20 text-[9px] md:text-[10px] font-bold tracking-[2px] uppercase">Top Clicked Products</p>
          </div>
          <button className="text-[#F2CA50] text-[8px] md:text-[9px] font-bold tracking-[2px] uppercase border border-[#F2CA50]/20 px-4 py-2 rounded-full hover:bg-[#F2CA50] hover:text-black transition-all">
            Full Report
          </button>
        </div>

        <div className="h-[200px] md:h-[250px] flex items-end">
           <BarChart data={topProducts} height={200} />
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 pt-6 md:pt-8 border-t border-white/5">
            {[
              { label: "Views", value: "82.4K" },
              { label: "Cart", value: "12.8K" },
              { label: "Sales", value: "2.4K" }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                 <p className="text-white/20 text-[7px] md:text-[8px] font-bold tracking-[1px] uppercase truncate">{stat.label}</p>
                 <p className="text-white text-sm md:text-lg font-serif">{stat.value}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
