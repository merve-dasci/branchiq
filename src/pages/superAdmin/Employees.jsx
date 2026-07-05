// React ve durum kancasını (useState) içe aktar
import React, { useState } from 'react';
// Çalışan kadrosu ekranı simgelerini Lucide React paketinden yükle
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  SlidersHorizontal, 
  X, 
  Trash2, 
  Edit2, 
  Briefcase 
} from 'lucide-react';
// Redux çalışan ekleme, güncelleme ve silme thunk eylemlerini import et
import { useDispatch } from 'react-redux';
import { addStaff, updateStaff, deleteStaff } from '../../features/employees/employeesSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';

// Süper Admin ve Bölge Yöneticisi Çalışan Kadrosu Yönetim Paneli
export default function Employees({ staff, branches, selectedRegion, currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();

  // Arama filtresi, unvan filtresi ve şube filtresi durum yönetimi
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedBranchId, setSelectedBranchId] = useState('All');

  // Modal Açık/Kapalı ve güncellenen üye durumları
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Yeni çalışan formu veri yapısı
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Chef',
    branchId: '',
    status: 'Active'
  });

  // Şubeleri bölge ağı sınırlarına göre filtrele
  const regionalBranches = selectedRegion === 'All' 
    ? branches 
    : branches.filter(b => b.region === selectedRegion);

  const regionalBranchIds = regionalBranches.map(b => b.id);

  // Çalışanları arama kelimesine, şubeye ve unvana göre süz
  const filteredStaff = staff.filter(member => {
    // Bölgesel kısıt
    const matchesRegion = selectedRegion === 'All' || regionalBranchIds.includes(member.branchId);
    
    // Şube filtresi
    const matchesBranch = selectedBranchId === 'All' || member.branchId === selectedBranchId;
    
    // Görev / Unvan filtresi
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;

    // Arama kelimesi eşleşmesi (Ad, e-posta veya görev)
    const text = `${member.name} ${member.email} ${member.role}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    return matchesRegion && matchesBranch && matchesRole && matchesSearch;
  });

  // Yeni Çalışan Ekleme Modalini Aç
  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Chef',
      branchId: regionalBranches.length > 0 ? regionalBranches[0].id : '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  // Çalışan Düzenleme Modalini Aç
  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      branchId: member.branchId,
      status: member.status
    });
    setIsModalOpen(true);
  };

  // Modali Kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // Form Değişimlerini İzle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Formu Gönder (Ekle veya Güncelle)
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedBranch = branches.find(b => b.id === formData.branchId);
    const postData = {
      ...formData,
      branchName: selectedBranch ? selectedBranch.name : 'Unknown Branch'
    };

    if (editingMember) {
      dispatch(updateStaff({ id: editingMember.id, ...postData }));
    } else {
      dispatch(addStaff(postData));
    }
    handleCloseModal();
  };

  // Çalışan Kaydını Sil (İşten Çıkar)
  const handleDelete = (id) => {
    if (window.confirm(language === 'tr' ? 'Bu çalışanı kurumsal çalışan veri tabanından silmek istediğinize emin misiniz?' : 'Are you sure you want to dismiss this member from the staff database?')) {
      dispatch(deleteStaff(id));
    }
  };

  // Unvan Listesi Tanımları
  const roles = ['All', 'Branch Manager', 'Chef', 'Waiter', 'Cashier', 'Host'];

  return (
    <div id="staff-panel" className="p-8 space-y-6 animate-fade-in">

      {/* Kontrol Arama & Filtre Satırı */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
          {/* Arama Girişi */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="staff-search-input"
              type="text"
              placeholder={t('search_staff_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Görev / Unvan Seçicisi */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              id="staff-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              {roles.map(role => {
                const roleTranslation = role === 'All' ? (language === 'tr' ? 'Tüm Unvanlar' : 'All Roles') :
                                        role === 'Branch Manager' ? (language === 'tr' ? 'Şube Müdürü' : 'Branch Manager') :
                                        role === 'Chef' ? (language === 'tr' ? 'Şef / Aşçı' : 'Chef') :
                                        role === 'Waiter' ? (language === 'tr' ? 'Garson' : 'Waiter') :
                                        role === 'Cashier' ? (language === 'tr' ? 'Kasiyer' : 'Cashier') :
                                        (language === 'tr' ? 'Karşılama / Hostes' : 'Host');

                return (
                  <option key={role} value={role}>{roleTranslation}</option>
                );
              })}
            </select>
          </div>

          {/* Şube Seçicisi */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <MapPin size={12} className="text-slate-500" />
            <select
              id="staff-branch-filter"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="All">{language === 'tr' ? 'Tüm Şubeler' : 'All Store Nodes'}</option>
              {regionalBranches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Çalışan Onboard Etme Butonu */}
        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Regional Manager') && (
          <button
            id="add-staff-btn"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer animate-fade-in"
          >
            <Plus size={14} />
            <span>{t('onboard_employee')}</span>
          </button>
        )}
      </div>

      {/* Çalışan Kartları Bento Görünümü */}
      {filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map(member => {
            const statusTranslation = member.status === 'Active' ? (language === 'tr' ? 'Aktif Görevde' : 'Active') : (language === 'tr' ? 'İzinli / Pasif' : 'Inactive');
            const roleTranslation = member.role === 'Branch Manager' ? (language === 'tr' ? 'Şube Müdürü' : 'Branch Manager') :
                                    member.role === 'Chef' ? (language === 'tr' ? 'Şef / Aşçı' : 'Chef') :
                                    member.role === 'Waiter' ? (language === 'tr' ? 'Garson' : 'Waiter') :
                                    member.role === 'Cashier' ? (language === 'tr' ? 'Kasiyer' : 'Cashier') :
                                    (language === 'tr' ? 'Karşılama / Hostes' : 'Host');

            return (
              <div 
                key={member.id} 
                id={`staff-card-${member.id}`}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="p-6 pb-4 flex-1">
                  <div className="flex items-center gap-3.5 mb-4">
                    {/* Baş Harf Profil Dairesi */}
                    <div className="h-11 w-11 bg-slate-100 text-slate-700 rounded-2xl border border-slate-200/50 flex items-center justify-center text-sm font-black uppercase">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">{member.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1 mt-0.5">
                        <Briefcase size={10} className="text-slate-400" />
                        <span>{roleTranslation}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-3.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">{t('assigned_node')}:</span>
                      <span className="font-bold text-slate-800">{member.branchName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">{t('roster_status')}:</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-150 text-slate-500'
                      }`}>
                        {statusTranslation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">{t('direct_email')}:</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Mail size={11} className="text-slate-400" />
                        {member.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">{t('contact_phone')}:</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Phone size={11} className="text-slate-400" />
                        {member.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* İşlem Kontrol Paneli Butonları */}
                {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Regional Manager') && (
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-3.5">
                    <button
                      id={`staff-edit-btn-${member.id}`}
                      onClick={() => handleOpenEditModal(member)}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 font-bold transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>{t('edit') || 'Edit'}</span>
                    </button>
                    <button
                      id={`staff-delete-btn-${member.id}`}
                      onClick={() => handleDelete(member.id)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>{t('dismiss')}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('no_staff_listed')}</h4>
          <p className="text-xs text-slate-400 mt-1">{t('staff_subtitle')}</p>
        </div>
      )}

      {/* Çalışan Onboard Ekleme/Düzenleme Form Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                <h3 className="font-bold">{editingMember ? t('update_staff_member') : t('onboard_employee')}</h3>
              </div>
              <button 
                id="close-staff-modal-btn"
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('full_legal_name')}</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Hale Yilmaz"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('roster_email')}</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. name@branchiq.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('store_node_assignment')}</label>
                  <select
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    {regionalBranches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('operational_role')}</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="Branch Manager">{language === 'tr' ? 'Şube Müdürü' : 'Branch Manager'}</option>
                    <option value="Chef">{language === 'tr' ? 'Şef' : 'Chef'}</option>
                    <option value="Waiter">{language === 'tr' ? 'Garson' : 'Waiter'}</option>
                    <option value="Cashier">{language === 'tr' ? 'Kasiyer' : 'Cashier'}</option>
                    <option value="Host">{language === 'tr' ? 'Host/Hostes' : 'Host'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('contact_phone_required')}</label>
                  <input
                    required
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+90 555 123 4455"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{t('roster_status_required')}</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="Active">{language === 'tr' ? 'Aktif Görevde' : 'Active Duty'}</option>
                    <option value="Inactive">{language === 'tr' ? 'İzinli / Pasif' : 'Leave / Inactive'}</option>
                  </select>
                </div>
              </div>

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
                  id="submit-staff-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {editingMember ? t('save_updates') : t('commit_onboard')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
