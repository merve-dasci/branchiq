// React ve durum kancasını (useState) içe aktar
import React, { useState } from 'react';
// Panel simgelerini Lucide React kütüphanesinden yükle
import { 
  Megaphone, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Trash2, 
  X, 
  Calendar, 
  User
} from 'lucide-react';
// Redux duyuru ekleme ve silme thunk eylemlerini import et
import { useDispatch } from 'react-redux';
import { addAnnouncement, deleteAnnouncement } from '../../features/campaigns/campaignsSlice.js';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';
// Bildirim ve özel onay modali kancasını içe aktar
import { useNotification } from '../../context/NotificationContext.jsx';

// Kurumsal Duyuru Panosu Yönetim Bileşeni
export default function Campaigns({ announcements, currentUser }) {
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const { showToast, confirm } = useNotification();

  // Modal Açık/Kapalı durumu ve form girdileri durum yönetimi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    sender: ''
  });

  // Duyuru Yayınlama Modalini Aç
  const handleOpenModal = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      sender: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Corporate HQ'
    });
    setIsModalOpen(true);
  };

  // Modali Kapat
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Form girdi değişimlerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Yeni duyuruyu veritabanına ekle
  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    dispatch(addAnnouncement({
      ...formData,
      date: now.toISOString().split('T')[0]
    }));
    showToast(language === 'tr' ? 'Duyuru başarıyla yayınlandı!' : 'Notice broadcasted successfully!', 'success');
    handleCloseModal();
  };

  // Duyuruyu panodan kalıcı olarak kaldır
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: language === 'tr' ? 'Duyuruyu Sil' : 'Delete Notice',
      message: language === 'tr' ? 'Bu duyuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.' : 'Delete this announcement? This action cannot be undone.',
      confirmText: language === 'tr' ? 'Sil' : 'Delete',
      cancelText: language === 'tr' ? 'İptal' : 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteAnnouncement(id));
      showToast(language === 'tr' ? 'Duyuru başarıyla silindi!' : 'Notice deleted successfully!', 'success');
    }
  };

  return (
    <div id="announcements-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Duyuru Panosu Üst Bilgi Satırı */}
      <div className="flex justify-between items-center bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{t('corporate_notices')}</h3>
          <p className="text-xs text-slate-500">{t('notices_subtitle')}</p>
        </div>

        {/* Duyuru Yayınlama Yetki Butonu */}
        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
          <button
            id="new-notice-btn"
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>{t('broadcast_notice')}</span>
          </button>
        )}
      </div>

      {/* Kayıtlı Duyuruların Bento Listesi */}
      {announcements.length > 0 ? (
        <div className="space-y-4 max-w-4xl">
          {announcements.map(ann => {
            const typeTranslation = ann.type === 'info' ? (language === 'tr' ? 'BİLGİ' : 'INFO') :
                                    ann.type === 'success' ? (language === 'tr' ? 'BAŞARI' : 'SUCCESS') :
                                    (language === 'tr' ? 'UYARI' : 'WARNING');

            return (
              <div 
                key={ann.id} 
                id={`announcement-card-${ann.id}`}
                className={`bg-white border rounded-2xl p-6 shadow-xs flex gap-4 items-start relative hover:shadow-sm transition-all duration-150 ${
                  ann.type === 'warning' ? 'border-amber-200' :
                  ann.type === 'success' ? 'border-emerald-200' :
                  'border-slate-200'
                }`}
              >
                {/* Duruma göre renklendirilmiş simgeler */}
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  ann.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                  ann.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {ann.type === 'warning' && <AlertCircle size={20} />}
                  {ann.type === 'success' && <CheckCircle size={20} />}
                  {ann.type === 'info' && <Info size={20} />}
                </div>

                {/* Duyuru Metin İçeriği */}
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">{ann.title}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      ann.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                      ann.type === 'success' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {typeTranslation}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-650 leading-relaxed font-medium mb-4 whitespace-pre-line">
                    {ann.content}
                  </p>

                  {/* Gönderen ve Tarih Damgaları */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-semibold border-t border-slate-50 pt-3">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-slate-300" />
                      {t('sender')}: {ann.sender}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-300" />
                      {ann.date}
                    </span>
                  </div>
                </div>

                {/* Silme Kontrolü (Yalnızca Süper Admin'ler duyuruları silebilir) */}
                {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin') && (
                  <button
                    id={`delete-announcement-btn-${ann.id}`}
                    onClick={() => handleDelete(ann.id)}
                    className="absolute top-6 right-6 p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    title={t('delete') || 'Delete'}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Boş pano şablonu
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs max-w-4xl">
          <Megaphone size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">{t('announcements_empty')}</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">{t('employees_up_to_date')}</p>
        </div>
      )}

      {/* Duyuru Yayınlama Form Modali */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-blue-400" />
                <h3 className="font-bold">{t('broadcast_notice')}</h3>
              </div>
              <button 
                id="close-announcement-modal-btn"
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Duyuru Kategori Seçimi */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">{t('notice_type_group')}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden cursor-pointer"
                >
                  <option value="info">{t('info_standard')}</option>
                  <option value="success">{t('success_achievement')}</option>
                  <option value="warning">{t('warning_urgent')}</option>
                </select>
              </div>

              {/* Başlık */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">{t('notice_headline')}</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Scheduled System Maintenance"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                />
              </div>

              {/* Detay Metin Alanı */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">{t('notice_content_text')}</label>
                <textarea
                  required
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Provide precise details, guidelines, or instructions..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden"
                />
              </div>

              {/* Form Butonları */}
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
                  id="submit-announcement-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {t('broadcast_notice')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
