# useSpeechRecognition
A react hook for speech recognition using SpeechRecognition API

## Getting started

### Demo
Please see the [demo app](https://speech-recognition-demo.vercel.app/)

### Example
Here is an example of the usage of the hook in [Stackblitz](https://stackblitz.com/~/github.com/makafsal/speechRecognitionDemo), fork and play with it 🚀

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

And use the hook without any config

```sh
const { start, stop, result, isListening, errorMessage } = useSpeechRecognition();
```

## Properties

| **Property**    | **Type**     | **Description**                          |
| --------------- | ------------ | ---------------------------------------- |
| `start`         | `() => void` | Starts speech recognition.               |
| `stop`          | `() => void` | Stop speech recognition.                 |
| `isListening`   | `boolean`    | Indicates whether recognition is active. |
| `result`        | `string`     | Holds the recognized text.               |
| `errorMessage`  | `string`     | Contains any error messages.             |

## Optional Parameters & Event handlers

| **Parameter**     | **Type**                 | **Description**                                                                                           |
| ----------------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `grammarList`     | `string[]`               | The list of grammars will be understood by the SpeechRecognition, default value is `[]`                   |
| `autoStopTimeout` | `number`                 | Set a timeout delay to automatically stop recording after this much milliseconds, default value is `8000` |
| `lang`            | `string`                 | Language for recognition (e.g., 'en-US', 'fr-FR')                                                         |
| `continuous`      | `boolean`                | Whether to return continuous results or just one                                                          |
| `interimResults`  | `boolean`                | Whether to return interim results                                                                         |
| `maxAlternatives` | `number`                 | Maximum number of alternative transcripts to return                                                       |
| `serviceURI`      | `string`                 | URL of the speech recognition service (optional)                                                          |
| `onstart`         | `(event: Event) => void` | Fired when recognition starts                                                                             |
| `onend`           | `(event: Event) => void` | Fired when recognition ends                                                                               |
| `onerror`         | `(event: any) => void`   | Fired on error                                                                                            |
| `onresult`        | `(event: any) => void`   | Fired when a result is received                                                                           |
| `onsoundstart`    | `(event: Event) => void` | Fired when sound is detected                                                                              |
| `onsoundend`      | `(event: Event) => void` | Fired when sound stops                                                                                    |
| `onstart`         | `(event: Event) => void` | Fired when speech is detected                                                                             |
| `onspeechstart`   | `(event: Event) => void` | Fired when speech is detected                                                                             |
| `onspeechend`     | `(event: Event) => void` | Fired when speech stops                                                                                   |
| `onnomatch`       | `(event: any) => void`   | Fired when no match is found                                                                              |
| `onaudiostart`    | `(event: Event) => void` | Fired when audio capture starts                                                                           |
| `onaudioend`      | `(event: Event) => void` | Fired when audio capture ends                                                                             |

### Example for parameters and event handlers

```sh
const { start, stop, result, isListening, errorMessage } = useSpeechRecognition({
  continuous: true,
  interimResults: true,
  onstart: _onStart,
  onspeechstart: _onspeechstart
});
```
