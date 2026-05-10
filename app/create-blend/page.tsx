"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Toast from "@/components/ui/Toast";

const STEPS = [
  { id: "01", name: "Select Fragrance" },
  { id: "02", name: "Composition" },
  { id: "03", name: "Product" },
  { id: "04", name: "Label" },
  { id: "05", name: "Preview" },
];

const FORMULAS = [
  { id: 1, name: "Cambodian Oud", category: "Base Note", type: "BASE NOTE", description: "Deep, resinous, and animalic. Provides the structural foundation of your bespoke elixir.", image: "/FORMULAS (1).png" },
  { id: 2, name: "Damask Rose", category: "Heart Note", type: "HEART NOTE", description: "Velvety floral with honeyed undertones, harvested at dawn for maximum potency.", image: "/FORMULAS (2).png" },
  { id: 3, name: "Mysore Sandalwood", category: "Top Note", type: "TOP NOTE", description: "Creamy, milky wood that softens the edges and adds a lingering warmth to the trail.", image: "/FORMULAS (3).png" },
  { id: 4, name: "Citrus Aurantium", category: "Top Note", type: "TOP NOTE", description: "Calabrian bergamot infused with neroli and bitter orange zest.", image: "/product (2).png" },
  { id: 5, name: "Midnight Jasmine", category: "Heart Note", type: "HEART NOTE", description: "Night-blooming jasmine paired with white musk and vanilla accords.", image: "/product (3).png" },
  { id: 6, name: "Amber Noir", category: "Base Note", type: "BASE NOTE", description: "A magnetic blend of fossil amber, labdanum, and charred cedarwood.", image: "/product (5).png" }
];

