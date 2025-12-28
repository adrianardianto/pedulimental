# PeduliMental 🧠

PeduliMental adalah platform kesehatan mental komprehensif yang dirancang untuk membantu pengguna menjaga kesejahteraan mental mereka melalui edukasi, pemantauan mandiri, dukungan komunitas, dan konsultasi profesional.

## 🌟 Fitur Utama

- **Edukasi**: Akses berbagai artikel dan video edukasi seputar kesehatan mental dengan riwayat baca tersimpan.
- **Mental Health Tracker**: Evaluasi kesehatan mental Anda dengan pelacakan riwayat yang terhubung personal ke akun Anda.
- **Komunitas Suportif**: Gabung dalam grup diskusi, kirim pesan, dan bangun koneksi yang aman. Status keanggotaan dan chat tersimpan per user.
- **Konsultasi**: Jadwalkan sesi dengan psikolog, lakukan pembayaran simulasi, dan jalankan **Video Call** langsung di platform.
- **Riwayat Terintegrasi**: Pantau semua aktivitas (Konsultasi, Tracker, Edukasi) dalam satu halaman history yang terpusat.

## � Desain Responsif (Mobile, Tablet, & Desktop Support)

Aplikasi ini dibangun dengan pendekatan **Responsive Design** yang memastikan pengalaman pengguna tetap optimal di berbagai perangkat:

- **Smartphone**: Tampilan adaptif yang nyaman digenggam, menu navigasi yang ramah jari, dan layout yang rapi.
- **Tablet**: Layout yang menyesuaikan diri dengan baik pada layar medium, baik dalam mode portrait maupun landscape.
- **Desktop/Laptop**: Tampilan luas yang memanfaatkan lebar layar secara maksimal tanpa mengorbankan keterbacaan.

Semua fitur (Konsultasi Video, Edukasi, Dashboard) dapat diakses dengan lancar tanpa kendala tampilan di perangkat apa pun.

## �🛠️ Teknologi yang Digunakan

Project ini dibangun menggunakan teknologi web modern:

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/) (Centralized Store)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Real-time Communication**: [PeerJS](https://peerjs.com/) (untuk fitur konsultasi video)
- **Data Persistence**: LocalStorage (dengan isolasi data per User/Email)

## 🚀 Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer Anda:

### Prasyarat

- Node.js (versi 16.0 atau lebih baru direkomendasikan)
- npm (bawaan Node.js)

### Instalasi

1. **Clone repository ini** (jika belum):

   ```sh
   git clone https://github.com/adrianardianto/pedulimental.git
   cd pedulimental
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

### Development

Untuk menjalankan server development dengan fitur Hot Module Replacement (HMR):

```sh
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

### Production Build

Untuk mem-build aplikasi untuk production:

```sh
npm run build
```

Hasil build akan berada di folder `dist`.

Untuk melihat preview hasil build secara lokal (simulasi production):

```sh
npm run preview
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat _Pull Request_ atau laporkan _Issues_ jika Anda menemukan masalah.

---

Dibuat dengan hati untuk kesehatan mental semester akhir
