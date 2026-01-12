import { Injectable } from "@angular/core";

declare var webkitSpeechRecognition: new () => any;

@Injectable({
  providedIn: 'root'
})
export class VoiceControlService {

  recognition: any;
  googleHindiVoice: SpeechSynthesisVoice | any;

  constructor() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.startListening();
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        this.googleHindiVoice = voices.find(voice => voice.name === 'Google हिन्दी');
        if (!this.googleHindiVoice) {
          console.error('Google Hindi voice not found');
        }
      };
    } else {
      console.error('Speech synthesis not supported');
    }
  }

  startListening() {
    this.recognition.onresult = (e: any) => {
      const results = e.results;
      const transcript = results[results.length - 1][0].transcript;
      this.getResult(transcript);
    };

    this.recognition.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error);
      this.recognition.stop();
      this.startListening(); // Restart listening
    };

    this.recognition.onend = () => {
      this.startListening(); // Restart listening
    };

    this.recognition.start();
  }

  getResult(transcript: string) {
    if(transcript === "stop") {
      this.stopListening() 
    }
    const speech = new SpeechSynthesisUtterance(transcript);
    speech.lang = 'hi-IN';
    speech.voice = this.googleHindiVoice;
    window.speechSynthesis.speak(speech);
    // Process the transcript as needed
  }

  stopListening() {
    this.recognition.stop();
  }
}
