# BranchIQ

> Enterprise Restaurant Chain Management Platform

---

# 📌 Proje Tanıtımı

## Proje Adı

**BranchIQ**

## Geliştirici

**SMAH Technologies**

## Geliştirme Ekibi

- Sinem
- Merve
- Hale
- Aslınur

---

# 📖 Proje Hakkında

BranchIQ, çok şubeli restoran zincirlerinin operasyonlarını tek merkezden yönetebilmesini sağlayan kurumsal bir restoran yönetim platformudur.

Sistem; şube yönetimi, personel yönetimi, sipariş yönetimi, rezervasyon yönetimi, stok takibi, kampanya yönetimi ve raporlama süreçlerini tek bir panel altında toplar.

Bu proje bir POS (Point of Sale) sistemi değildir.

Bu proje;

- Garson ekranı
- Kasiyer ekranı
- Müşteri sipariş ekranı

yerine,

genel merkezin tüm restoran zincirini yönetmesini sağlayan üst düzey yönetim panelidir.

---

# 🎯 Proje Amacı

Restoran zincirlerinin;

- tüm şubelerini,
- çalışanlarını,
- stoklarını,
- siparişlerini,
- kampanyalarını,
- raporlarını,

tek bir merkezden güvenli ve hızlı bir şekilde yönetmesini sağlamaktır.

---

# 🎯 Hedef Kullanıcılar

- CEO
- Operasyon Direktörü
- Bölge Müdürü
- Şube Müdürü
- Operasyon Sorumlusu

---

# 🚀 Temel Özellikler

✔ Çok şubeli restoran desteği

✔ Rol bazlı yetkilendirme

✔ Dashboard

✔ Şube Yönetimi

✔ Personel Yönetimi

✔ Menü Yönetimi

✔ Sipariş Yönetimi

✔ Rezervasyon Yönetimi

✔ Masa Yönetimi

✔ Stok Yönetimi

✔ Kampanya Yönetimi

✔ Analitik Raporlama

✔ Responsive Tasarım

---

# 👥 Kullanıcı Rolleri

## 1. Super Admin

En yüksek yetkiye sahiptir.

Yapabilecekleri

- Dashboard görüntüleme
- Şube ekleme
- Şube silme
- Şube düzenleme
- Personel yönetimi
- Menü yönetimi
- Kampanya yönetimi
- Rapor görüntüleme
- Ayarlar
- Kullanıcı yönetimi

---

## 2. Branch Admin

Yalnızca kendi şubesini yönetebilir.

Yapabilecekleri

- Şube Dashboard
- Sipariş Yönetimi
- Masa Yönetimi
- Rezervasyonlar
- Personel görüntüleme
- Şube stoklarını yönetme
- Şube raporları

---

## 3. Operation Admin

Restoran içerisindeki operasyonları yönetir.

Yapabilecekleri

- Kitchen Queue
- Live Orders
- Table Status
- Sipariş Durumu Güncelleme

---

# 🗂 Sistem Mimarisi

```
Super Admin
      │
      │
 ┌────┴────┐
 │         │
Branch1  Branch2
 │         │
 │         │
Operation Operation
```

---

# 🖥 Sayfa Yapısı

## Authentication

- Login

---

## Super Admin

- Dashboard
- Branch Management
- Branch Detail
- Employee Management
- Menu Management
- Inventory Management
- Reports
- Campaign Management
- Settings

---

## Branch Admin

- Branch Dashboard
- Orders
- Reservations
- Table Management

---

## Operation Admin

- Kitchen Queue
- Live Orders
- Table Status

---

# 🏢 Dashboard

Dashboard ekranı;

- Toplam Şube
- Toplam Personel
- Günlük Ciro
- Aktif Sipariş
- Bekleyen Rezervasyon
- Kritik Stok
- Şube Performansı

gibi KPI bilgilerini gösterir.

---

# 🏢 Branch Management

Super Admin;

- yeni şube oluşturabilir
- şube düzenleyebilir
- şube silebilir
- şube detaylarını görüntüleyebilir.

---

# 👨‍🍳 Employee Management

Personel bilgileri

- Ad Soyad
- Görev
- Şube
- Vardiya
- Durum
- Performans

tek ekrandan yönetilir.

---

# 🍽 Menu Management

Merkezden tüm şubelerin menüsü yönetilebilir.

Özellikler

- Ürün ekleme
- Ürün silme
- Ürün güncelleme
- Aktif/Pasif
- Kategori
- Fiyat

---

# 📦 Inventory

Stok yönetimi

- Kritik stok
- Güncel stok
- Tedarikçi
- Son güncelleme
- Şube bazlı filtreleme

---

# 🛒 Orders

Sipariş ekranı

Durumlar

- New

- Preparing

- Ready

- Completed

---

# 📅 Reservations

Rezervasyon bilgileri

- Tarih

- Saat

- Masa

- Kişi Sayısı

- Durum

---

# 🪑 Table Management

Masa durumları

- Available

- Reserved

- Occupied

- Cleaning

---

# 📊 Reports

Sistem aşağıdaki raporları sunar

- Günlük Ciro

- Aylık Ciro

- Şube Performansı

- En Çok Satan Ürünler

- Personel Performansı

- Sipariş Analizi

---

# 🎯 Kampanyalar

Merkezden oluşturulur.

- Kampanya oluştur

- Düzenle

- Pasife al

- Sil

---

# 🔐 Güvenlik

Rol bazlı yetkilendirme uygulanmıştır.

Her kullanıcı yalnızca kendi yetkisi dahilindeki sayfalara erişebilir.

---

# 📁 Teknolojiler

- React

- JavaScript

- Redux Toolkit

- React Router DOM

- Tailwind CSS

- Axios

- JSON Server

- Vite

---

# 📂 Proje Yapısı

```
src
│
├── app
│
├── components
│
├── pages
│
├── features
│
├── services
│
├── assets
│
└── routes
```

---

# 🎨 Tasarım

Tasarım dili

Modern Enterprise SaaS Dashboard

İlham Kaynakları

- Stripe

- Linear

- Notion

- Oracle Cloud

- Atlassian

---

# 🎯 Gelecek Geliştirmeler

- Gerçek Backend

- JWT Authentication

- Docker

- SignalR

- WebSocket

- Bildirim Sistemi

- Grafik Analizleri

- Çoklu Dil Desteği

- Dark Mode

- AI Destekli Satış Analizi

---

# 📄 Lisans

Bu proje eğitim amacıyla geliştirilmiştir.

© SMAH Technologies