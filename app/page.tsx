"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Plane, Stars, Music, Volume2, VolumeX, X, Minimize2, Maximize2 } from "lucide-react";
import confetti from "canvas-confetti";

// --- Components ---

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: "easeOut" }}
    // FIX: Use min-h-[100dvh] for mobile browsers to handle address bars correctly
    className={`min-h-[100dvh] flex flex-col items-center justify-center p-6 relative ${className}`}
  >
    {children}
  </motion.section>
);

// 1. INTERACTIVE: Flip Card for Memories
const FlipCard = ({ image, date, caption, index }: { image: string, date: string, caption: string, index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <div className="h-96 w-full cursor-pointer group perspective-1000" onClick={handleFlip}>
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setIsAnimating(false)}
        className="w-full h-full relative preserve-3d shadow-xl rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT: The "Cover" */}
        <div className="absolute inset-0 backface-hidden bg-white border-4 border-rose-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20">
          <Heart className="w-12 h-12 text-rose-300 mb-4 animate-pulse" />
          <h3 className="font-playfair text-2xl font-bold text-slate-700">Memory #{index}</h3>
          <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest">Tap to reveal</p>
        </div>

        {/* BACK: The Photo */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border-4 border-white bg-slate-200"
          style={{ transform: "rotateY(180deg)" }}
        >
          <img 
            src={image} 
            alt="Memory" 
            className="w-full h-full object-cover"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <p className="font-bold text-lg">{date}</p>
            <p className="text-sm opacity-90">{caption}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// 2. INTERACTIVE: Draggable Plane Slider
const DistanceSlider = () => {
  const [arrived, setArrived] = useState(false);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 150) { 
      setArrived(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-full h-16 relative shadow-inner border border-rose-100 flex items-center px-2 mt-8 overflow-hidden touch-none">
      <motion.div 
        className="absolute left-0 top-0 bottom-0 bg-rose-200" 
        style={{ width: x, opacity: 0.5 }} 
      />
      
      {!arrived ? (
        <motion.div 
          ref={constraintsRef} 
          className="w-full h-full flex items-center relative z-10"
        >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 250 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              style={{ x }}
              className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg text-white"
            >
              <Plane className="w-6 h-6 rotate-90" />
            </motion.div>
            <p className="ml-4 text-slate-400 text-sm font-medium animate-pulse pointer-events-none select-none">
              Drag plane to close the distance &rarr;
            </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="w-full flex items-center justify-center text-rose-600 font-bold text-lg z-10"
        >
          <MapPin className="w-5 h-5 mr-2" />
          <span>Distance Closed!</span>
        </motion.div>
      )}
    </div>
  );
}

// 3. PLAYFUL: Runaway Button
const RunawayButton = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const moveButton = () => {
    const x = Math.random() * 150 - 75; // Reduced range for mobile so it stays visible
    const y = Math.random() * 150 - 75;
    setPosition({ x, y });
  };

  return (
    <motion.button
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 10 }} // Added spring for smoother movement
      onHoverStart={moveButton}
      onClick={moveButton}
      // FIX: Changed 'absolute' to 'relative' so it sits BELOW the Yes button by default
      className="bg-slate-300 text-slate-600 px-10 py-4 rounded-full font-bold text-xl relative hover:bg-slate-400 transition-colors z-10"
    >
      No 😢
    </motion.button>
  );
};

