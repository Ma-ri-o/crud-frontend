type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sharedContext) sharedContext = new AudioContextClass();
  void sharedContext.resume();
  return sharedContext;
}

function tone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.07,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, context.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(context.currentTime + start);
  oscillator.stop(context.currentTime + start + duration + 0.05);
}

/** Playful "ba-na-na" bounce used when the giant intro button is tapped. */
export function playBananaJingle() {
  const context = getContext();
  if (!context) return;
  tone(context, 392, 0, 0.16, "triangle");
  tone(context, 523.25, 0.14, 0.16, "triangle");
  tone(context, 659.25, 0.28, 0.24, "triangle");
}

/** Short cheerful blip used for secondary interactions. */
export function playBlip(frequency = 740) {
  const context = getContext();
  if (!context) return;
  tone(context, frequency, 0, 0.12, "square", 0.05);
}

/** Minion-style giggle used for easter eggs. */
export function playGiggle() {
  const context = getContext();
  if (!context) return;
  [660, 740, 880, 990].forEach((frequency, index) => tone(context, frequency, index * 0.07, 0.11, "sine", 0.045));
}
