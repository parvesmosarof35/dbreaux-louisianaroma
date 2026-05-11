"use client";

import Image from "next/image";
import Link from "next/link";

const MY_ORDERS = [
  { id: "LN-8821", name: "Nocturnal Silk", date: "Oct 24, 2024", status: "Bottling", price: 1690.00, image: "/product (1).png" },
  { id: "LN-8750", name: "Amber Solstice", date: "Sep 12, 2024", status: "Delivered", price: 850.00, image: "/product (4).png" },
];

export default function MyOrdersPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
         <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Transaction History</span>
         <h1 className="text-white text-3xl md:text-5xl font-serif">My Orders</h1>
         <p className="text-white/40 text-sm md:text-lg font-light leading-relaxed max-w-lg italic">
           Revisit your archived collection and track the movement of your recent acquisitions.
         </p>
      </header>

      <div className="space-y-6">
        {MY_ORDERS.map((order) => (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10 group hover:border-[#F2CA50]/30 transition-all duration-500">
            <div className="relative w-full sm:w-32 aspect-square bg-black/40 rounded-2xl overflow-hidden shrink-0 border border-white/5">
              <Image src={order.image} alt={order.name} fill className="object-contain p-4 opacity-60 group-hover:scale-110 transition-transform duration-1000" />
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row justify-between gap-8 py-2 w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Order {order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-bold tracking-[1px] uppercase ${order.status === "Delivered" ? "bg-green-500/10 text-green-500" : "bg-[#F2CA50]/10 text-[#F2CA50]"}`}>
                    {order.status}
                  </span>
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-serif">{order.name}</h3>
                <p className="text-white/40 text-xs font-light tracking-wide italic">{order.date}</p>
              </div>

              <div className="flex flex-col items-start md:items-end justify-between py-2 gap-4">
                <div className="text-white text-xl md:text-2xl font-light">${order.price.toFixed(2)}</div>
                <Link href={`/order-details/${order.id}`} className="text-[#F2CA50] text-[9px] font-bold tracking-[3px] uppercase hover:text-white transition-all border-b border-[#F2CA50]/20 pb-1">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
