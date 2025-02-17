"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { MicButton } from "./components/MicButton/MicButton";
import { useSpeechRecognition } from "@afsalk/use-speech-recognition";
import { useEffect } from "react";

export default function Home() {
  const { onStart, isListening, result, errorMessage } = useSpeechRecognition();

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Speech Recognition</h1>
        <div>
          Press the below mic button and say something.
          <br />
        </div>
        <div className={styles.micHolder}>
          <MicButton isListening={isListening} onRecord={onStart} />
        </div>
        <div>
          <small>The recording will end automatically after 8 seconds</small>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://www.npmjs.com/package/@afsalk/use-speech-recognition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Stackblitz
        </a>
        <a
          href="https://www.npmjs.com/package/@afsalk/use-speech-recognition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          npm
        </a>
        <a
          href="https://github.com/makafsal/useSpeechRecognition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          GitHub
        </a>
      </footer>
    </div>
  );
}
