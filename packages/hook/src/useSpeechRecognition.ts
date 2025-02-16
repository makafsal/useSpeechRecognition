import { useCallback, useEffect, useRef, useState } from "react";

export const useSpeechRecognition = (commands = []) => {
  const recognition = useRef<any>(null);
  // State
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");

  const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(
    " | "
  )};`;

  useEffect(() => {
    const _window = window as any;
    const SpeechRecognition =
      _window?.SpeechRecognition || _window?.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition API is not supported in this browser.");
      return;
    }
    const SpeechGrammarList =
      _window?.SpeechGrammarList || _window?.webkitSpeechGrammarList;

    recognition.current = new SpeechRecognition();

    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.current.grammars = speechRecognitionList;
    recognition.current.continuous = false;
    recognition.current.lang = "en-US";
    recognition.current.interimResults = false;
    recognition.current.maxAlternatives = 1;
    recognition.current.onerror = (event: any) => onError(event);
    recognition.current.onresult = (event: any) => onResult(event);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStop = useCallback(() => {
    recognition?.current.stop();
    setIsListening(false);
  }, []);

  const onStart = useCallback(() => {
    if (isListening) {
      onStop();
      return;
    }

    setErrorMessage("");
    setResult("");

    recognition?.current.start();
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

  return {
    onStart,
    onStop,
    isListening,
    errorMessage,
    result
  };
};