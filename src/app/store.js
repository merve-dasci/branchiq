// Redux Toolkit'in temel mağaza (store) yapılandırma fonksiyonunu içe aktar
import { configureStore } from '@reduxjs/toolkit';
// Farklı işlevsel modüllerin (features) Reducer'larını (durum yöneticilerini) içe aktar
import authReducer from '../features/auth/authSlice.js';
import branchesReducer from '../features/branches/branchesSlice.js';
import employeesReducer from '../features/employees/employeesSlice.js';
import menuReducer from '../features/menu/menuSlice.js';
import inventoryReducer from '../features/inventory/inventorySlice.js';
import ordersReducer from '../features/orders/ordersSlice.js';
import reservationsReducer from '../features/reservations/reservationsSlice.js';
import tablesReducer from '../features/tables/tablesSlice.js';
import campaignsReducer from '../features/campaigns/campaignsSlice.js';
import reportsReducer from '../features/reports/reportsSlice.js';
// Konsol ekranında akan Redux olaylarını yakalamak için log reducere'ını ve aksiyonunu ekle
import reduxLogsReducer, { addLog } from '../features/logs/reduxLogsSlice.js';

// --- ÖZEL ARA KATMAN YAZILIMI (CUSTOM LOGGER MIDDLEWARE) ---
// Bu fonksiyon, uygulamada tetiklenen (dispatch edilen) her bir Redux aksiyonunu araya girerek yakalar.
const loggerMiddleware = (store) => (next) => (action) => {
  // Eğer tetiklenen aksiyon boş değilse ve log eyleminin kendisi değilse (sonsuz döngüyü önlemek için)
  if (action && action.type && !action.type.startsWith('reduxLogs/')) {
    // Aksiyonun gerçekleştiği anlık saat bilgisini al
    const time = new Date().toLocaleTimeString('tr-TR', { hour12: false });
    let payloadStr = '';
    
    // Aksiyon ile birlikte gönderilen veri (payload) varsa okunabilir metne dönüştür
    if (action.payload) {
      try {
        payloadStr = typeof action.payload === 'object' 
          ? JSON.stringify(action.payload).substring(0, 60) + '...' // Nesne ise ilk 60 karakterini al
          : String(action.payload);
      } catch {
        payloadStr = '[Object]';
      }
    }
    
    // Konsol log satır formatını oluştur: "[Saat] AKSİYON_TİPİ (varsa veri)"
    const message = `[${time}] ${action.type} ${payloadStr ? `(${payloadStr})` : ''}`;
    
    // Asenkron olarak bu log satırını log durum deposuna (reduxLogsSlice) ekle
    setTimeout(() => {
      store.dispatch(addLog(message));
    }, 0);
  }
  
  // Aksiyonun bir sonraki aşamaya (reducer'a) geçmesini sağla (zinciri bozma)
  return next(action);
};

// --- REDUX MAĞAZASI (STORE) YAPILANDIRMASI ---
// Redux Store, tüm uygulamanın durumunu (state) tek bir merkezi ağaçta tutan "Tek Gerçeklik Kaynağı"dır (Single Source of Truth).
export const store = configureStore({
  // Tüm alt reducer'ları (dilimleri) birleştirerek küresel state yapısını oluştur
  reducer: {
    auth: authReducer,                       // Giriş ve yetki bilgileri
    branches: branchesReducer,               // Şube verileri
    employees: employeesReducer,             // Çalışan/Personel listesi
    menu: menuReducer,                       // Yemek menüsü ve fiyatlar
    inventory: inventoryReducer,             // Malzeme stok envanteri
    orders: ordersReducer,                   // Mutfak/Teslimat siparişleri
    reservations: reservationsReducer,       // Masa rezervasyonları
    tables: tablesReducer,                   // Masalar ve doluluk oranları
    campaigns: campaignsReducer,             // Duyurular ve kampanyalar
    reports: reportsReducer,                 // Finansal/Operasyonel raporlar
    reduxLogs: reduxLogsReducer,             // Terminal konsolundaki Redux logları
  },
  // Varsayılan Redux ara katman yazılımlarının sonuna kendi yazdığımız log yakalayıcıyı ekle
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

// Mağazayı dışa aktar (React uygulamasının sarmalanması için main.jsx'te kullanılır)
export default store;
