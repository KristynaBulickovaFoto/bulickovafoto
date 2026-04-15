"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const TOTAL_FRAMES = 145;
const FRAME_PATH = "/hero-frames/frame-";
const DECORATIVE_ACCENT_PATH = "/hero-frames/ja.webp";

function getFrameSrc(index: number): string {
  return `${FRAME_PATH}${String(index).padStart(3, "0")}.webp`;
}

// Automatically calculate current age based on birth date (4. 9. 1993)
const getKristynaAge = (): number => {
  const birthDate = new Date(1993, 8, 4); // Month is 0-indexed (8 = September)
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
const kristynaAge = getKristynaAge();

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef<HTMLImageElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[frameIndex];
    if (!canvas || !ctx || !img) return;

    const container = containerRef.current;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.querySelector(".sticky")?.getBoundingClientRect()
      ?? { width: window.innerWidth, height: window.innerHeight };

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const cw = rect.width;
    const ch = rect.height;

    // Fill with background color matching the light theme
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();
    // Set to the CSS variable directly (it already includes oklch()), or fallback to white
    ctx.fillStyle = bgColor || "#ffffff";
    ctx.fillRect(0, 0, cw, ch);

    // Contain-fit: show the whole image, centered
    const imgRatio = img.naturalWidth / img.naturalHeight;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (cw < 1024) {
      // Mobile & Tablet Portrait (< 1024px)
      // On tiny phones (<640px) text is compact (1 paragraph + button), 60% gives good balance
      // On tablets (sm: >= 640px) more text shows, so keep at 55%
      const availableH = cw >= 640 ? ch * 0.55 : ch * 0.60;
      const tempDrawH = cw / imgRatio;

      if (tempDrawH > availableH) {
        drawH = availableH;
        drawW = availableH * imgRatio;
      } else {
        drawW = cw;
        drawH = tempDrawH;
      }

      drawX = (cw - drawW) / 2; // Center horizontally
      drawY = ch - drawH;       // Lock totally to the bottom
    } else {
      // Desktop (>= 1024px)
      // The text lives inside a max-w-7xl (1280px) container. We must position Kristýna
      // relative to that container, not the full canvas width, so she stays anchored on ultra-wide screens.
      const contentMaxW = 1280; // matches max-w-7xl
      const contentW = Math.min(cw, contentMaxW);
      const contentLeft = (cw - contentW) / 2;

      let tempDrawH = ch;
      let tempDrawW = tempDrawH * imgRatio;

      // Limit image width relative to the CONTENT area, not the full canvas
      const maxW = cw < 1280 ? contentW * 0.50 : contentW * 0.55;
      
      if (tempDrawW > maxW) {
        tempDrawW = maxW;
        tempDrawH = tempDrawW / imgRatio;
      }

      drawW = tempDrawW;
      drawH = tempDrawH;

      // Position her centered in the right half of the CONTENT container
      const rightHalfStart = contentLeft + contentW * 0.42;
      const rightHalfSpace = contentLeft + contentW - rightHalfStart;
      drawX = rightHalfStart + (rightHalfSpace - drawW) / 2;
      drawY = ch - drawH; // lock to bottom
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const accent = accentRef.current;
    if (accent?.complete && cw >= 1024) {
      const accentWidth = Math.min(Math.max(cw * 0.14, 120), 190);
      const accentHeight = accentWidth * (accent.naturalHeight / accent.naturalWidth);
      const accentX = cw - accentWidth - cw * 0.04;
      const accentY = ch * 0.08;

      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.drawImage(accent, accentX, accentY, accentWidth, accentHeight);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    const accent = new Image();
    accent.src = DECORATIVE_ACCENT_PATH;
    accent.onload = () => {
      accentRef.current = accent;
      drawFrame(currentFrameRef.current);
    };
    accentRef.current = accent;

    return () => {
      accent.onload = null;
      accentRef.current = null;
    };
  }, [drawFrame]);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
          drawFrame(0);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
      });
    };
  }, [drawFrame]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableHeight = container.scrollHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / scrollableHeight, 0), 1);

        setScrollProgress(progress);

        const frameIndex = Math.min(
          Math.floor(progress * (TOTAL_FRAMES - 1)),
          TOTAL_FRAMES - 1
        );

        if (frameIndex !== currentFrameRef.current && imagesRef.current[frameIndex]) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Text fading based on scroll progress
  const headlineOpacity = scrollProgress < 0.15
    ? 1
    : scrollProgress < 0.35
      ? 1 - (scrollProgress - 0.15) / 0.2
      : 0;

  const subheadlineOpacity = scrollProgress < 0.55
    ? 0
    : scrollProgress < 0.75
      ? (scrollProgress - 0.55) / 0.2
      : 1;

  const scrollIndicatorOpacity = scrollProgress < 0.05
    ? 1
    : scrollProgress < 0.15
      ? 1 - (scrollProgress - 0.05) / 0.1
      : 0;

  return (
    <section
      ref={containerRef}
      className="relative bg-background"
      style={{ height: "400vh" }}
    >
      {/* Sticky viewport container - positioned right under the sticky header */}
      <div className="sticky top-[89px] md:top-[101px] flex h-[calc(100dvh-89px)] md:h-[calc(100dvh-101px)] w-full items-center justify-center overflow-hidden bg-background">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Načítání…</p>
            </div>
          </div>
        )}

        {/* Canvas for frame rendering */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Mobile Gradient Overlay (Top Down) gently protects the text without bleaching out the subject's face */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[50%] bg-gradient-to-b from-background to-transparent lg:hidden"
        />

        {/* Desktop Gradient Overlay (Radial Left) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-background/80 via-background/20 to-transparent lg:block"
        />

        {/* Headline text – top left */}
        <div
          className="pointer-events-none absolute inset-x-0 mx-auto top-0 z-20 w-full max-w-7xl px-4 pt-4 sm:px-6 lg:pt-[12vh]"
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${(1 - headlineOpacity) * -20}px)`,
          }}
        >
          <div className="flex flex-col items-center text-center lg:w-1/2 lg:mr-auto">
            <h1
              className="max-w-2xl font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[5.5rem]"
              style={{ textShadow: '0 0 40px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,1)' }}
            >
              Zachycuji momenty,
              <br />
              <span className="text-primary">které vyprávějí</span>
              <br />
              váš příběh
            </h1>

            {/* Intro paragraph & tags filling the empty space below the headline */}
            <div className="pointer-events-auto mt-5 flex max-w-lg flex-col items-center gap-3 sm:mt-6 sm:gap-4 lg:mt-10 lg:gap-6">
              <p
                className="hidden text-sm font-medium leading-relaxed text-foreground/85 sm:block md:text-base lg:text-xl"
                style={{ textShadow: '0 0 20px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1)' }}
              >
                Od nefalšovaných emocí na svatbách přes surovou energii kapel na pódiu až po opravdové rodinné portréty. Jsem flexibilní fotografka z Přerova.
              </p>

              <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Svatby
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-sm">
                  Kluby & Koncerty
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-sm">
                  Rodina & Portrét
                </span>
              </div>

              <div className="mt-1 sm:mt-2">
                <Link
                  href="/kontakt"
                  className="group inline-flex items-center gap-2 rounded-full border border-transparent bg-foreground px-5 py-2.5 font-display text-xs font-bold tracking-wide text-background transition-all duration-300 hover:border-primary hover:bg-primary hover:shadow-xl hover:shadow-primary/20 sm:px-7 sm:py-3.5 sm:text-sm"
                >
                  Nezávazná poptávka
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* About Me block - displayed at the top on mobile, anchored bottom on desktop */}
        <div
          className="pointer-events-auto absolute inset-x-0 mx-auto top-5 z-20 w-full max-w-7xl px-4 pb-8 sm:px-6 lg:top-auto lg:bottom-0 lg:pb-[6vh]"
          style={{
            opacity: subheadlineOpacity,
            transform: `translateY(${(1 - subheadlineOpacity) * 20}px)`,
          }}
        >
          <div className="flex w-full mx-auto lg:mx-0 max-w-[22rem] flex-col items-center text-center gap-3 sm:max-w-lg sm:gap-4 lg:max-w-lg lg:gap-6">

            {/* Elegant Introduction */}
            <div className="mb-0 sm:mb-1">
              <h2
                className="font-display text-[3.25rem] font-bold leading-none tracking-wider text-foreground sm:text-5xl lg:text-[4rem]"
                style={{ textShadow: '0 0 30px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1)' }}
              >
                Jsem Kristýna
              </h2>
            </div>

            {/* About Me Story */}
            <div
              className="flex flex-col gap-2 text-[12.5px] font-medium leading-[1.5] text-foreground/85 sm:gap-3 sm:text-[14px] lg:gap-4 lg:text-[15px] lg:leading-[1.6]"
              style={{ textShadow: '0 0 15px rgba(255,255,255,1)' }}
            >
              {/* Short version for mobile & tablet (< 1024px) */}
              <div className="lg:hidden flex flex-col gap-2 sm:gap-3">
                <p>
                  Je mi {kristynaAge} let a k focení jsem se dostala díky svému staršímu bratrovi. Začínala jsem s krajinou a zvířaty, ale skutečný zlom přišel u portrétů – práce s lidmi a emocemi mě naprosto pohltila.
                </p>
                <p>
                  Moje první svatba pak odstartovala cestu svatební fotografky, na kterou se dnes nejvíc soustředím. Vedle svateb fotím i kapely a rodiny s dětmi, kde mě baví zachytit přirozené momenty.
                </p>
              </div>
              {/* Full version for desktop (>= 1024px) */}
              <p className="hidden lg:block">
                Je mi {kristynaAge} let a k focení jsem se dostala vlastně díky svému staršímu bratrovi, který si tehdy pořídil svůj první fotoaparát. Mně bylo kolem deseti a od té chvíle mě focení úplně pohltilo. Foťák jsem si postupně půjčovala čím dál častěji a z prvních pokusů s krajinou a zvířaty jsem se časem dostala až k portrétům.
              </p>
              <p className="hidden lg:block">
                Právě tehdy přišel zásadní zlom. Práce s lidmi a zachycování skutečných emocí mě oslovily natolik, že se tomu věnuji dodnes. O pár let později přišla moje úplně první svatba – a právě ta odstartovala cestu, na které jsem dnes jako svatební fotografka.
              </p>
              <p className="hidden lg:block">
                Svatby pro mě mají jedinečné kouzlo. Každá je jiná, každá má svůj vlastní příběh a atmosféru. Vedle svateb se věnuji také focení kapel a rodin s dětmi, kde mě baví zachytit přirozenost, energii i drobné okamžiky, které mají pro lidi největší hodnotu.
              </p>
            </div>

            {/* Ultimate Contact block */}
            <div className="mt-2 flex w-full flex-col gap-3 sm:mt-4 sm:gap-4">
              <Link
                href="/kontakt"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-xs font-semibold tracking-wide text-background shadow-lg shadow-foreground/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-xl hover:shadow-primary/20 sm:px-6 sm:py-4 sm:text-sm"
              >
                Mám zájem o focení
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
              </Link>

              <div className="hidden sm:flex items-center justify-center gap-3 text-[11px] font-medium tracking-wide text-foreground/60 sm:gap-4 sm:text-[13px]">
                <a href="mailto:bulickovak@email.cz" className="transition-colors hover:text-primary">
                  bulickovak@email.cz
                </a>
                <span className="h-1 w-1 rounded-full bg-foreground/20" />
                <a href="tel:+420736121170" className="transition-colors hover:text-primary">
                  736 121 170
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - kept subtle at the bottom */}
        <div
          className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <ChevronDown className="h-6 w-6 animate-bounce text-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
}
