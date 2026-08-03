import { useCallback, useEffect, useState } from "react";

export function useTTS() {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => {
      const vs = window.speechSynthesis.getVoices() || [];
      if (vs.length) setAvailableVoices(vs);
    };
    load();
    // some browsers populate voices after a user gesture
    try {
      (window.speechSynthesis as any).onvoiceschanged = load;
    } catch {}
    // attempt to populate voices
    window.speechSynthesis.getVoices();
    return () => {
      try { (window.speechSynthesis as any).onvoiceschanged = null; } catch {}
    };
  }, []);

  const speak = useCallback((char: string, _name?: string) => {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      const PRON_MAP: Record<string,string> = {
        "ౠ": "ruu",
        "ఒ": "o",
        "అం": "aum",
        "అః": "aha",
        "ఢ": "ḍa",
        "బ": "ba",
        "శ": "say",
        "ఱ": "ra"
      };

      const translitMap: Record<string,string> = {
        "అ":"a","ఆ":"aa","ఇ":"i","ఈ":"ee","ఉ":"u","ఊ":"oo","ఋ":"ru","ౠ":"ruu",
        "ఎ":"e","ఏ":"ae","ఐ":"ai","ఒ":"o","ఓ":"oh","ఔ":"au",
        "అం":"aum","అః":"aha",
        "క":"ka","ఖ":"kha","గ":"ga","ఘ":"gha","ఙ":"nga",
        "చ":"cha","ఛ":"chha","జ":"ja","ఝ":"jha","ఞ":"nya",
        "ట":"ta","ఠ":"tha","డ":"da","ఢ":"dda","ణ":"na",
        "త":"tha","థ":"tha","ద":"da","ధ":"dha","న":"na",
        "ప":"pa","ఫ":"pha","బ":"ba","భ":"bha","మ":"ma",
        "య":"ya","ర":"ra","ల":"la","వ":"va",
        "శ":"sha","ష":"sha","స":"sa","హ":"ha","ళ":"la",
        "క్ష":"ksha","ఱ":"ra"
      };

      let textToSpeak = PRON_MAP[char] ?? char;
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.rate = 0.8;

      const voices = availableVoices.length ? availableVoices : window.speechSynthesis.getVoices();
      const teluguVoice = voices.find(v => v.lang === 'te-IN' || v.lang.toLowerCase().startsWith('te'));

      if (teluguVoice) {
        utter.voice = teluguVoice;
        utter.lang = teluguVoice.lang || 'te-IN';
        window.speechSynthesis.speak(utter);
        return;
      }

      // No Telugu voice - speak transliteration with an available English-like voice
      const translit = translitMap[char] ?? PRON_MAP[char] ?? char;
      utter.text = translit;

      let chosen = voices.find(v => v.lang.toLowerCase().includes('en')) || voices[0];
      if (chosen) {
        utter.voice = chosen;
        utter.lang = chosen.lang || 'en-US';
      } else {
        utter.lang = 'en-US';
      }

      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.error('Speech synthesis error', err);
    }
  }, [availableVoices]);

  return { speak, availableVoices };
}

export default useTTS;
