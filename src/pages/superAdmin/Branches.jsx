import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { addBranch, updateBranch, deleteBranch } from '../../features/branches/branchesSlice.js';

export default function Branches({ branches, selectedRegion, currentUser, onViewDetail }) {
  const dispatch = useDispatch();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // Form states
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

  // Filters
  const filteredBranches = branches.filter(branch => {
    // Region Filter
    const matchesRegion = selectedRegion === 'All' || branch.region === selectedRegion;
    
    // Status Filter
    const matchesStatus = statusFilter === 'All' || branch.status === statusFilter;
    
    // Search Query
    const text = `${branch.name} ${branch.city} ${branch.manager} ${branch.address}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());

    return matchesRegion && matchesStatus && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingBranch(null);
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
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (branch) => {
    setEditingBranch(branch);
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'revenueThisMonth' || name === 'dailyOrders' || name === 'rating' || name === 'tableCount'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBranch) {
      // Update
      dispatch(updateBranch({ id: editingBranch.id, ...formData }));
    } else {
      // Create
      dispatch(addBranch(formData));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this branch node from the enterprise?')) {
      dispatch(deleteBranch(id));
    }
  };

  const toggleStatus = (branch) => {
    const updated = {
      ...branch,
      status: branch.status === 'Active' ? 'Inactive' : 'Active'
    };
    dispatch(updateBranch(updated));
  };

  return (
    <div id="branches-panel" className="p-8 space-y-6 animate-fade-in">
      
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="branch-search-input"
              type="text"
              placeholder="Search branches by name, location, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              id="branch-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'Regional Manager') && (
          <button
            id="add-branch-btn"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all duration-200 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Branch Node</span>
          </button>
        )}
      </div>

      {/* Grid of branches */}
      {filteredBranches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBranches.map(branch => (
            <div 
              key={branch.id} 
              id={`branch-card-${branch.id}`}
              className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Header block with status toggle */}
              <div className="p-6 pb-4 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Store size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">{branch.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{branch.address}, {branch.city}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStatus(branch)}
                    id={`branch-toggle-status-${branch.id}`}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all duration-150 ${
                      branch.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    {branch.status}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Gross</span>
                    <span className="text-sm font-extrabold text-slate-900">${branch.revenueThisMonth.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Daily Orders</span>
                    <span className="text-sm font-extrabold text-slate-900">{branch.dailyOrders} avg</span>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-2 mt-4 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Regional HQ:</span>
                    <span className="font-semibold text-slate-800">{branch.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">General Manager:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Briefcase size={11} className="text-blue-500" />
                      {branch.manager}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Table Count:</span>
                    <span className="font-semibold text-slate-800">{branch.tableCount} tables</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Quality Rating:</span>
                    <span className="font-semibold text-amber-500 flex items-center gap-0.5">
                      <Star size={11} fill="currentColor" />
                      {branch.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Contact:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Phone size={11} />
                      {branch.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer Panel */}
              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-between items-center">
                <button
                  id={`branch-analytics-btn-${branch.id}`}
                  onClick={() => onViewDetail && onViewDetail(branch)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-extrabold transition-all cursor-pointer"
                >
                  <TrendingUp size={12} />
                  <span>View Analytics</span>
                </button>
                <div className="flex gap-3.5">
                  <button
                    id={`branch-edit-btn-${branch.id}`}
                    onClick={() => handleOpenEditModal(branch)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-bold transition-all cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>Configure</span>
                  </button>
                  {currentUser && currentUser.role === 'Super Admin' && (
                    <button
                      id={`branch-delete-btn-${branch.id}`}
                      onClick={() => handleDelete(branch.id)}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                      <span>Decommission</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <Store size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">No Branch Nodes Located</h4>
          <p className="text-xs text-slate-400 mt-1">Try resetting your filter parameters or search queries.</p>
        </div>
      )}

      {/* Add / Edit Branch Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-blue-400" />
                <h3 className="font-bold">{editingBranch ? 'Update Branch Details' : 'Provision New Branch'}</h3>
              </div>
              <button 
                id="close-branch-modal-btn"
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Branch Name*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">City*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Region Network*</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Marmara">Marmara</option>
                    <option value="Central Anatolia">Central Anatolia</option>
                    <option value="Aegean">Aegean</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">General Manager Name*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Address*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Monthly Gross Revenue ($)</label>
                  <input
                    type="number"
                    name="revenueThisMonth"
                    value={formData.revenueThisMonth}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Daily Orders</label>
                  <input
                    type="number"
                    name="dailyOrders"
                    value={formData.dailyOrders}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number*</label>
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
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Table Count</label>
                  <input
                    type="number"
                    name="tableCount"
                    value={formData.tableCount}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
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
                  id="submit-branch-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {editingBranch ? 'Update Details' : 'Provision Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
