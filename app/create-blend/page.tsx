"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Toast from "@/components/ui/Toast";
import { useCart } from "@/app/context/CartContext";
import { useSearchParams } from "next/navigation";

const STEPS = [
  { id: "01", name: "Select Fragrance" },
  { id: "02", name: "Composition" },
  { id: "03", name: "Label" },
  { id: "04", name: "Preview" },
];

const FORMULAS = [
  { id: 1, name: "Inspired by Cambodian Oud", category: "An Oriental Wood", type: "BASE NOTE", description: "Deep Agarwood paired with rare saffron and smoked leather notes.", image: "/FORMULAS (1).png" },
  { id: 2, name: "Inspired by Damask Rose", category: "A Floral Elixir", type: "HEART NOTE", description: "Velvety floral with honeyed undertones, harvested at dawn.", image: "/FORMULAS (2).png" },
  { id: 3, name: "Inspired by Mysore Sandalwood", category: "A Creamy Woody Blend", type: "TOP NOTE", description: "Creamy, milky wood that softens the edges and adds warmth.", image: "/FORMULAS (3).png" },
  { id: 4, name: "Inspired by Citrus Aurantium", category: "A Bright Citrus Accord", type: "TOP NOTE", description: "Calabrian bergamot infused with neroli and bitter orange zest.", image: "/product (2).png" },
  { id: 5, name: "Inspired by Midnight Jasmine", category: "A White Floral Aura", type: "HEART NOTE", description: "Night-blooming jasmine paired with white musk and vanilla accords.", image: "/product (3).png" },
  { id: 6, name: "Inspired by Amber Noir", category: "A Resinous Oriental", type: "BASE NOTE", description: "A magnetic blend of fossil amber, labdanum, and charred cedarwood.", image: "/product (5).png" }
];

