const STORAGE_KEY = "invitacion-sonido";
export const SOUND_PREFERENCE_EVENT = "invitacion-sonido-cambio";

/** Reads whether optional sound effects are enabled (defaults to on). */
export function getSoundPreference(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "1";
}

/** Persists the sound preference and notifies any listening components. */
export function setSoundPreference(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  window.dispatchEvent(new CustomEvent<boolean>(SOUND_PREFERENCE_EVENT, { detail: enabled }));
}
