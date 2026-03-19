import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import confetti from "canvas-confetti";
import { Volume2, Trophy, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { LEVELS_DATA, Level, WordData, getRandomWord, generateDistractorLetters } from "@/lib/telugu-data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface LetterItem {
  id: string;
  letter: string;
}

export default function Home() {
  const [level, setLevel] = useState<Level>(1);
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [poolItems, setPoolItems] = useState<LetterItem[]>([]);
  const [answerItems, setAnswerItems] = useState<LetterItem[]>([]);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mode, setMode] = useState<'game' | 'reveal'>('game');
  const [isListening, setIsListening] = useState(false);
  const [recognizedWord, setRecognizedWord] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);

  // Speech function
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'te-IN'; // Telugu India
    utterance.rate = 0.8; // Slightly slower for learning
    
    // Try to find a specific Telugu voice if available
    const voices = window.speechSynthesis.getVoices();
    const teluguVoice = voices.find(v => v.lang === 'te-IN' || v.lang.includes('te'));
    if (teluguVoice) {
      utterance.voice = teluguVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const loadNewWord = useCallback((newLevel: Level = level) => {
    const wordData = getRandomWord(newLevel, currentWord?.id);
    setCurrentWord(wordData);
    setIsSuccess(false);
    
    const distractors = generateDistractorLetters(wordData.letters, 3);
    const allLetters = [...wordData.letters, ...distractors];
    
    // Shuffle and map to items
    const shuffled = allLetters.sort(() => 0.5 - Math.random()).map((l, index) => ({
      id: `pool-${Date.now()}-${index}-${l}`, // Ensure unique IDs on reload
      letter: l
    }));
    
    setPoolItems(shuffled);
    setAnswerItems([]);
  }, [level, currentWord]);

  // Load voices early to ensure they are available
  useEffect(() => {
    const loadVoices = () => { window.speechSynthesis.getVoices(); };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNewWord(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Success effect removed from here and moved after handleDragEnd to fix disappearing tiles
  
  const handleLevelChange = (newLevel: Level) => {
    if (level === newLevel) return;
    setLevel(newLevel);
    loadNewWord(newLevel);
    setScore(0); // Reset score on level change
  };

  const handleNextWord = () => {
    setScore(prev => prev + 10);
    loadNewWord();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || isSuccess) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const items = source.droppableId === 'pool' ? Array.from(poolItems) : Array.from(answerItems);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === 'pool') {
        setPoolItems(items);
      } else {
        setAnswerItems(items);
      }
    } else {
      // Moving between lists
      const sourceItems = source.droppableId === 'pool' ? Array.from(poolItems) : Array.from(answerItems);
      const destItems = destination.droppableId === 'pool' ? Array.from(poolItems) : Array.from(answerItems);
      
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);
      
      // Speak the letter when moved
      speak(movedItem.letter);

      if (source.droppableId === 'pool') {
        setPoolItems(sourceItems);
        setAnswerItems(destItems);
      } else {
        setAnswerItems(sourceItems);
        setPoolItems(destItems);
      }
    }
  };

  // Check success whenever answerItems changes (even after drag or click)
  useEffect(() => {
    if (!currentWord || answerItems.length === 0 || isSuccess) return;
    
    const formedWord = answerItems.map(item => item.letter).join('');
    if (formedWord === currentWord.word) {
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF1493', '#FFD700', '#00BFFF', '#00FF00']
      });
      setTimeout(() => speak(currentWord.word), 500); 
    }
  }, [answerItems, currentWord, speak, isSuccess]);

  // Support click-to-move for accessibility and ease on mobile
  const handleItemClick = (item: LetterItem, sourceList: 'pool' | 'answer') => {
    if (isSuccess) return;
    
    speak(item.letter);
    
    if (sourceList === 'pool') {
      setPoolItems(prev => prev.filter(i => i.id !== item.id));
      setAnswerItems(prev => [...prev, item]);
    } else {
      setAnswerItems(prev => prev.filter(i => i.id !== item.id));
      setPoolItems(prev => [...prev, item]);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'te-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    setIsListening(true);
    recognition.start();
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().replace(/\s/g, '');
      setRecognizedWord(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
      setRecognizedWord('');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const nextWordInReveal = () => {
    setRecognizedWord(null);
    setShowTranslation(true);
    loadNewWord();
  };

  if (!currentWord) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center selection:bg-transparent">
      {/* Header & Controls */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white relative z-10">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">Telugu Explorer</h1>
        </div>
        
        <div className="flex flex-col items-center gap-3 w-full md:w-auto">
          <div className="flex flex-wrap justify-center items-center gap-2 bg-secondary/20 p-2 rounded-2xl md:rounded-full">
            {[1, 2, 3, 4, 'verbs'].map((l) => (
              <button
                key={l}
                data-testid={`btn-level-${l}`}
                onClick={() => { handleLevelChange(l as Level); setMode('game'); }}
                className={`px-4 py-2 rounded-xl md:rounded-full font-bold text-sm md:text-base transition-all capitalize ${
                  level === l && mode === 'game'
                    ? 'bg-secondary text-secondary-foreground shadow-md scale-105' 
                    : 'text-muted-foreground hover:bg-white/50'
                }`}
              >
                {typeof l === 'number' ? `Lvl ${l}` : l}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setMode(mode === 'game' ? 'reveal' : 'game'); setRecognizedWord(null); }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              mode === 'reveal'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {mode === 'game' ? 'Word Reveal' : 'Game Mode'}
          </button>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/letters">
            <Button variant="outline" className="rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/5 flex">
              <BookOpen className="w-4 h-4" />
              <span className="hidden xs:inline">Letters</span>
              <span className="xs:hidden">ABC</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-accent/10 px-4 md:px-6 py-2 rounded-full text-accent-foreground font-bold shadow-inner">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            <span className="text-xl md:text-2xl text-accent" data-testid="text-score">{score}</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center gap-6">
        
        {mode === 'game' ? (
          <>
            {/* Word Clue */}
            <div className="text-center space-y-2 bg-white/60 p-6 rounded-3xl w-full shadow-sm border border-white backdrop-blur-sm">
              <h2 className="text-lg md:text-xl font-medium text-muted-foreground uppercase tracking-widest">Meaning</h2>
              <div className="text-3xl md:text-5xl font-bold text-primary capitalize flex items-center justify-center gap-4 flex-wrap">
                {currentWord.englishMeaning}
                <button 
                  onClick={() => speak(currentWord.word)}
                  className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all"
                  title="Hear the word"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
              </div>
              {/* Level indicator for parents/teachers */}
              <div className="mt-4 inline-block bg-muted px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground">
                {level === 1 && "Level 1: Simple Words (No Vathulu)"}
                {level === 2 && "Level 2: Words with Achu Vathulu"}
                {level === 3 && "Level 3: Words with Hallu Vathulu"}
                {level === 4 && "Level 4: Mixed & Complex Words"}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Word Reveal Mode */}
            <div className="text-center space-y-4 bg-white/60 p-6 rounded-3xl w-full shadow-sm border border-white backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-medium text-purple-600 uppercase tracking-widest">Speak the Word</h2>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    showTranslation
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {showTranslation ? 'Hide Translation' : 'Show Translation'}
                </button>
              </div>
              
              {showTranslation && (
                <div className="text-lg md:text-xl font-bold text-purple-700 bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                  📚 English: {currentWord.englishMeaning}
                </div>
              )}
              
              <button
                onClick={startListening}
                disabled={isListening}
                className={`w-full py-6 rounded-2xl font-bold text-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isListening ? '🎤 Listening...' : '🎤 Click to Speak'}
              </button>
              
              {recognizedWord && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="text-4xl font-bold text-purple-700">{recognizedWord}</div>
                  
                  {recognizedWord === currentWord.word && (
                    <>
                      <div className="bg-green-100 p-4 rounded-2xl text-green-800 font-bold text-lg">
                        ✓ Correct!
                      </div>
                      <div className="space-y-3 text-left bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200">
                        <div className="text-center mb-3">
                          <div className="text-3xl font-bold text-emerald-700">{currentWord.word}</div>
                          <div className="text-lg font-semibold text-emerald-600 mt-2">= {currentWord.englishMeaning}</div>
                        </div>
                      </div>
                      <div className="space-y-3 text-left bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl">
                        <div className="font-bold text-purple-800 text-lg mb-2">Word Breakdown:</div>
                        <div className="text-sm space-y-2">
                          {currentWord.word.split('').map((char, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-purple-700">
                              <span className="font-bold text-lg">{char}</span>
                              <span className="text-xs text-gray-600">(Base letter)</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="font-bold text-purple-800">Formed Word:</div>
                          <div className="text-2xl font-bold text-purple-900 mt-2">{currentWord.word}</div>
                          <div className="text-sm text-purple-600 mt-1">({currentWord.englishMeaning})</div>
                        </div>
                      </div>
                      <Button 
                        onClick={nextWordInReveal}
                        size="lg"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                      >
                        Next Word
                      </Button>
                    </>
                  )}
                  
                  {recognizedWord !== currentWord.word && (
                    <>
                      <div className="bg-red-100 p-4 rounded-2xl text-red-800 font-bold text-lg">
                        ✗ Try Again
                      </div>
                      <button
                        onClick={startListening}
                        className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </>
        )}

        {mode === 'game' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Answer Zone (Droppable) */}
          <div className="w-full mt-4">
            {!isSuccess ? (
              <Droppable droppableId="answer" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[140px] w-full mx-auto rounded-[2rem] p-6 flex flex-wrap justify-center items-center gap-4 transition-all duration-300 ${
                      snapshot.isDraggingOver ? 'bg-primary/10 border-2 border-primary border-dashed scale-[1.02]' : 'bg-white/40 shadow-inner border-2 border-transparent'
                    }`}
                    data-testid="zone-answer"
                  >
                    {answerItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleItemClick(item, 'answer')}
                            className={`
                              relative bg-white w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl flex items-center justify-center
                              text-4xl md:text-5xl lg:text-6xl font-telugu text-primary select-none touch-none tile-shadow cursor-pointer hover:-translate-y-1
                              ${snapshot.isDragging ? 'z-50 scale-110 shadow-2xl rotate-3' : 'transition-transform duration-200'}
                            `}
                            style={provided.draggableProps.style}
                            data-testid={`tile-answer-${item.letter}`}
                          >
                            {item.letter}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {answerItems.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-muted-foreground/60 font-medium text-lg md:text-xl text-center w-full animate-pulse">
                        Drag or tap letters to form the word
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            ) : (
              <div className="min-h-[140px] w-full mx-auto rounded-[2rem] p-6 flex flex-wrap justify-center items-center gap-4 bg-white/40 shadow-inner border-2 border-transparent">
                {answerItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative bg-accent text-white w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl md:text-5xl lg:text-6xl font-telugu select-none tile-shadow-accent shadow-lg"
                    data-testid={`tile-success-${item.letter}`}
                  >
                    {item.letter}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Success Action */}
          <div className="min-h-[96px] flex items-center justify-center w-full my-4">
            <AnimatePresence mode="wait">
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <Button 
                    onClick={handleNextWord}
                    size="lg"
                    className="w-full max-w-md bg-accent hover:bg-accent/90 text-white rounded-full py-8 text-2xl font-bold shadow-[0_8px_0_0_hsl(142,71%,35%)] active:shadow-none active:translate-y-2 transition-all group"
                    data-testid="btn-next-word"
                  >
                    Next Word
                    <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Source Pool (Droppable) */}
          <div className="w-full">
            {!isSuccess ? (
              <Droppable droppableId="pool" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[140px] w-full mx-auto rounded-[2rem] p-6 flex flex-wrap justify-center items-center gap-4 transition-colors bg-secondary/10`}
                    data-testid="zone-pool"
                  >
                    {poolItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleItemClick(item, 'pool')}
                            className={`
                              bg-white w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl flex items-center justify-center
                              text-4xl md:text-5xl lg:text-6xl font-telugu text-foreground select-none touch-none cursor-pointer
                              tile-shadow-secondary hover:-translate-y-1
                              ${snapshot.isDragging ? 'z-50 scale-110 shadow-2xl -rotate-3' : 'transition-transform duration-200'}
                            `}
                            style={provided.draggableProps.style}
                            data-testid={`tile-pool-${item.letter}`}
                          >
                            {item.letter}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ) : (
              <div className="min-h-[140px] w-full mx-auto rounded-[2rem] p-6 flex flex-wrap justify-center items-center gap-4 bg-secondary/5">
                {poolItems.map((item) => (
                  <div key={item.id} className="bg-white/40 w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl md:text-5xl lg:text-6xl font-telugu text-foreground/20 select-none grayscale-[0.5]">
                    {item.letter}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DragDropContext>
        )}

      </main>
    </div>
  );
}
