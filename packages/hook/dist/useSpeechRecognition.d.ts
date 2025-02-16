export declare const useSpeechRecognition: (commands?: never[]) => {
    onStart: () => void;
    onStop: () => void;
    isListening: boolean;
    errorMessage: string;
    result: string;
};
