'use client';

import React, { useState, useCallback } from 'react';
import { MediaType, PortfolioItem } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────
interface PortfolioGridProps {
  items: PortfolioItem[];
  onDelete?: (id: string) => void;
  editable?: boolean;
}

// ─── Media Icons ──────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 group-hover:bg-white/20 group-hover:scale-110">
      <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  item: PortfolioItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-black transition-all duration-200 z-10"
        aria-label="Close lightbox"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-black transition-all duration-200"
          aria-label="Previous item"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-black transition-all duration-200"
          aria-label="Next item"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center gap-4">
        {item.mediaType === 'IMAGE' && (
          <img
            src={item.mediaUrl || item.url}
            alt={item.title}
            className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
        )}

        {item.mediaType === 'VIDEO' && (
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
            <video
              src={item.mediaUrl || item.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {item.mediaType === 'LINK' && (
          <div className="bg-[#FFFFFF] border border-[#111111] rounded-2xl p-8 text-center flex flex-col items-center gap-4 max-w-sm w-full">
            <LinkIcon />
            <p className="text-black font-semibold text-lg">{item.title}</p>
            {item.description && <p className="text-gray-400 text-sm">{item.description}</p>}
            <a
              href={item.mediaUrl || item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#FFF4D6] bg-red-600 hover:bg-red-600 transition-all duration-200"
            >
              Open Link
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {item.mediaType === 'PDF' && (
          <div className="bg-[#FFFFFF] border border-[#111111] rounded-2xl p-8 text-center flex flex-col items-center gap-4 max-w-sm w-full">
            <PdfIcon />
            <p className="text-black font-semibold text-lg">{item.title}</p>
            {item.description && <p className="text-gray-400 text-sm">{item.description}</p>}
            <a
              href={item.mediaUrl || item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all duration-200"
            >
              Open PDF
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Title + description */}
        {(item.title || item.description) && item.mediaType !== 'LINK' && item.mediaType !== 'PDF' && (
          <div className="text-center">
            {item.title && <p className="text-black font-semibold">{item.title}</p>}
            {item.description && <p className="text-gray-400 text-sm mt-1">{item.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Grid Item ────────────────────────────────────────────────────────────────
function PortfolioGridItem({
  item,
  onClick,
  onDelete,
  editable,
}: {
  item: PortfolioItem;
  onClick: () => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
}) {
  const isImage = item.mediaType === 'IMAGE';
  const isVideo = item.mediaType === 'VIDEO';
  const isLink = item.mediaType === 'LINK';
  const isPdf = item.mediaType === 'PDF';

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="relative aspect-video bg-[#FFFFFF] border border-[#111111] rounded-xl overflow-hidden hover:border-red-600/30 hover:shadow-[0_0_20px_rgba(230,57,70,0.08)] transition-all duration-300 w-full text-left"
        aria-label={`Open ${item.title}`}
      >
        {/* Image */}
        {isImage && (
          <>
            <img
              src={item.thumbnailUrl ?? item.mediaUrl ?? item.url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <p className="text-black text-xs font-medium truncate">{item.title}</p>
            </div>
          </>
        )}

        {/* Video */}
        {isVideo && (
          <>
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-[#FFF4D6]" />
            )}
            {/* Dark overlay + play button */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <PlayIcon />
            </div>
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-black text-xs font-medium truncate">{item.title}</p>
            </div>
          </>
        )}

        {/* Link */}
        {isLink && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4 bg-gradient-to-br from-red-600/20 to-[#FFF4D6] group-hover:from-red-600/30 transition-all duration-300">
            <LinkIcon />
            <p className="text-black text-sm font-medium text-center line-clamp-2">{item.title}</p>
            {item.description && (
              <p className="text-gray-500 text-xs text-center line-clamp-1">{item.description}</p>
            )}
            <span className="text-xs text-red-600/60 font-medium">Click to open →</span>
          </div>
        )}

        {/* PDF */}
        {isPdf && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4 bg-gradient-to-br from-red-900/20 to-[#FFF4D6] group-hover:from-red-900/30 transition-all duration-300">
            <PdfIcon />
            <p className="text-black text-sm font-medium text-center line-clamp-2">{item.title}</p>
            {item.description && (
              <p className="text-gray-500 text-xs text-center line-clamp-1">{item.description}</p>
            )}
            <span className="text-xs text-red-400/60 font-medium">PDF Document</span>
          </div>
        )}

        {/* Media type tag */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-black backdrop-blur-sm">
            {item.mediaType}
          </span>
        </div>
      </button>

      {/* Delete button if editable */}
      {editable && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="absolute top-2 left-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-black rounded-lg text-xs transition-colors z-10"
          title="Delete item"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PortfolioGrid({ items, onDelete, editable }: PortfolioGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevItem = useCallback(
    () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    []
  );
  const nextItem = useCallback(
    () => setLightboxIndex((i) => (i !== null && i < items.length - 1 ? i + 1 : i)),
    [items?.length]
  );

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#111111] flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No portfolio items yet.</p>
      </div>
    );
  }

  // Sort by sortOrder or order field
  const sorted = [...items].sort((a, b) => (a.sortOrder ?? a.order ?? 0) - (b.sortOrder ?? b.order ?? 0));

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((item, index) => (
          <PortfolioGridItem
            key={item.id}
            item={item}
            onClick={() => openLightbox(index)}
            onDelete={onDelete}
            editable={editable}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          item={sorted[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < sorted.length - 1}
        />
      )}
    </>
  );
}
