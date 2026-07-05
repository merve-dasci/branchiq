# BranchIQ - Proje Tanıtım Belgesi

> Enterprise Restaurant Chain Management Platform

---

# 📌 Proje Tanıtımı

## Proje Adı
**BranchIQ**

## Geliştirici
**SMAH Technologies**

## Geliştirme Ekibi
- Sinem
- Merve (Auth, Rotalama, Redux Store, Sidebar/Navbar Layout, Super Admin Dashboard, Şube Yönetimi ve Şube Analiz)
- Hale
- Aslınur

---

# 📖 Proje Hakkında

BranchIQ, çok şubeli restoran zincirlerinin operasyonlarını tek merkezden yönetebilmesini sağlayan kurumsal bir restoran yönetim platformudur.

Sistem; şube yönetimi, personel yönetimi, sipariş yönetimi, rezervasyon yönetimi, stok takibi, kampanya yönetimi ve raporlama süreçlerini tek bir panel altında toplar.

Bu proje bir POS (Point of Sale) sistemi değildir. Garson ekranı, kasiyer ekranı veya müşteri sipariş ekranı yerine genel merkezin tüm restoran zincirini üst düzeyden denetlemesini ve yönetmesini sağlayan kurumsal yönetim panelidir.

---

# 🎯 Proje Amacı

Restoran zincirlerinin;
- Tüm şubelerini,
- Çalışan personellerini,
- Envanter stoklarını,
- Canlı mutfak sipariş kuyruklarını,
- Pazarlama kampanyalarını ve duyurularını,
- Finansal raporlarını,

tek bir merkezden güvenli, hızlı, rol tabanlı ve canlı olarak yönetmesini sağlamaktır.

---

# 🎯 Hedef Kullanıcılar

- CEO / Yönetim Kurulu
- Operasyon Direktörü
- Bölge Müdürü
- Şube Müdürü
- Operasyon ve Mutfak Sorumlusu

---

# 🚀 Temel Özellikler

✔ Çok şubeli restoran desteği (Bölgesel kırılımlar dahil)

✔ Rol bazlı yetkilendirme (Super Admin, Branch Admin, Operation Admin)

✔ Gelişmiş Kurumsal Dashboard (KPI kartları, interaktif grafikler)

✔ Canlı Sipariş Akış Simülatörü (Sunumlar için gerçek zamanlı sipariş üreteci)

✔ Canlı Redux Event Log Konsolu (Geliştirici terminal paneli)

✔ Çoklu Dil Desteği (TR/EN - Dil tercihi hafızada tutulur)

✔ Şube Yönetimi ve Detaylı Analitik Raporlar

✔ Performans Uyarıları (Düşük performans gösteren şubeler için görsel alarmlar)

✔ Rapor Dışa Aktarma (PDF/CSV dosya indirme simülasyonu ve Toast bildirimler)

✔ Personel ve Menü Fiyat Yönetimi

---

# 👥 Kullanıcı Rolleri ve Yetki Matrisi

## 1. Super Admin
En yüksek yetkiye sahiptir.
*   Dashboard görüntüleme (Tüm şubelerin analizi, bölgesel ciro payları)
*   Yeni Şube ekleme, silme, güncelleme ve detaylı analitikleri izleme
*   Tüm restoran zincirinin personel dağılımını yönetme
*   Merkezi menü elemanlarını ve fiyatlarını düzenleme
*   Merkezi kampanya ve duyuru yönetimi
*   PDF/CSV olarak raporları dışa aktarma
*   Genel ayarlar ve dil yapılandırması

## 2. Branch Admin
Yalnızca kendi şubesini yönetebilir.
*   Şube Dashboard (Kendi şubesine ait ciro ve sipariş verileri)
*   Kendi şubesine gelen aktif siparişlerin onay süreçleri
*   Masa yönetimi ve doluluk durumu düzenlemesi
*   Rezervasyon listesi takibi ve yeni rezervasyon ekleme
*   Şube envanter stok seviyesi ve kritik stok uyarı filtresi

