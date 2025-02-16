interface SpeechRecognitionHook {
    onStart: () => void;
    onStop: () => void;
    isListening: boolean;
    errorMessage: string;
    result: string;
}
export declare const useSpeechRecognition: (commands?: never[]) => SpeechRecognitionHook;
export {};
