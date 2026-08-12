import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Home as HomeIcon, Sparkles, Play, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

/* ---------------- TELUGU LETTER DATA ---------------- */

type TeluguItem = {
  char: string;
  name: string;
  parent?: string;
};

const TELUGU_ALPHABET = {
  vowels: [
    { char: "అ", name: "a" },
    { char: "ఆ", name: "aa" },
    { char: "ఇ", name: "i" },
    { char: "ఈ", name: "ee" },
    { char: "ఉ", name: "u" },
    { char: "ఊ", name: "oo" },
    { char: "ఋ", name: "ru" },
    { char: "ౠ", name: "ruu"},
    { char: "ఎ", name: "e" },
    { char: "ఏ", name: "ae" },
    { char: "ఐ", name: "ai" },
    { char: "ఒ", name: "o" },
    { char: "ఓ", name: "oh" },
    { char: "ఔ", name: "au" },
    { char: "అం", name: "um" },
    { char: "అః", name: "aha" }
  ],
  consonants: [
    { char: "క", name: "ka" },
    { char: "ఖ", name: "kha" },
    { char: "గ", name: "ga" },
    { char: "ఘ", name: "gha" },
    { char: "ఙ", name: "nga" },
    { char: "చ", name: "cha" },
    { char: "ఛ", name: "chha" },
    { char: "జ", name: "ja" },
    { char: "ఝ", name: "jha" },
    { char: "ఞ", name: "nya" },
    { char: "ట", name: "ta" },
    { char: "ఠ", name: "tha" },
    { char: "డ", name: "da" },
    { char: "ఢ", name: "dda" },
    { char: "ణ", name: "na" },
    { char: "త", name: "tha" },
    { char: "థ", name: "tha" },
    { char: "ద", name: "da" },
    { char: "ధ", name: "dha" },
    { char: "న", name: "na" },
    { char: "ప", name: "pa" },
    { char: "ఫ", name: "pha" },
    { char: "బ", name: "ba" },
    { char: "భ", name: "bha" },
    { char: "మ", name: "ma" },
    { char: "య", name: "ya" },
    { char: "ర", name: "ra" },
    { char: "ల", name: "la" },
    { char: "వ", name: "va" },
    { char: "శ", name: "sha" },
    { char: "ష", name: "sha" },
    { char: "స", name: "sa" },
    { char: "హ", name: "ha" },
    { char: "ళ", name: "la" },
    { char: "క్ష", name: "ksha" },
    { char: "ఱ", name: "ra" }
  ],
  achuVathulu: [
      { char: "", name: "a vathu", parent: "అ" },
      { char: "ా", name: "aa vathu", parent: "ఆ" },
      { char: "ి", name: "i vathu", parent: "ఇ" },
      { char: "ీ", name: "ee vathu", parent: "ఈ" },
      { char: "ు", name: "u vathu", parent: "ఉ" },
      { char: "ూ", name: "oo vathu", parent: "ఊ" },
      { char: "ృ", name: "ru vathu", parent: "ఋ" },
      { char: "ౄ", name: "roo vathu", parent: "ౠ" },
      { char: "ె", name: "e vathu", parent: "ఎ" },
      { char: "ే", name: "ae vathu", parent: "ఏ" },
      { char: "ై", name: "ai vathu", parent: "ఐ" },
      { char: "ొ", name: "o", parent: "ఒ" },
      { char: "ో", name: "oh vathu", parent: "ఓ" },
      { char: "ౌ", name: "au vathu", parent: "ఔ" },
      { char: "ం", name: "um", parent: "అం" },
      { char: "ః", name: "aha", parent: "అః" },
  ],
  halluVathulu: [
    { char: "్క", name: "ka vathu", parent: "క" },
    { char: "్ఖ", name: "kha vathu", parent: "ఖ" },
    { char: "్గ", name: "ga vathu", parent: "గ" },
    { char: "్ఘ", name: "gha vathu", parent: "ఘ" },
    { char: "్చ", name: "cha vathu", parent: "చ" },
    { char: "్ఛ", name: "chha vathu", parent: "ఛ" },
    { char: "్జ", name: "ja vathu", parent: "జ" },
    { char: "్ఝ", name: "jha vathu", parent: "ఝ" },
    { char: "్ట", name: "ta vathu", parent: "ట" },
    { char: "్ఠ", name: "tha vathu", parent: "ఠ" },
    { char: "్డ", name: "da vathu", parent: "డ" },
    { char: "్ఢ", name: "dah", parent: "ఢ" },
    { char: "్ణ", name: "na vathu", parent: "ణ" },
    { char: "్త", name: "tha vathu", parent: "త" },
    { char: "్థ", name: "tha vathu", parent: "థ" },
    { char: "్ద", name: "da vathu", parent: "ద" },
    { char: "్ధ", name: "dha vathu", parent: "ధ" },
    { char: "్న", name: "na vathu", parent: "న" },
    { char: "్ప", name: "pa vathu", parent: "ప" },
    { char: "్ఫ", name: "pha vathu", parent: "ఫ" },
    { char: "్బ", name: "ba vathu", parent: "బ" },
    { char: "్భ", name: "bha vathu", parent: "భ" },
    { char: "్మ", name: "ma vathu", parent: "మ" },
    { char: "్య", name: "ya vathu", parent: "య" },
    { char: "్ర", name: "ra vathu", parent: "ర" },
    { char: "్ల", name: "la vathu", parent: "ల" },
    { char: "్వ", name: "va vathu", parent: "వ" },
    { char: "్శ", name: "sha vathu", parent: "శ" },
    { char: "్ష", name: "sha vathu", parent: "ష" },
    { char: "్స", name: "sa vathu", parent: "స" },
    { char: "్హ", name: "ha vathu", parent: "హ" },
    { char: "్ళ", name: "la vathu", parent: "ళ" },
  ],
  gunithalu: [
    { char: "ం", name: "anusvaram" },
    { char: "ः", name: "visargam" },
    { char: "ఁ", name: "chandrabindu" },
    { char: "ః", name: "jihvamuliya" }
  ]
};

