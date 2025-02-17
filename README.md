# useSpeechRecognition
A react hook for speech recognition using SpeechRecognition API

## Getting started

### Demo
Please see the demo app

### Example
Here is an example of the usage of the hook

### Install
```sh
npm i @afsalk/use-speech-recognition
```
or 
```sh
yarn add @afsalk/use-speech-recognition
```

### Usage
Import the `useSpeechRecognition` hook into your component

```sh
import { useSpeechRecognition } from "@afsalk/use-speech-recognition";
```

And use the hook

```sh
const { onStart, isListening, result, errorMessage } = useSpeechRecognition();
```

## Properties

| **Property**    | **Type**     | **Description** |
|---------------|------------|----------------|
| `onStart`     | `() => void` | Starts speech recognition. |
| `onStop`     | `() => void` | Stop speech recognition. |
| `isListening` | `boolean` | Indicates whether recognition is active. |
| `result`      | `string` | Holds the recognized text. |
| `errorMessage` | `string` | Contains any error messages. |
