'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaType = 'IMAGE' | 'VIDEO' | 'LINK' | 'PDF';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: MediaType;
  createdAt?: string;
}

interface NewItemForm {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: MediaType;
}

const INITIAL_FORM: NewItemForm = {
  title: '',
  description: '',
  mediaUrl: '',
  mediaType: 'IMAGE',
};

// ─── Media Type Icons ─────────────────────────────────────────────────────────
const MediaIcons: Record<MediaType, React.ReactNode> = {
  IMAGE: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  VIDEO: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  LINK: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  PDF: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

const MediaColors: Record<MediaType, string> = {
  IMAGE: '#E63946',
  VIDEO: '#D00000',
  LINK: '#1B9E5A',
  PDF: '#FFB703',
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  const isSuccess = type === 'success';
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: isSuccess ? 'rgba(27,158,90,0.15)' : 'rgba(208,0,0,0.15)',
        border: `1px solid ${isSuccess ? '#1B9E5A' : '#D00000'}`,
        color: isSuccess ? '#1B9E5A' : '#D00000',
        zIndex: 9999,
        padding: '12px 20px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      {isSuccess ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      {message}
    </div>
  );
}

// ─── Input Style ──────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: '#FFF4D6',
  border: '1px solid #111111',
  color: '#111',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
};

