import { useState, useRef, useEffect } from "react";
import styles from "./MultiRangeSlider.module.css";

const MultiRangeSlider = ({minValue=0, maxValue=100, step=0.1, wholeNumbers=true}) => {
  const [min, setMin] = useState(minValue);
  const [max, setMax] = useState(maxValue);
  const minRangeRef = useRef(null);
  const maxRangeRef = useRef(null);
  const sliderProgress = useRef(null);
  const minGap = step;

  const parseNumber = wholeNumbers ? parseInt : parseFloat;

  // Update progress bar when min/max changes
  useEffect(() => {
    if (sliderProgress.current && minRangeRef.current && maxRangeRef.current) {
      const minPercent = (min / parseNumber(minRangeRef.current.max)) * 100;
      const maxPercent = (max / parseNumber(maxRangeRef.current.max)) * 100;
      sliderProgress.current.style.left = `${minPercent}%`;
      sliderProgress.current.style.right = `${100 - maxPercent}%`;
    }
  }, [min, max]);

  // Handle range input (slider)
  const onSliderChange = (e) => {
    const minVal = parseNumber(minRangeRef.current.value);
    const maxVal = parseNumber(maxRangeRef.current.value);

    if (maxVal - minVal < minGap) {
      if (e.target === minRangeRef.current) {
        setMin(maxVal - minGap);
      } else {
        setMax(minVal + minGap);
      }
    } else {
      setMin(minVal);
      setMax(maxVal);
    }
  };

  // Handle number input (manual typing)
  const onNumberInput = (e, type) => {
    const value = parseNumber(e.target.value) || 0;

    if (type === "min") {
      if (max - value >= minGap && value >= minValue) {
        setMin(value);
        minRangeRef.current.value = value;
      }
    } else {
      if (value - min >= minGap && value <= maxValue) {
        setMax(value);
        maxRangeRef.current.value = value;
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* --- SLIDER --- */}
      <div className={styles.slider}>
        <div ref={sliderProgress} className={styles.progress}></div>
      </div>

      <div className={styles["range-input"]}>
        <input
          ref={minRangeRef}
          type="range"
          min={minValue}
          max={maxValue}
          value={min}
          step={step}
          onInput={onSliderChange}
          className={styles["range-min"]}
        />
        <input
          ref={maxRangeRef}
          type="range"
          min={minValue}
          max={maxValue}
          value={max}
          step={step}
          onInput={onSliderChange}
          className={styles["range-max"]}
        />
      </div>

      {/* --- PRICE INPUTS --- */}
      <div className={styles["value-input"]}>
        <div className={styles.field}>
          <input
            type="number"
            value={min}
            min={minValue}
            max={maxValue}
            step={step}
            onChange={(e) => onNumberInput(e, "min")}
            className={styles.inputMin}
          />
        </div>

        <div className={styles.field}>
          <input
            type="number"
            value={max}
            min={minValue}
            max={maxValue}
            step={step}
            onChange={(e) => onNumberInput(e, "max")}
            className={styles.inputMax}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
