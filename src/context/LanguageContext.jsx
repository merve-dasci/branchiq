import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  tr: {
    // Navigation / Tabs
    "overview": "Kurumsal Dashboard",
    "branches": "Şube Yönetimi",
    "staff": "Çalışan Raporları",
    "menu": "Menü Yönetimi",
    "inventory": "Envanter ve Stok",
    "reports": "Analitik Raporlar",
    "announcements": "Duyuru Panosu",
    "settings": "Sistem Ayarları",
    "branchDashboard": "Şube Dashboard",
    "orders": "Sipariş Kayıtları",
    "reservations": "Rezervasyon Defteri",
    "tables": "Masa Yönetimi",
    "kitchenQueue": "Mutfak Hazırlık Sırası",
    "liveOrders": "Canlı Sipariş Takibi",
    "tableStatus": "Masa Durum Ekranı",
    
    // Login Page
    "login_title": "BranchIQ",
    "login_subtitle": "Kurumsal Restoran Zinciri Yönetim Konsolu",
    "login_btn": "Sistem Konsoluna Giriş Yap",
    "email_placeholder": "Kurumsal E-posta Adresi",
    "password_placeholder": "Giriş Şifresi",
    "demo_accounts": "Hızlı Erişim Demoları (Giriş için tıklayın)",
    "login_error_title": "Giriş Başarısız",
    
    // Sidebar
    "exit_system": "Sistem Konsolundan Çıkış",
    "enterprise_console": "Kurumsal Konsol",
    "developed_by": "Sinem, Merve, Hale, Aslınur tarafından geliştirildi.",
    
    // Navbar
    "scope": "Kapsam:",
    "all_regions": "Tüm Bölgeler",
    "marmara": "Marmara Ağı",
    "central_anatolia": "İç Anadolu Ağı",
    "aegean": "Ege Ağı",
    "secure_core": "Güvenli Çekirdek",
    
    // Dashboard / Common Metrics
    "total_branches": "Toplam Aktif Şube",
    "total_staff": "Toplam Kurumsal Personel",
    "daily_revenue": "Günlük Zincir Cirosu",
    "active_orders": "Aktif Sipariş Miktarı",
    "waiting_reservations": "Bekleyen Rezervasyonlar",
    "critical_stock": "Kritik Limit Altı Stok",
    "branch_performance": "Şube Performans Analizi",
    "revenue_trend": "Aylık Ciro Eğilimi",
    "revenue": "Ciro",
    
    // Branch Detail
    "back_to_branches": "Şube Listesine Geri Dön",
    "branch_details": "Şube Detay Analizi",
    "manager": "Yönetici",
    "status": "Durum",
    "address": "Adres",
    "phone": "Telefon",
    "recent_orders": "Son Sipariş İstasyon Biletleri",
    
    // Employees
    "staff_roster": "Kurumsal Çalışan Kadrosu",
    "add_employee": "Yeni Personel Tanımla",
    "edit_employee": "Personel Bilgilerini Güncelle",
    "employee_name": "Ad Soyad",
    "role": "Görev",
    "shift": "Vardiya",
    "performance": "Performans",
    "salary": "Maaş",
    
    // Menu
    "menu_catalog": "Kurumsal Menü Kataloğu",
    "add_dish": "Yeni Menü Ürünü Ekle",
    "dish_name": "Ürün Adı",
    "category": "Kategori",
    "price": "Fiyat",
    "cost": "Maliyet",
    
    // Inventory
    "inventory_ledger": "Stok ve Depo Envanteri",
    "add_stock": "Yeni Stok Kalemi Ekle",
    "stock_name": "Malzeme Adı",
    "quantity": "Miktar",
    "unit": "Birim",
    "min_limit": "Kritik Miktar Limiti",
    "supplier": "Tedarikçi Firma",
    
    // Reports
    "gross_revenue": "Brüt Bölgesel Gelir",
    "completed_orders": "Tamamlanan Siparişler",
    "avg_order_value": "Ortalama Sipariş Tutarı",
    
    // Reservations
    "reservations_book": "Masa Rezervasyon Defteri",
    "add_booking": "Yeni Rezervasyon Planla",
    "customer_name": "Müşteri Ad Soyad",
    "guests": "Kişi Sayısı",
    "date": "Tarih",
    "time": "Saat",
    "assigned_table": "Atanan Masa",
    
    // Kitchen Queue
    "kitchen_console": "Live Mutfak Hazırlık Kuyruğu",
    "kitchen_active": "Mutfak Motoru Aktif",
    "incoming_tickets": "Gelen Biletler (Yeni)",
    "in_prep": "Hazırlanıyor",
    "ready_pickup": "Servise Hazır",
    
    // Tables
    "seating_layout": "İnteraktif Oturma Düzeni",
    "total_seats": "Toplam Oturma Kapasitesi",
    "available_tables": "Boş Masalar",
    "occupied_tables": "Dolu Masalar",
    "cleaning_tables": "Temizlenen Masalar"
  },
  en: {
    // Navigation / Tabs
    "overview": "Super Dashboard",
    "branches": "Branch Operations",
    "staff": "Employees Roster",
    "menu": "Menu Catalog",
    "inventory": "Inventory Stock",
    "reports": "Financial Reports",
    "announcements": "Notice Broadcasts",
    "settings": "System Settings",
    "branchDashboard": "Local Dashboard",
    "orders": "Orders Registry",
    "reservations": "Table Reservations",
    "tables": "Table Management",
    "kitchenQueue": "Kitchen Queue",
    "liveOrders": "Live Orders",
    "tableStatus": "Table Status",
    
    // Login Page
    "login_title": "BranchIQ",
    "login_subtitle": "Enterprise Restaurant Chain Management",
    "login_btn": "Sign In to System Console",
    "email_placeholder": "Email Address",
    "password_placeholder": "Password",
    "demo_accounts": "Quick Demo Accounts (Click to login)",
    "login_error_title": "Authentication Failed",
    
    // Sidebar
    "exit_system": "Exit System Console",
    "enterprise_console": "Enterprise Console",
    "developed_by": "Developed by Sinem, Merve, Hale, Aslınur.",
    
    // Navbar
    "scope": "Scope:",
    "all_regions": "All Regions",
    "marmara": "Marmara Network",
    "central_anatolia": "Central Anatolia Network",
    "aegean": "Aegean Network",
    "secure_core": "Secure Core",
    
    // Dashboard / Common Metrics
    "total_branches": "Total Active Branches",
    "total_staff": "Total Staff Directory",
    "daily_revenue": "Daily Chain Income",
    "active_orders": "Active Station Tickets",
    "waiting_reservations": "Waiting Reservations",
    "critical_stock": "Critical Stock Items",
    "branch_performance": "Branch Performance Index",
    "revenue_trend": "Monthly Revenue Trend",
    "revenue": "Revenue",
    
    // Branch Detail
    "back_to_branches": "Back to Branch List",
    "branch_details": "Branch Detail Analysis",
    "manager": "Manager",
    "status": "Status",
    "address": "Address",
    "phone": "Phone",
    "recent_orders": "Recent Station Tickets",
    
    // Employees
    "staff_roster": "Employees Roster",
    "add_employee": "Add Employee",
    "edit_employee": "Edit Employee Details",
    "employee_name": "Full Name",
    "role": "Role",
    "shift": "Shift",
    "performance": "Performance",
    "salary": "Salary",
    
    // Menu
    "menu_catalog": "Corporate Menu Catalog",
    "add_dish": "Add Product",
    "dish_name": "Product Name",
    "category": "Category",
    "price": "Price",
    "cost": "Cost",
    
    // Inventory
    "inventory_ledger": "Inventory Stock Ledger",
    "add_stock": "Add Stock Item",
    "stock_name": "Ingredient Name",
    "quantity": "Quantity",
    "unit": "Unit",
    "min_limit": "Min Limit",
    "supplier": "Supplier",
    
    // Reports
    "gross_revenue": "Gross Regional Income",
    "completed_orders": "Completed Orders",
    "avg_order_value": "Avg. Order Value",
    
    // Reservations
    "reservations_book": "Table Reservations Book",
    "add_booking": "Schedule Guest Booking",
    "customer_name": "Customer Name",
    "guests": "Guest Size",
    "date": "Date",
    "time": "Time",
    "assigned_table": "Assigned Table",
    
    // Kitchen Queue
    "kitchen_console": "Live Kitchen Preparation Queue",
    "kitchen_active": "Kitchen Engine Active",
    "incoming_tickets": "Incoming Tickets (New)",
    "in_prep": "Active In-Prep",
    "ready_pickup": "Ready for Pick-Up",
    
    // Tables
    "seating_layout": "Interactive Seating Layout",
    "total_seats": "Total Seating Slots",
    "available_tables": "Available Tables",
    "occupied_tables": "Occupied Tables",
    "cleaning_tables": "Tables in Cleaning"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('branchiq_lang') || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('branchiq_lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
