// React ve durum/etki kancalarını içe aktar
import React, { useState } from 'react';
// Şube yönetim ekranı simgelerini Lucide React paketinden yükle
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Trash2, 
  Edit2, 
  Plus, 
  SlidersHorizontal, 
  Search, 
  X, 
  ShieldAlert, 
  Globe 
} from 'lucide-react';
// Redux dispatch nesnesini yükle
import { useDispatch } from 'react-redux';
// Şube ekleme, güncelleme ve silme thunk eylemlerini import et
import { addBranch, updateBranch, deleteBranch } from '../../features/branches/branchesSlice.js';
// Çoklu dil çeviri kancasını (t fonksiyonu) context'ten çek
import { useLanguage } from '../../context/LanguageContext.jsx';
// Bildirim ve özel onay modali kancasını içe aktar
import { useNotification } from '../../context/NotificationContext.jsx';

// Şube listeleme ve yönetim ana bileşeni
export default function Branches({ branches, selectedRegion, currentUser, onViewDetail }) {
  // Redux dispatch nesnesini tanımla
  const dispatch = useDispatch();
  // Dil çeviri çevirisini kullanıma hazırla
  const { t, language } = useLanguage();
  const { showToast, confirm } = useNotification();

  // Arama metni durum yönetimi (Search query)
  const [searchQuery, setSearchQuery] = useState('');
  // Durum filtresi durum yönetimi (Active / Inactive / All)
  const [statusFilter, setStatusFilter] = useState('All');

  // Şube Ekleme / Güncelleme modal pencerelerinin açık-kapalı durumu ve seçili şube referansı
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // Şube formu girdi veri yapısı şablonu
  const [formData, setFormData] = useState({
    name: '',
    region: 'North',
    manager: '',
    phone: '',
    status: 'Active',
    revenue: 0,
    ordersCount: 0
  });

  // Şubeleri seçilen bölge limitine göre listele
  const regionalBranches = selectedRegion === 'All' 
    ? branches 
    : branches.filter(b => b.region === selectedRegion);

  // Filtrelenmiş şube listesi (Arama kelimesine ve duruma göre)
  const filteredBranches = regionalBranches.filter(branch => {
    // Arama kelimesi kontrolü (Müdür adı veya şube adına göre)
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          branch.manager.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Durum kontrolü (Aktif, Pasif, Hepsi)
    const matchesStatus = statusFilter === 'All' || branch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Yeni Şube Ekleme Modalini Aç
  const handleOpenAddModal = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      region: selectedRegion === 'All' ? 'North' : selectedRegion,
      manager: '',
      phone: '',
      status: 'Active',
      revenue: 0,
      ordersCount: 0
    });
    setIsModalOpen(true);
  };

  // Mevcut Şube Güncelleme Modalini Aç
  const handleOpenEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      region: branch.region,
      manager: branch.manager,
      phone: branch.phone,
      status: branch.status,
      revenue: branch.revenue || 0,
      ordersCount: branch.ordersCount || 0
    });
    setIsModalOpen(true);
  };

  // Modali Kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  // Form elemanlarındaki değişiklikleri formData state yapısına yansıt
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'revenue' || name === 'ordersCount') ? Number(value) : value
    }));
  };

  // Şube Ekleme/Güncelleme Form Gönderimi (Submit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      // Düzenleme modundaysak updateBranch eylemini tetikle
      dispatch(updateBranch({ id: editingBranch.id, ...formData }));
      showToast('Branch updated successfully!', 'success');
    } else {
      // Yeni şube ekleniyorsa addBranch eylemini dispatch et
      dispatch(addBranch(formData));
      showToast('Branch created successfully!', 'success');
    }
    // Modali kapat
    handleCloseModal();
  };

  // Şube Sil (Decommission) tetikleyicisi
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Şubeyi Devreden Çıkar' : 'Decommission Branch',
      message: language === 'tr' 
        ? 'Bu şube düğümünü işletmeden kalıcı olarak silmek istediğinizden emin misiniz?' 
        : 'Are you sure you want to permanently delete this branch node from the enterprise?',
      confirmText: language === 'tr' ? 'Devreden Çıkar' : 'Decommission',
      cancelText: language === 'tr' ? 'İptal' : 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteBranch(id));
      showToast('Branch decommissioned successfully!', 'success');
    }
  };

  // Şube Aktif/Pasif durum değiştirici hızlı anahtar
  const handleToggleStatus = (branch) => {
    const nextStatus = branch.status === 'Active' ? 'Inactive' : 'Active';
    dispatch(updateBranch({ ...branch, status: nextStatus }));
  };

  return (
    <div id="branches-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Kontrol Arama & Filtreleme Çubuğu */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Şube veya Müdür Adı ile Arama Arayüzü */}
          <div className="relative flex-1 max-w-md min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="branch-search-input"
              type="text"
              placeholder={t('search_branches_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Şube Çalışma Durumuna Göre Filtre (Dropdown) */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              id="branch-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none font-bold text-slate-650 cursor-pointer focus:outline-hidden"
            >
              <option value="All">{t('all_statuses')}</option>
              <option value="Active">{t('active')}</option>
              <option value="Inactive">{t('inactive')}</option>
            </select>
          </div>
        </div>

        {/* Yetki Kontrolü: Sadece Super Admin veya Regional Manager yeni şube ekleyebilir */}
        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
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

      {/* Şube Kartları Arayüz Izgarası (Grid Layout) */}
      {filteredBranches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBranches.map(branch => (
            <div 
              key={branch.id} 
              id={`branch-card-${branch.id}`}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Kart Üst Bölgesi */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* Şube Simgesi */}
                    <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl">
                      <Building2 size={20} />
                    </div>
                    <div>
                      {/* Şube İsmi ve Bölgesi */}
                      <h4 className="font-extrabold text-slate-900 tracking-tight">{branch.name}</h4>
                      <p className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-0.5 mt-0.5">
                        <MapPin size={10} />
                        <span>{branch.region} {t('region')}</span>
                      </p>
                    </div>
                  </div>

                  {/* Şube Aktiflik Durum Rozeti (Badge) */}
                  <button
                    onClick={() => handleToggleStatus(branch)}
                    id={`branch-status-toggle-${branch.id}`}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      branch.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'bg-slate-150 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {branch.status === 'Active' ? t('active') : t('inactive')}
                  </button>
                </div>

                {/* Aylık Performans Metrikleri */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">{t('monthly_income')}</span>
                    <span className="text-slate-900 font-black">${branch.revenue?.toLocaleString() || 0}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">{t('monthly_orders')}</span>
                    <span className="text-slate-900 font-black">{branch.ordersCount?.toLocaleString() || 0} {t('orders')}</span>
                  </div>
                </div>

                {/* Şube Müdürü Bilgi Şeridi */}
                <div className="bg-slate-50 px-4 py-2.5 rounded-xl text-xs flex justify-between font-semibold">
                  <span className="text-slate-400 font-medium">{t('manager')}:</span>
                  <span className="text-slate-800 font-extrabold">{branch.manager}</span>
                </div>
              </div>

              {/* Kart İşlem Paneli Altlığı */}
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
                  {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin') && (
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
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_branches_found')}</h4>
          <p className="text-xs text-slate-400 mt-1 font-semibold">{t('no_branches_subtitle')}</p>
        </div>
      )}

      {/* Şube Ekleme / Güncelleme Düzenleme Form Modali (Modal Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            {/* Modal Başlığı */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-blue-400" />
                <h3 className="font-bold">
                  {editingBranch ? t('edit_branch_config') : t('onboard_branch_node')}
                </h3>
              </div>
              <button 
                id="close-branch-modal-btn"
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Şube Bilgileri Giriş Formu */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('branch_title')}</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. BranchIQ Kadikoy"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('regional_scope')}</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="North">{t('north')}</option>
                    <option value="South">{t('south')}</option>
                    <option value="East">{t('east')}</option>
                    <option value="West">{t('west')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('branch_status')}</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="Active">{t('active')}</option>
                    <option value="Inactive">{t('inactive')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('assigned_leader')}</label>
                <input
                  required
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  placeholder="e.g. Can Ozkan"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('monthly_revenue_input')}</label>
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('monthly_orders_input')}</label>
                  <input
                    type="number"
                    name="ordersCount"
                    value={formData.ordersCount}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('contact_phone')}</label>
                <input
                  required
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+90 (216) 123 4567"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                />
              </div>

              {/* Form Alt Butonları */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  id="submit-branch-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer animate-fade-in"
                >
                  {editingBranch ? t('save_updates') : t('commit_onboard')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