// ─── Portfolio Item Card ──────────────────────────────────────────────────────
function ItemCard({
  item,
  onDelete,
}: {
  item: PortfolioItem;
  onDelete: (id: string) => void;
}) {
  const color = MediaColors[item.mediaType] ?? '#444444';

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid #111111`,
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Media Preview */}
      {item.mediaType === 'IMAGE' && item.mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.mediaUrl}
          alt={item.title}
          style={{ width: '100%', height: '160px', objectFit: 'cover' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          style={{
            height: '160px',
            background: `${color}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          {MediaIcons[item.mediaType]}
        </div>
      )}

      {/* Media Type Badge */}
      <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
        <span
          style={{
            background: `${color}22`,
            border: `1px solid ${color}44`,
            color,
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: '600',
          }}
        >
          {item.mediaType}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(item.id)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(208,0,0,0.2)',
          border: '1px solid rgba(208,0,0,0.4)',
          color: '#D00000',
          borderRadius: '6px',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          lineHeight: '1',
        }}
        aria-label="Delete item"
      >
        ×
      </button>

      {/* Content */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p className="text-black font-semibold text-sm truncate">{item.title}</p>
        {item.description && (
          <p
            style={{ color: '#444444', fontSize: '12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {item.description}
          </p>
        )}
        {item.mediaUrl && (
          <a
            href={item.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color, fontSize: '12px', marginTop: 'auto' }}
          >
            View →
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 rounded-xl"
      style={{ border: '2px dashed #111111' }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
      <p className="text-black font-medium mt-4">No portfolio items yet</p>
      <p style={{ color: '#555555' }} className="text-sm mt-1">
        Add your first item to showcase your work.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewItemForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch items ─────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.items ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ── Field update ────────────────────────────────────────────────────────────
  const set = <K extends keyof NewItemForm>(key: K, value: NewItemForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Submit new item ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Title is required.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('Item added!', 'success');
        setForm(INITIAL_FORM);
        setShowForm(false);
        await fetchItems();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message ?? 'Failed to add item.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete item ─────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast('Item deleted.', 'success');
      } else {
        showToast('Failed to delete item.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black text-2xl font-bold">Portfolio</h1>
          <p style={{ color: '#444444' }} className="text-sm mt-1">
            Showcase your best work to production companies.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            background: showForm ? 'rgba(230,57,70,0.1)' : '#E63946',
            color: showForm ? '#E63946' : '#FFF4D6',
            border: '1px solid #E63946',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{ background: '#FFFFFF', border: '1px solid #E6394644', borderRadius: '14px', padding: '24px' }}
          className="space-y-4"
        >
          <h2 className="text-black font-semibold mb-2 flex items-center gap-2">
            <span style={{ width: '3px', height: '16px', background: '#E63946', borderRadius: '2px', display: 'inline-block' }} />
            New Portfolio Item
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label style={{ color: '#444444', fontSize: '13px', fontWeight: '500' }}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Macbeth — Sidelight & Haze Plot"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label style={{ color: '#444444', fontSize: '13px', fontWeight: '500' }}>
                Media URL or Upload
              </label>
              <input
                type="text"
                value={form.mediaUrl.startsWith('data:') ? '[Uploaded Image File]' : form.mediaUrl}
                onChange={(e) => set('mediaUrl', e.target.value)}
                placeholder="Paste an image/video URL or use upload below"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
              />
            </div>
          </div>

          {/* Image Upload & Presets */}
          <div className="p-4 bg-[#FFF4D6] border-2 border-black rounded-lg space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase">📷 Add Image:</span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="portfolio-file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        set('mediaUrl', reader.result as string);
                        set('mediaType', 'IMAGE');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label
                  htmlFor="portfolio-file"
                  className="nb-btn nb-btn-white cursor-pointer !text-xs !py-1.5 !px-3 shadow-[2px_2px_0_#000]"
                >
                  📁 Choose File from Computer
                </label>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-black/20">
              <span className="text-xs text-[#555] font-bold">Or pick sample:</span>
              {[
                { label: '💡 Lighting Rig', url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800' },
                { label: '🎚️ Sound Console', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800' },
                { label: '🎭 Stage Set', url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800' },
                { label: '👗 Costume Stills', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    set('mediaUrl', p.url);
                    set('mediaType', 'IMAGE');
                  }}
                  className="px-2.5 py-1 text-xs bg-white border border-black font-semibold hover:bg-[#FFD60A] transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Live Preview */}
            {form.mediaUrl && (
              <div className="relative mt-2 inline-block border-2 border-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.mediaUrl}
                  alt="Preview"
                  className="h-28 w-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => set('mediaUrl', '')}
                  className="absolute top-1 right-1 bg-black text-white text-xs px-1.5 py-0.5 font-bold hover:bg-[#D00000]"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ color: '#444444', fontSize: '13px', fontWeight: '500' }}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe this piece of work…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#E63946')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#111111')}
            />
          </div>

          {/* Media Type Radio */}
          <div className="flex flex-col gap-2">
            <label style={{ color: '#444444', fontSize: '13px', fontWeight: '500' }}>Media Type</label>
            <div className="flex gap-3 flex-wrap">
              {(['IMAGE', 'VIDEO', 'LINK', 'PDF'] as MediaType[]).map((mt) => {
                const isSelected = form.mediaType === mt;
                const color = MediaColors[mt];
                return (
                  <label
                    key={mt}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${isSelected ? color : '#111111'}`,
                      background: isSelected ? `${color}15` : '#FFF4D6',
                      color: isSelected ? color : '#444444',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: isSelected ? '600' : '400',
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="radio"
                      name="mediaType"
                      value={mt}
                      checked={isSelected}
                      onChange={() => set('mediaType', mt)}
                      style={{ display: 'none' }}
                    />
                    {mt}
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? 'rgba(230,57,70,0.4)' : '#E63946',
              color: submitting ? 'rgba(10,10,15,0.5)' : '#FFF4D6',
              borderRadius: '10px',
              padding: '12px',
              width: '100%',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              marginTop: '4px',
            }}
          >
            {submitting ? 'Adding…' : 'Add to Portfolio'}
          </button>
        </form>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: '#111111', borderTopColor: '#E63946' }}
          />
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Drag Hint */}
      {items.length > 1 && (
        <p style={{ color: '#666666' }} className="text-xs text-center">
          💡 Drag-and-drop reordering coming soon — items are sorted by newest first.
        </p>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
