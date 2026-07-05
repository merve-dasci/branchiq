// React ve durum kancasını (useState) içe aktar
import React, { useState } from 'react';
// Panel simgelerini Lucide React paketinden yükle
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Globe, 
  Save 
} from 'lucide-react';
// Çoklu dil kancasını içe aktar
import { useLanguage } from '../../context/LanguageContext.jsx';

// Süper Admin Sistem Ayarları Bileşeni
export default function Settings({ currentUser }) {
  const { t, language, setLanguage } = useLanguage();

  // Profil veri durum yönetimi
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Admin',
    email: currentUser?.email || '',
    language: language === 'tr' ? 'Turkish' : 'English',
    regionScope: currentUser?.region || 'All'
  });

  // Sistem özellik bayrakları durum yönetimi (Açık/Kapalı)
  const [toggles, setToggles] = useState({
    emailAlerts: true,
    pushAlerts: false,
    autoBackup: true,
    strictSla: true
  });

  const [savedStatus, setSavedStatus] = useState(false);

  // Özellik bayrağını aç/kapa
  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Dili değiştirme işlemi
  const handleLanguageChange = (val) => {
    setProfile(prev => ({ ...prev, language: val }));
    if (val === 'Turkish') {
      setLanguage('tr');
    } else {
      setLanguage('en');
    }
  };

  // Ayarları Kaydet
  const handleSave = (e) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div id="settings-panel" className="p-8 max-w-4xl space-y-6 animate-fade-in">
      {/* Sayfa Başlığı */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('settings_title')}</h2>
        <p className="text-xs text-slate-500 font-semibold">{t('settings_subtitle')}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profil Yapılandırma Kartı */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
            <User size={16} className="text-blue-500" />
            <span>{t('profile_config')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">{t('full_operational_name')}</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">{t('security_access_email')}</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 font-semibold cursor-not-allowed focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Bölgesel Tercihler ve Dil Seçimi */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
            <Globe size={16} className="text-emerald-500" />
            <span>{t('regional_preferences')}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">{t('system_locale_language')}</label>
              <select
                value={profile.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="English">English (Global)</option>
                <option value="Turkish">Türkçe (Local)</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 uppercase tracking-wider text-[9px] text-slate-400">{t('operational_region_limit')}</label>
              <input
                type="text"
                disabled
                value={profile.regionScope === 'All' ? (language === 'tr' ? 'Tüm Bölgeler' : 'All') : profile.regionScope}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 font-semibold cursor-not-allowed focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Mutfak ve Veri Tetikleme Bayrakları */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3">
            <Bell size={16} className="text-amber-500" />
            <span>{t('interactive_system_flags')}</span>
          </h4>

          <div className="space-y-3.5">
            {[
              { 
                id: 'emailAlerts', 
                title: language === 'tr' ? 'Günlük Operasyon Raporu E-postaları' : 'Operational Digest Emails', 
                desc: language === 'tr' ? 'Yönetici hesaplarına günlük PDF operasyon raporlarını otomatik gönder.' : 'Trigger daily PDF logs directly to active manager accounts.' 
              },
              { 
                id: 'pushAlerts', 
                title: language === 'tr' ? 'Canlı Sesli Bildirimler' : 'Live Sound Notifications', 
                desc: language === 'tr' ? 'Kuyruğa yeni sipariş geldiğinde hafif bir sesli uyarı çal.' : 'Synthesize sound ripples when new kitchen orders arrive in the queue.' 
              },
              { 
                id: 'autoBackup', 
                title: language === 'tr' ? 'Güvenli db.json Otomatik Yedekleme' : 'Durable db.json Auto-backups', 
                desc: language === 'tr' ? 'Belirli aralıklarla bulut veritabanı durum senkronizasyonunu etkinleştir.' : 'Enable secondary cloud state synchronization intervals.' 
              },
              { 
                id: 'strictSla', 
                title: language === 'tr' ? 'Sıkı SLA Süre Takibi (Mutfak)' : 'Strict SLA Tracking', 
                desc: language === 'tr' ? 'Hazırlanma süresi 15 dakikayı geçen siparişleri kırmızı olarak vurgula.' : 'Highlight food orders exceed 15-minute preparation limits in red.' 
              }
            ].map(flag => (
              <div key={flag.id} className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">{flag.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{flag.desc}</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleToggle(flag.id)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    toggles[flag.id] ? 'bg-blue-600 flex justify-end' : 'bg-slate-200 flex justify-start'
                  }`}
                >
                  <span className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kaydetme Butonu */}
        <div className="flex items-center gap-3 justify-end">
          {savedStatus && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in">
              {t('parameters_saved_success')}
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <Save size={13} />
            <span>{t('save_settings')}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