function CreateBlendContent() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFormulas, setSelectedFormulas] = useState<number[]>([]);
  const [percentages, setPercentages] = useState<{ [key: number]: number }>({ 1: 45, 2: 35, 3: 20 });
  const [pivotId, setPivotId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  
  // Label Customization State
  const [fragranceName, setFragranceName] = useState("");
  const [labelBg, setLabelBg] = useState("#F2CA50");
  const [textColor, setTextColor] = useState("#000000");
  const [giftMessage, setGiftMessage] = useState("");

  // Initialize from searchParams if editing
  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const data = JSON.parse(atob(dataParam));
        if (data.formulaIds) setSelectedFormulas(data.formulaIds);
        if (data.percentages) setPercentages(data.percentages);
        if (data.name) setFragranceName(data.name);
        if (data.labelBg) setLabelBg(data.labelBg);
        if (data.textColor) setTextColor(data.textColor);
        if (data.giftMessage) setGiftMessage(data.giftMessage);
        setCurrentStep(1); // Jump to composition step
      } catch (e) {
        console.error("Failed to parse edit data", e);
      }
    }
  }, [searchParams]);

  const bgInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

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
      const stickyId = currentPivot && otherActiveIds.includes(currentPivot) && otherActiveIds.length > 1 ? currentPivot : null;
      const adjustableIds = stickyId ? otherActiveIds.filter(oid => oid !== stickyId) : otherActiveIds;
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
    if (currentStep === 2 && !fragranceName.trim()) {
       triggerToast("Please provide a name for your fragrance before proceeding.", "error");
       return;
    }
    
    if (currentStep === 3) {
      handleAddToCart();
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = () => {
    const customItem = {
      id: editId || `custom-${Date.now()}`,
      name: fragranceName || "Your Signature Scent",
      price: 450.00,
      category: "Custom Formulation",
      subCategory: "Eau De Parfum",
      image: "/bottleofperfume.png",
      isCustom: true,
      labelBg,
      textColor,
      formulaIds: selectedFormulas,
      percentages,
      details: selectedData.map(f => ({
        label: f.name,
        value: `${percentages[f.id] || 0}%`
      })),
      giftMessage
    };

    const existingCart = JSON.parse(localStorage.getItem("louisianaroma-cart") || "[]");
    
    let updatedCart;
    if (editId) {
      updatedCart = existingCart.map((item: any) => item.id === editId ? customItem : item);
    } else {
      updatedCart = [...existingCart, customItem];
    }
    
    localStorage.setItem("louisianaroma-cart", JSON.stringify(updatedCart));
    refreshCart();

    triggerToast(editId ? "Your masterpiece has been refined." : "Your masterpiece has been added to the atelier.", "success");
    setTimeout(() => {
      router.push("/cart");
    }, 1500);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white flex flex-col">
      <Navbar />
      <Toast message={toastConfig.message} isVisible={showToast} onClose={() => setShowToast(false)} type={toastConfig.type} />

      <div className="flex flex-1 pt-24 pb-32">
        {/* Left Sidebar Steps */}
        <aside className="w-80 border-r border-white/5 hidden lg:flex flex-col px-12 py-12 space-y-12">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-6 group">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-500 ${idx === currentStep ? "bg-[#F2CA50] border-[#F2CA50] text-black shadow-[0_0_20px_rgba(242,202,80,0.3)]" : "border-white/10 text-white/20"}`}>{step.id}</div>
              <span className={`text-[10px] font-bold tracking-[3px] uppercase transition-colors duration-500 ${idx === currentStep ? "text-[#F2CA50]" : "text-white/20"}`}>{step.name}</span>
            </div>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {currentStep === 0 && (
            <div className="flex-1 px-8 md:px-12 py-12 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <header className="mb-10 md:mb-16 space-y-4 text-center">
                  <h1 className="text-[#F2CA50] text-4xl md:text-6xl font-serif uppercase tracking-tight">Choose Your Formulas</h1>
                  <p className="text-white/40 text-sm md:text-lg font-light max-w-2xl mx-auto leading-relaxed px-4">Begin your olfactory journey by selecting up to three core essences. Each foundation is crafted from the rarest botanicals and aged to perfection.</p>
                  <div className="pt-4 text-white/20 text-[10px] font-bold tracking-[4px] uppercase">Selected: <span className="text-[#F2CA50]">{selectedFormulas.length} / 3</span></div>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {FORMULAS.map((formula) => (
                    <div key={formula.id} className="bg-[#121414] rounded-2xl overflow-hidden border border-white/5 group hover:border-[#F2CA50]/30 transition-all duration-500 flex flex-col">
                      {/* Product Image Section */}
                      <div className="relative aspect-square bg-black/40 overflow-hidden">
                        <Image src={formula.image} alt={formula.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121414] to-transparent opacity-60"></div>
                      </div>
                      
                      {/* Footer Section - Designed as requested */}
                      <div className="p-8 flex items-center gap-6 mt-auto">
                        <div className="flex-1 space-y-2">
                          <div className="space-y-0.5">
                            <h3 className="text-[#F2CA50] text-xl font-serif tracking-wide">{formula.name}</h3>
                            <p className="text-white/40 text-xs font-light tracking-wide">{formula.category}</p>
                          </div>
                          <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed line-clamp-2 italic tracking-wide">
                            {formula.description}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => toggleFormula(formula.id)} 
                          className={`shrink-0 px-8 py-3 rounded-full text-[10px] font-bold tracking-[2px] uppercase transition-all duration-500 ${selectedFormulas.includes(formula.id) ? "bg-[#F2CA50] text-black shadow-[0_0_20px_rgba(242,202,80,0.3)]" : "bg-white/5 text-[#F2CA50] border border-[#F2CA50]/20 hover:bg-[#F2CA50] hover:text-black"}`}
                        >
                          {selectedFormulas.includes(formula.id) ? "Added" : "Add"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 px-6 md:px-20 py-12 space-y-12 md:space-y-16 overflow-y-auto">
                <header className="space-y-6 md:space-y-4">
                  <span className="text-[#F2CA50] text-xs font-bold tracking-[4px] uppercase opacity-60">Step 02 / 04</span>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <h1 className="text-[#F2CA50] text-4xl md:text-6xl font-serif">Art of Composition</h1>
                    <div className="bg-[#1A1C1C] border border-white/5 px-6 py-4 rounded-xl flex items-center gap-4 w-full md:w-auto justify-between">
                       <span className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Total Blend:</span>
                       <div className="flex items-center gap-2">
                         <span className="text-[#F2CA50] text-2xl font-light">{totalPercentage}%</span>
                         {totalPercentage === 100 && <span className="text-green-500 text-lg">✓</span>}
                       </div>
                    </div>
                  </div>
                </header>
                <div className="space-y-6 md:space-y-8">
                  {selectedData.map((formula) => (
                    <div key={formula.id} className="bg-[#1A1C1C]/40 border border-white/5 p-6 md:p-10 rounded-2xl space-y-8 md:space-y-10 group hover:border-white/10 transition-all duration-500">
                      <div className="flex justify-between items-start md:items-baseline">
                        <div className="space-y-2"><span className="text-[#F2CA50] text-[9px] font-bold tracking-[3px] uppercase opacity-70">{formula.type}</span><h3 className="text-white text-2xl md:text-4xl font-serif">{formula.name}</h3></div>
                        <div className="text-white/20 text-4xl md:text-6xl font-light group-hover:text-white/40 transition-colors">{percentages[formula.id] || 0}%</div>
                      </div>
                      <div className="relative group/slider">
                        <input type="range" min="0" max="100" value={percentages[formula.id] || 0} onChange={(e) => handlePercentageChange(formula.id, parseInt(e.target.value))} className="w-full h-px bg-white/10 appearance-none cursor-pointer accent-[#F2CA50]" />
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-px bg-[#F2CA50]/40 pointer-events-none" style={{ width: `${percentages[formula.id] || 0}%` }}></div>
                      </div>
                      <p className="text-white/30 text-xs md:text-sm font-light leading-relaxed max-w-xl italic">"{formula.description}"</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="w-full lg:w-[450px] border-l border-white/5 p-8 md:p-12 space-y-8 md:space-y-12 bg-[#0D0E0E]">
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/40 shadow-2xl flex items-center justify-center">
                   <Image src="/bottleofperfume.png" alt="Bottle Preview" fill className="object-contain p-8 md:p-12 drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]" />
                </div>
                <div className="space-y-6">
                   <h2 className="text-white text-2xl md:text-3xl font-serif">The Alchemist's View</h2>
                   <p className="text-white/40 text-sm md:text-base font-light italic leading-relaxed tracking-wide">The current blend creates a deep amber hue with high viscosity. Recommended for evening wear. The dominance of {selectedData[0]?.name} provides a robust foundation.</p>
                </div>
              </aside>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 px-8 md:px-20 py-12 space-y-12 overflow-y-auto">
                <header className="space-y-4">
                  <h2 className="text-white text-3xl font-serif">Label Your Creation</h2>
                  <p className="text-white/40 text-lg font-light max-w-lg leading-relaxed">The final touch to your artisanal blend. Define the identity of your bespoke fragrance.</p>
                </header>
                <div className="space-y-10 max-w-xl">
                  <div className="space-y-4">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Fragrance Name</label>
                    <input type="text" placeholder="E.G. MIDNIGHT JASMINE" value={fragranceName} onChange={(e) => setFragranceName(e.target.value)} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all uppercase tracking-widest text-sm" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Label Background</label>
                    <div className="flex gap-4 items-center">
                      {["#F2CA50", "#1A1C1C", "#064E3B", "#7F1D1D"].map(color => (
                        <button key={color} onClick={() => setLabelBg(color)} className={`w-12 h-12 rounded-full border-2 transition-all ${labelBg === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`} style={{ backgroundColor: color }} />
                      ))}
                      <input type="color" ref={bgInputRef} className="hidden" value={labelBg} onChange={(e) => setLabelBg(e.target.value)} />
                      <button onClick={() => bgInputRef.current?.click()} className="px-6 py-3 border border-white/10 rounded-xl text-[10px] font-bold tracking-[2px] uppercase hover:bg-white/5 transition-colors">Custom</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Text Color</label>
                    <div className="flex gap-4 items-center">
                      {["#F2CA50", "#E5E7EB", "#000000", "#991B1B"].map(color => (
                        <button key={color} onClick={() => setTextColor(color)} className={`w-12 h-12 rounded-full border-2 transition-all ${textColor === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`} style={{ backgroundColor: color }} />
                      ))}
                      <input type="color" ref={textInputRef} className="hidden" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                      <button onClick={() => textInputRef.current?.click()} className="px-6 py-3 border border-white/10 rounded-xl text-[10px] font-bold tracking-[2px] uppercase hover:bg-white/5 transition-colors">Custom</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between"><label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Gift Message (Optional)</label><span className="text-white/20 text-[10px]">{giftMessage.length}/150</span></div>
                    <textarea placeholder="A personal note for the recipient..." rows={4} value={giftMessage} onChange={(e) => setGiftMessage(e.target.value.slice(0, 150))} className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all text-sm font-light leading-relaxed resize-none" />
                  </div>
                </div>
              </div>
              <aside className="w-full lg:w-[600px] border-l border-white/5 p-8 md:p-12 flex flex-col items-center justify-center bg-[#0D0E0E] space-y-8 md:space-y-12">
                <div className="relative w-full aspect-square bg-[#121414] rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
                   <Image src="/bottleofperfume.png" alt="Label Preview" fill className="object-contain p-4 md:p-2 opacity-50 transition-all duration-700 hover:scale-105" />
                   <div className="absolute z-10 w-32 h-32 md:w-44 md:h-44 flex flex-col items-center justify-center text-center p-4 md:p-6 transition-all duration-500 shadow-2xl border border-white/5" style={{ backgroundColor: labelBg }}>
                      <span className="text-[5px] md:text-[6px] tracking-[2px] uppercase font-bold mb-1 md:mb-2 opacity-60" style={{ color: textColor }}>L'Essence Noire</span>
                      <h3 className="text-xs md:text-sm font-serif uppercase tracking-widest break-words w-full px-2" style={{ color: textColor }}>{fragranceName || "Your Signature"}</h3>
                      <div className="w-6 md:w-8 h-px my-2 md:my-3 opacity-20" style={{ backgroundColor: textColor }}></div>
                      <span className="text-[4px] md:text-[5px] uppercase tracking-[1px] font-light" style={{ color: textColor }}>Eau De Parfum</span>
                   </div>
                </div>
                <div className="text-center space-y-2"><span className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Visual Preview</span><p className="text-white/20 text-xs italic font-light tracking-wide">Finishing: Hand-applied 24k Gold Foil</p></div>
              </aside>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[url('/hero_bg.png')] bg-cover bg-fixed">
              <div className="flex-1 px-6 md:px-20 py-12 space-y-12 overflow-y-auto bg-black/60 backdrop-blur-3xl">
                <header className="space-y-4">
                  <h1 className="text-white text-3xl md:text-5xl font-serif">Review Your Signature Scent</h1>
                  <p className="text-white/40 text-sm md:text-lg font-light max-w-2xl leading-relaxed">
                    A meticulous orchestration of {selectedData.map(f => f.name).join(" and ")}, curated for a presence that lingers in the memory.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-12">
                      <section className="space-y-6">
                        <h3 className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase">The Formulation</h3>
                        <div className="space-y-4 border-l border-white/10 pl-8">
                          {selectedData.map(formula => (
                            <div key={formula.id} className="flex justify-between items-baseline group">
                               <span className="text-white/60 font-serif text-2xl group-hover:text-white transition-colors">{formula.name}</span>
                               <span className="text-[#F2CA50] text-lg font-light">{percentages[formula.id] || 0}%</span>
                            </div>
                          ))}
                          <div className="flex justify-between items-baseline pt-4 border-t border-white/5">
                             <span className="text-white/40 text-sm font-light uppercase tracking-[2px]">Label Color</span>
                             <span className="text-[#F2CA50] text-sm font-mono">{labelBg.toUpperCase()}</span>
                          </div>
                        </div>
                      </section>

                      <section className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <span className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">Product Type</span>
                            <p className="text-white text-2xl font-serif">Perfume</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">Bottle Size</span>
                            <p className="text-white text-2xl font-serif">100ml</p>
                         </div>
                      </section>
                   </div>

                    <div className="space-y-12">
                       <section className="space-y-2">
                         <span className="text-[#F2CA50] text-[9px] font-bold tracking-[3px] uppercase">Label Name</span>
                         <h2 className="text-white text-3xl md:text-5xl font-serif">"{fragranceName}"</h2>
                       </section>

                      {giftMessage && (
                        <section className="space-y-4 italic">
                          <p className="text-white/40 text-lg font-light leading-relaxed font-serif">
                            "{giftMessage}"
                          </p>
                        </section>
                      )}
                   </div>
                </div>
              </div>
              <aside className="w-full lg:w-[650px] border-l border-white/5 p-8 md:p-12 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl space-y-12 md:space-y-16">
                  <div className="relative w-full aspect-[4/5] md:aspect-square bg-gradient-to-b from-white/5 to-transparent rounded-3xl flex items-center justify-center overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                     <Image src="/bottleofperfume.png" alt="Final Review" fill className="object-contain p-0 md:p-2 drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] transition-transform duration-1000 group-hover:scale-110 opacity-60" />
                     <div className="absolute z-10 w-28 h-28 md:w-48 md:h-48 flex flex-col items-center justify-center text-center p-4 md:p-8 shadow-2xl transition-all duration-700 group-hover:shadow-[0_0_50px_rgba(242,202,80,0.1)]" style={{ backgroundColor: labelBg }}>
                         <span className="text-[4px] md:text-[7px] tracking-[2px] uppercase font-bold mb-1 md:mb-3 opacity-60" style={{ color: textColor }}>L'Essence Noire</span>
                         <h3 className="text-[10px] md:text-lg font-serif uppercase tracking-widest break-words w-full px-2" style={{ color: textColor }}>{fragranceName}</h3>
                         <div className="w-4 md:w-10 h-px my-2 md:my-4 opacity-20" style={{ backgroundColor: textColor }}></div>
                         <span className="text-[3px] md:text-[6px] uppercase tracking-[1px] font-light" style={{ color: textColor }}>Eau De Parfum</span>
                     </div>
                  </div>
  
                 <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center gap-4 text-[#F2CA50]">
                       <div className="w-6 h-6 border-2 border-[#F2CA50] rounded-full flex items-center justify-center text-[8px] animate-pulse">3D</div>
                       <span className="text-[10px] font-bold tracking-[3px] uppercase">Interactive Preview Enabled</span>
                    </div>
                 </div>
              </aside>
            </div>
          )}
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5 py-8 z-50">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <button onClick={prevStep} className="flex items-center gap-3 text-white/40 text-[10px] font-bold tracking-[3px] uppercase hover:text-white transition-colors">← Back</button>
          
          <div className="hidden lg:flex flex-col items-center">
             <span className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase">{currentStep === 3 ? "Total Value" : "Current Estimate"}</span>
             <span className="text-[#F2CA50] text-3xl font-light">{currentStep === 3 ? "$450.00" : "€285.00"}</span>
          </div>

          <button 
            onClick={nextStep} 
            disabled={currentStep === 0 && selectedFormulas.length === 0} 
            className={`text-black text-[10px] font-bold tracking-[3px] uppercase px-12 py-5 rounded-xl transition-all duration-500 flex items-center gap-3 shadow-[0_10px_20px_rgba(242,202,80,0.15)] ${(currentStep === 0 && selectedFormulas.length === 0) ? "bg-white/5 text-white/20 cursor-not-allowed shadow-none" : "bg-[#F2CA50] hover:bg-white"}`}>
            {currentStep === 0 ? "Next Step" : currentStep === 3 ? "Add to Cart" : "Next Step"} <span className="text-sm">→</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function CreateBlendPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#F2CA50] font-serif text-xl animate-pulse">Initializing Atelier...</div>
      </div>
    }>
      <CreateBlendContent />
    </Suspense>
  );
}
