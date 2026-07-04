import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { addAnnouncement, deleteAnnouncement } from '../../features/campaigns/campaignsSlice.js';

export default function Campaigns({ announcements, currentUser }) {
  const dispatch = useDispatch();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    sender: ''
  });

  const handleOpenModal = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      sender: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Corporate HQ'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    dispatch(addAnnouncement({
      ...formData,
      date: now.toISOString().split('T')[0]
    }));
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this announcement? This action cannot be undone.')) {
      dispatch(deleteAnnouncement(id));
    }
  };

  return (
    <div id="announcements-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Notice Board Header with Quick Post Button */}
      <div className="flex justify-between items-center bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Corporate Notice Broadcasts</h3>
          <p className="text-xs text-slate-500">Communicate guidelines, policy adjustments, and branch achievements.</p>
        </div>

        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Regional Manager') && (
          <button
            id="new-notice-btn"
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Broadcast Notice</span>
          </button>
        )}
      </div>

      {/* Grid or Stack of notices */}
      {announcements.length > 0 ? (
        <div className="space-y-4 max-w-4xl">
          {announcements.map(ann => {
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
                {/* Status colored icon */}
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  ann.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                  ann.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {ann.type === 'warning' && <AlertCircle size={20} />}
                  {ann.type === 'success' && <CheckCircle size={20} />}
                  {ann.type === 'info' && <Info size={20} />}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">{ann.title}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      ann.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                      ann.type === 'success' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ann.type}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4 whitespace-pre-line">
                    {ann.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-semibold border-t border-slate-50 pt-3">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-slate-300" />
                      Sender: {ann.sender}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-slate-300" />
                      {ann.date}
                    </span>
                  </div>
                </div>

                {/* Delete button (HQ Super Admins only) */}
                {currentUser && currentUser.role === 'Super Admin' && (
                  <button
                    id={`delete-announcement-btn-${ann.id}`}
                    onClick={() => handleDelete(ann.id)}
                    className="absolute top-6 right-6 p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Remove Notice"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs max-w-4xl">
          <Megaphone size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">Announcement Board Empty</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">All employees are completely up to date.</p>
        </div>
      )}

      {/* Broadcast Notice modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-blue-400" />
                <h3 className="font-bold">Broadcast Notice</h3>
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
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Notice Type Group*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden cursor-pointer"
                >
                  <option value="info">Information (Standard Info)</option>
                  <option value="success">Success (Achievement Celebration)</option>
                  <option value="warning">Warning (Urgent Maintenance / Attention)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Notice Headline*</label>
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

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Notice Content Text*</label>
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

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-announcement-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
