import Image from "next/image";
import BottleWithWater from "./BottleWithWater";

export default function AnatomyOfScent() {
  return (
    <section className="py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-24">
          <h2
            className="uppercase"
            style={{
              color: "#F2CA50",
              fontFamily: "var(--font-noto-serif), serif",
              fontWeight: 400,
              fontSize: "40px",
              lineHeight: "48px",
              letterSpacing: "10px",
              textAlign: "center",
              maxWidth: "800px",
              width: "100%"
            }}
          >
            The Anatomy of Scent
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
          {[
            { level: "30%", delay: "0s", label: "fragment 1" },
            { level: "50%", delay: "1.5s", label: "fragment 2" },
            { level: "80%", delay: "3s", label: "fragment 3" }
          ].map((bottle, idx) => (
            <BottleWithWater 
              key={idx}
              level={bottle.level}
              label={bottle.label}
              delay={bottle.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
