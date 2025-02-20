import { useCallback, useEffect, useRef, useState } from "react";

export interface SpeechRecognitionHook {
  onStart: () => void;
  onStop: () => void;
  isListening: boolean;
  errorMessage: string;
  result: string;
}

export interface SpeechRecognitionOptions extends Partial<EventTarget> {
  // Properties
  grammars?: string[]; // A list of grammar strings for recognition
  lang?: string; // Language for recognition (e.g., 'en-US', 'fr-FR')
  continuous?: boolean; // Whether to return continuous results or just one
  interimResults?: boolean; // Whether to return interim results
  maxAlternatives?: number; // Maximum number of alternative transcripts to return
  serviceURI?: string; // URL of the speech recognition service (optional)
  autoStopTimeout?: number; // A timeout to stop recording automatically (milliseconds), and default timeout value is `8000` milliseconds

  // Event Handlers
  // onstart?: (event: Event) => void; // Fired when recognition starts
  // onend?: (event: Event) => void; // Fired when recognition ends
  // onerror?: (event: any) => void; // Fired on error
  // onresult?: (event: any) => void; // Fired when a result is received
  // onsoundstart?: (event: Event) => void; // Fired when sound is detected
  // onsoundend?: (event: Event) => void; // Fired when sound stops
  // onspeechstart?: (event: Event) => void; // Fired when speech is detected
  // onspeechend?: (event: Event) => void; // Fired when speech stops
  // onnomatch?: (event: any) => void; // Fired when no match is found
  // onaudiostart?: (event: Event) => void; // Fired when audio capture starts
  // onaudioend?: (event: Event) => void; // Fired when audio capture ends

  // Methods
  // start(): void; // Starts speech recognition
  // stop(): void; // Stops speech recognition
  // abort(): void; // Aborts speech recognition
}

const BROWSER_ERR = "SpeechRecognition API is not supported in this browser.";
const DETECTION_ERR = "No speech detected.";

/**
 * Custom hook for speech recognition.
 *
 * @param {SpeechRecognitionOptions} [options]
 * @returns {SpeechRecognitionHook} The speech recognition hook instance.
 */
export const useSpeechRecognition = (
  options?: SpeechRecognitionOptions
): SpeechRecognitionHook => {
  const recognitionRef = useRef<any>(null);
  // State
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");

  const grammar = `#JSGF V1.0; grammar commands; public <command> = ${options?.grammars?.join(
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

    if (options?.autoStopTimeout) {
      setTimeout(() => onStop(), options?.autoStopTimeout);
    }
  }, [isListening, onStop, options?.autoStopTimeout]);

  const onResult = useCallback(
    (event: any) => {
      const command = event.results[0][0].transcript;
      setResult(command);

      if (event.results[0].isFinal) {
        onStop();
      }
    },
    [onStop]
  );

  const onError = useCallback(
    (event: any) => {
      setErrorMessage(DETECTION_ERR);
      onStop();
    },
    [onStop]
  );

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
      recognitionRef.current.continuous = options?.continuous;
      recognitionRef.current.lang = options?.lang;
      recognitionRef.current.interimResults = options?.interimResults;
      recognitionRef.current.maxAlternatives = options?.maxAlternatives;

      recognitionRef.current.onerror = (event: any) => onError(event);
      recognitionRef.current.onresult = (event: any) => onResult(event);
    }
  }, [
    grammar,
    onError,
    onResult,
    options?.continuous,
    options?.interimResults,
    options?.lang,
    options?.maxAlternatives
  ]);

  return {
    onStart,
    onStop,
    isListening,
    errorMessage,
    result
  };
};
