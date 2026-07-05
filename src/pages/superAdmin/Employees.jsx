import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { addStaff, updateStaff, deleteStaff } from '../../features/employees/employeesSlice.js';
import { useNotification } from '../../context/NotificationContext.jsx';

export default function Employees({ staff, branches, selectedRegion, currentUser }) {
  const dispatch = useDispatch();
  const { showToast, confirm } = useNotification();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedBranchId, setSelectedBranchId] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Chef',
    branchId: '',
    status: 'Active'
  });

  // Filter branches by region scope
  const regionalBranches = selectedRegion === 'All' 
    ? branches 
    : branches.filter(b => b.region === selectedRegion);

  const regionalBranchIds = regionalBranches.map(b => b.id);

  // Filtering Staff Directory list
  const filteredStaff = staff.filter(member => {
    // Region scoping
    const matchesRegion = selectedRegion === 'All' || regionalBranchIds.includes(member.branchId);
    
    // Branch filter
    const matchesBranch = selectedBranchId === 'All' || member.branchId === selectedBranchId;
    
    // Role filter
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;

    // Search query match
    const text = `${member.name} ${member.email} ${member.role}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    return matchesRegion && matchesBranch && matchesRole && matchesSearch;
  });

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedBranch = branches.find(b => b.id === formData.branchId);
    const postData = {
      ...formData,
      branchName: selectedBranch ? selectedBranch.name : 'Unknown Branch'
    };

    if (editingMember) {
      dispatch(updateStaff({ id: editingMember.id, ...postData }));
      showToast('Staff member updated successfully!', 'success');
    } else {
      dispatch(addStaff(postData));
      showToast('Staff member onboarded successfully!', 'success');
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Dismiss Staff Member',
      message: 'Are you sure you want to dismiss this member from the staff database?',
      confirmText: 'Dismiss',
      cancelText: 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteStaff(id));
      showToast('Staff member dismissed successfully!', 'success');
    }
  };

  const roles = ['All', 'Branch Manager', 'Chef', 'Waiter', 'Cashier', 'Host'];

  return (
    <div id="staff-panel" className="p-8 space-y-6 animate-fade-in">

      {/* Control Actions Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="staff-search-input"
              type="text"
              placeholder="Search by staff name, role, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              id="staff-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role === 'All' ? 'All Roles' : role}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
            <MapPin size={12} className="text-slate-500" />
            <select
              id="staff-branch-filter"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="All">All Store Nodes</option>
              {regionalBranches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
          <button
            id="add-staff-btn"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Onboard Employee</span>
          </button>
        )}
      </div>

      {/* Directory Cards Grid */}
      {filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStaff.map(member => (
            <div 
              key={member.id} 
              id={`staff-card-${member.id}`}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="p-6 pb-4 flex-1">
                <div className="flex items-center gap-3.5 mb-4">
                  {/* Initials profile circle */}
                  <div className="h-11 w-11 bg-slate-100 text-slate-700 rounded-2xl border border-slate-200/50 flex items-center justify-center text-sm font-black uppercase">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">{member.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-655 flex items-center gap-1 mt-0.5">
                      <Briefcase size={10} className="text-slate-400" />
                      <span>{member.role}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-3.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Assigned Node:</span>
                    <span className="font-bold text-slate-800">{member.branchName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Roster Status:</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      member.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-150 text-slate-500'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Direct Email:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Mail size={11} className="text-slate-400" />
                      {member.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Contact Phone:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Phone size={11} className="text-slate-400" />
                      {member.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls footer panel */}
              {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-3.5">
                  <button
                    id={`staff-edit-btn-${member.id}`}
                    onClick={() => handleOpenEditModal(member)}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 font-bold transition-all cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    id={`staff-delete-btn-${member.id}`}
                    onClick={() => handleDelete(member.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Dismiss</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">No Staff Members Listed</h4>
          <p className="text-xs text-slate-400 mt-1">Refine filters, scope boundaries, or onboard new employees.</p>
        </div>
      )}

      {/* Roster Onboarding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                <h3 className="font-bold">{editingMember ? 'Update Staff Member' : 'Onboard Employee'}</h3>
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
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Legal Name*</label>
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
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Roster Email*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Store Node Assignment*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Operational Role*</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Chef">Chef</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Host">Host</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Phone*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Roster Status*</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="Active">Active Duty</option>
                    <option value="Inactive">Leave / Inactive</option>
                  </select>
                </div>
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
                  id="submit-staff-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {editingMember ? 'Save Updates' : 'Commit Onboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