const ALL_LETTERS: TeluguItem[] = [
  ...TELUGU_ALPHABET.vowels,
  ...TELUGU_ALPHABET.consonants,
];

const ALL_VATHULU: TeluguItem[] = [
  ...TELUGU_ALPHABET.achuVathulu,
  ...TELUGU_ALPHABET.halluVathulu,
];

const ALL_GUNITHALU = TELUGU_ALPHABET.gunithalu;

/* ------------- MAIN COMPONENT ------------- */

export default function Letters() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Ensure component is fully initialized on mount
    setIsLoading(false);
  }, []);

  const [mode, setMode] = useState<'learn' | 'game' | 'vathulu' | 'vathulu-game' | 'gunithalu' | 'write'>('learn');
  const [gameTarget, setGameTarget] = useState<{ char: string; name: string; parent?: string } | null>(null);
  const [bubbles, setBubbles] = useState<
    { char: string; name: string; id: number; x: number; y: number; vx: number; vy: number; parent?: string }[]
  >([]);
  const [score, setScore] = useState(0);
  const [wrongId, setWrongId] = useState<number | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [writeTarget, setWriteTarget] = useState<{ char: string; name: string } | null>(null);
  const [writeFeedback, setWriteFeedback] = useState<{ type: 'correct' | 'wrong'; char?: string } | null>(null);
  const [brushColor, setBrushColor] = useState<string>('#0ea5e9');
  const [brushSize, setBrushSize] = useState<number>(4);
  
  // Gunithalu (Hallu-Achhulu Practice) state - with safe defaults
  const [currentHallu, setCurrentHallu] = useState<string>(() => {
    try {
      return TELUGU_ALPHABET.consonants?.[0]?.char || "క";
    } catch {
      return "క";
    }
  });
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceQuestion, setPracticeQuestion] = useState<{ hallu: string; achhulu: any; correct: string } | null>(null);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [isInteractivePractice, setIsInteractivePractice] = useState(false);
  const [selectedAchhulu, setSelectedAchhulu] = useState<any>(() => {
    try {
      return TELUGU_ALPHABET.achuVathulu?.[1] || TELUGU_ALPHABET.achuVathulu?.[0] || { char: "ా", name: "aa", parent: "ఆ" };
    } catch {
      return { char: "ా", name: "aa", parent: "ఆ" };
    }
  });
  const [displayedResult, setDisplayedResult] = useState<string>("");
  const [clickedHalluIndex, setClickedHalluIndex] = useState<number | null>(null);

  // show first 25 consonants in a 5x5 grid, rest rendered below normally
  const FIRST_CONSONANT_COUNT = 25;
  const firstConsonants = TELUGU_ALPHABET.consonants.slice(0, FIRST_CONSONANT_COUNT);
  const restConsonants = TELUGU_ALPHABET.consonants.slice(FIRST_CONSONANT_COUNT);

  // Initialize on mount to fix reload issues
  useEffect(() => {
    try {
      if (!currentHallu || currentHallu.length === 0) {
        setCurrentHallu(TELUGU_ALPHABET.consonants?.[0]?.char || "క");
      }
      if (!selectedAchhulu || !selectedAchhulu.char) {
        setSelectedAchhulu(TELUGU_ALPHABET.achuVathulu?.[1] || { char: "ా", name: "aa", parent: "ఆ" });
      }
    } catch (error) {
      console.error('Letters component initialization error:', error);
      setCurrentHallu("క");
      setSelectedAchhulu({ char: "ా", name: "aa", parent: "ఆ" });
    }
  }, []);

  /* ---------- SMART SPEAK FUNCTION ---------- */

  const speak = useCallback((char: string, name: string) => {
    try {
      if (!window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      let utterance: SpeechSynthesisUtterance;
      let textToSpeak = char;

      // Letters/combinations that need special pronunciation handling
      const pronunciationMap: { [key: string]: string } = {
        "ౠ": "ruu",
        "ఒ": "o",
        "అం": "aum",
        "అః": "aha",
        "ఢ": "ḍa",
        "బ" : "ba",
        "శ" : "say",
        "ఱ": "ra"
          };

      // For combinations with consonant + vowel mark
      // If it's just a consonant or simple combo, speak it directly
      if (pronunciationMap[char]) {
        textToSpeak = pronunciationMap[char];
      }

      utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "te-IN";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }, []);

  /* ---------- POSITION GENERATOR (NO OVERLAP) ---------- */

  const generatePositions = (count: number) => {
    const positions: { x: number; y: number }[] = [];

    while (positions.length < count) {
      const newPos = {
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      };

      const tooClose = positions.some(pos => {
        const dx = pos.x - newPos.x;
        const dy = pos.y - newPos.y;
        return Math.sqrt(dx * dx + dy * dy) < 20;
      });

      if (!tooClose) positions.push(newPos);
    }

    return positions;
  };

  /* ---------- GAME ROUND ---------- */

  const startNewRound = useCallback(() => {
    const isVathuluGame = mode === 'vathulu-game';
    const pool = isVathuluGame ? ALL_VATHULU : ALL_LETTERS;
    
    const target = pool[Math.floor(Math.random() * pool.length)];
    setGameTarget(target);

    const others = pool
      .filter(l => l.char !== target.char)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const letters = [target, ...others].sort(() => 0.5 - Math.random());
    const positions = generatePositions(letters.length);

    const newBubbles = letters.map((l, idx) => ({
      char: l.char,
      name: l.name,
      parent: l.parent,
      id: Math.random(), 
      x: positions[idx].x,
      y: positions[idx].y,
      vx: (Math.random() - 0.5) * 0.4, 
      vy: (Math.random() - 0.5) * 0.4  
    }));

    setBubbles(newBubbles);
    
    setTimeout(() => {
      if (isVathuluGame && target.parent) {
        speak(target.parent, target.name);
      } else {
        speak(target.char, target.name);
      }
    }, 500);
  }, [speak, mode]);

  useEffect(() => {
    if (mode === 'game' || mode === 'vathulu-game') {
      startNewRound();
      
      const interval = setInterval(() => {
        setBubbles(prev => prev.map(b => {
          let nx = b.x + b.vx;
          let ny = b.y + b.vy;
          let nvx = b.vx;
          let nvy = b.vy;

          if (nx < 10 || nx > 90) nvx *= -1;
          if (ny < 15 || ny > 85) nvy *= -1;

          return { ...b, x: nx, y: ny, vx: nvx, vy: nvy };
        }));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [mode, startNewRound]);

  const handleBubbleClick = (bubble: any) => {
    // Speak the parent consonant if in vathulu game, otherwise speak the character itself
    if (mode === 'vathulu-game' && bubble.parent) {
      speak(bubble.parent, bubble.name);
    } else {
      speak(bubble.char, bubble.name);
    }
    
    if (bubble.char === gameTarget?.char) {
      setScore(s => s + 10);
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
      confetti({ particleCount: 60, spread: 60 });
      setTimeout(startNewRound, 1000);
    } else {
      setWrongId(bubble.id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  /* ---------- LETTER WRITING PRACTICE ---------- */

  const startWriteRound = useCallback(() => {
    try {
      const target = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
      setWriteTarget(target);
      setWriteFeedback(null);
      clearCanvas();
      setTimeout(() => speak(target.char, target.name), 500);
    } catch (error) {
      console.error('Start write round error:', error);
    }
  }, [speak]);

  const clearCanvas = () => {
    try {
      if (canvasRef) {
        const ctx = canvasRef.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
      }
    } catch (error) {
      console.error('Canvas clear error:', error);
    }
  };

  const getCoordinates = (e: any) => {
    if (!canvasRef) return { x: 0, y: 0 };
    const rect = canvasRef.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY || 0;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const { x, y } = getCoordinates(e);
    ctx.moveTo(x, y);
  };

  const drawOnCanvas = (e: any) => {
    if (!isDrawing || !canvasRef) return;
    e.preventDefault();
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: any) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    startDrawing(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    drawOnCanvas(e);
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    stopDrawing(e);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    startDrawing(e);
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    drawOnCanvas(e);
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    stopDrawing(e);
  };

  const checkDrawing = () => {
    try {
      if (!canvasRef || !writeTarget) return;
      const ctx = canvasRef.getContext('2d');
      if (!ctx) return;
      
      const imageData = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
      const data = imageData.data;
      let filledPixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 128) {
          filledPixels++;
        }
      }
      
      // Require solid drawing (4000+ pixels) AND user confirmation that it matches
      // This ensures the drawn character actually resembles the target
      if (filledPixels < 4000) {
        setWriteFeedback({
          type: 'wrong',
          char: writeTarget?.char
        });
      } else {
        // Show confirmation dialog asking if they believe they drew the letter correctly
        const userConfirmed = confirm(`Did you draw the letter "${writeTarget.char}" correctly?\n\nClick OK if yes, Cancel if you want to redraw.`);
        
        if (userConfirmed) {
          setWriteFeedback({
            type: 'correct',
            char: writeTarget?.char
          });
        }
      }
    } catch (error) {
      console.error('Check drawing error:', error);
    }
  };

  const nextLetter = () => {
    startWriteRound();
  };

  /* ---------- GUNITHALU PRACTICE FUNCTIONS ---------- */

  const generatePracticeQuestion = useCallback(() => {
    try {
      const achhulu = TELUGU_ALPHABET.achuVathulu[Math.floor(Math.random() * TELUGU_ALPHABET.achuVathulu.length)];
      const correct = currentHallu + achhulu.char;
      
      const options = [correct];
      while (options.length < 4) {
        const randomAchhulu = TELUGU_ALPHABET.achuVathulu[Math.floor(Math.random() * TELUGU_ALPHABET.achuVathulu.length)];
        const option = currentHallu + randomAchhulu.char;
        if (!options.includes(option)) options.push(option);
      }
      
      const shuffledOptions = options.sort(() => 0.5 - Math.random());
      
      setPracticeQuestion({
        hallu: currentHallu,
        achhulu: achhulu,
        correct: correct
      });
      setPracticeOptions(shuffledOptions);
      
      // Speak the question with proper pronunciation - just the base letters
      setTimeout(() => {
        // Speak the consonant character directly
        speak(currentHallu, "consonant");
        setTimeout(() => {
          speak("plus", "plus");
        }, 600);
        setTimeout(() => {
          // Speak the actual vowel character (which is part of the vowel vowel)
          const vowelChar = achhulu.parent || achhulu.char;
          speak(vowelChar, "vowel");
        }, 1200);
      }, 300);
    } catch (error) {
      console.error('Generate practice question error:', error);
    }
  }, [currentHallu, speak]);

  const checkPracticeAnswer = (answer: string) => {
    try {
      if (answer === practiceQuestion?.correct) {
        setPracticeScore(s => s + 10);
        speak(answer, "correct");
        setTimeout(generatePracticeQuestion, 1000);
      } else {
        speak("malli prayatninchandi", "try again");
      }
    } catch (error) {
      console.error('Check practice answer error:', error);
    }
  };

  useEffect(() => {
    if (mode === 'write') {
      startWriteRound();
    }
  }, [mode, startWriteRound]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
        <div className="text-2xl font-bold text-sky-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-b from-sky-50 to-white text-slate-900 selection:bg-sky-100"> 
      <header className="mb-8 flex flex-wrap justify-center gap-2 bg-white p-2 rounded-3xl shadow-md border border-sky-50 relative z-50">
        <Button 
          variant={mode === 'learn' ? 'default' : 'ghost'} 
          className="rounded-full px-5 text-sm transition-all"
          onClick={() => setMode('learn')}
        >
          Letters
        </Button>

... (rest of file unchanged) ...