## 3. Operation Admin
Restoran içerisindeki mutfak ve saha operasyonlarını yönetir.
*   **Mutfak Sipariş Kuyruğu (Kitchen Queue)**: Gelen biletleri "Hazırlanıyor" veya "Hazır" durumuna getirme
*   **Canlı Sipariş Takibi (Live Orders)**: Tüm aktif siparişlerin listesi
*   **Masa Görsel Durumu (Table Status)**: Şubedeki masaların anlık durum şeması

---

# 🗂 Sistem Mimarisi

```
             Super Admin
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    Branch 1            Branch 2
   (Kadıköy)           (Beşiktaş)
        │                   │
        ▼                   ▼
   Mutfak & Saha       Mutfak & Saha
 (Operation Admin)   (Operation Admin)
```

---

# 🖥 Sayfa ve Rota Yapısı

## Yetkilendirme (Auth)
*   Giriş Sayfası (`/login`)
*   Güvenli Rota Kontrolü (`ProtectedRoute`)

## Super Admin Rotaları
*   Genel Performans Dashboard (`/super-admin/dashboard`)
*   Şubeler Listesi (`/super-admin/branches`)
*   Şube Detay & Analiz (`/super-admin/branches/:id`)
*   Çalışanlar Paneli (`/super-admin/staff`)
*   Menü Yönetimi (`/super-admin/menu`)
*   Stok Envanteri (`/super-admin/inventory`)
*   Grafikli Raporlar (`/super-admin/reports`)
*   Kampanyalar & Duyurular (`/super-admin/announcements`)
*   Sistem Ayarları (`/super-admin/settings`)

## Branch Admin Rotaları
*   Şube Performans Paneli (`/branch-admin/dashboard`)
*   Sipariş Onay Listesi (`/branch-admin/orders`)
*   Rezervasyon Listesi (`/branch-admin/reservations`)
*   Masa Yerleşimi (`/branch-admin/tables`)

## Operation Admin Rotaları
*   Mutfak Sipariş Sırası (`/operation/kitchen`)
*   Aktif Sipariş Takibi (`/operation/live-orders`)
*   Masa Durum Haritası (`/operation/tables`)

---

# 📁 Teknolojiler

*   **React (Vite)**: Ön yüz geliştirme platformu.
*   **Redux Toolkit**: Merkezi durum yönetimi ve asenkron thunk istek mimarisi.
*   **React Router DOM**: Rol tabanlı istemci rotalama kütüphanesi.
*   **Node.js & Express**: API isteklerini işleyen ve verileri `db.json`'a kalıcı kaydeden özel sunucu.
*   **fs/promises**: Veritabanı okuma/yazma işlemleri için dosya akış kütüphanesi.
*   **Recharts**: Grafik motoru.
*   **Tailwind CSS**: Modern ve duyarlı arayüz tasarımı.
*   **Lucide React**: İkon kütüphanesi.

---

# 🎨 Tasarım Dili

*   **Modern Enterprise SaaS Dashboard**: Stripe, Notion ve Linear arayüzlerinden esinlenerek oluşturulmuş temiz ve kurumsal tasarım dili.
*   **Dinamik Öğeler**: Cam efekti (glassmorphism), yanıp sönen animasyonlu durum lambaları, yumuşak geçişler ve gölgelendirmeler.

---

# 🎯 Gelecek Geliştirmeler

- JWT Token ile güvenli sunucu oturum yönetimi.
- Docker konteyner entegrasyonu.
- WebSocket / SignalR kullanarak mutfak ve admin panelleri arasında çift yönlü anlık veri senkronizasyonu.
- Yapay zeka (AI) destekli ileriye dönük ciro ve satış tahminleme modülü.
- Koyu Tema (Dark Mode) seçeneği.

---

# 📄 Lisans

Bu proje eğitim amacıyla geliştirilmiştir.

© SMAH Technologies