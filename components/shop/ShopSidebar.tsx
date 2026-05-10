import PriceRange from "./PriceRange/PriceRange";

const FAMILIES = [
  { name: "Oud", count: "12" },
  { name: "Floral", count: "24", active: true },
  { name: "Citrus", count: "08" },
  { name: "Woody", count: "16" },
];

export default function ShopSidebar() {
  return (
    <aside className="w-full lg:w-64 space-y-12">
      {/* Olfactory Families */}
      <div className="space-y-6">
        <h3 className="text-[#F2CA50] text-xs font-bold tracking-[3px] uppercase">
          Olfactory Families
        </h3>
        <div className="space-y-4">
          {FAMILIES.map((family) => (
            <div
              key={family.name}
              className={`flex justify-between items-center cursor-pointer group transition-colors ${
                family.active ? "text-[#F2CA50]" : "text-white/60 hover:text-white"
              }`}
            >
              <span className="text-lg font-light tracking-wide">{family.name}</span>
              <span className={`text-xs ${family.active ? "text-[#F2CA50]/60" : "text-white/20"}`}>
                ({family.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Component */}
      <PriceRange />
    </aside>
  );
}
