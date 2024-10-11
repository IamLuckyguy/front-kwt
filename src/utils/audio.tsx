let audioContext: AudioContext | null = null;
let lastPlayTime = 0;

const playSound = (type: OscillatorType, frequency: number, duration: number, volume: number) => {
  const now = Date.now();
  if (now - lastPlayTime < 50) return; // Prevent duplicate play within 50ms
  lastPlayTime = now;

  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

export const playBeep = () => {
  playSound('square', 1000, 0.05, 0.1);
};

export const playSelectSound = () => {
  playSound('sine', 1500, 0.1, 0.2);
};