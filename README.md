# SeatMind — AI Restoran İdarəetmə Platforması

Premium restoran idarəetmə sistemi — investor təqdimatı və demo üçün hazırlanmış tam funksional frontend.

## Texnologiyalar

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite, Tailwind CSS, Redux, Framer Motion |
| Data | Mock data + localStorage (backend yoxdur) |

## Sürətli Başlanğıc

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

## Demo Giriş

- **Email:** `demo@seatmind.az`
- **Şifrə:** `demo123`

## Əsas Funksionallıqlar

- **Dashboard** — Real-time statistika, AI banner, gəlir trendi
- **Rezervasiyalar** — Əlavə et, redaktə et, sil, check-in, VIP badge
- **Gözləmə Siyahısı** — Prioritet, oturma, masa təyinatı
- **Çoxmərtəbəli Masa Planı** — 4 mərtəbə, xidmət fazaları, canlı izləmə, drag & drop
- **Müştəri CRM** — VIP idarəetməsi, etiketlər, axtarış
- **Menyu** — Şəkil yükləmə, kateqoriyalar, CRUD
- **Personal** — Mərtəbə üzrə növbə, status idarəetməsi
- **Analitika** — Qrafiklər, CSV export, AI tövsiyələri
- **AI Mərkəzi** — Mərtəbə analizi, proqnozlar
- **QR Rezervasiya** — `/book/SM-NIZAMI2026` public booking
- **Command Palette** — `Cmd+K` global axtarış

## Struktur

```
seatmind/
├── src/              # React frontend
├── public/logo.svg   # SeatMind logo
└── README.md
```

Bütün məlumatlar brauzerin `localStorage`-ında saxlanılır. Tənzimləmələr səhifəsindən demo məlumatları bərpa edə bilərsiniz.
