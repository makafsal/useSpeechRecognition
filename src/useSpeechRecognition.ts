import { useCallback, useEffect, useRef, useState } from "react";

export interface SpeechRecognitionHook {
  start?: () => void;
  stop?: () => void;
  abort?: () => void;
  isListening?: boolean;
  errorMessage?: string;
  result?: string;
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
  onstart?: (event: Event) => void; // Fired when recognition starts
  onend?: (event: Event) => void; // Fired when recognition ends
  onerror?: (event: any) => void; // Fired on error
  onresult?: (event: any) => void; // Fired when a result is received
  onsoundstart?: (event: Event) => void; // Fired when sound is detected
  onsoundend?: (event: Event) => void; // Fired when sound stops
  onspeechstart?: (event: Event) => void; // Fired when speech is detected
  onspeechend?: (event: Event) => void; // Fired when speech stops
  onnomatch?: (event: any) => void; // Fired when no match is found
  onaudiostart?: (event: Event) => void; // Fired when audio capture starts
  onaudioend?: (event: Event) => void; // Fired when audio capture ends
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

  const stop = useCallback(() => {
    recognitionRef?.current.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    if (isListening) {
      stop();
      return;
    }

    setErrorMessage("");
    setResult("");

    recognitionRef?.current.start();
    setIsListening(true);

    if (options?.autoStopTimeout) {
      setTimeout(() => stop(), options?.autoStopTimeout);
    }
  }, [isListening, stop, options?.autoStopTimeout]);

  const abort = () => {
    recognitionRef?.current?.abort();
  };

  const onResult = useCallback(
    (event: any) => {
      const _results = [...event.results];
      const _transcripts: SpeechRecognitionAlternative[] =
        _results?.[_results?.length - 1];
      const _transcript = _transcripts?.[_transcripts?.length - 1]?.transcript;
      setResult(_transcript);

      if (event.results[0].isFinal) {
        stop();
      }

      options?.onresult?.(event);
    },
    [stop]
  );

  const onError = useCallback(
    (event: any) => {
      setErrorMessage(DETECTION_ERR);
      stop();

      options?.onerror?.(event);
    },
    [stop]
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

      recognitionRef.current.onstart = (event: Event) =>
        options?.onstart?.(event);
      recognitionRef.current.onend = (event: Event) => options?.onend?.(event);
      recognitionRef.current.onerror = (event: any) => onError(event);
      recognitionRef.current.onresult = (event: any) => onResult(event);
      recognitionRef.current.onsoundstart = (event: Event) =>
        options?.onsoundstart?.(event);
      recognitionRef.current.onsoundend = (event: Event) =>
        options?.onsoundend?.(event);
      recognitionRef.current.onspeechstart = (event: Event) =>
        options?.onspeechstart?.(event);
      recognitionRef.current.onspeechend = (event: Event) =>
        options?.onspeechend?.(event);
      recognitionRef.current.onnomatch = (event: Event) =>
        options?.onnomatch?.(event);
      recognitionRef.current.onaudiostart = (event: Event) =>
        options?.onaudiostart?.(event);
      recognitionRef.current.onaudioend = (event: Event) =>
        options?.onaudioend?.(event);
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
    start,
    stop,
    abort,
    isListening,
    errorMessage,
    result
  };
};
