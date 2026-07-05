# 🏢 BranchIQ - Çoklu Şube Restoran Yönetim Konsolu

BranchIQ, modern restoran zincirlerinin şube operasyonlarını, mutfak sipariş kuyruklarını, envanter takibini, personel yönetimini ve finansal raporlamalarını tek bir merkezden yönetmelerini sağlayan **Fullstack (React + Node.js/Express)** tabanlı bir kurumsal yönetim platformudur.

---

## 🌟 Proje Özellikleri ve Yetenekleri

### 👨‍💻 Yetkilendirme ve Rol Tabanlı Rotalar (Access Control)
Sistemde **3 farklı kullanıcı rolü** bulunur ve her rol sadece kendi yetki alanındaki rotalara erişebilir:
*   **Super Admin (Kurumsal Yönetim)**: Tüm şubelerin finansal performanslarını, personel dağılımlarını, menü fiyat politikalarını ve stok durumlarını üst seviyeden izler.
*   **Branch Admin (Şube Yönetimi)**: Kendi şubesine ait sipariş onaylarını, masa düzenini ve müşteri rezervasyonlarını yönetir.
*   **Operation Admin (Mutfak & Saha)**: Mutfak sipariş kuyruğunu (hazırlanıyor, tamamlandı biletleri) ve masaların canlı doluluk haritasını takip eder.

### 🌐 Çoklu Dil Desteği (Türkçe & English - i18n)
*   Tüm yönetim paneli tek tıkla **Türkçe** ve **İngilizce** dilleri arasında dinamik olarak geçiş yapabilir.
*   Kullanıcının dil tercihi tarayıcı hafızasında (`localStorage`) saklanır, böylece sayfa yenilense dahi dil tercihi korunur.

### 📈 Canlı Veri Akış Simülatörü (Live Order Simulator)
*   Sunumlar sırasında sistemin canlı veri akışını göstermek için üst menüye bir simülatör entegre edilmiştir.
*   Aktif edildiğinde, arka planda her **4.5 saniyede bir** rastgele şubelerden sipariş oluşturarak Redux Store ve yerel veritabanına kaydeder.
*   Finansal grafikler, mutfak kuyrukları ve KPI kartları gerçek zamanlı olarak güncellenip animasyonlarla yeniden çizilir.

### 📟 Canlı Redux Event Log Konsolu (Live Dev Console)
*   Uygulamanın alt kısmında yer alan terminal paneli sayesinde, arka planda gerçekleşen tüm Redux aksiyonları (`type` ve `payload` detaylarıyla) canlı olarak akar. 
*   Bu özellik, durum yönetiminin (Redux State) arka planda nasıl çalıştığını görselleştirmektedir.

### 📊 Performans Uyarıları ve Raporlama (Analytics & Reports)
*   **Düşük Performans Alarmları**: Aylık cirosu $12,000'ın veya müşteri değerlendirmesi 4.5 yıldızın altında olan şube kartlarında yanıp sönen kırmızı uyarı ışıkları yanar.
*   **PDF/CSV Dışa Aktarım**: Şube analiz sayfalarında cam tasarımlı (glassmorphic) mikro-bildirim pencereleri eşliğinde dosya indirme simülasyonu çalışır.

---

## 🛠️ Kullanılan Teknolojiler

### Ön Yüz (Frontend)
*   **React (Vite)**: Hızlı derleme ve bileşen tabanlı modern UI yapısı.
*   **Redux Toolkit**: Merkezi durum yönetimi (Single Source of Truth) ve asenkron veri çekme (Thunk) mekanizmaları.
*   **React Router DOM**: Rol tabanlı rota koruma (ProtectedRoute) ve yönlendirmeler.
*   **CSS & TailwindCSS**: Tamamen duyarlı (responsive) ve premium arayüz tasarımı.
*   **Recharts**: Finansal cirolar ve şube dağılımları için dinamik grafik çizimleri.
*   **Lucide React**: Modern ve minimalist simge kütüphanesi.

### Arka Yüz & Veritabanı (Backend & Database)
*   **Node.js & Express**: API rotalarını (GET, POST, PUT, DELETE) ve kullanıcı doğrulama (Auth) mantığını işleyen özel sunucu.
*   **fs/promises**: Verilerin kalıcı olarak yerel diske yazılmasını sağlayan Node.js dosya akış kütüphanesi.
*   **JSON Database (`db.json`)**: Verilerin şema halinde saklandığı hafif veritabanı.

---

## 📂 Proje Dizin Yapısı

```bash
branchiq/
├── server.js                 # API rotalarını ve Vite sunucusunu yöneten Express kodu
├── db.json                   # Yerel JSON veritabanı (cirolar, şubeler, siparişler, personeller)
├── package.json              # Bağımlılık paketleri ve çalıştırma scriptleri
├── vite.config.js            # Vite derleme ve proxy yapılandırma dosyası
└── src/
    ├── main.jsx              # React uygulamasını başlatan kök dosya
    ├── App.jsx               # Rotaları, korumalı rotaları ve simülatör motorunu içeren dosya
    ├── app/
    │   └── store.js          # Redux Store yapılandırması ve logger middleware kaydı
    ├── context/
    │   └── LanguageContext.jsx # Dil durum yönetimi ve çeviri sözlük sözleşmesi
    ├── features/             # Redux state dilimleri (Slice ve Thunk'lar)
    │   ├── auth/             # Giriş işlemleri (authSlice)
    │   ├── branches/         # Şube işlemleri (branchesSlice)
    │   ├── orders/           # Sipariş işlemleri (ordersSlice)
    │   └── logs/             # Konsol logları (reduxLogsSlice)
    ├── components/
    │   └── layout/           # Sidebar ve Navbar ortak şablon bileşenleri
    └── pages/                # Rol bazlı görünüm ekranları (Dashboard, Branches vb.)
```

---

## 🚀 Projeyi Yerelde Çalıştırma

### Gereksinimler
*   Bilgisayarınızda **Node.js** (v16 veya üzeri) kurulu olmalıdır.

### Adım Adım Kurulum
1.  **Bağımlılıkları Yükleyin**:
    Proje kök dizinindeyken terminalde aşağıdaki komutu çalıştırarak gerekli ön yüz ve arka yüz paketlerini yükleyin:
    ```bash
    npm install
    ```

2.  **Projeyi Başlatın (Geliştirme Sunucusu)**:
    Hem Express API sunucusunu hem de Vite React ön yüzünü tek bir port üzerinden başlatmak için şu komutu çalıştırın:
    ```bash
    npm run dev
    ```

3.  **Tarayıcıda Açın**:
    Terminalde sunucunun çalıştığı belirtilen adrese gidin (varsayılan olarak):
    **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Sunum Giriş Hesapları (Test Accounts)

Sunum sırasında farklı rollere geçerek sistemi test etmek için aşağıdaki hesapları kullanabilirsiniz:

| Rol | E-posta | Şifre |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@branchiq.com` | `123456` |
| **Branch Admin** | `branchadmin@branchiq.com` | `123456` |
| **Operation Admin** | `operation@branchiq.com` | `123456` |
