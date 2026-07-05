# SKILLS.md

# BranchIQ Geliştirme Standartları

Bu doküman, BranchIQ projesinde kullanılacak teknolojileri, geliştirme standartlarını ve ekip kurallarını tanımlar.

---

# Kullanılan Teknolojiler

## Frontend

- React
- JavaScript (ES6+)
- Tailwind CSS
- React Router DOM

## State Management

- Redux Toolkit
- React Redux

## HTTP Client

- Axios

## Mock Backend

- Node.js Express.js

## Build Tool

- Vite

## Version Control

- Git
- GitHub

---

# Kodlama Standartları

## Component Yapısı

Her component yalnızca tek bir sorumluluğa sahip olmalıdır.

Örnek:

✔ Sidebar

✔ Navbar

✔ StatCard

✔ DataTable

✔ SearchInput

✔ StatusBadge

---

## Sayfa Yapısı

Her sayfa pages klasörü altında bulunmalıdır.

Örnek:

pages/

- Login

- Dashboard

- Branches

- Employees

- Inventory

- Orders

---

## Redux Yapısı

Her modül kendi Slice dosyasına sahip olmalıdır.

Örnek:

authSlice

branchesSlice

employeesSlice

ordersSlice

inventorySlice

tablesSlice

reservationsSlice

campaignsSlice

reportsSlice

Store dosyası yalnızca reducer'ları birleştirmek için kullanılmalıdır.

---

# Dosya İsimlendirme

Component

PascalCase

Örnek

Sidebar.jsx

Navbar.jsx

Orders.jsx

InventoryManagement.jsx

---

Slice Dosyaları

camelCase

Örnek

authSlice.js

ordersSlice.js

inventorySlice.js

---

# React Kuralları

- Functional Components kullanılacaktır.
- Hooks kullanılacaktır.
- Class Component kullanılmayacaktır.

Kullanılacak Hooklar

- useState
- useEffect
- useSelector
- useDispatch
- useNavigate

---

# Routing

React Router DOM kullanılacaktır.

Role bazlı route koruması uygulanacaktır.

Roller

- Super Admin

- Branch Admin

- Operation Admin

---

# Tasarım Kuralları

Tailwind CSS kullanılacaktır.

Tek tip tasarım dili korunacaktır.

Renk Paleti

Primary

Blue

Background

Light Gray

Cards

White

Status Colors

Green

Orange

Red

---

# Responsive

Desktop First yaklaşımı uygulanacaktır.

Tablet desteği bulunacaktır.

Mobil görünüm temel seviyede desteklenecektir.

---

# API Kuralları

Tüm API istekleri services/api.js üzerinden yapılacaktır.

Doğrudan axios kullanımı önerilmez.

---

# JSON Server

Tüm veriler db.json dosyasında tutulacaktır.

Temel Koleksiyonlar

- users

- branches

- employees

- menuItems

- inventory

- orders

- reservations

- tables

- campaigns

---

# Git Kuralları

Her geliştirici kendi branch'i üzerinde çalışacaktır.

Kodlar Pull Request mantığı ile birleştirilecektir.

---

# Genel Hedef

Kod okunabilir,

yeniden kullanılabilir,

bakımı kolay

ve ölçeklenebilir olmalıdır.