const TimeCounter = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const startDate = new Date("2020-12-07T00:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTime({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-12 w-full max-w-4xl">
      {[
        { label: "Days", value: time.days },
        { label: "Hours", value: time.hours },
        { label: "Minutes", value: time.minutes },
        { label: "Seconds", value: time.seconds },
      ].map((item) => (
        <div key={item.label} className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300">
          <span className="block text-4xl md:text-6xl font-playfair font-bold text-rose-700 tabular-nums">
            {item.value}
          </span>
          <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-rose-900/60 font-semibold mt-2 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// --- NEW COMPONENT: The "Tap to Open" Screen ---
const IntroOverlay = ({ onStart }: { onStart: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-rose-50 flex flex-col items-center justify-center p-4 text-center cursor-pointer"
      onClick={onStart}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Heart className="w-24 h-24 text-rose-500 fill-rose-500 mb-8 mx-auto shadow-rose-200 drop-shadow-xl" />
        <h1 className="font-playfair text-4xl md:text-5xl text-slate-800 mb-6 font-bold">For Dabne</h1>
        <div className="flex items-center justify-center gap-2 text-rose-400 animate-pulse">
          <Music size={20} />
          <p className="uppercase tracking-widest text-sm font-semibold">Tap anywhere to open</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- UPDATED: Music Player with Minimize Feature ---
const MusicPlayer = ({ playing, onToggle }: { playing: boolean; onToggle: () => void }) => {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Main Music Button */}
      {!minimized && (
        <button 
          onClick={onToggle}
          className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-rose-600 hover:bg-rose-50 transition-all group border border-rose-100 flex items-center gap-2 pr-4"
        >
          {playing ? <Volume2 className="animate-pulse" size={20} /> : <VolumeX size={20} />}
          <span className="text-xs font-semibold hidden md:inline">{playing ? "Playing Our Song" : "Paused"}</span>
        </button>
      )}

      {/* Minimize/Maximize Controls */}
      <button 
        onClick={() => setMinimized(!minimized)}
        className="bg-white/60 backdrop-blur-sm p-2 rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-all"
        aria-label={minimized ? "Show Music Player" : "Hide Music Player"}
      >
        {minimized ? <Music size={16} /> : <Minimize2 size={16} />}
      </button>
    </div>
  );
};

// --- UPDATED: Home Component ---
export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(e => console.log("Audio play failed", e));
    }
    setStarted(true);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleYes = () => {
    setAccepted(true);
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    // FIX: Removed overflow-x-hidden from main and used min-h-screen to fix mobile scrolling
    <main className="min-h-screen w-full bg-[#fff0f3] text-slate-800 font-inter selection:bg-rose-200 cursor-default">
      
      <audio ref={audioRef} loop>
        <source src="/diewithasmile.mp3" type="audio/mpeg" />
      </audio>

      <MusicPlayer playing={playing} onToggle={togglePlay} />

      <AnimatePresence>
        {!started && <IntroOverlay onStart={handleStart} />}
      </AnimatePresence>

      {started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full overflow-hidden" // Handle overflow here instead
        >
          {/* 1. HERO SECTION */}
          <Section className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-200 via-rose-50 to-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 rounded-full"></div>
              <Heart className="w-24 h-24 text-rose-600 fill-rose-500 drop-shadow-2xl relative z-10" />
            </motion.div>
            
            <h1 className="font-playfair text-6xl md:text-9xl text-center mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-900 drop-shadow-sm px-4">
              Nathaniel <span className="text-rose-400 font-light">&</span> Dabne
            </h1>
            
            <p className="text-lg md:text-2xl font-light tracking-widest text-slate-600 uppercase mb-12">
              Est. December 07, 2020
            </p>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1, y: [0, 10, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 flex flex-col items-center gap-2 text-rose-400 opacity-60"
            >
              <span className="text-xs tracking-widest uppercase">Scroll to begin</span>
              <MapPin size={16} />
            </motion.div>
          </Section>

          {/* 2. THE TIMELINE */}
          <Section className="bg-white relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fff0f3] to-transparent"></div>
            <h2 className="font-playfair text-4xl md:text-6xl mb-8 text-center text-slate-800">
              The Longest Wait
            </h2>
            <p className="text-center max-w-2xl text-lg md:text-xl mb-12 leading-relaxed text-slate-600 px-4">
              They say time flies when you're having fun, but time stands still when you miss the one you love. 
              <br /><br />
              Since <span className="font-bold text-rose-600">December 07, 2020</span>, I have measured my life not in years, but in the moments until I see you again.
            </p>
            <TimeCounter />
          </Section>

          {/* 3. INTERACTIVE: THE STRUGGLE */}
          <Section className="bg-rose-50">
            <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto px-4">
              <div className="flex-1 space-y-8 text-left">
                <h2 className="font-playfair text-5xl md:text-7xl leading-tight text-slate-900">
                  Against <br/> <span className="text-rose-600 italic">The World</span>
                </h2>
                <div className="h-1 w-20 bg-rose-400"></div>
                
                <p className="text-lg md:text-xl leading-relaxed text-slate-700 font-light">
                  We have fought battles most couples never see. The distance, the time zones, the endless paperwork... 
                  But darling, <strong className="font-semibold text-rose-700">We are still here.</strong>
                </p>

                <DistanceSlider />
              </div>

              <div className="flex-1 relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-rose-200 rounded-[2rem] rotate-6 opacity-50"></div>
                <div className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white">
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center relative group">
                      <img 
                      src="/us-against-the-world.jpg" 
                      alt="Us" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                      <span className="text-slate-400 absolute px-4 text-center"></span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 4. FLIP GALLERY */}
          <Section className="bg-white">
            <h2 className="font-playfair text-4xl md:text-5xl mb-4 text-center">
              Glimpses of Forever
            </h2>
            <p className="text-slate-500 mb-12 italic">Tap the cards to reveal our memories</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
              <FlipCard 
                index={1}
                image="/memory-1.jpg" 
                date="First Time Together" 
                caption="First time we're together at winford." 
              />
              <FlipCard 
                index={2}
                image="/memory-2.jpg" 
                date="The Tough Times" 
                caption="Even miles apart, you were right there with me." 
              />
              <FlipCard 
                index={3}
                image="/memory-3.jpg" 
                date="The Future" 
                caption="Soon, this won't be temporary. It will be forever" 
              />
            </div>
            
            <p className="mt-16 text-center text-xl font-playfair italic text-rose-400">
              "I'd wait a hundred lifetimes just to spend one with you."
            </p>
          </Section>

          {/* 5. THE ASK */}
          <Section className="bg-rose-600 text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {!accepted ? (
              <div className="text-center space-y-8 z-10 relative max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="font-playfair text-5xl md:text-8xl mb-8 leading-tight">
                    My Dearest Dabne,
                  </h2>
                  <p className="text-xl md:text-3xl font-light mb-12 leading-relaxed opacity-90">
                    We are almost at the finish line. The visa is coming. The distance is ending. 
                    But today, I want to ask about <span className="font-bold italic">Us</span>.
                  </p>
                </motion.div>
                
                <div className="bg-white/10 backdrop-blur-lg p-8 md:p-12 rounded-[3rem] border border-white/20 shadow-2xl">
                  <h3 className="text-3xl md:text-5xl font-playfair font-bold mb-12 drop-shadow-md">
                    Will you be my Valentine?
                  </h3>
                  
                  {/* FIX: Added gap-8 and removed fixed height so buttons stack cleanly */}
                  <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full relative z-20">
                    <button
                      onClick={handleYes}
                      className="bg-white text-rose-600 px-12 py-5 rounded-full font-bold text-2xl hover:bg-rose-50 transition-all hover:scale-110 shadow-xl active:scale-95 z-30 whitespace-nowrap"
                    >
                      YES! ❤️
                    </button>

                    {/* The Tricky No Button */}
                    <RunawayButton />
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center z-10 max-w-4xl px-4 mx-auto"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 20px #fff)", "drop-shadow(0 0 0px #fff)"]
                  }} 
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mb-8 inline-block"
                >
                  <Heart className="w-24 h-24 md:w-32 md:h-32 text-rose-200 fill-rose-600 drop-shadow-2xl" />
                </motion.div>
                
                <h2 className="font-playfair text-5xl md:text-8xl mb-8 font-bold leading-tight drop-shadow-lg">
                  You are my <br/>
                  <span className="text-rose-200 italic">Forever Valentine</span>
                </h2>
                
                <div className="space-y-8 text-xl md:text-3xl font-light leading-relaxed opacity-90">
                  <p>
                    The miles between us mean nothing compared to the love within us.
                  </p>
                  <p>
                    The wait is just time.<br/>
                    But <strong className="font-bold text-white">You?</strong> You are my destiny.
                  </p>
                  <div className="w-24 h-1 bg-white/50 mx-auto rounded-full my-8"></div>
                  <p className="font-playfair text-2xl md:text-4xl italic">
                    "I will love you until the distance closes,<br/> 
                    and for every lifetime after that."
                  </p>
                </div>
                
                <div className="mt-16 animate-pulse text-rose-200">
                  <Stars className="w-12 h-12 mx-auto" />
                  <p className="text-sm mt-2 uppercase tracking-widest">See you soon, mi amore.</p>
                </div>
              </motion.div>
            )}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <BackgroundHeart key={i} />
              ))}
            </div>
          </Section>
        </motion.div>
      )}
    </main>
  );
}

// 4. INTERACTIVE: Clickable Background Hearts
const BackgroundHeart = () => {
  const [popped, setPopped] = useState(false);
  
  const randomDuration = Math.random() * 10 + 15;
  const randomDelay = Math.random() * 10;
  const randomX = Math.random() * 100;

  if (popped) return null;

  return (
    <motion.div
      initial={{ y: "100vh", x: `${randomX}vw`, opacity: 0 }}
      animate={{ 
        y: "-100vh", 
        opacity: [0, 1, 0],
        rotate: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5
      }}
      transition={{ 
        duration: randomDuration, 
        repeat: Infinity,
        delay: randomDelay,
        ease: "linear"
      }}
      onClick={() => {
        setPopped(true);
        confetti({ 
          particleCount: 20, 
          spread: 30, 
          origin: { x: randomX / 100, y: Math.random() },
          colors: ['#ffe4e6', '#f43f5e'] 
        });
      }}
      className="absolute cursor-pointer hover:scale-125 transition-transform pointer-events-auto"
    >
      <Heart className={`w-12 h-12 text-white/20 fill-white/20 hover:text-white/40`} />
    </motion.div>
  );
};