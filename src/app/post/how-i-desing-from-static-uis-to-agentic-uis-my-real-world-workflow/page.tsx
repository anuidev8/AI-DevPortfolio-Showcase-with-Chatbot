'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowLeft, ArrowRight, 
  Terminal, Shield, Database, Smartphone, Layout, 
  Cpu, CheckCircle, Clock, Zap, MessageSquare, 
  Sliders, BookOpen, Layers, Sparkles,
  Eye, Compass, HeartPulse
} from 'lucide-react';
import Link from 'next/link';

// Register GSAP plugins (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AgenticUIPresentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const coverCharacterRef = useRef<HTMLDivElement>(null);
  const coverElementsRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Slide 5 active tab state
  const [slide5Tab, setSlide5Tab] = useState<'spec' | 'a2ui'>('spec');

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
    const scrollTarget = (index / 7) * totalScroll;
    
    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] font-sans antialiased overflow-x-hidden selection:bg-[#5cbef8]/30 selection:text-white">
      {/* Premium Apple Ambient Lighting (Ultra-smooth, low opacity, no bright neon blobs) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[30%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-white/[0.02] to-transparent blur-[160px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#5cbef8]/[0.02] to-transparent blur-[180px]" />
      </div>

      {/* Floating Apple-Style Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center bg-black/70 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300">
        <Link href="/" className="flex items-center space-x-2 text-[#86868b] hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium tracking-tight">Volver al portfolio</span>
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
              SLIDE 0: COVER / PORTADA
              ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative select-none ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto">
              {/* Left: Content */}
              <div className="max-w-2xl mobile-animate">
                <h1 className="cover-title text-5xl md:text-[72px] xl:text-[84px] font-semibold tracking-tighter leading-[1.05] mb-8 text-white opacity-0">
                  <span className="block overflow-hidden py-1">
                    <span className="cover-title-line block">De UIs estáticas</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="cover-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      a UIs agénticas.
                    </span>
                  </span>
                </h1>
                <p className="cover-desc text-xl md:text-2xl xl:text-3xl font-normal text-[#86868b] mb-6 max-w-3xl leading-relaxed tracking-tight opacity-0">
                  Como estoy diseñando interfaces que se sientan diferentes.
                </p>
                <p className="cover-subdesc text-base md:text-lg xl:text-xl font-normal text-[#86868b]/90 mb-10 max-w-3xl leading-relaxed tracking-tight opacity-0">
                  Ayudo a las personas con cuidado personal (healthcare + mindfulness) a través de la tecnología,
                  usando la IA no solo como herramienta, sino como un medio para entender mejor los usuarios rápidamente y darles más valor.
                </p>

                {/* Apple-Style Grid Presenter Block */}
                <div className="cover-block p-8 rounded-[24px] bg-[#161617]/40 border border-white/[0.06] backdrop-blur-md max-w-2xl relative overflow-hidden group hover:border-white/[0.12] transition-all duration-500 opacity-0">
                  <div>
                    <h3 className="text-xs font-semibold text-[#86868b] tracking-wider uppercase mb-1.5">Presentador</h3>
                    <p className="text-2xl font-semibold text-white tracking-tight">Angel Arrieta</p>
                    <p className="text-[#86868b] text-sm mt-0.5 font-light">Founding Tech Lead &bull; The School of Breath</p>
                  </div>
                </div>
              </div>

              {/* Right: Hero character + floating elements */}
              <div className="relative flex items-end justify-center h-[480px] md:h-[580px] lg:h-[calc(100vh-120px)] lg:max-h-[860px] pointer-events-none overflow-visible">
                {/* Floating elements behind character */}
                <div
                  ref={coverElementsRef}
                  className="absolute inset-0 flex items-center justify-center will-change-transform scale-130"
                  aria-hidden="true"
                >
                  <img
                    src="/image_elemnts.png"
                    alt=""
                    className="w-[120%] max-w-none h-auto object-contain opacity-90"
                    draggable={false}
                  />
                </div>

                {/* Character in front */}
                <div
                  ref={coverCharacterRef}
                  className="relative z-10 flex items-end justify-center w-[130%] max-w-none xl:w-[140%] scale-[1.35] origin-bottom will-change-transform"
                >
                  <img
                    src="/image_profile.png"
                    alt="Angel Arrieta"
                    className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_60px_rgba(92,190,248,0.12)]"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
            
            {/* Extremely subtle background accent */}
            <div className="absolute right-[10%] top-[30%] w-96 h-96 rounded-full bg-white/[0.01] blur-[140px] pointer-events-none" />
          </section>

          {/* ==========================================
              SLIDE 1: EL DESAFÍO (Opening: The Challenge)
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">
              
              {/* Content (Left) */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <h2 className="slide-title text-4xl md:text-5xl font-semibold text-white tracking-tighter leading-tight mb-8">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">El desafío de hoy:</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      diseñar UI/UX que realmente resuelva el dolor del usuario.
                    </span>
                  </span>
                </h2>
                
                <div className="space-y-6">
                  <div className="slide-bullet flex items-start space-x-3">
                    <span className="text-[#86868b] font-medium mt-1">&bull;</span>
                    <p className="text-base text-[#86868b] leading-relaxed">
                      Hoy todavía diseñamos muchas UIs como si fueran catálogos de botones.
                    </p>
                  </div>
                  
                  <div className="slide-bullet flex items-start space-x-3">
                    <span className="text-[#86868b] font-medium mt-1">&bull;</span>
                    <p className="text-base text-[#86868b] leading-relaxed">
                      Preguntamos: ¿dónde pongo este botón?, ¿cómo hago este flujo?, pero no: ¿cuánto tardamos en resolver el dolor real del usuario?
                    </p>
                  </div>

                  <div className="slide-bullet flex items-start space-x-3">
                    <span className="text-[#5cbef8] font-medium mt-1">&bull;</span>
                    <p className="text-base text-[#86868b] leading-relaxed">
                      <span className="text-white font-medium">Mi objetivo hoy:</span> mostrar cómo pasé de pantallas estáticas a una UI agéntica que actúa como copiloto y resuelve problemas en minutos, no en clicks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual (Right) — Apple-style square card */}
              <div className="slide-visual lg:col-span-6 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl aspect-square rounded-[40px] overflow-hidden bg-[#0a0a0a] border border-white/[0.08] backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] group flex items-center justify-center p-3 md:p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10" />
                  <img
                    src="/new_way_ui.png"
                    alt="Diseñador evaluando UI agéntica con interfaces holográficas y copiloto JARVIS"
                    className="relative z-0 w-full h-full object-contain object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    draggable={false}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ==========================================
              SLIDE 2: CÓMO HA CAMBIADO LA INTERACCIÓN
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">
              
              {/* Content (Left) */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-8">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">De UI estática</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      a UI agéntica.
                    </span>
                  </span>
                </h2>
                <div className="space-y-6">
                  <div className="slide-bullet flex items-start space-x-3">
                    <span className="text-[#86868b] font-medium">&bull;</span>
                    <p className="text-[#86868b] text-base leading-relaxed">
                      <strong className="text-white font-medium">Interacción Tradicional</strong>: Es de naturaleza imperativa. El usuario manipula elementos visuales estáticos y el servidor responde de manera pasiva a peticiones directas.
                    </p>
                  </div>
                  
                  <div className="slide-bullet flex items-start space-x-3">
                    <span className="text-[#5cbef8] font-medium">&bull;</span>
                    <p className="text-[#86868b] text-base leading-relaxed">
                      <strong className="text-white font-medium">Interacción Agéntica y Voz Generativa</strong>: Es proactiva. Existe un loop bidireccional y continuo mediante voz generativa integrada en tiempo real. La UI se autoconstruye y se adapta progresivamente al contexto de forma dinámica.
                    </p>
                  </div>

                  <div className="slide-bullet flex items-start space-x-3">
                    <span className="text-white font-medium">&bull;</span>
                    <p className="text-[#86868b] text-base leading-relaxed">
                      Protocolos de <strong className="text-white">Generative UI</strong> como <strong className="text-white">AG-UI</strong>, <strong className="text-white">A2UI</strong> y <strong className="text-white">MCP-UI</strong> unifican la capa de modelos con el renderizado dinámico de componentes React interactivos y flujos de voz en tiempo real en el cliente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Diagram (Right) */}
              <div className="slide-visual lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Column 1: Static UI */}
                <div className="p-6 rounded-[28px] bg-[#161617]/20 border border-white/[0.04] backdrop-blur-md relative flex flex-col justify-between min-h-[420px] overflow-hidden group hover:border-white/[0.1] transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[10px] text-[#86868b] tracking-widest uppercase">STATIC MODEL</span>
                      <div className="p-1.5 rounded-full bg-white/[0.02] text-[#86868b]"><Clock size={14} /></div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">Estructura Pasiva</h3>
                    <p className="text-sm md:text-base text-[#d2d2d7] leading-relaxed mb-4 font-light">
                      Es de naturaleza imperativa. El usuario manipula elementos visuales estáticos y el servidor responde de manera pasiva a peticiones directas.
                    </p>
                  </div>
                  
                  {/* Generated Image rendering */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-square w-full mt-auto bg-black/40">
                    <img 
                      src="/static_model_ui.png" 
                      alt="Traditional Static Application" 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Column 2: Agentic UI */}
                <div className="p-6 rounded-[28px] bg-[#161617]/60 border border-white/[0.08] backdrop-blur-xl relative flex flex-col justify-between min-h-[420px] overflow-hidden group hover:border-[#5cbef8]/30 transition-all duration-300 shadow-[0_10px_30px_rgba(92,190,248,0.02)]">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[10px] text-[#5cbef8] tracking-widest uppercase">GENERATIVE UI MODEL</span>
                      <div className="p-1.5 rounded-full bg-[#5cbef8]/10 text-[#5cbef8]"><Zap size={14} /></div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">Estructura Proactiva</h3>
                    <p className="text-sm md:text-base text-[#d2d2d7] leading-relaxed mb-4 font-light">
                      Composición dinámica en tiempo real. Ejemplo: Un agente de Claude aplicando MCP-UI para renderizar un dashboard de estadísticas de MongoDB directamente en el chat bajo demanda.
                    </p>
                  </div>
                  
                  {/* Generated Image rendering */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#5cbef8]/20 aspect-square w-full mt-auto bg-[#fbfbf9] shadow-[0_0_20px_rgba(92,190,248,0.05)]">
                    <img 
                      src="/claude_mcp_ui_real_chat.png" 
                      alt="Claude Agent rendering MongoDB Dashboard via MCP-UI in Chat" 
                      className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ==========================================
              SLIDE 3: QUÉ SIGNIFICA SER AGÉNTICO
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">
              
              {/* Content (Left) */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-6">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">Pilares de la</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      UI Agéntica.
                    </span>
                  </span>
                </h2>
                <p className="text-lg text-[#86868b] leading-relaxed mb-8 font-light">
                  En *The School of Breath*, el flujo agéntico interactúa de extremo a extremo con nuestra arquitectura de producto:
                </p>
                
                <div className="space-y-4">
                  <div className="slide-bullet p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <h4 className="text-white font-semibold text-base mb-1">Context-Aware (Consciencia de Contexto)</h4>
                    <p className="text-[#86868b] text-sm leading-relaxed font-light">Reconoce de manera adaptativa el perfil del usuario, hábitos históricos de sueño, nivel de estrés detectado y condiciones ambientales temporales.</p>
                  </div>
                  
                  <div className="slide-bullet p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <h4 className="text-white font-semibold text-base mb-1">Tool-Oriented (Orientada a Herramientas)</h4>
                    <p className="text-[#86868b] text-sm leading-relaxed font-light">Orquesta de forma nativa e invisible la base de datos interna, indexadores semánticos de playlists y el reproductor de sonido sin requerir navegación manual.</p>
                  </div>

                  <div className="slide-bullet p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <h4 className="text-white font-semibold text-base mb-1">Real-time / Generative (Tiempo real generativo)</h4>
                    <p className="text-[#86868b] text-sm leading-relaxed font-light">Compone vistas dinámicas y personalizadas (Generative UI) bajo demanda, respondiendo de inmediato a los parámetros emocionales de la sesión.</p>
                  </div>
                </div>
              </div>

              {/* Visual Diagram (Right) */}
              <div className="slide-visual lg:col-span-6 flex justify-center w-full">
                <div className="relative rounded-[32px] overflow-hidden border border-white/[0.06] aspect-square w-full bg-[#161617]/20 group hover:border-[#5cbef8]/30 transition-all duration-300 shadow-[0_10px_40px_rgba(92,190,248,0.03)] backdrop-blur-md">
                  <img 
                    src="/agentic_ui_pillars.png" 
                    alt="Capa de Orquestación - Pilares de la UI Agéntica" 
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ==========================================
              SLIDE 4: MI WORKFLOW DE DISEÑO
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="w-full max-w-7xl mx-auto mobile-animate">
              <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-4">
                <span className="block overflow-hidden py-1">
                  <span className="slide-title-line block">Mi workflow para diseñar</span>
                </span>
                <span className="block overflow-hidden py-1">
                  <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                    UIs agénticas (Antigravity).
                  </span>
                </span>
              </h2>
              {/* Full Workflow Image */}
              <div className="slide-visual w-full flex justify-center items-center">
                <div className="relative rounded-[32px] overflow-hidden border border-white/[0.06] w-full max-w-5xl bg-[#161617]/20 group hover:border-[#5cbef8]/30 transition-all duration-300 shadow-[0_10px_40px_rgba(92,190,248,0.03)] backdrop-blur-md">
                  <img 
                    src="/spec_driven_workflow.png" 
                    alt="Spec-Driven AI UI Design Pipeline Workflow Diagram" 
                    className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================
              SLIDE 5: ESPECIFICACIÓN: SLEEP FLOW
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">
              
              {/* Content (Left) */}
              <div className="lg:col-span-4 flex flex-col justify-center">
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-6">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">
                      La <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">Especificación</span>.
                    </span>
                  </span>
                </h2>
                <p className="text-lg text-[#86868b] leading-relaxed mb-6 font-light">
                  Definición explícita del flujo y el estándar de comunicación dinámico entre el Agente y la interfaz del usuario.
                </p>
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] text-xs text-[#86868b] space-y-2 font-light leading-relaxed">
                    <strong className="text-white font-semibold block mb-1">¿Por qué usar estos dos esquemas?</strong>
                    <p>&bull; <span className="text-white font-medium">sleep-flow.spec.json:</span> Modela los objetivos, variables de contexto y restricciones de diseño de UI para gobernar y limitar el comportamiento del Agente antes del renderizado.</p>
                    <p>&bull; <span className="text-white font-medium">a2ui-component.json:</span> El contrato JSON estructurado (A2UI) que especifica la estructura y datos de los componentes que el Agente genera en tiempo de ejecución.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#161617]/30 border border-white/[0.04] text-xs text-[#86868b] space-y-2 font-light leading-relaxed">
                    <strong className="text-white font-semibold block mb-1">Mapeo de la Interfaz:</strong>
                    <p>&bull; <span className="text-white font-medium">Generative UI:</span> Panel sugerencias de respiración adaptativas en la pantalla principal.</p>
                    <p>&bull; <span className="text-white font-medium">Static UI:</span> Reproductor de audio base, menús de perfil y configuración general.</p>
                  </div>
                </div>
              </div>

              {/* Spec Terminal (Right) */}
              <div className="slide-visual lg:col-span-8">
                <div className="w-full rounded-[24px] bg-[#161617]/50 border border-white/[0.06] backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-xs">
                  {/* Terminal Header */}
                  <div className="px-6 py-4 bg-black/40 border-b border-white/[0.06] flex justify-between items-center">
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      <div className="flex items-center space-x-1.5 mr-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      </div>
                      <button 
                        onClick={() => setSlide5Tab('spec')}
                        className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all duration-200 ${
                          slide5Tab === 'spec' 
                            ? 'bg-white/[0.07] text-[#5cbef8] border border-white/[0.08]' 
                            : 'text-[#86868b] hover:text-[#f5f5f7]'
                        }`}
                      >
                        sleep-flow.spec.json
                      </button>
                      <button 
                        onClick={() => setSlide5Tab('a2ui')}
                        className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all duration-200 ${
                          slide5Tab === 'a2ui' 
                            ? 'bg-white/[0.07] text-[#5cbef8] border border-white/[0.08]' 
                            : 'text-[#86868b] hover:text-[#f5f5f7]'
                        }`}
                      >
                        a2ui-component.json
                      </button>
                    </div>
                    <span className="text-[10px] text-[#5cbef8] font-medium tracking-wider hidden sm:inline">CONTRACT SCHEMA</span>
                  </div>

                  {/* Terminal Body */}
                  <div className="p-8 space-y-4 max-h-[420px] overflow-y-auto sidebar-scroll text-left leading-relaxed">
                    {slide5Tab === 'spec' ? (
                      <>
                        <div>
                          <span className="text-white/40">"objective"</span>: <span className="text-[#a2a2a6]">"Ayudar al usuario a iniciar una sesión de respiración con menos de 3 interacciones rápidas."</span>,
                        </div>
                        <div>
                          <span className="text-white/40">"user_context"</span>: <span className="text-[#F5F5F7]">&#123;</span>
                          <div className="pl-6">
                            <span className="text-white/40">"profile"</span>: <span className="text-[#a2a2a6]">"Adulto con altos niveles de estrés reportados"</span>,
                            <br />
                            <span className="text-white/40">"time_window"</span>: <span className="text-[#a2a2a6]">"22:30 PM - 01:00 AM"</span>,
                            <br />
                            <span className="text-white/40">"device"</span>: <span className="text-[#a2a2a6]">"Mobile / iOS style screen"</span>
                          </div>
                          <span className="text-[#F5F5F7]">&#125;</span>,
                        </div>
                        <div>
                          <span className="text-white/40">"ui_constraints"</span>: <span className="text-[#F5F5F7]">&#123;</span>
                          <div className="pl-6">
                            <span className="text-white/40">"max_screens"</span>: <span className="text-[#5cbef8]">2</span>,
                            <br />
                            <span className="text-white/40">"default_action"</span>: <span className="text-[#a2a2a6]">"Sesión de respiración preseleccionada con botón de inicio directo"</span>,
                            <br />
                            <span className="text-white/40">"max_taps"</span>: <span className="text-[#5cbef8]">2</span>
                          </div>
                          <span className="text-[#F5F5F7]">&#125;</span>,
                        </div>
                        <div>
                          <span className="text-white/40">"agent_context_variables"</span>: <span className="text-[#F5F5F7]">[</span>
                          <span className="text-[#a2a2a6]">"local_time"</span>, <span className="text-[#a2a2a6]">"last_sessions_history"</span>, <span className="text-[#a2a2a6]">"current_heartrate_stress"</span>
                          <span className="text-[#F5F5F7]">]</span>,
                        </div>
                        <div>
                          <span className="text-white/40">"success_metric"</span>: <span className="text-[#a2a2a6]">"Sesión iniciada satisfactoriamente en menos de 10 segundos de interacción."</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-white/40">"component"</span>: <span className="text-[#a2a2a6]">"BreathingSession"</span>,
                        </div>
                        <div>
                          <span className="text-white/40">"type"</span>: <span className="text-[#a2a2a6]">"agentic_ui"</span>,
                        </div>
                        <div>
                          <span className="text-white/40">"data"</span>: <span className="text-[#F5F5F7]">&#123;</span>
                          <div className="pl-6">
                            <span className="text-white/40">"title"</span>: <span className="text-[#a2a2a6]">"Sesión de Respiración Guiada"</span>,
                            <br />
                            <span className="text-white/40">"inhale_seconds"</span>: <span className="text-[#5cbef8]">4</span>,
                            <br />
                            <span className="text-white/40">"hold_seconds"</span>: <span className="text-[#5cbef8]">4</span>,
                            <br />
                            <span className="text-white/40">"exhale_seconds"</span>: <span className="text-[#5cbef8]">4</span>,
                            <br />
                            <span className="text-white/40">"audio_stream"</span>: <span className="text-[#a2a2a6]">"https://meditatewithabhi.com/streams/sleep-breath.mp3"</span>
                          </div>
                          <span className="text-[#F5F5F7]">&#125;</span>,
                        </div>
                        <div>
                          <span className="text-white/40">"styling"</span>: <span className="text-[#F5F5F7]">&#123;</span>
                          <div className="pl-6">
                            <span className="text-white/40">"theme"</span>: <span className="text-[#a2a2a6]">"glassmorphic-dark"</span>,
                            <br />
                            <span className="text-white/40">"neon_color"</span>: <span className="text-[#a2a2a6]">"#5cbef8"</span>
                          </div>
                          <span className="text-[#F5F5F7]">&#125;</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ==========================================
              SLIDE 6: STACK TÉCNICO Y ARQUITECTURA
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">
              
              {/* Content (Left) */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-8">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">Estructura de</span>
                  </span>
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">
                      Arquitectura.
                    </span>
                  </span>
                </h2>
                
                <div className="space-y-6">
                  {/* Layer 3 */}
                  <div className="slide-bullet flex items-start space-x-3">
                    <div className="font-mono text-xs text-white/30 mt-1">01</div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Capa de Cliente (React & CopilotKit)</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Componentes modulares de interfaz integrados que permiten renderizar dinámicamente bloques generativos estructurados por el agente.
                      </p>
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="slide-bullet flex items-start space-x-3">
                    <div className="font-mono text-xs text-[#5cbef8] mt-1">02</div>
                    <div>
                      <h4 className="text-[#5cbef8] font-semibold text-base mb-0.5 tracking-tight">Capa Intermedia (AG-UI Middleware)</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Controla el mapeo de estados, traduce los flujos JSON abstractos y sincroniza la renderización en tiempo real del cliente.
                      </p>
                    </div>
                  </div>

                  {/* Layer 1 */}
                  <div className="slide-bullet flex items-start space-x-3">
                    <div className="font-mono text-xs text-white/30 mt-1">03</div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Capa de Backend (Google ADK Agents)</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Modelos de lenguaje especializados en inferencia semántica y conexión a bases de datos que evalúan proactivamente hábitos del usuario.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Isometric Stack (Right) */}
              <div className="slide-visual lg:col-span-7 flex justify-center items-center">
                <div className="relative rounded-[32px] overflow-hidden border border-white/[0.06] w-full max-w-2xl bg-[#161617]/20 group hover:border-[#5cbef8]/30 transition-all duration-300 shadow-[0_10px_40px_rgba(92,190,248,0.03)] backdrop-blur-md">
                  <img 
                    src="/agentic_ui_architecture.png" 
                    alt="AG-UI Architecture and Flow Diagram" 
                    className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* ==========================================
              SLIDE 7: DEMO & APRENDIZAJES (PREMIUM MOCKUP INTERACTIVO)
             ========================================== */}
          <section className={`slide-section shrink-0 w-screen h-screen flex flex-col justify-center px-12 md:px-32 relative ${isMobile ? 'h-auto py-16' : ''}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full max-w-7xl mx-auto mobile-animate">
              
              {/* Left Column: App demo screenshot */}
              <div className="slide-visual lg:col-span-6 flex justify-center">
                <img
                  src="/final.png"
                  alt="Mindfulness app demo"
                  className="w-full max-w-[820px] h-auto object-contain shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Right Column: Lessons learned */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <h2 className="slide-title text-4xl md:text-6xl font-semibold text-white tracking-tighter leading-tight mb-8">
                  <span className="block overflow-hidden py-1">
                    <span className="slide-title-line block">
                      Demo & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5cbef8] to-[#1283c4]">Aprendizajes</span>.
                    </span>
                  </span>
                </h2>

                <div className="space-y-6">
                  {/* Bullet 1 */}
                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="mt-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#5cbef8]">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Primero el producto, no la IA</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Identifica si realmente necesitas un agente completo o si un simple componente estático optimizado resuelve el problema. <span className="text-white font-medium">No sobre-diseñes flujos innecesarios</span>.
                      </p>
                    </div>
                  </div>

                  {/* Bullet 2 */}
                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="mt-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#5cbef8]">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Control y transparencia al usuario</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        El usuario siempre debe tener el control de detener, editar o cancelar cualquier sugerencia generativa. Un agente es un <span className="text-white font-medium">copiloto</span>, no un piloto sin control.
                      </p>
                    </div>
                  </div>

                  {/* Bullet 3 */}
                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="mt-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#5cbef8]">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Uso estratégico de la interfaz generativa</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        Evita automatizar flujos estables y predecibles. Limita la renderización generativa a momentos de alta fricción o decisiones contextuales del usuario.
                      </p>
                    </div>
                  </div>

                  {/* Bullet 4 */}
                  <div className="slide-bullet flex items-start space-x-4">
                    <div className="mt-1 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#5cbef8]">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base mb-0.5 tracking-tight">Lanzar, evaluar e iterar</h4>
                      <p className="text-sm text-[#86868b] leading-relaxed">
                        El 90% de la lógica inicial se construye rápido con IA, pero perfeccionar el 10% restante para que se sienta humano, cálido y consistente requiere pruebas con usuarios reales.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Quote Speaker note */}
                <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center font-normal text-xs text-[#86868b] leading-relaxed italic">
                  "Diseñar interfaces agénticas no es solo programar IA, sino darle a la interfaz la capacidad de adaptarse dinámicamente y con propósito humano."
                </div>
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
            {[0, 1, 2, 3, 4, 5, 6, 7].map((slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => scrollToSlide(slideIndex)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === slideIndex ? 'bg-white w-4' : 'bg-white/20 hover:bg-white/40'}`}
                title={`Ir al slide ${slideIndex + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={() => scrollToSlide(Math.min(activeSlide + 1, 7))}
            disabled={activeSlide === 7}
            className="p-1.5 rounded-full hover:bg-white/[0.06] disabled:opacity-20 disabled:hover:bg-transparent text-white transition-colors"
          >
            <ArrowRight size={16} />
          </button>
          
          <span className="font-mono text-xs text-[#86868b] border-l border-white/[0.08] pl-3">
            {activeSlide + 1} / 8
          </span>
        </div>
      )}
    </div>
  );
}
