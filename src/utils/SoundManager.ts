import typeSound from '../assets/sounds/type.wav';
import returnSound from '../assets/sounds/return.wav';

export class SoundManager {
    private typeAudio: HTMLAudioElement;
    private returnAudio: HTMLAudioElement;

    constructor() {
        this.typeAudio = new Audio(typeSound);
        this.returnAudio = new Audio(returnSound);

        // Preload
        this.typeAudio.load();
        this.returnAudio.load();
    }

    public playTypeSound() {
        // Clone for polyphony (fast typing)
        const clone = this.typeAudio.cloneNode() as HTMLAudioElement;
        clone.volume = 0.6 + Math.random() * 0.4; // Varied volume
        clone.play().catch(e => console.error("Audio play failed", e));
    }

    public playReturnSound() {
        this.returnAudio.currentTime = 0;
        this.returnAudio.play().catch(e => console.error("Audio play failed", e));
    }
}

export const soundManager = new SoundManager();
