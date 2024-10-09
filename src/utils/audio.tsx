let audioContext: AudioContext | null = null;
let lastPlayTime = 0;

export const playBeep = () => {
  const now = Date.now();
  if (now - lastPlayTime < 50) return; // 50ms 내에 중복 재생 방지
  lastPlayTime = now;

  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.05);
};
