import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionHook {
  onStart: () => void;
  onStop: () => void;
  isListening: boolean;
  errorMessage: string;
  result: string;
}

const ERR = "SpeechRecognition API is not supported in this browser.";

export const useSpeechRecognition = (commands = []): SpeechRecognitionHook => {
  const recognitionRef = useRef<any>(null);
  // State
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");

  const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(
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

    setTimeout(() => onStop(), 8000);
  }, [isListening, onStop]);

  const onResult = (event: any) => {
    const command = event.results[0][0].transcript;
    setResult(command);
    onStop();
  };

  const onError = (event: any) => {
    setErrorMessage("No voice detected.");
    onStop();
  };

  useEffect(() => {
    const _window = window as any;
    const SpeechRecognition =
      _window?.SpeechRecognition || _window?.webkitSpeechRecognition;

    const SpeechGrammarList =
      _window?.SpeechGrammarList || _window?.webkitSpeechGrammarList;

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

  if (!recognitionRef?.current) {
    console.error(ERR);

    return {
      onStart,
      onStop,
      isListening,
      errorMessage: ERR,
      result
    };
  }

  return {
    onStart,
    onStop,
    isListening,
    errorMessage,
    result
  };
};
