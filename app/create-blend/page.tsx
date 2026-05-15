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

function LabelPreview({ fragranceName, labelBg, textColor, textAlign, fontSize, size }: { fragranceName: string, labelBg: string, textColor: string, textAlign: string, fontSize: number, size: 'large' | 'small' }) {
  return (
    <div className={`relative flex flex-col items-center justify-center text-center transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden ${size === 'large' ? 'w-64 h-64 md:w-80 md:h-80 p-6 md:p-8' : 'w-28 h-28 md:w-48 md:h-48 p-4 md:p-6'}`} style={{ backgroundColor: labelBg }}>
        <span className={`${size === 'large' ? 'absolute top-8 md:top-12 text-[8px] md:text-[10px]' : 'absolute top-3 md:top-6 text-[4px] md:text-[7px]'} tracking-[4px] uppercase font-bold opacity-60`} style={{ color: textColor }}>L'Essence Noire</span>
        
        <div className={`w-full flex flex-col items-center justify-center ${size === 'large' ? 'py-10' : 'py-4 md:py-8'}`}>
        <h3 
            className="font-serif uppercase w-full px-4 whitespace-pre leading-tight" 
            style={{ 
            color: textColor, 
            textAlign: textAlign as any,
            fontSize: `calc(${fragranceName.length > 20 ? (size === 'large' ? '0.85rem' : '0.5rem') : fragranceName.length > 10 ? (size === 'large' ? '1.25rem' : '0.75rem') : (size === 'large' ? '1.75rem' : '1.0rem')} * ${fontSize})`,
            letterSpacing: fragranceName.length > 15 ? '0.05em' : '0.02em'
            }}
        >
            {fragranceName || (size === 'large' ? "Your Signature" : "")}
        </h3>
        </div>

        <div className={`${size === 'large' ? 'absolute bottom-8 md:bottom-12' : 'absolute bottom-3 md:bottom-6'} flex flex-col items-center w-full`}>
        <div className={`${size === 'large' ? 'w-12 md:w-16 h-px mb-4 md:mb-6' : 'w-4 md:w-10 h-px mb-2 md:mb-3'} opacity-30`} style={{ backgroundColor: textColor }}></div>
        <span className={`${size === 'large' ? 'text-[6px] md:text-[8px] tracking-[2px]' : 'text-[3px] md:text-[6px] tracking-[1px]'} uppercase font-light`} style={{ color: textColor }}>Eau De Parfum</span>
        </div>
    </div>
  );
}

