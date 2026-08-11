import { useMemo, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Languages, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";


type WordItem = {
  english: string;
  transliteration: string;
  translation: string;
  chunks: string[];
};

type SentenceItem = {
  english: string;
  transliteration: string;
  translation: string;
  chunks: string[];
};

type StoryItem = {
  title: string;
  english: string[];
  transliteration: string[];
  translation: string[];
};

const WORDS: WordItem[] = [
  { english: "mango", transliteration: "మ్యాంగో", translation: "మామిడి పండు", chunks: ["మ్యా", "ం", "గో"] },
  { english: "apple", transliteration: "యాపిల్", translation: "ఆపిల్ పండు", chunks: ["యా", "పి", "ల్"] },
  { english: "school", transliteration: "స్కూల్", translation: "పాఠశాల", chunks: ["స్కూ", "ల్"] },
  { english: "book", transliteration: "బుక్", translation: "పుస్తకం", chunks: ["బు", "క్"] },
  { english: "water", transliteration: "వాటర్", translation: "నీరు", chunks: ["వా", "టర్"] },
  { english: "banana", transliteration: "బనానా", translation: "అరటి పండు", chunks: ["బ", "నా", "నా"] },
  { english: "mother", transliteration: "మదర్", translation: "అమ్మ", chunks: ["మ", "దర్"] },
  { english: "teacher", transliteration: "టీచర్", translation: "ఉపాధ్యాయుడు / ఉపాధ్యాయురాలు", chunks: ["టీ", "చర్"] },
];

const SENTENCES: SentenceItem[] = [
  { english: "I am going to school.", transliteration: "ఐ యామ్ గోయింగ్ టు స్కూల్.", translation: "నేను పాఠశాలకు వెళ్తున్నాను.", chunks: ["ఐ", "యామ్", "గోయింగ్", "టు", "స్కూల్."] },
  { english: "This is my book.", transliteration: "దిస్ ఈజ్ మై బుక్.", translation: "ఇది నా పుస్తకం.", chunks: ["దిస్", "ఈజ్", "మై", "బుక్."] },
  { english: "The mango is sweet.", transliteration: "ద మాంగో ఈజ్ స్వీట్.", translation: "మామిడి పండు తియ్యగా ఉంది.", chunks: ["ద", "మాంగో", "ఈజ్", "స్వీట్."] },
  { english: "My mother is at home.", transliteration: "మై మదర్ ఈజ్ అట్ హోమ్.", translation: "నా అమ్మ ఇంట్లో ఉంది.", chunks: ["మై", "మదర్", "ఈజ్", "అట్", "హోమ్."] },
];

const STORIES: StoryItem[] = [
  {
    title: "My Little Mango",
    english: [
      "I have a little mango tree.",
      "The tree has many green mangoes.",
      "I water the tree every day.",
      "One day, a mango becomes yellow and sweet.",
    ],
    transliteration: [
      "ఐ హ్యావ్ ఎ లిటిల్ మ్యాంగో ట్రీ.",
      "ద ట్రీ హ్యాజ్ మెనీ గ్రీన్ మ్యాంగోస్.",
      "ఐ వాటర్ ద ట్రీ ఎవ్రీ డే.",
      "వన్ డే, ఎ మ్యాంగో బికమ్స్ ఎల్లో అండ్ స్వీట్.",
    ],
    translation: [
      "నా దగ్గర ఒక చిన్న మామిడి చెట్టు ఉంది.",
      "ఆ చెట్టుకు చాలా పచ్చి మామిడి పండ్లు ఉన్నాయి.",
      "నేను ప్రతిరోజూ ఆ చెట్టుకు నీళ్లు పోస్తాను.",
      "ఒక రోజు, ఒక మామిడి పండు పసుపు రంగులోకి మారి తియ్యగా అవుతుంది.",
    ],
  },
  {
    title: "A Day at School",
    english: [
      "I go to school in the morning.",
      "I learn Telugu letters with my teacher.",
      "I read words and sentences with my friends.",
      "I come home happily in the evening.",
    ],
    transliteration: [
      "ఐ గో టు స్కూల్ ఇన్ ద మార్నింగ్.",
      "ఐ లర్న్ తెలుగు లెటర్స్ విత్ మై టీచర్.",
      "ఐ రీడ్ వర్డ్స్ అండ్ సెంటెన్సెస్ విత్ మై ఫ్రెండ్స్.",
      "ఐ కమ్ హోమ్ హ్యాపిలీ ఇన్ ద ఈవెనింగ్.",
    ],
    translation: [
      "నేను ఉదయం పాఠశాలకు వెళ్తాను.",
      "నేను నా ఉపాధ్యాయుడితో తెలుగు అక్షరాలు నేర్చుకుంటాను.",
      "నేను నా స్నేహితులతో పదాలు మరియు వాక్యాలు చదువుతాను.",
      "నేను సాయంత్రం సంతోషంగా ఇంటికి వస్తాను.",
    ],
  },
];

function speak(text: string, lang: "en-US" | "te-IN") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.78;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang === lang || v.lang.startsWith(lang.split("-")[0]));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function Transliteration() {
  const [section, setSection] = useState<"words" | "sentences" | "stories">("words");
  const [practice, setPractice] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [wordAnswer, setWordAnswer] = useState<string[]>([]);
  const [wordPool, setWordPool] = useState<string[]>(shuffle(WORDS[0].chunks));
  const [sentenceAnswer, setSentenceAnswer] = useState<string[]>([]);
  const [sentencePool, setSentencePool] = useState<string[]>(shuffle(SENTENCES[0].chunks));
  const [showTranslation, setShowTranslation] = useState(true);
  const [storyLine, setStoryLine] = useState(0);

  const word = WORDS[wordIndex];
  const sentence = SENTENCES[sentenceIndex];
  const story = STORIES[storyIndex];

  const wordComplete = wordAnswer.join("") === word.transliteration;
  const sentenceComplete = sentenceAnswer.join(" ") === sentence.chunks.join(" ");

  const selectSection = (next: typeof section) => {
    setSection(next);
    setPractice(false);
    setShowTranslation(true);
  };

  const nextWord = () => {
    const next = (wordIndex + 1) % WORDS.length;
    setWordIndex(next);
    setWordAnswer([]);
    setWordPool(shuffle(WORDS[next].chunks));
  };

  const nextSentence = () => {
    const next = (sentenceIndex + 1) % SENTENCES.length;
    setSentenceIndex(next);
    setSentenceAnswer([]);
    setSentencePool(shuffle(SENTENCES[next].chunks));
  };

  const dragWord = (chunk: string) => {
    setWordPool((items) => items.filter((x, i) => !(x === chunk && i === items.indexOf(chunk))));
    setWordAnswer((items) => [...items, chunk]);
  };

  const removeWord = (index: number) => {
    const [chunk] = wordAnswer.slice(index, index + 1);
    setWordAnswer((items) => items.filter((_, i) => i !== index));
    setWordPool((items) => [...items, chunk]);
  };

  const dragSentence = (chunk: string) => {
    setSentencePool((items) => items.filter((x, i) => !(x === chunk && i === items.indexOf(chunk))));
    setSentenceAnswer((items) => [...items, chunk]);
  };

  const removeSentence = (index: number) => {
    const [chunk] = sentenceAnswer.slice(index, index + 1);
    setSentenceAnswer((items) => items.filter((_, i) => i !== index));
    setSentencePool((items) => [...items, chunk]);
  };

  const resetPractice = () => {
    if (section === "words") {
      setWordAnswer([]);
      setWordPool(shuffle(word.chunks));
    } else if (section === "sentences") {
      setSentenceAnswer([]);
      setSentencePool(shuffle(sentence.chunks));
    }
  };

  const practiceLabel = useMemo(() => {
    if (section === "words") return "Word Practice";
    if (section === "sentences") return "Sentence Practice";
    return "Story Reading Practice";
  }, [section]);

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-8 font-sans">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white bg-white/85 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Languages className="h-7 w-7" />
              <h1 className="text-2xl font-bold md:text-3xl">Telugu Transliteration & Translation</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Learn Telugu through English words, sentences and stories.</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-full">Back to Telugu World</Button>
          </Link>
        </header>

        <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl bg-white/70 p-2 shadow-sm">
          {(["words", "sentences", "stories"] as const).map((item) => (
            <button
              key={item}
              onClick={() => selectSection(item)}
              className={`rounded-xl px-3 py-3 text-sm font-bold capitalize transition-all md:text-base ${section === item ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-primary/10"}`}
            >
              {item}
            </button>
          ))}
        </div>

        {!practice && section === "words" && (
          <section className="rounded-3xl border bg-white/80 p-6 shadow-sm md:p-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">English Word</p>
              <h2 className="mt-2 text-5xl font-bold text-primary">{word.english}</h2>
              <button onClick={() => speak(word.english, "en-US")} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-3 font-bold text-primary">
                <Volume2 className="h-5 w-5" /> Hear English
              </button>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-sky-50 p-5"><p className="text-xs font-bold uppercase text-sky-600">Transliteration</p><p className="mt-2 text-4xl font-bold text-slate-800">{word.transliteration}</p></div>
                <div className="rounded-2xl bg-emerald-50 p-5"><p className="text-xs font-bold uppercase text-emerald-600">Meaning in Telugu</p><p className="mt-2 text-3xl font-bold text-slate-800">{word.translation}</p></div>
              </div>
              <Button className="mt-7 rounded-full px-8" onClick={() => setPractice(true)}>Practice this word</Button>
            </div>
          </section>
        )}

        {!practice && section === "sentences" && (
          <section className="rounded-3xl border bg-white/80 p-6 shadow-sm md:p-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">English Sentence</p>
              <h2 className="mt-3 text-2xl font-bold md:text-4xl">{sentence.english}</h2>
              <button onClick={() => speak(sentence.english, "en-US")} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-3 font-bold text-primary"><Volume2 className="h-5 w-5" /> Hear English</button>
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-sky-50 p-5"><p className="text-xs font-bold uppercase text-sky-600">Telugu Transliteration</p><p className="mt-2 text-2xl font-bold">{sentence.transliteration}</p></div>
                {showTranslation && <div className="rounded-2xl bg-emerald-50 p-5"><p className="text-xs font-bold uppercase text-emerald-600">Telugu Translation</p><p className="mt-2 text-2xl font-bold">{sentence.translation}</p></div>}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3"><Button variant="outline" className="rounded-full" onClick={() => setShowTranslation(!showTranslation)}>{showTranslation ? "Hide Translation" : "Show Translation"}</Button><Button className="rounded-full" onClick={() => setPractice(true)}>Practice this sentence</Button></div>
            </div>
          </section>
        )}

        {!practice && section === "stories" && (
          <section className="rounded-3xl border bg-white/80 p-6 shadow-sm md:p-10">
            <div className="flex items-center gap-3"><BookOpen className="h-8 w-8 text-primary" /><h2 className="text-3xl font-bold">{story.title}</h2></div>
            <div className="mt-6 space-y-5">
              {story.english.map((line, i) => <div key={line} className="rounded-2xl border bg-white p-5"><p className="font-bold text-lg">{line}</p><p className="mt-2 text-lg text-sky-700">{story.transliteration[i]}</p>{showTranslation && <p className="mt-2 text-lg text-emerald-700">{story.translation[i]}</p>}<button onClick={() => speak(line, "en-US")} className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary"><Volume2 className="h-4 w-4" /> Hear English</button></div>)}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><Button variant="outline" className="rounded-full" onClick={() => setShowTranslation(!showTranslation)}>{showTranslation ? "Hide Translation" : "Show Translation"}</Button><Button className="rounded-full" onClick={() => { setPractice(true); setStoryLine(0); }}>Start story reading practice</Button></div>
          </section>
        )}

        {practice && section === "words" && (
          <section className="rounded-3xl border bg-white/80 p-6 shadow-sm md:p-10">
            <div className="flex items-center justify-between gap-3"><Button variant="outline" className="rounded-full" onClick={() => setPractice(false)}>← Learn</Button><span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">Word Practice</span><Button variant="ghost" onClick={resetPractice}>Reset</Button></div>
            <div className="mt-8 text-center"><p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Listen in English and build the Telugu sound</p><h2 className="mt-3 text-5xl font-bold">{word.english}</h2><button onClick={() => speak(word.english, "en-US")} className="mt-3 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground"><Volume2 className="mr-2 inline h-5 w-5" /> English only</button></div>
            <div className="mt-8 min-h-20 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 p-4 text-center"><div className="flex min-h-12 flex-wrap justify-center gap-2">{wordAnswer.map((chunk, i) => <button key={`${chunk}-${i}`} onClick={() => removeWord(i)} className="rounded-xl bg-white px-4 py-2 text-2xl font-bold shadow-sm">{chunk}</button>)}</div>{wordComplete && <p className="mt-3 font-bold text-green-600"><Check className="mr-1 inline h-5 w-5" /> Correct! {word.transliteration}</p>}</div>
            <p className="mt-5 text-center text-sm font-bold text-muted-foreground">Drag/tap the Telugu pieces in the correct order</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">{wordPool.map((chunk, i) => <button draggable key={`${chunk}-${i}`} onDragEnd={() => dragWord(chunk)} onClick={() => dragWord(chunk)} className="rounded-2xl bg-white px-5 py-3 text-2xl font-bold shadow-md hover:-translate-y-1">{chunk}</button>)}</div>
            <div className="mt-8 flex justify-center"><Button className="rounded-full" onClick={nextWord}>Next word <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
          </section>
        )}

        {practice && section === "sentences" && (
          <section className="rounded-3xl border bg-white/80 p-6 shadow-sm md:p-10">
            <div className="flex items-center justify-between gap-3"><Button variant="outline" className="rounded-full" onClick={() => setPractice(false)}>← Learn</Button><span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">Sentence Practice</span><Button variant="ghost" onClick={resetPractice}>Reset</Button></div>
            <div className="mt-8 text-center"><p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Build the Telugu sentence</p><h2 className="mt-3 text-2xl font-bold md:text-3xl">{sentence.english}</h2><button onClick={() => speak(sentence.english, "en-US")} className="mt-3 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground"><Volume2 className="mr-2 inline h-5 w-5" /> English only</button></div>
            <div className="mt-8 min-h-24 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 p-4"><div className="flex min-h-12 flex-wrap justify-center gap-2">{sentenceAnswer.map((chunk, i) => <button key={`${chunk}-${i}`} onClick={() => removeSentence(i)} className="rounded-xl bg-white px-4 py-2 text-lg font-bold shadow-sm">{chunk}</button>)}</div>{sentenceComplete && <p className="mt-3 text-center font-bold text-green-600"><Check className="mr-1 inline h-5 w-5" /> Correct sentence!</p>}</div>
            <p className="mt-5 text-center text-sm font-bold text-muted-foreground">Drag/tap the Telugu sound words into the correct order</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">{sentencePool.map((chunk, i) => <button draggable key={`${chunk}-${i}`} onDragEnd={() => dragSentence(chunk)} onClick={() => dragSentence(chunk)} className="rounded-2xl bg-white px-4 py-3 text-lg font-bold shadow-md">{chunk}</button>)}</div>
            <div className="mt-8 flex justify-center"><Button className="rounded-full" onClick={nextSentence}>Next sentence <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
          </section>
        )}

        {practice && section === "stories" && (
          <section className="rounded-3xl border bg-white/80 p-6 shadow-sm md:p-10">
            <div className="flex items-center justify-between gap-3"><Button variant="outline" className="rounded-full" onClick={() => setPractice(false)}>← Story</Button><span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">Story Reading Practice</span></div>
            <div className="mt-8 text-center"><BookOpen className="mx-auto h-10 w-10 text-primary" /><h2 className="mt-2 text-3xl font-bold">{story.title}</h2><p className="mt-2 text-muted-foreground">Read one line at a time. Listen in English, then read the Telugu sounds.</p></div>
            <div className="mt-8 rounded-3xl bg-sky-50 p-6 text-center"><p className="text-xl font-bold">{story.english[storyLine]}</p><button onClick={() => speak(story.english[storyLine], "en-US")} className="mt-4 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground"><Volume2 className="mr-2 inline h-5 w-5" /> Hear English</button><p className="mt-6 text-2xl font-bold text-sky-700">{story.transliteration[storyLine]}</p>{showTranslation && <p className="mt-3 text-xl text-emerald-700">{story.translation[storyLine]}</p>}</div>
            <div className="mt-6 flex items-center justify-center gap-3"><Button variant="outline" className="rounded-full" disabled={storyLine === 0} onClick={() => setStoryLine((x) => Math.max(0, x - 1))}><ChevronLeft className="h-4 w-4" /> Previous</Button><span className="rounded-full bg-muted px-4 py-2 text-sm font-bold">{storyLine + 1} / {story.english.length}</span><Button className="rounded-full" disabled={storyLine === story.english.length - 1} onClick={() => setStoryLine((x) => Math.min(story.english.length - 1, x + 1))}>Next <ChevronRight className="h-4 w-4" /></Button></div>
            <div className="mt-5 flex justify-center"><Button variant="ghost" onClick={() => setShowTranslation(!showTranslation)}>{showTranslation ? "Hide Translation" : "Show Translation"}</Button></div>
          </section>
        )}
      </div>
    </div>
  );
}
