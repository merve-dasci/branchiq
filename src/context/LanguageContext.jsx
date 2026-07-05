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
    "cleaning_tables": "Temizlenen Masalar",
    
    // SuperAdminDashboard
    "latest_broadcast_notice": "Son Duyuru Yayını",
    "view_board": "Panoyu Görüntüle",
    "monthly_gross_revenue": "Aylık Brüt Ciro",
    "aggregate_orders": "Toplam Sipariş",
    "average_ticket_value": "Ortalama Sipariş Tutarı",
    "active_staff_members": "Aktif Personel Sayısı",
    "weekly_system_revenue": "Haftalık Sistem Ciro Analizi",
    "consolidated_billing": "Seçilen bölgelerdeki konsolide edilmiş fatura tutarları",
    "live_feed": "Canlı Akış",
    "regional_performance_share": "Bölgesel Performans Payı",
    "percentage_contribution": "Toplam aylık ciroya yüzde katkısı",
    "system_total": "Sistem Toplamı",
    "no_regional_data": "Bölgesel veri bulunamadı",
    "active_kitchen_orders": "Aktif Mutfak Sipariş Kuyruğu",
    "pending_kitchen_tickets": "mutfak siparişi hazırlanmayı bekliyor",
    "manage_queues": "Kuyrukları Yönet",
    "no_pending_orders": "Mutfakta bekleyen sipariş bulunmuyor.",
    "branch_operations_status": "Şube Operasyon Durumları",
    "functional_state_nodes": "Fiziksel şube düğümlerinin işlevsel durumu",
    "online": "Çevrimiçi",
    "offline": "Çevrimdışı",
    "revenue_vs_last_month": "geçen aya göre",
    "orders_vs_last_week": "geçen haftaya göre",
    "pricing_optimization": "fiyatlandırma optimizasyonu",
    "across_branches": "şube genelinde",

    // Branches
    "search_branches_placeholder": "Şubeleri isim, konum veya yöneticiye göre ara...",
    "all_statuses": "Tüm Durumlar",
    "active": "Aktif",
    "inactive": "Aktif Değil",
    "add_branch_node": "Yeni Şube Ekle",
    "monthly_gross": "Aylık Ciro",
    "daily_orders": "Günlük Sipariş",
    "regional_hq": "Bölge Ağı:",
    "general_manager": "Genel Yönetici:",
    "table_count_label": "Masa Sayısı:",
    "quality_rating": "Kalite Puanı:",
    "contact": "İletişim:",
    "view_analytics": "Analitiği Görüntüle",
    "configure": "Yapılandır",
    "decommission": "Şubeyi Devre Dışı Bırak",
    "no_branches_located": "Kayıtlı Şube Bulunamadı",
    "reset_filter_params": "Filtre parametrelerini veya arama sorgusunu sıfırlamayı deneyin.",
    "update_branch_details": "Şube Detaylarını Güncelle",
    "provision_new_branch": "Yeni Şube Ekle",
    "branch_name": "Şube Adı*",
    "city": "Şehir*",
    "region_network": "Bölge Ağı*",
    "general_manager_name": "Genel Yönetici Adı*",
    "address_label": "Adres*",
    "monthly_gross_revenue_label": "Aylık Brüt Ciro ($)",
    "avg_daily_orders_label": "Ortalama Günlük Sipariş",
    "phone_number_label": "Telefon Numarası*",
    "table_count": "Masa Sayısı",
    "cancel": "İptal",
    "provision_node": "Şubeyi Ekle",
    "delete_branch_confirm": "Bu şubeyi kurumsal ağdan kalıcı olarak silmek istediğinize emin misiniz?",

    // BranchDetail
    "select_branch_analytics": "Detaylı analitiği görüntülemek için lütfen bir şube seçin.",
    "go_back": "Geri Dön",
    "analytics_title": "Analizi",
    "city_node": "Şubesi",
    "region_label": "Bölgesi",
    "monthly_revenue": "Aylık Ciro",
    "total_orders_simulated": "Toplam Sipariş (Simüle)",
    "staff_count": "Personel Sayısı",
    "tables_configured": "Kayıtlı Masalar",
    "node_demographics": "Şube Bilgileri",
    "address_location": "Adres Bilgisi",
    "store_manager": "Şube Müdürü",
    "branch_telephone": "Şube Telefonu",
    "no_phone_set": "Telefon tanımlanmamış",
    "performance_rating": "Performans Puanı",
    "stars": "Yıldız",
    "assigned_staff_directory": "Görevli Personel Listesi",
    "no_employees_assigned": "Bu şubeye atanmış çalışan bulunmamaktadır.",
    "last_7_days": "Son 7 Gün",
    "last_30_days": "Son 30 Gün",
    "low_performance": "Düşük Performans",
    "export_report": "Verileri Dışa Aktar",
    "export_success": "Rapor başarıyla üretildi ve indirildi!",
    "simulation_active": "Canlı Sipariş Simülatörü: Aktif",
    "simulation_paused": "Canlı Sipariş Simülatörü: Kapalı",
    "live_redux_console": "Canlı Redux Event Log Konsolu",
    "clear_console": "Konsolu Temizle",
    "no_events_logged": "Redux olay kuyruğu boş. Sipariş Simülatörünü aktif ederek izleyebilirsiniz."
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
    "cleaning_tables": "Tables in Cleaning",

    // SuperAdminDashboard
    "latest_broadcast_notice": "Latest Broadcast Notice",
    "view_board": "View Board",
    "monthly_gross_revenue": "Monthly Gross Revenue",
    "aggregate_orders": "Aggregate Orders",
    "average_ticket_value": "Average Ticket Value",
    "active_staff_members": "Active Staff Members",
    "weekly_system_revenue": "Weekly System Revenue Analytics",
    "consolidated_billing": "Consolidated billing figures across designated regions",
    "live_feed": "Live Feed",
    "regional_performance_share": "Regional Performance Share",
    "percentage_contribution": "Percentage contribution to total monthly gross",
    "system_total": "System Total",
    "no_regional_data": "No regional data available",
    "active_kitchen_orders": "Active Kitchen Orders Queue",
    "pending_kitchen_tickets": "pending kitchen tickets require preparation",
    "manage_queues": "Manage Queues",
    "no_pending_orders": "No pending orders in the kitchen.",
    "branch_operations_status": "Branch Operations Status",
    "functional_state_nodes": "Functional state of the physical store nodes",
    "online": "Online",
    "offline": "Offline",
    "revenue_vs_last_month": "vs last month",
    "orders_vs_last_week": "vs last week",
    "pricing_optimization": "pricing optimization",
    "across_branches": "across branches",

    // Branches
    "search_branches_placeholder": "Search branches by name, location, or manager...",
    "all_statuses": "All Statuses",
    "active": "Active",
    "inactive": "Inactive",
    "add_branch_node": "Add Branch Node",
    "monthly_gross": "Monthly Gross",
    "daily_orders": "Daily Orders",
    "regional_hq": "Regional HQ:",
    "general_manager": "General Manager:",
    "table_count_label": "Table Count:",
    "quality_rating": "Quality Rating:",
    "contact": "Contact:",
    "view_analytics": "View Analytics",
    "configure": "Configure",
    "decommission": "Decommission",
    "no_branches_located": "No Branch Nodes Located",
    "reset_filter_params": "Try resetting your filter parameters or search queries.",
    "update_branch_details": "Update Branch Details",
    "provision_new_branch": "Provision New Branch",
    "branch_name": "Branch Name*",
    "city": "City*",
    "region_network": "Region Network*",
    "general_manager_name": "General Manager Name*",
    "address_label": "Address*",
    "monthly_gross_revenue_label": "Monthly Gross Revenue ($)",
    "avg_daily_orders_label": "Average Daily Orders",
    "phone_number_label": "Phone Number*",
    "table_count": "Table Count",
    "cancel": "Cancel",
    "provision_node": "Provision Node",
    "delete_branch_confirm": "Are you sure you want to permanently delete this branch node from the enterprise?",

    // BranchDetail
    "select_branch_analytics": "Please select a branch to view detailed analytics.",
    "go_back": "Go Back",
    "analytics_title": "Analytics",
    "city_node": "Node",
    "region_label": "Region",
    "monthly_revenue": "Monthly Revenue",
    "total_orders_simulated": "Total Orders (Simulated)",
    "staff_count": "Staff Count",
    "tables_configured": "Tables Configured",
    "node_demographics": "Node Demographics",
    "address_location": "Address Location",
    "store_manager": "Store Manager",
    "branch_telephone": "Branch Telephone",
    "no_phone_set": "No phone set",
    "performance_rating": "Performance Rating",
    "stars": "Stars",
    "assigned_staff_directory": "Assigned Staff Directory",
    "no_employees_assigned": "No employees explicitly assigned to this store node.",
    "last_7_days": "Last 7 Days",
    "last_30_days": "Last 30 Days",
    "low_performance": "Underperforming",
    "export_report": "Export Report",
    "export_success": "Report compiled and downloaded successfully!",
    "simulation_active": "Live Order Simulator: Active",
    "simulation_paused": "Live Order Simulator: Paused",
    "live_redux_console": "Live Redux Event Log Console",
    "clear_console": "Clear Console",
    "no_events_logged": "Redux event queue is empty. Activate the Order Simulator to observe logs."
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
