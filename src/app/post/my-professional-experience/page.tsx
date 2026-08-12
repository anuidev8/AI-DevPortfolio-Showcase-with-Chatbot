'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft, ArrowRight,
  Compass, MessageSquare, HelpCircle, Sparkles,
  Layers,
  UserCheck, HandHeart, Waves,
  ShieldCheck, Zap,
  Brain, Lightbulb, Smartphone, Mic, Workflow,
  Github, ExternalLink, BookOpen, Bot, Image, Target
} from 'lucide-react';
import Link from 'next/link';

// Register GSAP plugins (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProfessionalExperiencePresentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const coverCharacterRef = useRef<HTMLDivElement>(null);
  const coverElementsRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const TOTAL_SLIDES = 8;

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide 0 entrance load animation (runs on first mount)
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });

    tl.set('.cover-title', { opacity: 1 });

    tl.fromTo('.cover-title-line',
      { y: '105%', skewY: 4 },
      { y: '0%', skewY: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out' }
    );

    tl.fromTo('.cover-desc, .cover-subdesc',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.12 },
      '-=0.9'
    );

    tl.fromTo('.cover-block',
      { opacity: 0, y: 25, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' },
      '-=0.8'
    );

    const character = coverCharacterRef.current;
    const elements = coverElementsRef.current;

    if (character) {
      gsap.set(character, { opacity: 0, y: 120 });
      tl.to(character, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power3.out',
      }, '-=0.5');
    }

    if (elements) {
      gsap.set(elements, { opacity: 0, scale: 0.9, y: 30 });
      tl.to(elements, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, '-=0.9');
    }

    const floatTweens: gsap.core.Tween[] = [];

    if (elements) {
      floatTweens.push(
        gsap.to(elements, {
          y: -16,
          duration: 3.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.6,
        }),
        gsap.to(elements, {
          rotation: 0.8,
          duration: 15,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.6,
        }),
        gsap.to(elements, {
          scale: 1.015,
          duration: 14,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2,
        })
      );
    }

    if (character) {
      floatTweens.push(
        gsap.to(character, {
          y: -6,
          duration: 5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2.2,
        })
      );
    }

    return () => {
      floatTweens.forEach(tween => tween.kill());
    };
  }, []);

  // GSAP ScrollTrigger animation setup
  useEffect(() => {
    if (isMobile) {
      // In mobile, we animate items as they enter the viewport using pure GSAP scroll triggers
      const elements = gsap.utils.toArray('.mobile-animate');
      elements.forEach((el: any) => {
        gsap.fromTo(el,
          { opacity: 0, y: 35, skewY: 1 },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
      return;
    }

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const slides = gsap.utils.toArray('.slide-section');
    const totalSlides = slides.length;

    // Horizontal scroll timeline
    const pinTween = gsap.to(wrapper, {
      x: () => -(wrapper.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 0.5,
        start: 'top top',
        end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          // Calculate active slide based on scroll progress
          const current = Math.min(
            Math.floor(self.progress * totalSlides),
            totalSlides - 1
          );
          setActiveSlide(current);
        }
      }
    });

    // Individual slide entrance animations (Apple style: smooth fade & slide)
    slides.forEach((slide: any, index) => {
      if (index === 0) return; // Skip cover

      const titleLines = slide.querySelectorAll('.slide-title-line');
      const title = slide.querySelector('.slide-title');
      const bullets = slide.querySelectorAll('.slide-bullet');
      const visual = slide.querySelector('.slide-visual');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: slide,
          containerAnimation: pinTween,
          start: 'left 70%',
          toggleActions: 'play none none reverse'
        }
      });

      if (titleLines.length) {
        tl.fromTo(titleLines,
          { y: '105%', skewY: 3 },
          { y: '0%', skewY: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out' },
          0
        );
      } else if (title) {
        tl.fromTo(title,
          { opacity: 0, y: 40, skewY: 1 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.0, ease: 'power3.out' },
          0
        );
      }
      if (bullets.length) {
        tl.fromTo(bullets,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' },
          0.15
        );
      }
      if (visual) {
        tl.fromTo(visual,
          { opacity: 0, scale: 0.96, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          0.2
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  // Quick helper to scroll to a specific slide (desktop only)
  const scrollToSlide = (index: number) => {
    if (isMobile) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const totalScroll = wrapper.scrollWidth - window.innerWidth;
    const scrollTarget = (index / (TOTAL_SLIDES - 1)) * totalScroll;

    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] font-sans antialiased overflow-x-hidden relative">
      {/* Premium Apple Ambient Lighting (Ultra-smooth, low opacity, no bright neon blobs) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[30%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-white/[0.02] to-transparent blur-[160px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#5cbef8]/[0.02] to-transparent blur-[180px]" />
      </div>

      {/* Floating Apple-Style Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center bg-black/70 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300">
        <Link href="/" className="flex items-center space-x-2 text-[#86868b] hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium tracking-tight">Back to portfolio</span>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-[11px] font-semibold text-white tracking-widest bg-white/[0.08] px-3 py-1 rounded-full border border-white/[0.06]">
            KEYNOTE
          </span>
          <span className="text-xs font-medium text-[#86868b]">
            Angel Arrieta
          </span>
        </div>
      </header>

      {/* Top Progress Bar (Desktop only) */}
      {!isMobile && (
        <div className="fixed top-[65px] left-0 right-0 h-[2px] bg-white/[0.04] z-50">
          <div
            className="h-full bg-gradient-to-r from-[#86868b] to-white transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      )}

      {/* Main presentation container */}
      <div ref={containerRef} className="relative z-10">
        <div
          ref={wrapperRef}
          className={`
            ${isMobile
              ? 'flex flex-col space-y-24 px-6 py-28'
              : 'flex w-[800vw] h-screen items-center'
            }
          `}
        >
          {/* ==========================================
              SLIDE 0: COVER
              ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative select-none ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto">
              {/* Left: Content */}
              <div className="max-w-2xl mobile-animate">
                <h1 className="cover-title text-5xl md:text-[72px] xl:text-[84px] font-semibold tracking-tighter leading-[1.05] mb-8 text-white opacity-0">
                  <span className="block overflow-hidden py-1">
                    <span className="cover-title-line block">My professional</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="cover-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      experience.
                    </span>
                  </span>
                </h1>
                <p className="cover-desc text-xl md:text-2xl xl:text-3xl font-normal text-[#86868b] mb-6 max-w-3xl leading-relaxed tracking-tight opacity-0">
                  Tech consultant and ambassador at The School of Breath.
                </p>
                <p className="cover-subdesc text-base md:text-lg xl:text-xl font-normal text-[#86868b]/90 mb-10 max-w-3xl leading-relaxed tracking-tight opacity-0">
                  My experience building a wellness product in an app with over
                  {' '}<span className="text-white font-medium">5K downloads</span> and a channel with over
                  {' '}<span className="text-white font-medium">175K active users</span>.
                </p>


                {/* QR Codes - Cover */}
                <div className="cover-block flex flex-wrap gap-3 mt-4 opacity-0">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath&hl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath&hl')}`}
                      alt="QR Google Play"
                      className="w-16 h-16 rounded-lg"
                      loading="lazy"
                    />
                    <span className="text-[10px] text-white/50 font-medium">Google Play</span>
                  </a>
                  <a
                    href="https://apps.apple.com/co/app/the-school-of-breath/id6736984340?l=en-GB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent('https://apps.apple.com/co/app/the-school-of-breath/id6736984340?l=en-GB')}`}
                      alt="QR App Store"
                      className="w-16 h-16 rounded-lg"
                      loading="lazy"
                    />
                    <span className="text-[10px] text-white/50 font-medium">App Store</span>
                  </a>
                </div>
              </div>

              {/* Right: App Screenshot */}
              <div className="flex items-center justify-center h-[480px] md:h-[580px] lg:h-[calc(100vh-120px)] lg:max-h-[860px] overflow-visible">
                <div className="w-[320px] md:w-[400px] lg:w-[500px] pointer-events-auto">
                  <div className="rounded-[36px] overflow-hidden border border-white/[0.12] shadow-[0_32px_80px_rgba(0,0,0,0.5)] bg-[#0a0a0a] relative">
                    <img
                      src="/image_app.png"
                      alt="The School of Breath App"
                      className="w-full h-[600px] md:h-[700px] lg:h-[800px] object-cover"
                      draggable={false}
                    />
                    {/* App Branding Footer - YouTube Style */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent px-6 py-4 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src="/logo.png"
                          alt="The School of Breath"
                          className="w-16 h-16 object-contain rounded-full flex-shrink-0"
                          draggable={false}
                        />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-base tracking-tight">The School of Breath</span>
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-white/70 text-xs font-medium">@TheSchoolofBreath</span>
                          <span className="text-white/60 text-xs">175K subscribers</span>
                        </div>
                      </div>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath&hl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white text-sm font-bold transition-all duration-300 flex-shrink-0 tracking-tight"
                      >
                        Subscribe
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extremely subtle background accent */}
            <div className="absolute right-[10%] top-[30%] w-96 h-96 rounded-full bg-white/[0.01] blur-[140px] pointer-events-none" />
          </section>

          {/* ==========================================
              SLIDE 1: UNDERSTAND THE PRODUCT VISION
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="w-full max-w-7xl mx-auto mobile-animate">
              <div className="mb-12">
                <span className="font-mono text-xs text-[#5cbef8] tracking-widest uppercase mb-4 block">
                  01 — Product
                </span>
                <h2 className="slide-title text-5xl md:text-6xl font-semibold text-white tracking-tighter leading-tight">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">Understand the</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      product vision.
                    </span>
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="space-y-6 lg:col-span-1">
                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] flex-shrink-0 mt-1"><Compass size={20} /></div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-1">Plan before you execute</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">Clarity comes from communication. Setting the direction before assigning the first task avoids rework.</p>
                    </div>
                  </div>

                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] flex-shrink-0 mt-1"><HelpCircle size={20} /></div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-1">Ask</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">Uncover the real purpose behind every feature.</p>
                    </div>
                  </div>

                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] flex-shrink-0 mt-1"><Sparkles size={20} /></div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-1">Prototype</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">Google AI Studio + Gemini to experiment fast.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:col-span-1">
                  <div className="relative w-full max-w-md">
                    <img
                      src="/presentatrion.png"
                      alt="Product Vision Exploration"
                      className="slide-visual w-full h-auto object-contain drop-shadow-2xl"
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="space-y-4 lg:col-span-1">
                  <div className="slide-bullet p-5 rounded-[24px] bg-[#161617]/40 border border-white/[0.08] hover:border-[#5cbef8]/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#5cbef8]/20 border border-[#5cbef8]/50 flex items-center justify-center text-[#5cbef8] font-bold text-xs">?</div>
                      <h4 className="text-white font-semibold text-base">Ask</h4>
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed">Uncover the real purpose behind every feature.</p>
                  </div>

                  <div className="slide-bullet p-5 rounded-[24px] bg-[#161617]/40 border border-white/[0.08] hover:border-[#5cbef8]/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#5cbef8]/20 border border-[#5cbef8]/50 flex items-center justify-center text-[#5cbef8] font-bold text-xs">◉</div>
                      <h4 className="text-white font-semibold text-base">Prototype</h4>
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed">Google AI Studio + Gemini to experiment fast.</p>
                  </div>

                  <div className="slide-bullet p-5 rounded-[24px] bg-[#161617]/40 border border-white/[0.08] hover:border-[#5cbef8]/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#5cbef8]/20 border border-[#5cbef8]/50 flex items-center justify-center text-[#5cbef8] font-bold text-xs">🚀</div>
                      <h4 className="text-white font-semibold text-base">Execute</h4>
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed">With clarity, confidence, and direction.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================
              SLIDE 2: USER PERSPECTIVE
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">

              {/* Visual (Left) */}
              <div className="slide-visual lg:col-span-6 order-2 lg:order-1 flex justify-center">
                <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
                  <img
                    src="/image_bretahing.png"
                    alt="User Perspective - Breathing"
                    className="w-full h-auto object-contain rounded-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Content (Right) */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
                <span className="font-mono text-xs text-[#5cbef8] tracking-widest uppercase mb-4 block">
                  02 — User
                </span>
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-8">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">User</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      perspective.
                    </span>
                  </span>
                </h2>
                <div className="space-y-4">
                  <div className="slide-bullet p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <h4 className="text-white font-semibold text-base mb-1">Value lives in simplicity</h4>
                    <p className="text-[#86868b] text-sm leading-relaxed font-light">Real value is making the user&apos;s life simpler, not adding more features.</p>
                  </div>

                  <div className="slide-bullet p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <h4 className="text-white font-semibold text-base mb-1">Fewer decisions</h4>
                    <p className="text-[#86868b] text-sm leading-relaxed font-light">In wellness and yoga products, users don&apos;t want too many decisions. Don&apos;t overload them.</p>
                  </div>

                  <div className="slide-bullet p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <h4 className="text-white font-semibold text-base mb-1">Respond fast</h4>
                    <p className="text-[#86868b] text-sm leading-relaxed font-light">Respond quickly and offer alternatives when needed.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ==========================================
              SLIDE 3: LEADERSHIP PERSPECTIVE
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">

              {/* Content (Left) */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="font-mono text-xs text-[#5cbef8] tracking-widest uppercase mb-4 block">
                  03 — Leadership
                </span>
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-6">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">Leadership</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      perspective.
                    </span>
                  </span>
                </h2>
                <p className="text-lg text-[#86868b] leading-relaxed font-light">
                  I lead by identifying each person&apos;s potential and building a close, honest relationship with the team.
                </p>
              </div>

              {/* Visual Grid (Right) */}
              <div className="slide-visual lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-[28px] bg-[#161617]/40 border border-white/[0.06] backdrop-blur-md group hover:border-[#5cbef8]/30 transition-all duration-300">
                  <div className="p-2.5 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] w-fit mb-4"><UserCheck size={20} /></div>
                  <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">Delegate with clarity</h4>
                  <p className="text-sm text-[#86868b] leading-relaxed font-light">I identify each developer&apos;s strengths so I can assign work where they shine.</p>
                </div>

                <div className="p-6 rounded-[28px] bg-[#161617]/40 border border-white/[0.06] backdrop-blur-md group hover:border-[#5cbef8]/30 transition-all duration-300">
                  <div className="p-2.5 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] w-fit mb-4"><MessageSquare size={20} /></div>
                  <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">Honest communication</h4>
                  <p className="text-sm text-[#86868b] leading-relaxed font-light">I keep communication constant and transparent at all times.</p>
                </div>

                <div className="p-6 rounded-[28px] bg-[#161617]/40 border border-white/[0.06] backdrop-blur-md group hover:border-[#5cbef8]/30 transition-all duration-300">
                  <div className="p-2.5 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] w-fit mb-4"><HandHeart size={20} /></div>
                  <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">Close relationship</h4>
                  <p className="text-sm text-[#86868b] leading-relaxed font-light">I ask how the team is feeling and I protect the human connection.</p>
                </div>

                <div className="p-6 rounded-[28px] bg-[#161617]/40 border border-white/[0.06] backdrop-blur-md group hover:border-[#5cbef8]/30 transition-all duration-300">
                  <div className="p-2.5 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] w-fit mb-4"><Layers size={20} /></div>
                  <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">Teach and let go</h4>
                  <p className="text-sm text-[#86868b] leading-relaxed font-light">I teach, but I also let the team build and learn by doing.</p>
                </div>
              </div>

            </div>
          </section>

          {/* ==========================================
              SLIDE 4: EMOTIONAL MANAGEMENT
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">

              {/* Content (Left) */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <span className="font-mono text-xs text-[#5cbef8] tracking-widest uppercase mb-4 block">
                  04 — Energy
                </span>
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-8">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">Emotional</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      management.
                    </span>
                  </span>
                </h2>

                <div className="space-y-6">
                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="mt-1 p-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#5cbef8]">
                      <Zap size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Bring good energy</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Attitude is contagious. <span className="text-white font-medium">Always good energy</span>, even on hard days.
                      </p>
                    </div>
                  </div>

                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="mt-1 p-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#5cbef8]">
                      <Waves size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Focus and calm</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Stay focused, calm, and professional <span className="text-white font-medium">even under pressure</span>.
                      </p>
                    </div>
                  </div>

                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="mt-1 p-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#5cbef8]">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Professionalism</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Be the team&apos;s steady point when everything is moving fast.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Quote Speaker note */}
                <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center font-normal text-xs text-[#86868b] leading-relaxed italic">
                  &quot;Leading a wellness product is, first of all, taking care of people: the team that builds and the user who breathes.&quot;
                </div>

                {/* App Store Links */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath&hl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300"
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.meditatewithabhi.theschoolofbreath&hl')}`}
                      alt="QR Google Play"
                      className="w-20 h-20 rounded-lg"
                      loading="lazy"
                    />
                    <span className="text-xs text-white/70 font-medium">Google Play</span>
                  </a>
                  <a
                    href="https://apps.apple.com/co/app/the-school-of-breath/id6736984340?l=en-GB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300"
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent('https://apps.apple.com/co/app/the-school-of-breath/id6736984340?l=en-GB')}`}
                      alt="QR App Store"
                      className="w-20 h-20 rounded-lg"
                      loading="lazy"
                    />
                    <span className="text-xs text-white/70 font-medium">App Store</span>
                  </a>
                </div>
              </div>

              {/* Visual (Right) */}
              <div className="slide-visual lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl aspect-square rounded-[40px] overflow-hidden bg-[#0a0a0a] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.45)] group">
                  <img
                    src="/energy.png"
                    alt="Emotional management - Energy"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-left z-20">
                    <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug mb-2">
                      Calm, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">focus</span>, and good energy.
                    </p>
                    <p className="text-sm text-[#d1d1d6] font-light max-w-xs">
                      The emotional stability that holds the team together under pressure.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ==========================================
              SLIDE 5: TOOLS
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="w-full max-w-7xl mx-auto mobile-animate">
              <div className="mb-10">
                <span className="font-mono text-xs text-[#5cbef8] tracking-widest uppercase mb-4 block">
                  05 — Stack
                </span>
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">The tools</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      we use.
                    </span>
                  </span>
                </h2>
                <p className="slide-bullet mt-5 text-lg text-[#86868b] max-w-2xl leading-relaxed font-light">
                  The stack that lets us prototype, ship, and iterate a wellness product without slowing the team down.
                </p>
              </div>

              <div className="slide-visual grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    icon: <Smartphone size={18} />,
                    title: 'Product',
                    tools: ['React Native', 'Expo', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP'],
                  },
                  {
                    icon: <Bot size={18} />,
                    title: 'AI',
                    tools: ['Cursor', 'OpenAI', 'Gemini', 'Google AI Studio', 'CopilotKit', 'Claude'],
                  },
                  {
                    icon: <Mic size={18} />,
                    title: 'Voice & realtime',
                    tools: ['ElevenLabs', 'OpenAI Realtime', 'Google Live API', 'WebRTC', 'WebSocket'],
                  },
                  {
                    icon: <Workflow size={18} />,
                    title: 'Ship & automate',
                    tools: ['n8n', 'Vercel', 'Google Play', 'App Store', 'Node.js'],
                  },
                ].map((group) => (
                  <div
                    key={group.title}
                    className="slide-bullet p-6 rounded-[28px] bg-[#161617]/40 border border-white/[0.06] hover:border-[#5cbef8]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-full bg-[#5cbef8]/10 text-[#5cbef8]">{group.icon}</div>
                      <h4 className="text-white font-semibold text-base tracking-tight">{group.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.06] text-xs text-[#d1d1d6] font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==========================================
              SLIDE 6: AI DESIGN FRAMEWORK
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto mobile-animate">
              <div className="lg:col-span-5">
                <span className="font-mono text-xs text-[#5cbef8] tracking-widest uppercase mb-4 block">
                  06 — Framework
                </span>
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-6">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">How we design</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      with AI.
                    </span>
                  </span>
                </h2>
                <p className="slide-bullet text-lg text-[#86868b] leading-relaxed font-light mb-6">
                  We use the <span className="text-white font-medium">AI Design Framework</span>: a repeatable agentic UI/UX workflow from product brain to prototype.
                </p>
                <p className="slide-bullet text-sm text-[#86868b] leading-relaxed mb-8">
                  Traditional path: brief → Figma → handoff → build. Our path: soul.md → mood boards → one-shot variants → locked prototype.
                </p>
                <a
                  href="https://github.com/anuidev8/ai-design-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="slide-bullet inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] text-sm text-white transition-all"
                >
                  <Github size={16} />
                  anuidev8/ai-design-framework
                  <ExternalLink size={14} className="text-[#86868b]" />
                </a>
              </div>

              <div className="slide-visual lg:col-span-7 space-y-3">
                {[
                  { step: '01', artifact: 'soul.md', goal: 'Purpose, audience, constraints, UI principles' },
                  { step: '02', artifact: 'Visual research', goal: '6–15 curated references' },
                  { step: '03', artifact: 'Mood boards', goal: '2–3 directions scored against soul' },
                  { step: '04', artifact: 'Design system', goal: 'Tokens, components, screen layouts' },
                  { step: '05', artifact: 'One-shot variants', goal: 'Explore many directions, then pick' },
                  { step: '06', artifact: 'Specs', goal: 'States, flows, and behaviors' },
                  { step: '07', artifact: 'Prototype', goal: 'Build the locked direction in code' },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="slide-bullet flex items-center gap-4 p-3.5 rounded-2xl bg-[#161617]/40 border border-white/[0.06] hover:border-[#5cbef8]/30 transition-all"
                  >
                    <span className="font-mono text-xs text-[#5cbef8] w-8 shrink-0">{item.step}</span>
                    <div className="min-w-0">
                      <h4 className="text-white font-semibold text-sm tracking-tight">{item.artifact}</h4>
                      <p className="text-xs text-[#86868b] leading-relaxed">{item.goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==========================================
              SLIDE 7: IDEAS
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="w-full max-w-7xl mx-auto mobile-animate">
              <div className="mb-10">
                <span className="font-mono text-xs text-[#5cbef8] tracking-widest uppercase mb-4 block">
                  07 — Ideas
                </span>
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">Ideas this</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      unlocks.
                    </span>
                  </span>
                </h2>
                <p className="slide-bullet mt-5 text-lg text-[#86868b] max-w-2xl leading-relaxed font-light">
                  Imagination is the bottleneck now — not software execution. These are the ideas we run with.
                </p>
              </div>

              <div className="slide-visual grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    icon: <BookOpen size={18} />,
                    title: 'soul.md as source of truth',
                    body: 'One shared product brain for humans and agents. Purpose, taste, and constraints stay aligned.',
                  },
                  {
                    icon: <Image size={18} />,
                    title: 'Mood boards before pixels',
                    body: 'Set taste early with curated references. Direction before screens.',
                  },
                  {
                    icon: <Sparkles size={18} />,
                    title: 'One-shot many variants',
                    body: 'Generate directions in parallel, pin favorites in a disposable gallery, then lock one.',
                  },
                  {
                    icon: <Brain size={18} />,
                    title: 'Agents build, we decide',
                    body: 'Coding agents implement. We choose story, interaction, and taste.',
                  },
                  {
                    icon: <Target size={18} />,
                    title: 'Faster wellness experiments',
                    body: 'Breathing flows, yoga paths, and habit loops can be prototyped in days, not weeks.',
                  },
                  {
                    icon: <Lightbulb size={18} />,
                    title: 'Keep exploring',
                    body: 'Voice-first screens, agentic UI, and new product bets — without losing the product soul.',
                  },
                ].map((idea) => (
                  <div
                    key={idea.title}
                    className="slide-bullet p-6 rounded-[28px] bg-[#161617]/40 border border-white/[0.06] hover:border-[#5cbef8]/30 transition-all duration-300"
                  >
                    <div className="p-2.5 rounded-full bg-[#5cbef8]/10 text-[#5cbef8] w-fit mb-4">{idea.icon}</div>
                    <h4 className="text-base font-semibold text-white mb-1.5 tracking-tight">{idea.title}</h4>
                    <p className="text-sm text-[#86868b] leading-relaxed font-light">{idea.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating navigation controls (Desktop only) */}
      {!isMobile && (
        <div className="fixed bottom-8 right-12 z-50 flex items-center space-x-4 bg-black/60 border border-white/[0.08] px-4 py-2.5 rounded-full backdrop-blur-xl shadow-2xl">
          <button
            onClick={() => scrollToSlide(Math.max(activeSlide - 1, 0))}
            disabled={activeSlide === 0}
            className="p-1.5 rounded-full hover:bg-white/[0.06] disabled:opacity-20 disabled:hover:bg-transparent text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center space-x-1.5">
            {Array.from({ length: TOTAL_SLIDES }, (_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => scrollToSlide(slideIndex)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === slideIndex ? 'bg-white w-4' : 'bg-white/20 hover:bg-white/40'}`}
                title={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => scrollToSlide(Math.min(activeSlide + 1, TOTAL_SLIDES - 1))}
            disabled={activeSlide === TOTAL_SLIDES - 1}
            className="p-1.5 rounded-full hover:bg-white/[0.06] disabled:opacity-20 disabled:hover:bg-transparent text-white transition-colors"
          >
            <ArrowRight size={16} />
          </button>

          <span className="font-mono text-xs text-[#86868b] border-l border-white/[0.08] pl-3">
            {activeSlide + 1} / {TOTAL_SLIDES}
          </span>
        </div>
      )}
    </div>
  );
}
