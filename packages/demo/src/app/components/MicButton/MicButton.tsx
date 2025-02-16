import { RefObject } from "react";
import styles from "./MicButton.module.css";

interface MicButtonProps {
  isListening?: boolean;
  onRecord?: () => void;
  ref?: RefObject<HTMLButtonElement>;
}

export const MicButton = ({ isListening, onRecord, ref }: MicButtonProps) => {
  console.log(isListening)
  return (
    <button
      ref={ref}
      className={`${styles.micButton} ${isListening && styles.animate}`}
      onClick={onRecord}
    >
      <svg
        width="90"
        height="90"
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="40"
          cy="40"
          r="38.5"
          fill="#2D6A4F"
          stroke="#52B788"
          strokeWidth="3"
        />
        <g className={`${styles.micIcon} ${isListening && styles.animate}`}>
          <path
            d="M40 29C39.2044 29 38.4413 29.3161 37.8787 29.8787C37.3161 30.4413 37 31.2044 37 32V40C37 40.7956 37.3161 41.5587 37.8787 42.1213C38.4413 42.6839 39.2044 43 40 43C40.7956 43 41.5587 42.6839 42.1213 42.1213C42.6839 41.5587 43 40.7956 43 40V32C43 31.2044 42.6839 30.4413 42.1213 29.8787C41.5587 29.3161 40.7956 29 40 29Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M47 38V40C47 41.8565 46.2625 43.637 44.9497 44.9497C43.637 46.2625 41.8565 47 40 47C38.1435 47 36.363 46.2625 35.0503 44.9497C33.7375 43.637 33 41.8565 33 40V38"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M40 47V51"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 51H44"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </button>
  );
};
