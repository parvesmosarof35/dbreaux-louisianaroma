"use client";

import styles from "./PriceRange.module.css";

interface PriceRangeProps {
  /** When true, omits the section header and reduces spacing (for mobile drawer) */
  compact?: boolean;
  minPrice: number;
  maxPrice: number;
  minLimit: number;
  maxLimit: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceRange({
  compact = false,
  minPrice,
  maxPrice,
  minLimit,
  maxLimit,
  onChange,
}: PriceRangeProps) {
  // Safe default calculations if limits are equal or invalid
  const limitSpan = maxLimit - minLimit;
  const priceGap = Math.max(1, Math.floor(limitSpan / 20)); // 5% range gap
  const safeMaxLimit = maxLimit || 100;

  const handleMinRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (maxPrice - value >= priceGap) {
      onChange(value, maxPrice);
    }
  };

  const handleMaxRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value - minPrice >= priceGap) {
      onChange(minPrice, value);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange(value, maxPrice);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onChange(minPrice, value);
  };

  const handleBlur = () => {
    let finalMin = minPrice;
    let finalMax = maxPrice;

    if (finalMax - finalMin < priceGap) {
      if (finalMin > safeMaxLimit - priceGap) {
        finalMin = safeMaxLimit - priceGap;
        finalMax = safeMaxLimit;
      } else {
        finalMax = finalMin + priceGap;
      }
    }

    if (finalMin < minLimit) finalMin = minLimit;
    if (finalMax > safeMaxLimit) finalMax = safeMaxLimit;

    onChange(finalMin, finalMax);
  };

  // Safe percentage calculation to prevent division by zero or negative bounds
  const getPercent = (value: number) => {
    if (limitSpan <= 0) return 0;
    return Math.min(100, Math.max(0, ((value - minLimit) / limitSpan) * 100));
  };

  const minPercent = getPercent(minPrice);
  const maxPercent = getPercent(maxPrice);

  return (
    <div className={compact ? styles.wrapperCompact : styles.wrapper}>
      {/* Header — hidden in compact mode (parent renders the label) */}
      {!compact && (
        <header className="mb-6">
          <h3 className="text-[#F2CA50] text-xs font-bold tracking-[3px] uppercase mb-1">
            Price Range
          </h3>
          <p className="text-white/30 text-[10px] uppercase tracking-wider">Use slider or enter min and max price</p>
        </header>
      )}

      <div className={styles.priceInput}>
        <div className={styles.field}>
          <span>Min ($)</span>
          <input 
            type="number" 
            className={styles.inputMin} 
            value={minPrice} 
            onChange={handleMinInputChange}
            onBlur={handleBlur}
            min={minLimit}
            max={maxLimit}
          />
        </div>
        <div className={styles.separator}>-</div>
        <div className={styles.field}>
          <span>Max ($)</span>
          <input 
            type="number" 
            className={styles.inputMax} 
            value={maxPrice} 
            onChange={handleMaxInputChange}
            onBlur={handleBlur}
            min={minLimit}
            max={maxLimit}
          />
        </div>
      </div>

      <div className={styles.slider}>
        <div 
          className={styles.progress} 
          style={{ 
            left: `${minPercent}%`, 
            right: `${100 - maxPercent}%` 
          }}
        ></div>
      </div>

      <div className={styles.rangeInput}>
        <input 
          type="range" 
          className={styles.rangeMin} 
          min={minLimit}
          max={maxLimit}
          value={minPrice} 
          step="1" 
          onChange={handleMinRangeChange}
        />
        <input 
          type="range" 
          className={styles.rangeMax} 
          min={minLimit}
          max={maxLimit}
          value={maxPrice} 
          step="1" 
          onChange={handleMaxRangeChange}
        />
      </div>
    </div>
  );
}
