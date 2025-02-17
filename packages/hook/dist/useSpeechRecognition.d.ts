interface SpeechRecognitionHook {
    onStart: () => void;
    onStop: () => void;
    isListening: boolean;
    errorMessage: string;
    result: string;
}
/**
 * Custom hook for speech recognition.
 *
 * @param {string[]} [grammarList=[]] - List of voice commands to recognize, by default it is an `[]` array
 * @param {number} [autoStopTimeout=8000] - A timeout to stop recording automatically (milliseconds), and default timeout value is `8000` milliseconds
 * @returns {SpeechRecognitionHook} - The speech recognition hook instance.
 */
export declare const useSpeechRecognition: (grammarList?: string[], autoStopTimeout?: number) => SpeechRecognitionHook;
export {};
