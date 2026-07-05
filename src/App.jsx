// React kütüphanesini ve temel durum/etki kancalarını (hooks) içe aktar
import React, { useEffect, useState } from 'react';
// Redux store ile haberleşmek (dispatch tetiklemek ve state okumak) için gerekli kancaları yükle
import { useDispatch, useSelector } from 'react-redux';
// Rotalama işlemleri (routing) için react-router-dom kütüphanesinin bileşenlerini al
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
// Redux dilimlerinden (slices) veri çekme (fetch) asenkron thunk aksiyonlarını import et
import { fetchBranches } from './features/branches/branchesSlice.js';
import { fetchMenuItems } from './features/menu/menuSlice.js';
import { fetchOrders, addOrder } from './features/orders/ordersSlice.js';
import { fetchStaff } from './features/employees/employeesSlice.js';
import { fetchAnnouncements } from './features/campaigns/campaignsSlice.js';
// Oturumu kapatma aksiyonunu import et
import { logout } from './features/auth/authSlice.js';

// Düzen ve Şablon (Layout) bileşenleri
import Sidebar from './components/layout/Sidebar.jsx';
import Navbar from './components/layout/Navbar.jsx';

// Giriş (Auth) ekranı bileşeni
import Login from './pages/auth/Login.jsx';

// Süper Admin arayüz panelleri (Super Admin Pages)
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard.jsx';
import Branches from './pages/superAdmin/Branches.jsx';
import BranchDetail from './pages/superAdmin/BranchDetail.jsx';
import Employees from './pages/superAdmin/Employees.jsx';
import MenuManagement from './pages/superAdmin/MenuManagement.jsx';
import InventoryManagement from './pages/superAdmin/InventoryManagement.jsx';
import Reports from './pages/superAdmin/Reports.jsx';
import Campaigns from './pages/superAdmin/Campaigns.jsx';
import Settings from './pages/superAdmin/Settings.jsx';

// Şube Yöneticisi arayüz panelleri (Branch Admin Pages)
import BranchDashboard from './pages/branchAdmin/BranchDashboard.jsx';
import Orders from './pages/branchAdmin/Orders.jsx';
import Reservations from './pages/branchAdmin/Reservations.jsx';
import TableManagement from './pages/branchAdmin/TableManagement.jsx';

// Mutfak ve Operasyon panelleri (Operation Pages)
import KitchenQueue from './pages/operation/KitchenQueue.jsx';
import LiveOrders from './pages/operation/LiveOrders.jsx';
import TableStatus from './pages/operation/TableStatus.jsx';

// Yükleniyor halka simgesini Lucide React'tan yükle
import { Loader2 } from 'lucide-react';

