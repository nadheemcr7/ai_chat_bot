import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Mic,
  FileDown
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/presentationSlides';

export const PresentationView: React.FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = PRESENTATION_SLIDES[currentSlideIdx];
  const totalSlides = PRESENTATION_SLIDES.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlideIdx((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, isFullscreen]);

  return (
    <div
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 overflow-y-auto p-4 sm:p-8'
          : 'max-w-[1440px] mx-auto px-4 sm:px-6 py-6'
      } space-y-6`}
    >
      {/* Top Studio Header & Download .PPTX Bar */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-medium text-sky-600 dark:text-sky-400 mb-1">
            <span>Ready-to-Present Academic Slide Deck (8 Visual Slides + Live Screenshots + Viva Script)</span>
          </div>
          <h1
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isFullscreen ? 'text-white' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            CSDX 142 Project Presentation (PPT) &amp; Easy Viva Guide
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="./CampusMate_AI_CSDX142_Presentation.pptx"
            download="CampusMate_AI_CSDX142_Presentation.pptx"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PowerPoint (.pptx) with Images</span>
          </a>

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Exit Full-Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Full-Screen Present Mode</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Slide Selector Strip */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PRESENTATION_SLIDES.map((s, idx) => {
            const isActive = idx === currentSlideIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlideIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tabular-nums font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-sky-400'
                }`}
              >
                Slide 0{s.id}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIdx === 0}
            aria-label="Previous slide"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {currentSlideIdx + 1} / {totalSlides}
          </span>
          <button
            type="button"
            onClick={() => setCurrentSlideIdx((prev) => Math.min(totalSlides - 1, prev + 1))}
            disabled={currentSlideIdx === totalSlides - 1}
            aria-label="Next slide"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 disabled:opacity-40 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN 16:9 PRESENTATION SLIDE STAGE */}
      <article className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        {/* Slide Header */}
        <div className="border-b border-slate-800 pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-sky-400">
              {slide.kicker}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {slide.subtitle}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 shrink-0">
            CSDX 142 · Zero-Cost AI Project
          </div>
        </div>

        {/* Plain-English 1-Sentence Takeaway Banner */}
        <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-800/80 text-xs sm:text-sm text-sky-200 leading-relaxed">
          <strong className="text-sky-400 font-semibold mr-1.5">In Simple Words:</strong>
          {slide.easySummary}
        </div>

        {/* 2-Column Slide Body: Left = Easy Bullet Points & Formula Box, Right = Real Screenshot of Our Chatbot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2.5">
              <div className="text-xs font-mono font-semibold text-slate-400">
                KEY SLIDE POINTS (EASY TO EXPLAIN):
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                {slide.bulletPoints.map((pt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 leading-relaxed"
                  >
                    <span className="font-mono text-xs font-bold text-sky-400 mt-0.5 shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical / Architecture Highlight Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400">
                {slide.highlightTitle}
              </div>
              <ul className="space-y-1.5 text-xs font-mono text-slate-300">
                {slide.highlightPoints.map((hp, i) => (
                  <li key={i} className="leading-snug">
                    • {hp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Live High-Resolution Screenshot of Our Chatbot (6 Cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-md">
              <img
                src={slide.imageUrl}
                alt={slide.imageCaption}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              {slide.imageCaption}
            </p>
          </div>
        </div>

        {/* Word-for-Word Speaker Script Box */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/70 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Mic className="w-4 h-4" />
            <span>What to Say When Presenting This Slide (Word-for-Word Viva Script):</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed italic">
            {slide.speakerScript}
          </p>
        </div>
      </article>
    </div>
  );
};
