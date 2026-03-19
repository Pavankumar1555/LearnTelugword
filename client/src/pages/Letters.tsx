import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Home as HomeIcon, Sparkles, Play, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

/* ---------------- TELUGU LETTER DATA ---------------- */

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
    { char: "ఢ", name: "dah" },
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

const ALL_LETTERS = [...TELUGU_ALPHABET.vowels, ...TELUGU_ALPHABET.consonants];
const ALL_VATHULU = [...TELUGU_ALPHABET.achuVathulu, ...TELUGU_ALPHABET.halluVathulu];
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
        "ఒ": "o",
        "అం": "am",
        "అః": "ah",
        "ఢ": "dha",
        "ఱ": "rra",
        "ౠ": "ruu",
        "ఔ": "au"
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
        <Button 
          variant={mode === 'vathulu' ? 'default' : 'ghost'} 
          className="rounded-full px-5 text-sm transition-all"
          onClick={() => setMode('vathulu')}
        >
          Vathulu
        </Button>
        <Button 
          variant={mode === 'game' ? 'default' : 'ghost'} 
          className="rounded-full px-5 text-sm transition-all"
          onClick={() => setMode('game')}
        >
          Letter Game
        </Button>
        <Button 
          variant={mode === 'vathulu-game' ? 'default' : 'ghost'} 
          className="rounded-full px-5 text-sm transition-all"
          onClick={() => setMode('vathulu-game')}
        >
          Vathu Game
        </Button>
        <Button 
          variant={mode === 'gunithalu' ? 'default' : 'ghost'} 
          className="rounded-full px-5 text-sm transition-all"
          onClick={() => setMode('gunithalu')}
        >
          Gunithalu
        </Button>
        <Button 
          variant={mode === 'write' ? 'default' : 'ghost'} 
          className="rounded-full px-5 text-sm transition-all"
          onClick={() => setMode('write')}
        >
          Write Letter
        </Button>
      </header>

      {mode === "gunithalu" && (
        <div className="w-full max-w-5xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-sky-900 border-b-2 border-sky-100 pb-3 flex items-center gap-3">
              <Sparkles className="text-sky-500" />
              Gunithalu (హల్లు-అచ్చు)
            </h2>

            {!isPracticeMode && !isInteractivePractice ? (
              <div className="space-y-6">
                {/* Hallu Buttons */}
                <div className="flex flex-wrap gap-2 justify-center bg-sky-50 p-4 rounded-2xl">
                  {TELUGU_ALPHABET.consonants.map((c) => (
                    <button
                      key={c.char}
                      onClick={() => setCurrentHallu(c.char)}
                      className={`px-4 py-2 rounded-lg font-bold text-lg transition-all ${
                        currentHallu === c.char
                          ? 'bg-white border-2 border-sky-600 text-sky-700'
                          : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
                      }`}
                    >
                      {c.char}
                    </button>
                  ))}
                </div>

                {/* Hallu + Achhulu Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {TELUGU_ALPHABET.achuVathulu.map((a, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => speak(currentHallu + a.char, a.name)}
                      className="bg-white border-2 border-sky-200 rounded-xl p-4 hover:border-sky-400 hover:shadow-lg transition-all text-center"
                    >
                      <div className="text-5xl font-bold text-sky-700">{currentHallu + a.char}</div>
                      <div className="text-xs text-slate-500 mt-2">{currentHallu} + {a.name}</div>
                    </motion.button>
                  ))}
                  
                  {/* Practice Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsPracticeMode(true);
                      setPracticeScore(0);
                      generatePracticeQuestion();
                    }}
                    className="bg-orange-100 border-2 border-orange-400 rounded-xl p-4 hover:border-orange-500 hover:shadow-lg transition-all font-bold text-orange-700 col-span-2 sm:col-span-3 md:col-span-4"
                  >
                    🎮 Practice (ప్రాక్టీస్)
                  </motion.button>

                  {/* Interactive Practice Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsInteractivePractice(true);
                      setSelectedAchhulu(TELUGU_ALPHABET.achuVathulu[1]);
                      setDisplayedResult("");
                    }}
                    className="bg-green-100 border-2 border-green-400 rounded-xl p-4 hover:border-green-500 hover:shadow-lg transition-all font-bold text-green-700 col-span-2 sm:col-span-3 md:col-span-4"
                  >
                    🎯 Interactive Practice (ఇంటరాక్టివ్)
                  </motion.button>
                </div>
              </div>
            ) : isPracticeMode ? (
              /* Quiz Practice Mode */
              <div className="space-y-6 text-center">
                {/* Score */}
                <div className="bg-sky-50 rounded-2xl p-4 text-2xl font-bold text-sky-700">
                  Score: {practiceScore}
                </div>

                {/* Question */}
                {practiceQuestion && (
                  <>
                    <div className="bg-white border-4 border-sky-300 rounded-2xl p-8">
                      <div className="text-lg text-slate-600 mb-6">
                        <span className="text-3xl font-bold text-sky-700">{practiceQuestion.hallu}</span>
                        <span className="text-2xl mx-3">+</span>
                        <span className="text-3xl font-bold text-sky-700">{practiceQuestion.achhulu.parent}</span>
                        <span className="text-2xl mx-3">=</span>
                        <span className="text-3xl font-bold text-sky-700">?</span>
                      </div>
                      <div className="text-3xl text-slate-500 font-semibold">
                        Select the correct answer
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-4">
                      {practiceOptions.map((opt, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => checkPracticeAnswer(opt)}
                          className="bg-white border-2 border-sky-200 rounded-xl p-4 text-3xl font-bold text-sky-700 hover:border-sky-400 hover:shadow-lg transition-all"
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}

                {/* Exit Practice */}
                <Button
                  onClick={() => {
                    setIsPracticeMode(false);
                    setPracticeScore(0);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Back to Grid
                </Button>
              </div>
            ) : (
              /* Interactive Practice Mode */
              <div className="space-y-6">
                {/* Achu Selector Menu */}
                <div className="bg-sky-50 rounded-2xl p-4">
                  <div className="text-sm font-semibold text-sky-700 uppercase mb-3">Select Achu (అచ్చు):</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {TELUGU_ALPHABET.achuVathulu.map((a, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedAchhulu(a);
                          setDisplayedResult("");
                        }}
                        className={`px-4 py-2 rounded-lg font-bold text-lg transition-all ${
                          selectedAchhulu.char === a.char
                            ? 'bg-white border-2 border-sky-600 text-sky-700'
                            : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
                        }`}
                      >
                        {a.parent}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hallu Letters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 relative">
                  {TELUGU_ALPHABET.consonants.map((c, idx) => (
                    <div key={c.char} className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const result = c.char + selectedAchhulu.char;
                          setDisplayedResult(result);
                          setClickedHalluIndex(idx);
                          speak(c.char, c.name);
                          setTimeout(() => {
                            speak("plus", "plus");
                          }, 600);
                          setTimeout(() => {
                            speak(selectedAchhulu.parent, selectedAchhulu.name);
                          }, 1200);
                          setTimeout(() => {
                            speak(result, "result");
                          }, 1800);
                        }}
                        className="bg-white border-2 border-sky-200 rounded-xl p-4 hover:border-sky-400 hover:shadow-lg transition-all w-full"
                      >
                        <div className="text-4xl font-bold text-sky-700">{c.char}</div>
                      </motion.button>

                      {/* Popup Result Near Clicked Button */}
                      {displayedResult && clickedHalluIndex === idx && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0, y: 10 }}
                          animate={{ scale: 1, opacity: 1, y: -60 }}
                          exit={{ scale: 0.5, opacity: 0, y: 10 }}
                          className="absolute left-1/2 -translate-x-1/2 top-0 bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-400 rounded-2xl p-4 shadow-xl whitespace-nowrap z-50 pointer-events-none"
                        >
                          <div className="text-3xl font-bold text-green-700">{displayedResult}</div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Exit Interactive Practice */}
                <Button
                  onClick={() => {
                    setIsInteractivePractice(false);
                    setDisplayedResult("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Back to Grid
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === "vathulu" && (
        <div className="w-full max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-sky-900 border-b-2 border-sky-100 pb-3 flex items-center gap-3">
              <Sparkles className="text-sky-500" />
              Achu Vathulu (అచ్చు వత్తులు)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
              {(TELUGU_ALPHABET?.achuVathulu || []).map((l) => (
                <motion.div
                  key={l.char}
                  whileHover={{ y: -5 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-sky-100 flex flex-col items-center gap-3 group transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col items-center justify-center h-20 w-full">
                    <span className="text-sm text-slate-400 font-medium mb-1 group-hover:text-sky-400 transition-colors">{l.parent} →</span>
                    <span className="text-4xl font-bold text-slate-800 drop-shadow-sm">{l.char}</span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-10 w-10 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
                    onClick={() => speak(l.parent || l.char, l.name)}
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-sky-900 border-b-2 border-sky-100 pb-3 flex items-center gap-3">
              <Sparkles className="text-sky-500" />
              Hallu Vathulu (హల్లు వత్తులు)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
              {TELUGU_ALPHABET.halluVathulu.map((l) => (
                <motion.div
                  key={l.char}
                  whileHover={{ y: -5 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-sky-100 flex flex-col items-center gap-3 group transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col items-center justify-center h-20 w-full">
                    <span className="text-sm text-slate-400 font-medium mb-1 group-hover:text-sky-400 transition-colors">{l.parent} →</span>
                    <span className="text-4xl font-bold text-slate-800 drop-shadow-sm">{l.char}</span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-10 w-10 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100"
                    onClick={() => speak(l.parent || l.char, l.name)}
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(mode === "game" || mode === "vathulu-game") && (
        <div className="w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 px-4">
            <div className="bg-white/90 backdrop-blur px-8 py-3 rounded-2xl shadow-sm border border-sky-100 flex items-center gap-4">
              <span className="text-sky-600 font-bold uppercase tracking-wider text-xs">{mode === 'vathulu-game' ? 'Listen & Find Vathu' : 'Listen & Find Letter'}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/90 backdrop-blur px-8 py-3 rounded-2xl shadow-sm border border-sky-100 flex items-center gap-4">
                <span className="text-sky-600 font-bold uppercase tracking-wider text-xs">Score</span>
                <span className="text-3xl font-bold text-slate-800">{score}</span>
              </div>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-14 w-14 rounded-2xl bg-white border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300 transition-all shadow-sm"
                onClick={() => {
                  if (gameTarget) {
                    if (mode === 'vathulu-game' && gameTarget.parent) {
                      speak(gameTarget.parent, gameTarget.name);
                    } else {
                      speak(gameTarget.char, gameTarget.name);
                    }
                  }
                }}
              >
                <Volume2 className="h-7 w-7" />
              </Button>
            </div>
          </div>

          <div className="relative w-full h-[60vh] bg-sky-50 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(186,230,253,0.4),transparent)] pointer-events-none" />
            <AnimatePresence>
              {bubbles.map((bubble) => (
                <motion.button
                  key={bubble.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                  }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  onClick={() => handleBubbleClick(bubble)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full text-5xl font-bold transition-all shadow-xl flex items-center justify-center border-4 border-white/60 backdrop-blur-md ${
                    wrongId === bubble.id 
                      ? "bg-red-500 text-white animate-shake z-10" 
                      : "bg-white/80 text-sky-900 hover:bg-white hover:scale-110 active:scale-90 z-0"
                  }`}
                  style={{
                    background: `radial-gradient(circle at 30% 30%, white, ${wrongId === bubble.id ? '#ef4444' : '#bae6fd'})`
                  }}
                >
                  {bubble.char}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-6 text-center text-slate-400 font-medium italic">
            Tap the correct {mode === 'vathulu-game' ? 'vathu' : 'letter'} bubble!
          </div>
        </div>
      )}

      {mode === "write" && (
        <div className="w-full max-w-3xl flex flex-col items-center gap-6">
          <div className="bg-white/90 backdrop-blur px-8 py-4 rounded-2xl shadow-sm border border-sky-100 flex items-center gap-4">
            <span className="text-sky-600 font-bold uppercase tracking-wider">Listen & Write</span>
            <span className="text-5xl font-bold text-slate-800">{writeTarget?.char}</span>
          </div>

          <div className="w-full max-w-2xl space-y-4">
            {/* Color and Size Controls */}
            <div className="flex flex-wrap gap-4 justify-center items-center bg-white/80 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sky-700">Color:</span>
                <div className="flex gap-2">
                  {['#0ea5e9', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        brushColor === color ? 'border-slate-800 scale-110' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-bold text-sky-700">Size:</span>
                <div className="flex gap-2">
                  {[2, 4, 6, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        brushSize === size
                          ? 'bg-sky-600 text-white scale-110'
                          : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas with Guide Letter */}
            <div className="relative w-full" style={{ touchAction: 'none' }}>
              <div className="relative">
                {/* Guide letter (faded) */}
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none z-10">
                  <span className="text-[120px] font-bold text-slate-200 opacity-30">
                    {writeTarget?.char}
                  </span>
                </div>
                
                {/* Canvas */}
                <canvas
                  ref={setCanvasRef}
                  width={600}
                  height={400}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  onTouchStart={handleCanvasTouchStart}
                  onTouchMove={handleCanvasTouchMove}
                  onTouchEnd={handleCanvasTouchEnd}
                  className="w-full border-4 border-sky-300 rounded-2xl bg-white cursor-crosshair shadow-lg block select-none relative z-20"
                  style={{ touchAction: 'none', WebkitTouchCallout: 'none' } as any}
                />
              </div>
              
              <div className="mt-3 text-center text-sm text-slate-500 italic">
                Trace over the faded letter to match it
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={checkDrawing}
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold text-lg"
            >
              Check
            </Button>
            <Button 
              onClick={clearCanvas}
              variant="outline"
              className="px-8 py-3 rounded-xl font-bold text-lg"
            >
              Clear
            </Button>
            <Button 
              size="icon"
              variant="outline" 
              className="h-14 w-14 rounded-2xl bg-white border-sky-200 text-sky-600"
              onClick={() => writeTarget && speak(writeTarget.char, writeTarget.name)}
            >
              <Volume2 className="h-6 w-6" />
            </Button>
          </div>

          {writeFeedback && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-center p-6 rounded-2xl text-2xl font-bold ${
                writeFeedback.type === 'correct'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {writeFeedback.type === 'correct' ? (
                <div>
                  <div>Great Job! 🎉</div>
                  <Button onClick={nextLetter} className="mt-4 bg-green-600 hover:bg-green-700">
                    Next Letter
                  </Button>
                </div>
              ) : (
                <div>
                  <div>Let's try again!</div>
                  <div className="text-4xl mt-3">{writeFeedback.char}</div>
                  <div className="text-sm mt-2 mb-4">The letter was</div>
                  <Button onClick={nextLetter} className="bg-red-600 hover:bg-red-700">
                    Next Letter
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {mode === "learn" && (
        <div className="w-full max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-sky-900 border-b-2 border-sky-100 pb-3 flex items-center gap-3">
              <Sparkles className="text-sky-500" />
              Vowels (అచ్చులు)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
              {(TELUGU_ALPHABET?.vowels || []).map((l) => (
                <motion.div
                  key={l.char}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 flex flex-col items-center gap-3 group transition-shadow hover:shadow-md cursor-pointer"
                  onClick={() => speak(l.char, l.name)}
                >
                  <span className="text-5xl font-bold text-slate-800 drop-shadow-sm">{l.char}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">{l.name}</span>
                  <Volume2 className="h-4 w-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-sky-900 border-b-2 border-sky-100 pb-3 flex items-center gap-3">
              <Sparkles className="text-sky-500" />
              Consonants (హల్లులు)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
              {(TELUGU_ALPHABET?.consonants || []).map((l) => (
                <motion.div
                  key={l.char}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 flex flex-col items-center gap-3 group transition-shadow hover:shadow-md cursor-pointer"
                  onClick={() => speak(l.char, l.name)}
                >
                  <span className="text-5xl font-bold text-slate-800 drop-shadow-sm">{l.char}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">{l.name}</span>
                  <Volume2 className="h-4 w-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <footer className="mt-auto py-8">
        <Link href="/">
          <Button variant="link" className="text-slate-400 hover:text-sky-500 transition-colors gap-2">
            <HomeIcon className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </footer>
    </div>
  );
}