// Uygulama Giriş Noktası (Main App Component)
export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Redux store'dan giriş yapmış olan aktif kullanıcıyı çek
  const currentUser = useSelector((state) => state.auth.user);

  // Redux Store'dan tüm çekirdek verileri (branches, menu, orders, staff, announcements) oku
  const branches = useSelector((state) => state.branches);
  const menu = useSelector((state) => state.menu);
  const orders = useSelector((state) => state.orders);
  const staff = useSelector((state) => state.employees);
  const announcements = useSelector((state) => ({
    items: state.campaigns.announcements,
    loading: state.campaigns.loading,
    error: state.campaigns.error
  }));

  // Küresel Filtreler ve Simülatör Durumu (Global UI States)
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDetailedBranch, setSelectedDetailedBranch] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Kullanıcı şubeler sayfasından ayrılırsa, seçili detaylı şube görünümünü sıfırlayan izleyici (Watcher)
  useEffect(() => {
    if (location.pathname !== '/super-admin/branches') {
      setSelectedDetailedBranch(null);
    }
  }, [location.pathname]);

  // Sunum gösterileri için Canlı Sipariş Akış Simülatörü motoru (Simulator Engine)
  useEffect(() => {
    // Simülatör aktif değilse işlem yapma
    if (!isSimulating) return;

    // Her 4.5 saniyede bir yeni bir sipariş üreten zamanlayıcıyı başlat
    const interval = setInterval(() => {
      const branchList = branches.items;
      if (!branchList || branchList.length === 0) return;

      // Rastgele bir şube seç
      const randomBranch = branchList[Math.floor(Math.random() * branchList.length)];
      // Rastgele müşteri isimleri havuzu
      const customerNames = ["Merve Daşcı", "Sinem Yılmaz", "Hale Demir", "Aslınur Kaya", "Gökhan K.", "Selin T.", "Onur B.", "Deniz Y."];
      // Rastgele yemek havuzu
      const itemNames = ["Adana Kebap", "Lahmacun", "Künefe", "İskender", "Mercimek Çorbası", "Kola", "Sütlaç"];
      
      const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
      
      // Siparişe rastgele 1 ila 3 farklı ürün ekle
      const randomItemsCount = Math.floor(Math.random() * 3) + 1;
      let total = 0;
      const items = Array.from({ length: randomItemsCount }, () => {
        const name = itemNames[Math.floor(Math.random() * itemNames.length)];
        const price = Math.floor(Math.random() * 15) + 12; // Rastgele fiyatlama
        total += price;
        return { name, price, quantity: 1 };
      });

      // Sahte sipariş şablonu oluştur
      const mockOrder = {
        branchId: randomBranch.id,
        branchName: randomBranch.name,
        customerName: randomCustomer,
        type: Math.random() > 0.5 ? "Dine-in" : "Delivery",
        status: "Pending",
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        totalAmount: total,
        items
      };

      // Siparişi veritabanına ve Redux store'a kaydetmek üzere dispatch et
      dispatch(addOrder(mockOrder));
    }, 4500);

    // Bileşen kapandığında veya simülatör kapatıldığında zamanlayıcıyı temizle (Memory leak engelleme)
    return () => clearInterval(interval);
  }, [isSimulating, branches.items, dispatch]);

  // Uygulama ilk açıldığında (veya kullanıcı giriş yaptığında) sunucudan temel verileri çeken izleyici
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchBranches());
      dispatch(fetchMenuItems());
      dispatch(fetchOrders());
      dispatch(fetchStaff());
      dispatch(fetchAnnouncements());
    }
  }, [currentUser, dispatch]);

  // Oturumu kapatma (Logout) eylemi
  const handleLogout = () => {
    dispatch(logout()); // Redux store'dan kullanıcı bilgilerini sil
    setSelectedRegion('All');
    setSelectedDetailedBranch(null);
    navigate('/login'); // Giriş sayfasına yönlendir
  };

  // Uygulamanın genel senkronizasyon/yükleniyor (Loading) durumunu hesapla
  const isDataLoading = branches.loading || menu.loading || orders.loading || staff.loading || announcements.loading;

  return (
    <Routes>
      {/* Giriş Ekranı Rotası */}
      <Route path="/login" element={<Login />} />
      
      {/* 1. Süper Admin Yetki Korumalı Rotalar (Super Admin Protected Routes) */}
      <Route element={<ProtectedRoute allowedRoles={['superAdmin', 'Super Admin']} />}>
        <Route element={<AppLayout 
          currentUser={currentUser}
          handleLogout={handleLogout}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isDataLoading={isDataLoading}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
        />}>
          {/* Süper Admin Dashboard Paneli */}
          <Route path="/super-admin/dashboard" element={
            <SuperAdminDashboard 
              branches={branches.items}
              menuItems={menu.items}
              orders={orders.items}
              staff={staff.items}
              announcements={announcements.items}
              selectedRegion={selectedRegion}
              setActiveTab={(tab) => {
                // Dashboard üzerindeki butonlardan diğer sekmelere hızlı yönlendirme yapar
                if (tab === 'branches') navigate('/super-admin/branches');
                else if (tab === 'staff') navigate('/super-admin/staff');
                else if (tab === 'menu') navigate('/super-admin/menu');
                else if (tab === 'inventory') navigate('/super-admin/inventory');
                else if (tab === 'reports') navigate('/super-admin/reports');
                else if (tab === 'announcements') navigate('/super-admin/announcements');
                else if (tab === 'settings') navigate('/super-admin/settings');
              }}
            />
          } />
          {/* Şube Listesi / Detaylı Görünüm Rotası */}
          <Route path="/super-admin/branches" element={
            selectedDetailedBranch ? (
              <BranchDetail 
                branch={selectedDetailedBranch}
                staff={staff.items}
                orders={orders.items}
                onBack={() => setSelectedDetailedBranch(null)}
              />
            ) : (
              <Branches 
                branches={branches.items} 
                selectedRegion={selectedRegion}
                currentUser={currentUser}
                onViewDetail={(branch) => setSelectedDetailedBranch(branch)}
              />
            )
          } />
          {/* Personel Yönetim Paneli */}
          <Route path="/super-admin/staff" element={
            <Employees 
              staff={staff.items} 
              branches={branches.items} 
              selectedRegion={selectedRegion}
              currentUser={currentUser}
            />
          } />
          {/* Menü ve Fiyat Listesi Yönetim Paneli */}
          <Route path="/super-admin/menu" element={
            <MenuManagement 
              menuItems={menu.items} 
              currentUser={currentUser}
            />
          } />
          {/* Stok Envanter Takip Paneli */}
          <Route path="/super-admin/inventory" element={
            <InventoryManagement 
              currentUser={currentUser}
            />
          } />
          {/* Detaylı Grafikli Raporlar Paneli */}
          <Route path="/super-admin/reports" element={
            <Reports 
              branches={branches.items}
              menuItems={menu.items}
              orders={orders.items}
            />
          } />
          {/* Duyuru ve Kampanya Giriş Paneli */}
          <Route path="/super-admin/announcements" element={
            <Campaigns 
              announcements={announcements.items} 
              currentUser={currentUser}
            />
          } />
          {/* Ayarlar Ekranı */}
          <Route path="/super-admin/settings" element={
            <Settings 
              currentUser={currentUser}
            />
          } />
        </Route>
      </Route>

      {/* 2. Şube Yöneticisi Yetki Korumalı Rotalar (Branch Admin Protected Routes) */}
      <Route element={<ProtectedRoute allowedRoles={['branchAdmin']} />}>
        <Route element={<AppLayout 
          currentUser={currentUser}
          handleLogout={handleLogout}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isDataLoading={isDataLoading}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
        />}>
          {/* Şube Performans Ekranı */}
          <Route path="/branch-admin/dashboard" element={
            <BranchDashboard 
              currentUser={currentUser}
              orders={orders.items}
              branches={branches.items}
            />
          } />
          {/* Sipariş Geçmişi / Onaylama Ekranı */}
          <Route path="/branch-admin/orders" element={
            <Orders 
              orders={orders.items} 
              branches={branches.items} 
              menuItems={menu.items} 
              selectedRegion={selectedRegion}
              currentUser={currentUser}
            />
          } />
          {/* Masa Rezervasyon Listesi */}
          <Route path="/branch-admin/reservations" element={
            <Reservations 
              currentUser={currentUser}
            />
          } />
          {/* Masa Yerleşimi ve Kapasite Yönetim Ekranı */}
          <Route path="/branch-admin/tables" element={
            <TableManagement 
              currentUser={currentUser}
            />
          } />
          {/* Şubeye Ait Duyuru ve Kampanyalar */}
          <Route path="/branch-admin/announcements" element={
            <Campaigns 
              announcements={announcements.items} 
              currentUser={currentUser}
            />
          } />
        </Route>
      </Route>

      {/* 3. Mutfak ve Operasyon Yetki Korumalı Rotalar (Operation Protected Routes) */}
      <Route element={<ProtectedRoute allowedRoles={['operationAdmin']} />}>
        <Route element={<AppLayout 
          currentUser={currentUser}
          handleLogout={handleLogout}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          isDataLoading={isDataLoading}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
        />}>
          {/* Mutfak Sipariş Sırası ve Ticket Kartları */}
          <Route path="/operation/kitchen" element={
            <KitchenQueue 
              currentUser={currentUser}
            />
          } />
          {/* Canlı Sipariş Akış Tablosu */}
          <Route path="/operation/live-orders" element={
            <LiveOrders 
              currentUser={currentUser}
            />
          } />
          {/* Masaların Doluluk / Sipariş Durumu Görsel Haritası */}
          <Route path="/operation/tables" element={
            <TableStatus 
              currentUser={currentUser}
            />
          } />
        </Route>
      </Route>

      {/* Sayfa Kök Yönlendirmeleri (Fallback/Root Redirects) */}
      <Route path="/" element={<NavigateToDashboard />} />
      <Route path="*" element={<NavigateToDashboard />} />
    </Routes>
  );
}

