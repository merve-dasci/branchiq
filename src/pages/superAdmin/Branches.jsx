// React ve yerel durum yönetimi için useState kancasını içe aktar
import React, { useState } from 'react';
// Arayüzde kullanılacak modern simgeleri Lucide React paketinden ekle
import { 
  Store, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Star, 
  Edit2, 
  Trash2, 
  X, 
  SlidersHorizontal,
  Briefcase,
  TrendingUp
} from 'lucide-react';
// Redux eylemlerini (actions) tetiklemek için useDispatch kancasını yükle
import { useDispatch } from 'react-redux';
// Şube ekleme, güncelleme ve silme thunk eylemlerini import et
import { addBranch, updateBranch, deleteBranch } from '../../features/branches/branchesSlice.js';
// Çoklu dil çeviri kancasını (t fonksiyonu) context'ten çek
import { useLanguage } from '../../context/LanguageContext.jsx';

// Şube listeleme ve yönetim ana bileşeni
export default function Branches({ branches, selectedRegion, currentUser, onViewDetail }) {
  // Redux dispatch nesnesini tanımla
  const dispatch = useDispatch();
  // Dil çeviri çevirisini kullanıma hazırla
  const { t } = useLanguage();

  // Arama metni durum yönetimi (Search query)
  const [searchQuery, setSearchQuery] = useState('');
  // Durum filtresi yönetimi (All, Active, Inactive)
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Şube Ekleme/Düzenleme modal pencere görünürlüğü durum yönetimi
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Düzenlenen şubenin referansı (Yeni ekleme yapılıyorsa null kalır)
  const [editingBranch, setEditingBranch] = useState(null);

  // Şube formu girdi alanları durum yönetimi
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    region: 'Marmara',
    manager: '',
    status: 'Active',
    address: '',
    revenueThisMonth: 0,
    dailyOrders: 0,
    rating: 5.0,
    tableCount: 15,
    phone: ''
  });

  // Şubeleri arama, bölge ve durum filtrelerine göre süz (Sadece eşleşenleri listeler)
  const filteredBranches = branches.filter(branch => {
    // Üst menüden seçilen bölge filtresi kontrolü (All ise hepsini eşle)
    const matchesRegion = selectedRegion === 'All' || branch.region === selectedRegion;
    
    // Aktif/Pasif durum filtresi kontrolü
    const matchesStatus = statusFilter === 'All' || branch.status === statusFilter;
    
    // Arama kutusuna yazılan metnin isim, şehir, müdür veya adreste geçip geçmediğini kontrol et
    const text = `${branch.name} ${branch.city} ${branch.manager} ${branch.address}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    // Şubenin gösterilebilmesi için 3 filtrenin de olumlu sonuçlanması gerekir
    return matchesRegion && matchesStatus && matchesSearch;
  });

  // Yeni Şube Ekle modalini açma tetikleyicisi
  const handleOpenAddModal = () => {
    // Düzenlenen şubeyi temizle (sıfır kayıt olduğunu belirtir)
    setEditingBranch(null);
    // Form alanlarını varsayılan boş değerler ile doldur
    setFormData({
      name: '',
      city: '',
      region: selectedRegion === 'All' ? 'Marmara' : selectedRegion,
      manager: '',
      status: 'Active',
      address: '',
      revenueThisMonth: 0,
      dailyOrders: 0,
      rating: 5.0,
      tableCount: 15,
      phone: ''
    });
    // Modali aç
    setIsModalOpen(true);
  };

  // Mevcut Şube Düzenleme modalini açma tetikleyicisi
  const handleOpenEditModal = (branch) => {
    // Seçilen şubeyi düzenlenecek şube olarak state'e ata
    setEditingBranch(branch);
    // Şubeye ait güncel verileri forma aktar
    setFormData({
      name: branch.name,
      city: branch.city,
      region: branch.region,
      manager: branch.manager,
      status: branch.status,
      address: branch.address,
      revenueThisMonth: branch.revenueThisMonth,
      dailyOrders: branch.dailyOrders,
      rating: branch.rating,
      tableCount: branch.tableCount,
      phone: branch.phone
    });
    // Modali aç
    setIsModalOpen(true);
  };

  // Modal penceresini kapatma fonksiyonu
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  // Form girdileri değiştikçe durum güncelleyen change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Sayısal alanları otomatik Number tipine dönüştür, diğerlerini metin olarak kaydet
      [name]: name === 'revenueThisMonth' || name === 'dailyOrders' || name === 'rating' || name === 'tableCount'
        ? Number(value)
        : value
    }));
  };

  // Form Kaydet (Submit) tetikleyicisi
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBranch) {
      // Şube güncelleniyorsa updateBranch eylemini ID ile birlikte dispatch et
      dispatch(updateBranch({ id: editingBranch.id, ...formData }));
    } else {
      // Yeni şube ekleniyorsa addBranch eylemini dispatch et
      dispatch(addBranch(formData));
    }
    // Modali kapat
    handleCloseModal();
  };

  // Şube Sil (Decommission) tetikleyicisi
  const handleDelete = (id) => {
    // Kullanıcıya yerelleştirilmiş onay kutusunu göster
    if (window.confirm(t('delete_branch_confirm'))) {
      // Onaylandıysa deleteBranch eylemini veritabanına silme isteği atmak üzere tetikle
      dispatch(deleteBranch(id));
    }
  };

  // Şube Aktif/Pasif durum değiştirici hızlı anahtar
  const toggleStatus = (branch) => {
    const updated = {
      ...branch,
      // Durum 'Active' ise 'Inactive' yap, tersiyse 'Active' yap
      status: branch.status === 'Active' ? 'Inactive' : 'Active'
    };
    // Güncellenmiş şube durumunu sunucuya kaydetmek üzere dispatch et
    dispatch(updateBranch(updated));
  };

  return (
    <div id="branches-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Üst Arama Kutusu ve Durum Filtre Alanı */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          {/* Arama Input Kutusu */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="branch-search-input"
              type="text"
              placeholder={t('search_branches_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Aktif/Pasif Durum Filtre Seçicisi */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              id="branch-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="All">{t('all_statuses')}</option>
              <option value="Active">{t('active')}</option>
              <option value="Inactive">{t('inactive')}</option>
            </select>
          </div>
        </div>

        {/* Yetki Kontrolü: Sadece Super Admin veya Regional Manager yeni şube ekleyebilir */}
        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Regional Manager') && (
          <button
            id="add-branch-btn"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all duration-200 cursor-pointer"
          >
            <Plus size={16} />
            <span>{t('add_branch_node')}</span>
          </button>
        )}
      </div>

      {/* Şube Kartlarının Listelendiği Alan */}
      {filteredBranches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBranches.map(branch => (
            <div 
              key={branch.id} 
              id={`branch-card-${branch.id}`}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Kart İçerik Bloğu */}
              <div className="p-6 pb-4 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Store size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {/* Şube Adı */}
                        <h4 className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">{branch.name}</h4>
                        {/* Düşük Performans Uyarısı (Rating < 4.5 veya Ciro < $12,000 ise alarm verir) */}
                        {(branch.rating < 4.5 || branch.revenueThisMonth < 12000) && (
                          <span className="text-[9px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md border border-rose-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                            <span>{t('low_performance')}</span>
                          </span>
                        )}
                      </div>
                      {/* Konum Bilgisi */}
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{branch.address}, {branch.city}</span>
                      </p>
                    </div>
                  </div>

                  {/* Şube Aktif/Pasif Durum Butonu */}
                  <button
                    onClick={() => toggleStatus(branch)}
                    id={`branch-toggle-status-${branch.id}`}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all duration-150 ${
                      branch.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {branch.status === 'Active' ? t('active') : t('inactive')}
                  </button>
                </div>

                {/* Hızlı Finansal KPI Göstergesi (Aylık Brüt Ciro ve Sipariş Adetleri) */}
                <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t('monthly_gross')}</span>
                    <span className="text-sm font-extrabold text-slate-900">${branch.revenueThisMonth.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t('daily_orders')}</span>
                    <span className="text-sm font-extrabold text-slate-900">{branch.dailyOrders} avg</span>
                  </div>
                </div>

                {/* Şube Genel Detay Listesi */}
                <div className="space-y-2 mt-4 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t('regional_hq')}</span>
                    <span className="font-semibold text-slate-800">{branch.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t('general_manager')}</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Briefcase size={11} className="text-blue-500" />
                      {branch.manager}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t('table_count_label')}</span>
                    <span className="font-semibold text-slate-800">{branch.tableCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{t('quality_rating')}</span>
                    <span className="font-semibold text-amber-500 flex items-center gap-0.5">
                      <Star size={11} fill="currentColor" />
                      {branch.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">{t('contact')}</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Phone size={11} />
                      {branch.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kart Alt Panel Eylemleri (Analytics, Configure, Decommission) */}
              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-between items-center">
                <button
                  id={`branch-analytics-btn-${branch.id}`}
                  onClick={() => onViewDetail && onViewDetail(branch)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-extrabold transition-all cursor-pointer"
                >
                  <TrendingUp size={12} />
                  <span>{t('view_analytics')}</span>
                </button>
                <div className="flex gap-3.5">
                  <button
                    id={`branch-edit-btn-${branch.id}`}
                    onClick={() => handleOpenEditModal(branch)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-bold transition-all cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>{t('configure')}</span>
                  </button>
                  {/* Sadece Super Admin şubeyi tamamen devreden çıkarabilir (veritabanından silebilir) */}
                  {currentUser && currentUser.role === 'Super Admin' && (
                    <button
                      id={`branch-delete-btn-${branch.id}`}
                      onClick={() => handleDelete(branch.id)}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>{t('decommission')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Eşleşen Şube Kaydı Bulunamazsa Gösterilecek Boş Panel
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <Store size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_branches_located')}</h4>
          <p className="text-xs text-slate-400 mt-1">{t('reset_filter_params')}</p>
        </div>
      )}

      {/* Şube Ekleme / Güncelleme Modal Pencere Formu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-zoom-in">
            {/* Modal Başlığı */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-blue-400" />
                <h3 className="font-bold">{editingBranch ? t('update_branch_details') : t('provision_new_branch')}</h3>
              </div>
              <button 
                id="close-branch-modal-btn"
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Formu */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('branch_name')}</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. BranchIQ Atasehir"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('city')}</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Istanbul"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('region_network')}</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Marmara">{t('marmara') || 'Marmara'}</option>
                    <option value="Central Anatolia">{t('central_anatolia') || 'Central Anatolia'}</option>
                    <option value="Aegean">{t('aegean') || 'Aegean'}</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('general_manager_name')}</label>
                  <input
                    required
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    placeholder="e.g. Ahmet Yildirim"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('address_label')}</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Bagdat Cd. No:24"
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('monthly_gross_revenue_label')}</label>
                  <input
                    type="number"
                    name="revenueThisMonth"
                    value={formData.revenueThisMonth}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('avg_daily_orders_label')}</label>
                  <input
                    type="number"
                    name="dailyOrders"
                    value={formData.dailyOrders}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('phone_number_label')}</label>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+90 212 555 1122"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('table_count_label')}</label>
                  <input
                    type="number"
                    name="tableCount"
                    value={formData.tableCount}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Modal Eylem Butonları (İptal / Kaydet) */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  id="submit-branch-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {editingBranch ? t('update_branch_details') : t('provision_node')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
