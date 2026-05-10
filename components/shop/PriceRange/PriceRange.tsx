"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./PriceRange.module.css";

export default function PriceRange() {
  const [minPrice, setMinPrice] = useState(2500);
  const [maxPrice, setMaxPrice] = useState(7500);
  const priceGap = 1000;
  const maxLimit = 10000;

  const handleMinRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (maxPrice - value >= priceGap) {
      setMinPrice(value);
    }
  };

  const handleMaxRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value - minPrice >= priceGap) {
      setMaxPrice(value);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMinPrice(value);
    // Logic to sync range slider if valid
    if (maxPrice - value >= priceGap && value >= 0) {
      // Valid state
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMaxPrice(value);
    // Logic to sync range slider if valid
    if (value - minPrice >= priceGap && value <= maxLimit) {
      // Valid state
    }
  };

  // Sync logic when inputs are changed to ensure gap is maintained
  const handleBlur = () => {
    let finalMin = minPrice;
    let finalMax = maxPrice;

    if (finalMax - finalMin < priceGap) {
      if (finalMin > maxLimit - priceGap) {
        finalMin = maxLimit - priceGap;
        finalMax = maxLimit;
      } else {
        finalMax = finalMin + priceGap;
      }
    }

    if (finalMin < 0) finalMin = 0;
    if (finalMax > maxLimit) finalMax = maxLimit;

    setMinPrice(finalMin);
    setMaxPrice(finalMax);
  };

  return (
    <div className={styles.wrapper}>
      <header className="mb-6">
        <h3 className="text-[#F2CA50] text-xs font-bold tracking-[3px] uppercase mb-1">
          Price Range
        </h3>
        <p className="text-white/30 text-[10px] uppercase tracking-wider">Use slider or enter min and max price</p>
      </header>

      <div className={styles.priceInput}>
        <div className={styles.field}>
          <span>Min</span>
          <input 
            type="number" 
            className={styles.inputMin} 
            value={minPrice} 
            onChange={handleMinInputChange}
            onBlur={handleBlur}
          />
        </div>
        <div className={styles.separator}>-</div>
        <div className={styles.field}>
          <span>Max</span>
          <input 
            type="number" 
            className={styles.inputMax} 
            value={maxPrice} 
            onChange={handleMaxInputChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className={styles.slider}>
        <div 
          className={styles.progress} 
          style={{ 
            left: `${(minPrice / maxLimit) * 100}%`, 
            right: `${100 - (maxPrice / maxLimit) * 100}%` 
          }}
        ></div>
      </div>

      <div className={styles.rangeInput}>
        <input 
          type="range" 
          className={styles.rangeMin} 
          min="0" 
          max={maxLimit} 
          value={minPrice} 
          step="100" 
          onChange={handleMinRangeChange}
        />
        <input 
          type="range" 
          className={styles.rangeMax} 
          min="0" 
          max={maxLimit} 
          value={maxPrice} 
          step="100" 
          onChange={handleMaxRangeChange}
        />
      </div>
    </div>
  );
}