export default function CreateBlendPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFormulas, setSelectedFormulas] = useState<number[]>([]);
  const [percentages, setPercentages] = useState<{ [key: number]: number }>({ 1: 45, 2: 35, 3: 20 });
  const [pivotId, setPivotId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({ message: "", type: "info" as "error" | "success" | "info" });

  const triggerToast = (message: string, type: "error" | "success" | "info" = "info") => {
    setToastConfig({ message, type });
    setShowToast(true);
  };

  const toggleFormula = (id: number) => {
    setSelectedFormulas(prev => {
      if (prev.includes(id)) return prev.filter(f => f !== id);
      if (prev.length >= 3) {
        triggerToast("Maximum of 3 formulas can be selected for a single blend.", "error");
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedData = useMemo(() => {
    return selectedFormulas.length > 0 
      ? selectedFormulas.map(id => FORMULAS.find(f => f.id === id)!)
      : FORMULAS.slice(0, 3);
  }, [selectedFormulas]);

  const totalPercentage = useMemo(() => {
    return selectedData.reduce((sum, f) => sum + (percentages[f.id] || 0), 0);
  }, [selectedData, percentages]);

  const handlePercentageChange = (id: number, val: number) => {
    // Determine the pivot (sticky) ID
    let currentPivot = pivotId;
    if (activeId !== id) {
      currentPivot = activeId;
      setPivotId(activeId);
      setActiveId(id);
    }

    setPercentages(prev => {
      const activeIds = selectedData.map(f => f.id);
      const otherActiveIds = activeIds.filter(oid => oid !== id);
      if (otherActiveIds.length === 0) return { ...prev, [id]: val };

      // Sticky logic: keep currentPivot fixed if possible
      const stickyId = currentPivot && otherActiveIds.includes(currentPivot) && otherActiveIds.length > 1
        ? currentPivot
        : null;

      const adjustableIds = stickyId 
        ? otherActiveIds.filter(oid => oid !== stickyId)
        : otherActiveIds;

      const next = { ...prev };
      const stickyVal = stickyId ? (prev[stickyId] || 0) : 0;
      const maxPossibleVal = 100 - stickyVal;
      
      const cappedVal = Math.min(val, maxPossibleVal);
      next[id] = cappedVal;

      const remainingTotal = 100 - cappedVal - stickyVal;
      const currentAdjustableSum = adjustableIds.reduce((sum, aid) => sum + (prev[aid] || 0), 0);

      if (currentAdjustableSum > 0) {
        adjustableIds.forEach(aid => {
          next[aid] = Math.max(0, Math.round(((prev[aid] || 0) / currentAdjustableSum) * remainingTotal));
        });
      } else {
        adjustableIds.forEach(aid => {
          next[aid] = Math.round(remainingTotal / adjustableIds.length);
        });
      }

      let activeTotal = activeIds.reduce((sum, aid) => sum + (next[aid] || 0), 0);
      if (activeTotal !== 100) {
        const fixerId = adjustableIds[0] || otherActiveIds[0];
        next[fixerId] = Math.max(0, (next[fixerId] || 0) + (100 - activeTotal));
      }

      return next;
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && totalPercentage !== 100) {
      triggerToast(`Your total blend is currently ${totalPercentage}%. It must be exactly 100% to proceed.`, "error");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col">
      <Navbar />
      <Toast message={toastConfig.message} isVisible={showToast} onClose={() => setShowToast(false)} type={toastConfig.type} />

      <div className="flex flex-1 pt-24 pb-32">
        <aside className="w-80 border-r border-white/5 hidden lg:flex flex-col px-12 py-12 space-y-12">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-6 group">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-500 ${idx === currentStep ? "bg-[#F2CA50] border-[#F2CA50] text-black shadow-[0_0_20px_rgba(242,202,80,0.3)]" : "border-white/10 text-white/20"}`}>{step.id}</div>
              <span className={`text-[10px] font-bold tracking-[3px] uppercase transition-colors duration-500 ${idx === currentStep ? "text-[#F2CA50]" : "text-white/20"}`}>{step.name}</span>
            </div>
          ))}
        </aside>

        <main className="flex-1 flex flex-col lg:flex-row">
          {currentStep === 0 && (
            <div className="flex-1 px-8 md:px-12 py-12">
              <div className="max-w-7xl">
                <header className="mb-16 space-y-4">
                  <div className="flex justify-between items-end">
                    <h1 className="text-[#F2CA50] text-6xl font-serif">Choose Your Formulas</h1>
                    <div className="text-white/40 text-[10px] font-bold tracking-[3px] uppercase pb-2">Selected: <span className="text-[#F2CA50]">{selectedFormulas.length} / 3</span></div>
                  </div>
                  <p className="text-white/40 text-lg font-light max-w-2xl leading-relaxed">Begin your olfactory journey by selecting up to three core essences. Each foundation is crafted from the rarest botanicals and aged to perfection.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {FORMULAS.map((formula) => (
                    <div key={formula.id} className="bg-[#1A1C1C] rounded-2xl p-6 border border-white/5 group hover:border-[#F2CA50]/30 transition-all duration-500 flex flex-col">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 mb-6"><Image src={formula.image} alt={formula.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                      <div className="space-y-3 flex-1">
                        <div className="space-y-1"><h3 className="text-[#F2CA50] text-lg font-serif">{formula.name}</h3><p className="text-white/20 text-[8px] font-bold tracking-[2px] uppercase">{formula.type}</p></div>
                        <p className="text-white/40 text-xs font-light leading-relaxed line-clamp-2">{formula.description}</p>
                      </div>
                      <button onClick={() => toggleFormula(formula.id)} className={`mt-6 w-full py-3.5 rounded-lg text-[9px] font-bold tracking-[2px] uppercase transition-all duration-300 ${selectedFormulas.includes(formula.id) ? "bg-[#F2CA50] text-black" : "bg-[#F2CA50]/10 text-[#F2CA50] hover:bg-[#F2CA50] hover:text-black"}`}>{selectedFormulas.includes(formula.id) ? "Selected" : "Add"}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex-1 flex flex-col lg:flex-row">
              <div className="flex-1 px-8 md:px-20 py-12 space-y-16">
                <header className="space-y-4">
                  <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-60">Step 02 / 05</span>
                  <div className="flex justify-between items-center">
                    <h1 className="text-[#F2CA50] text-6xl font-serif">Art of Composition</h1>
                    <div className="bg-[#1A1C1C] border border-white/5 px-6 py-4 rounded-xl flex items-center gap-4">
                       <span className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Total Blend:</span>
                       <span className="text-[#F2CA50] text-2xl font-light">{totalPercentage}%</span>
                       {totalPercentage === 100 && <span className="text-green-500 text-lg">✓</span>}
                    </div>
                  </div>
                </header>
                <div className="space-y-8">
                  {selectedData.map((formula) => (
                    <div key={formula.id} className="bg-[#1A1C1C]/40 border border-white/5 p-10 rounded-2xl space-y-10 group hover:border-white/10 transition-all duration-500">
                      <div className="flex justify-between items-baseline">
                        <div className="space-y-2"><span className="text-[#F2CA50] text-[9px] font-bold tracking-[3px] uppercase opacity-70">{formula.type}</span><h3 className="text-white text-4xl font-serif">{formula.name}</h3></div>
                        <div className="text-white/20 text-6xl font-light group-hover:text-white/40 transition-colors">{percentages[formula.id] || 0}%</div>
                      </div>
                      <div className="relative group/slider">
                        <input type="range" min="0" max="100" value={percentages[formula.id] || 0} onChange={(e) => handlePercentageChange(formula.id, parseInt(e.target.value))} className="w-full h-px bg-white/10 appearance-none cursor-pointer accent-[#F2CA50]" />
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-px bg-[#F2CA50]/40 pointer-events-none" style={{ width: `${percentages[formula.id] || 0}%` }}></div>
                      </div>
                      <p className="text-white/30 text-sm font-light leading-relaxed max-w-xl italic">"{formula.description}"</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="w-full lg:w-[450px] border-l border-white/5 p-12 space-y-12 bg-[#0D0E0E]">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/40 shadow-2xl"><Image src="/bottleofperfume.png" alt="Bottle Preview" fill className="object-contain p-12 drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]" /></div>
                <div className="space-y-6"><h2 className="text-white text-3xl font-serif">The Alchemist's View</h2><p className="text-white/40 text-base font-light italic leading-relaxed tracking-wide">The current blend creates a deep amber hue with high viscosity. Recommended for evening wear. The dominance of {selectedData[0]?.name} provides a robust foundation.</p></div>
              </aside>
            </div>
          )}
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5 py-8 z-50">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <button onClick={prevStep} className="flex items-center gap-3 text-white/40 text-[10px] font-bold tracking-[3px] uppercase hover:text-white transition-colors">← Back</button>
          {currentStep === 1 && (<div className="hidden md:flex flex-col items-center"><span className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">Current Estimate</span><span className="text-[#F2CA50] text-3xl font-light">€285.00</span></div>)}
          <button onClick={nextStep} disabled={currentStep === 0 && selectedFormulas.length === 0} className={`text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-5 rounded-xl transition-all duration-500 flex items-center gap-3 shadow-[0_10px_20px_rgba(242,202,80,0.15)] ${(currentStep === 0 && selectedFormulas.length === 0) ? "bg-white/5 text-white/20 cursor-not-allowed shadow-none" : "bg-[#F2CA50] hover:bg-white"}`}>{currentStep === 0 ? "Next Step" : "Next: Select Product"} <span className="text-sm">→</span></button>
        </div>
      </footer>
    </div>
  );
}
