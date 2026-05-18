import Image from "next/image";
import styles from "./BottleWithWater.module.css";

interface BottleWithWaterProps {
  level: string;
  label: string;
  delay: string;
}

export default function BottleWithWater({ level, label, delay }: BottleWithWaterProps) {
  // Convert level percentage to a vertical offset for the waves
  // Since the waves are 200% height and rotate, top: 40% means 60% fill roughly.
  // We'll calculate the top based on the level prop.
  const fillValue = parseInt(level);

  return (
    <div
      className="relative aspect-[3/4] flex flex-col items-center justify-center group animate-float"
      style={{ animationDelay: delay, animationDuration: "6s" }}
    >
      {/* Bottle Container */}
      <div className="relative w-full h-full flex items-center justify-center">

        {/* Dynamic Liquid Fill Container */}
        <div
          className="absolute bottom-[18%] w-[62%] h-[55%] overflow-hidden"
          style={{
            borderRadius: "2px 2px 4px 4px",
          }}
        >
          {/* Animated Waves using User's exact logic */}
          <div className={styles["water-round-container"]}>
            <div
              className={styles["water-wave1"]}
              style={{ top: `${100 - fillValue - 10}%` }}
            ></div>
            <div
              className={styles["water-wave2"]}
              style={{ top: `${100 - fillValue - 5}%` }}
            ></div>
            <div
              className={styles["water-wave3"]}
              style={{ top: `${100 - fillValue}%` }}
            ></div>
          </div>
        </div>

        {/* Bottle Image */}
        <Image
          src="/bottleofperfume.png"
          alt="Bottle of Perfume"
          width={350}
          height={500}
          className="relative z-10 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105"
        />

        {/* Percentage Indicator - Eye Catching */}
        <div className="absolute z-20 top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-white text-5xl font-serif tracking-tighter opacity-90 transition-all duration-700 transform scale-110 animate-fade-in-up"
            style={{
              textShadow: "0 10px 30px rgba(0,0,0,0.8)",
              animationDelay: `calc(${delay} + 0.5s)`,
              animationFillMode: "backwards"
            }}
          >
            {fillValue}%
          </span>
          <div
            className="w-10 h-px bg-[#D4AF37] mt-3 opacity-60 animate-scale-x"
            style={{
              animationDelay: `calc(${delay} + 1s)`,
              animationFillMode: "backwards"
            }}
          ></div>
        </div>

        {/* Bottom Reflection Glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#3B82F6]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>

      {/* Label */}
      <div
        className="mt-8 text-center animate-fade-in-up"
        style={{
          animationDelay: `calc(${delay} + 1.2s)`,
          animationFillMode: "backwards"
        }}
      >
        <span className="text-[#D4AF37] text-xs font-bold tracking-[4px] uppercase mb-1 block">{label}</span>
        <span className="text-white/40 text-[10px] uppercase tracking-[2px]">{level} Concentration</span>
      </div>
    </div>
  );
}