// Rotaları Rol Tabanlı Yetkilendirme ile Koruyan Özel Halka Bileşen (ProtectedRoute)
function ProtectedRoute({ allowedRoles }) {
  const currentUser = useSelector((state) => state.auth.user);
  const location = useLocation();

  // Giriş yapmamış kullanıcıyı Giriş Ekranına yönlendir ve geldiği konumu hafızada tut (state.from)
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kullanıcının rolü izin verilen roller arasında yoksa, yetkili olduğu sayfaya geri püskürt
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'superAdmin' || currentUser.role === 'Super Admin') {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else if (currentUser.role === 'branchAdmin') {
      return <Navigate to="/branch-admin/dashboard" replace />;
    } else if (currentUser.role === 'operationAdmin') {
      return <Navigate to="/operation/kitchen" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // İzin verildiyse alt sayfayı (route) render et
  return <Outlet />;
}

// Uygulamanın üst düzen çerçevesini (Sidebar, Navbar ve Loader) sunan Layout şablonu
function AppLayout({ currentUser, handleLogout, selectedRegion, setSelectedRegion, isDataLoading, isSimulating, setIsSimulating }) {
  const location = useLocation();
  
  // Sol menüde (Sidebar) ve Üst Başlıkta aktif sekmenin doğru yanmasını sağlayan rota eşleştirici
  const getActiveTabFromPathname = (pathname) => {
    if (pathname.includes('/super-admin/dashboard')) return 'overview';
    if (pathname.includes('/super-admin/branches')) return 'branches';
    if (pathname.includes('/super-admin/staff')) return 'staff';
    if (pathname.includes('/super-admin/menu')) return 'menu';
    if (pathname.includes('/super-admin/inventory')) return 'inventory';
    if (pathname.includes('/super-admin/reports')) return 'reports';
    if (pathname.includes('/super-admin/announcements')) return 'announcements';
    if (pathname.includes('/super-admin/settings')) return 'settings';
    
    if (pathname.includes('/branch-admin/dashboard')) return 'branchDashboard';
    if (pathname.includes('/branch-admin/orders')) return 'orders';
    if (pathname.includes('/branch-admin/reservations')) return 'reservations';
    if (pathname.includes('/branch-admin/tables')) return 'tables';
    if (pathname.includes('/branch-admin/announcements')) return 'announcements';
    
    if (pathname.includes('/operation/kitchen')) return 'kitchenQueue';
    if (pathname.includes('/operation/live-orders')) return 'liveOrders';
    if (pathname.includes('/operation/tables')) return 'tables';
    
    return 'overview';
  };

  const activeTab = getActiveTabFromPathname(location.pathname);

  return (
    <div id="branchiq-app-root" className="min-h-screen bg-slate-100 flex flex-row overflow-hidden font-sans antialiased text-slate-800">
      
      {/* 1. Sol Sabit Menü Paneli (Sidebar Drawer) */}
      <Sidebar 
        activeTab={activeTab} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {/* 2. Ana Çalışma Bölgesi (Main Workstage Block) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Üst Kısım Gezinme ve Bilgilendirme Çubuğu (Navbar) */}
        <Navbar 
          activeTab={activeTab} 
          selectedRegion={selectedRegion} 
          setSelectedRegion={setSelectedRegion} 
          currentUser={currentUser} 
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
        />

        {/* 3. Sayfa İçeriklerinin Render Edildiği Alan ve Küresel Yükleniyor Kontrolü */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {isDataLoading && (
            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-xs flex items-center justify-center z-40 animate-fade-in">
              <div className="bg-white/80 p-5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-200">
                <Loader2 className="animate-spin text-blue-600" size={18} />
                <span className="text-xs font-bold text-slate-700 font-sans">Syncing with BranchIQ Cloud...</span>
              </div>
            </div>
          )}
          {/* Aktif rotaya ait alt bileşeni (page panel) buraya yükler */}
          <Outlet />
        </main>
      </div>

    </div>
  );
}

// Ana kök rotada olan kullanıcının rolüne göre doğru yönetim paneline yönlendiren yönlendirici (NavigateToDashboard)
function NavigateToDashboard() {
  const currentUser = useSelector((state) => state.auth.user);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role === 'superAdmin' || currentUser.role === 'Super Admin') {
    return <Navigate to="/super-admin/dashboard" replace />;
  } else if (currentUser.role === 'branchAdmin') {
    return <Navigate to="/branch-admin/dashboard" replace />;
  } else if (currentUser.role === 'operationAdmin') {
    return <Navigate to="/operation/kitchen" replace />;
  }
  return <Navigate to="/login" replace />;
}