function CreateBlendContent() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const stepParam = searchParams.get("step");
  const currentStep = stepParam ? parseInt(stepParam) : 0;
  const [selectedFormulas, setSelectedFormulas] = useState<number[]>([]);
  const [percentages, setPercentages] = useState<{ [key: number]: number }>({ 1: 45, 2: 35, 3: 20 });
  const [pivotId, setPivotId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  
  // Label Customization State
  const [fragranceName, setFragranceName] = useState("");
  const [labelBg, setLabelBg] = useState("#F2CA50");
  const [textColor, setTextColor] = useState("#000000");
  const [searchQuery, setSearchQuery] = useState("");
  const [productType, setProductType] = useState("Fragrance");
  const [textAlign, setTextAlign] = useState("center");
  const [labelFontSize, setLabelFontSize] = useState(1.0);

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
        if (data.labelFontSize) setLabelFontSize(data.labelFontSize);
        if (data.productType) setProductType(data.productType);
        if (data.textAlign) setTextAlign(data.textAlign);
        
        // If data is present, we likely want to see the result
        if (!stepParam) {
          router.replace("?step=3&data=" + dataParam);
        }
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

  const updatePercentage = (id: number, val: number) => {
    const cappedVal = Math.max(0, Math.min(100, val));
    setPercentages(prev => ({ ...prev, [id]: cappedVal }));
  };

  const handleTotalChange = (newTotal: number) => {
    if (newTotal < 0) return;
    if (newTotal === 0) {
      setPercentages(prev => {
        const next = { ...prev };
        selectedData.forEach(f => next[f.id] = 0);
        return next;
      });
      return;
    }
    
    // If current total is 0, distribute equally
    if (totalPercentage === 0) {
      const share = Math.round(newTotal / selectedData.length);
      setPercentages(prev => {
        const next = { ...prev };
        selectedData.forEach((f, i) => {
          next[f.id] = i === selectedData.length - 1 ? newTotal - (share * (selectedData.length - 1)) : share;
        });
        return next;
      });
      return;
    }

    const ratio = newTotal / totalPercentage;
    setPercentages(prev => {
      const next = { ...prev };
      selectedData.forEach(f => {
        next[f.id] = Math.round((prev[f.id] || 0) * ratio);
      });
      // Fix rounding errors
      const currentSum = selectedData.reduce((sum, f) => sum + (next[f.id] || 0), 0);
      if (currentSum !== newTotal && selectedData.length > 0) {
        const fixerId = selectedData[0].id;
        next[fixerId] = Math.max(0, (next[fixerId] || 0) + (newTotal - currentSum));
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
    router.push(`?step=${currentStep + 1}${searchParams.get("data") ? `&data=${searchParams.get("data")}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    const data = {
      formulaIds: selectedFormulas,
      percentages,
      name: fragranceName,
      labelBg,
      textColor,
      textAlign,
      labelFontSize,
      productType
    };
    const encodedData = btoa(JSON.stringify(data));
    const shareUrl = `${window.location.origin}${window.location.pathname}?step=3&data=${encodedData}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      triggerToast("Share link copied to clipboard!", "success");
    }).catch(() => {
      triggerToast("Failed to copy link.", "error");
    });
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
      productType,
      textAlign,
      labelFontSize,
      formulaIds: selectedFormulas,
      percentages,
      details: selectedData.map(f => ({
        label: f.name,
        value: `${percentages[f.id] || 0}%`
      }))
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
    router.push(`?step=${Math.max(currentStep - 1, 0)}${searchParams.get("data") ? `&data=${searchParams.get("data")}` : ""}`);
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
            <div className="flex-1 px-4 md:px-12 py-8 overflow-y-auto scrollbar-hide">
              <div className="max-w-5xl mx-auto space-y-10">
                <header className="space-y-4 text-center">
                  <div className="space-y-1">
                    <span className="text-[#F2CA50] text-[8px] font-bold tracking-[4px] uppercase opacity-50">Step 01 / 04</span>
                    <h1 className="text-white text-3xl md:text-5xl font-serif tracking-tight">Choose Your Formulas</h1>
                  </div>
                </header>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#F2CA50]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search essences..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#121414] border border-white/5 pl-14 pr-6 py-4 rounded-xl text-white placeholder:text-white/10 outline-none focus:border-[#F2CA50]/30 transition-all duration-500 text-sm font-light"
                  />
                </div>

                {/* Available Essences - COMPACT LIST */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h2 className="text-white/30 text-[10px] font-bold tracking-[3px] uppercase px-2">Available Essences</h2>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-[#F2CA50] text-[9px] font-bold tracking-[2px] uppercase opacity-60 hover:opacity-100 transition-opacity">Clear Filter</button>
                    )}
                  </div>

                  <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {FORMULAS.filter(f => !selectedFormulas.includes(f.id))
                      .filter(f => 
                        f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        f.category.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((formula) => (
                        <div 
                          key={formula.id} 
                          className="bg-[#121414]/30 border border-white/5 rounded-xl p-3 flex items-center gap-4 group hover:bg-[#121414] hover:border-[#F2CA50]/20 transition-all duration-300"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0">
                            <Image src={formula.image} alt={formula.name} fill className="object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-3">
                              <h3 className="text-white text-sm font-serif truncate">{formula.name}</h3>
                              <span className="text-[#F2CA50] text-[8px] font-bold tracking-[1px] uppercase opacity-30 truncate">{formula.category}</span>
                            </div>
                            <p className="text-white/20 text-[10px] font-light truncate">{formula.description}</p>
                          </div>

                          <button 
                            onClick={() => toggleFormula(formula.id)}
                            disabled={selectedFormulas.length >= 3}
                            className={`shrink-0 px-6 py-2 rounded-lg text-[9px] font-bold tracking-[2px] uppercase transition-all duration-300 ${selectedFormulas.length >= 3 ? "text-white/5 cursor-not-allowed" : "bg-white/5 text-[#F2CA50] border border-[#F2CA50]/10 hover:bg-[#F2CA50] hover:text-black"}`}
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Selected Essences - AT THE BOTTOM */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center px-2">
                    <div className="space-y-1">
                      <h2 className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Your Selection</h2>
                      <p className="text-white/20 text-[9px] font-light">Max 3 essences per blend</p>
                    </div>
                    <div className="text-white/40 text-[10px] font-bold tracking-[2px]">
                      <span className={selectedFormulas.length === 3 ? "text-[#F2CA50]" : ""}>{selectedFormulas.length}</span> / 3
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedFormulas.length === 0 ? (
                      <div className="md:col-span-3 py-12 border border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center space-y-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-white/20 text-xs font-light italic">Select essences from the list above to begin...</p>
                      </div>
                    ) : (
                      selectedFormulas.map((id) => {
                        const formula = FORMULAS.find(f => f.id === id)!;
                        return (
                          <div key={formula.id} className="bg-[#1A1C1C] rounded-[24px] overflow-hidden border border-[#F2CA50]/20 group transition-all duration-500 relative shadow-xl hover:translate-y-[-4px]">
                            <div className="relative aspect-[16/9] bg-black/40">
                              <Image src={formula.image} alt={formula.name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1C] to-transparent"></div>
                              
                              <button 
                                onClick={() => toggleFormula(formula.id)}
                                className="absolute top-4 right-4 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/40 hover:text-red-400 transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="p-5 space-y-1">
                              <h3 className="text-white text-sm font-serif">{formula.name}</h3>
                              <p className="text-[#F2CA50] text-[8px] font-bold tracking-[1px] uppercase opacity-40">{formula.category}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
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
                    <div className="bg-[#1A1C1C] border border-white/5 px-6 py-4 rounded-xl flex items-center gap-4 w-full md:w-auto justify-between min-w-[200px]">
                       <div className="flex flex-col gap-1">
                         <span className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase">Total Blend:</span>
                         {totalPercentage !== 100 && totalPercentage > 0 && (
                           <button 
                             onClick={() => handleTotalChange(100)}
                             className="text-[#F2CA50] text-[10px] font-bold tracking-[1px] uppercase hover:text-white transition-colors flex items-center gap-1.5 animate-pulse"
                             title="Automatically scale ingredients to reach 100%"
                           >
                             <span className="w-1 h-1 rounded-full bg-[#F2CA50]"></span>
                             Balance to 100%
                           </button>
                         )}
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1 group/total relative">
                            <input 
                              type="number"
                              value={totalPercentage}
                              onChange={(e) => handleTotalChange(parseInt(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              className={`bg-transparent text-2xl font-light w-16 text-right outline-none focus:ring-1 focus:ring-[#F2CA50]/30 rounded px-1 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:animate-none caret-[#F2CA50] ${totalPercentage === 100 ? "text-[#F2CA50]" : "text-white/40"}`}
                              inputMode="numeric"
                            />
                            <span className={`text-2xl font-light transition-colors ${totalPercentage === 100 ? "text-[#F2CA50]" : "text-white/40"}`}>%</span>
                         </div>
                         {totalPercentage === 100 && <span className="text-green-500 text-lg animate-in fade-in zoom-in duration-500">✓</span>}
                       </div>
                    </div>
                  </div>
                </header>
                <div className="space-y-6 md:space-y-8">
                  {selectedData.map((formula) => (
                    <div key={formula.id} className="bg-[#1A1C1C]/40 border border-white/5 p-6 md:p-10 rounded-2xl space-y-8 md:space-y-10 group hover:border-white/10 transition-all duration-500">
                      <div className="flex justify-between items-start md:items-baseline">
                        <div className="space-y-2"><span className="text-[#F2CA50] text-[9px] font-bold tracking-[3px] uppercase opacity-70">{formula.type}</span><h3 className="text-white text-2xl md:text-4xl font-serif">{formula.name}</h3></div>
                         <div className="flex items-center gap-1 group/val relative">
                            <input
                              type="number"
                              value={percentages[formula.id] || 0}
                              onChange={(e) => handlePercentageChange(formula.id, parseInt(e.target.value) || 0)}
                              onFocus={(e) => e.target.select()}
                              className="bg-transparent text-white/20 text-4xl md:text-6xl font-light group-hover:text-white/40 focus:text-[#F2CA50] outline-none transition-colors w-28 md:w-44 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:animate-none caret-[#F2CA50]"
                              inputMode="numeric"
                            />
                            <span className="text-white/20 text-4xl md:text-6xl font-light group-hover:text-white/40 transition-colors">%</span>
                         </div>
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
              <aside className="w-full lg:w-[450px] border-l border-white/5 p-8 md:p-12 space-y-12 bg-[#0D0E0E] flex flex-col justify-center">
                <div className="space-y-10">
                  <div className="space-y-6">
                    <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase opacity-60">Medium Selection</span>
                    <h2 className="text-white text-3xl md:text-4xl font-serif">The Alchemist's View</h2>
                    <p className="text-white/40 text-sm md:text-base font-light italic leading-relaxed tracking-wide">
                      The current blend creates a deep amber hue with high viscosity. Recommended for evening wear. The dominance of {selectedData[0]?.name} provides a robust foundation.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <label className="text-white/20 text-[9px] font-bold tracking-[3px] uppercase block">Select Your Essence Medium</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Fragrance", "Essence Oil", "Artisanal Soap", "Shower Gel"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setProductType(type)}
                          className={`px-6 py-8 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-3 group ${productType === type ? "bg-[#F2CA50] border-[#F2CA50] text-black shadow-[0_20px_40px_rgba(242,202,80,0.1)]" : "bg-white/5 border-white/10 text-white/40 hover:border-[#F2CA50]/30 hover:text-white"}`}
                        >
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${productType === type ? "border-black/20" : "border-white/10 group-hover:border-[#F2CA50]/30"}`}>
                            <span className="text-[10px] font-serif">{type[0]}</span>
                          </div>
                          <span className="text-[10px] font-bold tracking-[2px] uppercase">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-[#121414] rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#F2CA50] animate-pulse"></div>
                      <span className="text-white/60 text-[10px] font-bold tracking-[2px] uppercase">Formulation Insight</span>
                    </div>
                    <p className="text-white/30 text-xs font-light leading-relaxed italic">
                      "Choosing {productType} will optimize the concentration of top notes to ensure {productType === 'Fragrance' ? 'maximum sillage' : 'a lingering intimate scent'}. The base of Cambodian Oud will remain the soul of this creation."
                    </p>
                  </div>
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
                    <textarea 
                      placeholder="" 
                      value={fragranceName} 
                      onChange={(e) => setFragranceName(e.target.value)} 
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-xl text-white outline-none focus:border-[#F2CA50]/50 transition-all uppercase tracking-widest text-sm resize-none" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Label Background</label>
                    <div className="flex gap-4 items-center">
                      {["#F2CA50", "#1A1C1C", "#064E3B", "#7F1D1D"].map(color => (
                        <button key={color} onClick={() => setLabelBg(color)} className={`w-12 h-12 rounded-full border-2 transition-all ${labelBg === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`} style={{ backgroundColor: color }} />
                      ))}
                      <input id="bg-color-picker" type="color" ref={bgInputRef} className="sr-only" value={labelBg} onChange={(e) => setLabelBg(e.target.value)} />
                      <label htmlFor="bg-color-picker" className="px-6 py-3 border border-white/10 rounded-xl text-[10px] font-bold tracking-[2px] uppercase hover:bg-white/5 transition-colors cursor-pointer">Custom</label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Text Color</label>
                    <div className="flex gap-4 items-center">
                      {["#F2CA50", "#E5E7EB", "#000000", "#991B1B"].map(color => (
                        <button key={color} onClick={() => setTextColor(color)} className={`w-12 h-12 rounded-full border-2 transition-all ${textColor === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`} style={{ backgroundColor: color }} />
                      ))}
                      <input id="text-color-picker" type="color" ref={textInputRef} className="sr-only" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                      <label htmlFor="text-color-picker" className="px-6 py-3 border border-white/10 rounded-xl text-[10px] font-bold tracking-[2px] uppercase hover:bg-white/5 transition-colors cursor-pointer">Custom</label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Text Alignment</label>
                    <div className="flex gap-4">
                      {["left", "center", "right"].map((align) => (
                        <button
                          key={align}
                          onClick={() => setTextAlign(align)}
                          className={`flex-1 py-4 border rounded-xl text-[10px] font-bold tracking-[2px] uppercase transition-all ${textAlign === align ? "bg-[#F2CA50] border-[#F2CA50] text-black" : "bg-white/5 border-white/10 text-white/40 hover:border-[#F2CA50]/30"}`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Font Size</label>
                      <span className="text-white/40 text-[10px] font-mono">{labelFontSize.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.1" 
                      value={labelFontSize} 
                      onChange={(e) => setLabelFontSize(parseFloat(e.target.value))}
                      className="w-full accent-[#F2CA50] bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <aside className="w-full lg:w-[600px] border-l border-white/5 p-8 md:p-12 flex flex-col items-center justify-center bg-[#0D0E0E] space-y-8 md:space-y-12">
                <div className="relative w-full aspect-square bg-[#121414] rounded-[40px] flex items-center justify-center overflow-hidden shadow-2xl border border-white/5">
                   <LabelPreview fragranceName={fragranceName} labelBg={labelBg} textColor={textColor} textAlign={textAlign} fontSize={labelFontSize} size="large" />
                </div>
                <div className="text-center space-y-2">
                  <span className="text-[#F2CA50] text-[10px] font-bold tracking-[4px] uppercase">Artisanal Labeling</span>
                </div>
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
                          <div className="flex justify-between items-baseline pt-2">
                             <span className="text-white/40 text-sm font-light uppercase tracking-[2px]">Text Color</span>
                             <span className="text-[#F2CA50] text-sm font-mono">{textColor.toUpperCase()}</span>
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
                          <h2 className="text-white text-3xl md:text-5xl font-serif whitespace-pre-wrap leading-tight uppercase">"{fragranceName}"</h2>
                        </section>
                        <section className="space-y-4">
                            <label className="text-[#F2CA50] text-[10px] font-bold tracking-[3px] uppercase">Adjust Font Size</label>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="2.0" 
                                step="0.1" 
                                value={labelFontSize} 
                                onChange={(e) => setLabelFontSize(parseFloat(e.target.value))}
                                className="w-full max-w-[200px] accent-[#F2CA50] bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                            />
                        </section>

                        <section className="pt-8">
                           <button 
                             onClick={handleShare}
                             className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                           >
                             <div className="w-10 h-10 rounded-full border border-[#F2CA50]/20 flex items-center justify-center text-[#F2CA50] group-hover:scale-110 transition-transform">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                               </svg>
                             </div>
                             <div className="text-left">
                               <span className="text-white/20 text-[9px] font-bold tracking-[2px] uppercase block">Share Masterpiece</span>
                               <span className="text-white text-sm font-serif">Copy Design Link</span>
                             </div>
                           </button>
                        </section>
                     </div>
                </div>
              </div>
              <aside className="w-full lg:w-[650px] border-l border-white/5 p-8 md:p-12 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl space-y-12 md:space-y-16">
                  <div className="relative w-full aspect-square bg-[#121414] rounded-[40px] flex items-center justify-center overflow-hidden shadow-2xl border border-white/5">
                     <LabelPreview fragranceName={fragranceName} labelBg={labelBg} textColor={textColor} textAlign={textAlign} fontSize={labelFontSize} size="large" />
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
