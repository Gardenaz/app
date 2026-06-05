# Design Guide — OwnaFarm Style Reference

> Referensi desain berdasarkan analisis langsung dari [ownafarm.xyz](https://www.ownafarm.xyz/).  
> Digunakan sebagai panduan implementasi visual untuk proyek GardenAZ.

---

## 1. Fondasi Design

### 1.1 Palet Warna

| Token | Nilai | Kegunaan |
|---|---|---|
| `--color-bg` | `#FFFFFF` / `rgb(255,255,255)` | Background utama halaman |
| `--color-bg-soft` | `#FAFAF7` / `rgb(250,250,247)` | Background section alternating |
| `--color-bg-muted` | `#F2F3EF` / `rgb(242,243,239)` | Card, panel background |
| `--color-text-primary` | `#0A0A0A` / `rgb(10,10,10)` | Heading utama |
| `--color-text-body` | `#3A3A3A` / `rgb(58,58,58)` | Body text |
| `--color-text-muted` | `#6F6F6F` / `rgb(111,111,111)` | Label, caption, meta text |
| `--color-text-subtle` | `#9A9A9A` / `rgb(154,154,154)` | Placeholder, disabled text |
| `--color-border` | `#E5E5E5` / `rgb(229,229,229)` | Border card, divider |
| `--color-border-muted` | `#C9C9C0` / `rgb(201,201,192)` | Border halus pada section gelap |
| `--color-accent-green` | `#4F7942` / `rgb(79,121,66)` | Warna aksen utama — hijau pertanian |
| `--color-dark-base` | `#0F1E14` / `rgb(15,30,20)` | Background section gelap (footer, CTA dark) |
| `--color-overlay-light` | `rgba(255,255,255,0.55)` | Overlay pada elemen dengan backdrop |
| `--color-shadow-sm` | `rgba(0,0,0,0.08)` | Shadow ringan card |
| `--color-shadow-md` | `rgba(0,0,0,0.12)` | Shadow medium |

### 1.2 Tipografi

**Font Families:**

| Peran | Font | Fallback |
|---|---|---|
| Heading / Display | `Space Grotesk` | `Inter, system-ui, sans-serif` |
| Body / UI | `Inter` | `system-ui, -apple-system, sans-serif` |
| Monospace / Code | `ui-monospace` | `monospace` |

**Type Scale:**

| Token | Size | Weight | Line Height | Penggunaan |
|---|---|---|---|---|
| `text-display` | `72px` | `500` | `0.98` (98%) | H1 hero headline |
| `text-h2` | `48px` | `500` | `1.1` | Section heading |
| `text-h3` | `24px` | `600` | `1.3` | Card title, subsection |
| `text-body-lg` | `18px` | `400` | `1.6` | Lead paragraph hero |
| `text-body` | `16px` | `400` | `1.6` | Body text umum |
| `text-sm` | `14px` | `400` | `1.5` | Caption, label, meta |
| `text-xs` | `12px` | `500` | `1.4` | Badge, tag, counter |
| `text-mono` | `13px` | `400` | `1.4` | Nomor urut, kode |

**Catatan tipografi:**
- Heading menggunakan `Space Grotesk` medium (500), bukan bold
- Italic / `<em>` dipakai di headline hero untuk highlight keyword (warna tetap hitam, style italic)
- Nomor urut (001, 002, dst) menggunakan monospace kecil, warna `--color-text-subtle`

### 1.3 Spacing System

Berbasis skala `4px`:

```
4px   → xs
8px   → sm  
12px  → md
16px  → base
24px  → lg
32px  → xl
48px  → 2xl
64px  → 3xl
80px  → 4xl
96px  → 5xl
128px → 6xl
```

**Section padding:**
- Vertikal: `80px – 120px` top/bottom
- Horizontal (container): `32px` pada desktop, `16px` pada mobile

**Max container width:** `1200px`, centered

---

## 2. Navbar

### Struktur
```
[Logo + Nama] ............ [Nav Links] [CTA Button]
```

### Spesifikasi

| Properti | Nilai |
|---|---|
| Background | `transparent` (scroll awal) |
| Position | `fixed` top-0, full width |
| Padding | `24px 32px` |
| Height | ~`64–72px` |
| Border | tidak ada (no border-bottom) |
| Backdrop filter | tidak ada (flat, no blur) |

**Logo:**
- Image + teks brand di samping kanan
- Font: `Space Grotesk`, ukuran `18px`, weight `600`
- Warna teks: hitam

**Nav Links:**
- "Docs" — link biasa, font `Inter 14px`, warna `--color-text-muted`
- Hover: warna gelap `--color-text-primary`

**CTA Button — "Launch App":**
- Style: outlined atau filled dengan rounded corner
- Padding: `10px 20px`
- Border radius: `8px`
- Background: `--color-text-primary` (hitam)
- Teks: putih, `14px`, weight `500`
- State disabled: opacity 50%, cursor not-allowed

**Responsive:**
- Mobile: hamburger menu atau simplifikasi ke logo + button saja

---

## 3. Hero Section

### Layout
- Full viewport height (`100vh`) atau setidaknya `90vh`
- Background: putih bersih (`#FFFFFF`)
- Konten centered secara vertikal dan horizontal (atau left-aligned dengan max-width)

### Konten Hierarki

```
[Badge/Award pill]
[H1 Headline — dengan italic keyword]
[Lead paragraph]
[Award badge]
[CTA button]
```

### Spesifikasi

**Headline (H1):**
- Font: `Space Grotesk`, `72px`, weight `500`
- Line height: `0.98` (tight, slightly below 1)
- Warna: `#0A0A0A`
- Keyword di-italic menggunakan `<em>` — tidak berubah warna, tetap hitam
- Contoh: *"Where **real-world assets** meet **GameFi**."*

**Lead Paragraph:**
- Font: `Inter`, `18px`, weight `400`
- Warna: `#6F6F6F`
- Max width: `520px`
- Margin top: `24px`

**Award / Achievement Badge:**
- Pill shape dengan border rounded `9999px`
- Background: `#F2F3EF` atau `rgba(0,0,0,0.05)`
- Border: `1px solid #E5E5E5`
- Padding: `8px 16px`
- Konten: icon kecil + teks deskripsi + chevron/arrow icon
- Font size: `13px`, warna `#3A3A3A`
- Clickable (link ke sumber eksternal)

**CTA Button Utama:**
- Label: misalnya "Coming Soon" / "Launch App"
- Background: `#0A0A0A` (hitam solid)
- Teks: putih, `15px`, weight `500`
- Padding: `14px 28px`
- Border radius: `8px`
- State disabled: opacity `0.4`, cursor `default`
- Margin top: `32px`

**Background decoration:**
- Bersih, putih. Tidak ada gradient atau image background
- Subtle: bisa ada noise texture sangat ringan atau titik-titik micro grid

---

## 4. Section — "What is OwnaFarm?" (Explainer Stack)

### Layout
- Background: `#FAFAF7` (off-white sedikit cream)
- 2 kolom: kiri konten teks, kanan interactive layer tabs
- Padding section: `96px 32px`

### Label Section (Kecil di atas heading)
- Pill icon + teks label kecil
- Font: `Inter 12px`, weight `500`, uppercase atau sentence case
- Warna: `#6F6F6F`
- Background: `rgba(79,121,66,0.1)` (hijau transparan)
- Border radius: `9999px`
- Padding: `4px 12px`

### Heading (H2)
- Font: `Space Grotesk`, `48px`, weight `500`
- Max width: `480px`
- Warna: `#0A0A0A`

### Body
- Font: `Inter`, `16px`, `#6F6F6F`
- Dikutip dengan `"..."` untuk emphasis naratif

### Layer Tabs (Interactive)
- Stack tab vertikal atau horizontal (L1–L5)
- Setiap tab: nomor layer kecil + label
- Active state: background filled hijau `#4F7942`, teks putih
- Inactive: border tipis, teks muted
- Content panel kanan: heading layer + deskripsi singkat + tombol

### Layer Card List (bawah)
- Numbered list `001` – `005`
- Setiap item: nomor monospace kecil + icon kecil + heading + paragraf
- Separator: border bottom `1px solid #E5E5E5`
- Hover state: background `#F2F3EF`, subtle transition

---

## 5. Section — Problem

### Layout
- Background: `#FFFFFF` atau `#FAFAF7`
- Split layout: kiri teks + cards, kanan visual (gambar kontrak / biner data)
- Padding: `96px 32px`

### Label Kecil
- Sama dengan pola section label di atas
- Warna aksen label: `#6F7785` (biru-abu)

### Heading (H2)
- Multi-baris, bold statement
- Contoh: *"Valid contracts.\nNo working capital."*
- Baris pertama warna hitam, baris kedua bisa dipertahankan hitam atau sedikit berbeda weight

### Visual Dekoratif (kanan)
- Gambar dokumen / kontrak yang distilisasi
- Overlay text biner/matriks (monospace kecil, warna muted)
- Badge floating: label `"$170B gap"` atau statistik kunci
- Border: dashed atau dotted untuk efek "document scan"

### Problem Cards (2 kolom)
- Numbered card: `001`, `002`
- Setiap card: icon + heading + paragraf + "Read documentation ›" link
- Background: `#F2F3EF`
- Border radius: `12px`
- Padding: `24px`
- Hover: slight shadow lift

---

## 6. Section — Solution

### Layout
- Background: `#FAFAF7`
- Heading + paragraf centered atau left-aligned
- Grid 5 feature cards (bisa 2-3 per baris di mobile)

### Feature Cards
- Setiap card: icon SVG + heading + paragraf
- Background: `#FFFFFF`
- Border: `1px solid #E5E5E5`
- Border radius: `16px`
- Padding: `28px`
- Clickable (link ke docs)
- Hover: shadow `rgba(0,0,0,0.08)` + slight translateY `-2px`
- Icon: ilustrasi simple, monochrome atau dua warna

---

## 7. Section — How It Works

### Layout
- Background: `#FFFFFF`
- Tab toggle: "For Digital Farmers" / "For Farm Owners"
- Di bawah tab: 4 step cards dalam grid atau horizontal flow

### Tab Toggle
- Pill-style switcher
- Active: background `#0A0A0A`, teks putih
- Inactive: background `transparent`, border `1px solid #E5E5E5`, teks muted
- Icon kecil di kiri teks tab
- Border radius: `9999px`

### Step Cards (1–4)
- Numbered: `001` – `004`, monospace kecil, warna muted
- Icon / ilustrasi per step (bisa SVG line art atau ilustrasi flat kecil)
- Heading H3 + paragraf + "Read documentation ›" link
- Koneksi antar step: opsional garis atau panah subtle

---

## 8. Section — Why OwnaFarm (Dual Perspective)

### Layout
- Background: `#FAFAF7` atau gelap `#0F1E14` (pilihan dramatic)
- Kiri: heading + paragraf + tab toggle (Investors / Farmers)
- Kanan: diagram radial / arc dengan node-node benefit

### Diagram Arc
- SVG berbasis lingkaran atau elips
- Node di sekeliling: setiap benefit sebagai button/pill kecil yang bisa di-klik
- Tengah: logo + tagline
- Active node: filled, warna aksen hijau
- Inactive node: outlined, warna border muted

### Benefit Pills (Nodes)
- Shape: pill rounded
- Padding: `8px 14px`
- Font: `Inter 13px`
- Warna: sesuai state (active/inactive)
- Hover: scale sedikit + shadow

### Award Badge (Bottom)
- Sama dengan pill di hero
- Mantle hackathon badge

---

## 9. Footer

### Layout
- Background: `#0F1E14` (hijau sangat gelap, hampir hitam)
- 2 baris: atas logo + copyright, bawah links
- Padding: `48px 32px`
- Border top: `1px solid rgba(201,201,192,0.2)`

### Baris Atas
- Kiri: Logo (image) + nama brand teks putih
- Kanan: copyright `© 2026 All rights reserved.` — font `Inter 14px`, warna `rgba(255,255,255,0.5)`

### Baris Bawah / Links
- **Contact:** label kecil "Contact" (muted) + email aktif (warna putih, underline on hover)
- **Docs:** link biasa, warna `rgba(255,255,255,0.7)`
- **Social (X/Twitter):** icon SVG, warna `rgba(255,255,255,0.7)`, hover putih
- Semua link font: `Inter 14px`

---

## 10. Komponen UI Reusable

### Button

| Variant | Background | Teks | Border | Radius |
|---|---|---|---|---|
| Primary | `#0A0A0A` | Putih | — | `8px` |
| Secondary | `transparent` | `#0A0A0A` | `1px solid #0A0A0A` | `8px` |
| Ghost | `transparent` | `#6F6F6F` | `1px solid #E5E5E5` | `8px` |
| Accent | `#4F7942` | Putih | — | `8px` |
| Disabled | (any) opacity `0.4` | — | — | — |

Padding default: `12px 24px`  
Font: `Inter 14–15px`, weight `500`

### Badge / Pill

```
[icon?] [teks label]
```
- Background: `rgba(79,121,66,0.1)` untuk status positif
- Background: `rgba(0,0,0,0.06)` untuk neutral
- Border radius: `9999px`
- Padding: `4px 12px`
- Font: `12–13px`, weight `500`

### Card

- Background: `#FFFFFF` atau `#F2F3EF`
- Border: `1px solid #E5E5E5`
- Border radius: `12–16px`
- Padding: `24–28px`
- Shadow: `0 2px 8px rgba(0,0,0,0.06)`
- Hover: `0 4px 16px rgba(0,0,0,0.10)`, `translateY(-2px)`
- Transition: `all 0.2s ease`

### Section Label (Kecil di atas H2)

```
[icon kecil] [teks label kecil]
```
- Background pill: `rgba(79,121,66,0.08)`
- Border: `1px solid rgba(79,121,66,0.2)`
- Font: `Inter 12px`, weight `500`
- Warna teks: `#4F7942`
- Border radius: `9999px`

### Numbered Item

```
[001]  [Icon]
       [Heading H3]
       [Paragraf]
       [Link ›]
```
- Nomor: `ui-monospace`, `12px`, warna `#9A9A9A`
- Separator: `border-bottom: 1px solid #E5E5E5`

---

## 11. Animasi & Transisi

| Elemen | Animasi | Durasi |
|---|---|---|
| Card hover | `translateY(-2px)` + shadow lift | `200ms ease` |
| Button hover | background darken / lighten | `150ms ease` |
| Tab switch | fade + slide content | `250ms ease` |
| Hero text | tidak ada (static, clean) | — |
| Layer tab highlight | background fill | `200ms ease` |
| Scroll entrance | `fadeInUp` subtle (opsional) | `400ms ease-out` |

Filosofi animasi: **subtle dan functional**, bukan dekoratif. Tidak ada parallax, tidak ada particle effects berat.

---

## 12. Iconografi & Ilustrasi

- **Gaya:** line art / flat minimal, stroke weight konsisten `1.5–2px`
- **Ukuran standar:** `24px`, `32px`, `48px` (ilustrasi section)
- **Warna:** monochrome (hitam/putih) atau dua warna (hitam + hijau aksen)
- **Ilustrasi section:** abstrak pertanian — benih, tanaman, kontrak dokumen — tetap minimal
- **Brand icon:** logo OwnaFarm adalah emblem sederhana + wordmark

---

## 13. Grid & Layout System

```
Desktop (≥1280px):  12-col grid, 32px gutter
Tablet (768–1279px): 8-col grid, 24px gutter
Mobile (<768px):     4-col grid, 16px gutter
```

**Breakpoints:**
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Max content width:** `1200px`  
**Section rhythm:** alternating background `#FFFFFF` ↔ `#FAFAF7`

---

## 14. Prinsip Design Keseluruhan

1. **Clean over decorative** — tidak ada efek berat, warna sangat terkendali (hitam, putih, off-white, satu aksen hijau)
2. **Typography-led** — hierarki konten dibangun dari ukuran dan weight teks, bukan dari warna atau ornamen
3. **Agricultural metaphor** — istilah (plant, water, harvest, seed) dan warna hijau sebagai aksen utama mencerminkan tema
4. **Real ≠ boring** — kombinasi kata "Real yield" + GameFi dijembatani dengan UI yang terasa seperti produk consumer, bukan DeFi protokol teknis
5. **Accessibility** — kontras teks body minimal 4.5:1, semua interactive element accessible via keyboard
6. **Performance first** — tidak ada heavy animations, tidak ada gambar hero yang besar, SVG-first untuk ilustrasi
