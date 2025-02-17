import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionHook {
  onStart: () => void;
  onStop: () => void;
  isListening: boolean;
  errorMessage: string;
  result: string;
}

const BROWSER_ERR = "SpeechRecognition API is not supported in this browser.";
const DETECTION_ERR = "No speech detected.";

/**
 * Custom hook for speech recognition.
 *
 * @param {string[]} [grammarList=[]] - List of voice commands to recognize, by default it is an `[]` array
 * @param {number} [autoStopTimeout=8000] - A timeout to stop recording automatically (milliseconds), and default timeout value is `8000` milliseconds
 * @returns {SpeechRecognitionHook} - The speech recognition hook instance.
 */
export const useSpeechRecognition = (
  grammarList: string[] = [],
  autoStopTimeout: number = 8000
): SpeechRecognitionHook => {
  const recognitionRef = useRef<any>(null);
  // State
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");

  const grammar = `#JSGF V1.0; grammar commands; public <command> = ${grammarList.join(
    " | "
  )};`;
  const onStop = useCallback(() => {
    recognitionRef?.current.stop();
    setIsListening(false);
  }, []);

  const onStart = useCallback(() => {
    if (isListening) {
      onStop();
      return;
    }

    setErrorMessage("");
    setResult("");

    recognitionRef?.current.start();
    setIsListening(true);

    if (autoStopTimeout) {
      setTimeout(() => onStop(), autoStopTimeout);
    }
  }, [isListening, onStop]);

  const onResult = (event: any) => {
    const command = event.results[0][0].transcript;
    setResult(command);
    onStop();
  };

  const onError = (event: any) => {
    setErrorMessage(DETECTION_ERR);
    onStop();
  };

  useEffect(() => {
    const _window = window as any;
    const SpeechRecognition =
      _window?.SpeechRecognition || _window?.webkitSpeechRecognition;

    const SpeechGrammarList =
      _window?.SpeechGrammarList || _window?.webkitSpeechGrammarList;

    if (!SpeechRecognition) {
      console.error(BROWSER_ERR);

      setErrorMessage(BROWSER_ERR);
    }

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();

      const speechRecognitionList = new SpeechGrammarList();

      speechRecognitionList.addFromString(grammar, 1);

      recognitionRef.current.grammars = speechRecognitionList;
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onerror = (event: any) => onError(event);
      recognitionRef.current.onresult = (event: any) => onResult(event);
    }
  }, []);

  return {
    onStart,
    onStop,
    isListening,
    errorMessage,
    result
  };
};
