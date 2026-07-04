import React, { useEffect, useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchInventory, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem 
} from '../../features/inventory/inventorySlice.js';

export default function InventoryManagement({ currentUser }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [alertFilter, setAlertFilter] = useState(false);

  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    minLimit: 10,
    branchName: 'All Branches',
    supplier: ''
  });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      quantity: 0,
      unit: 'kg',
      minLimit: 10,
      branchName: 'All Branches',
      supplier: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      minLimit: item.minLimit,
      branchName: item.branchName || 'All Branches',
      supplier: item.supplier || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'quantity' || name === 'minLimit') ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateInventoryItem({ id: editingItem.id, ...formData }));
    } else {
      dispatch(addInventoryItem(formData));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this stock ledger line?')) {
      dispatch(deleteInventoryItem(id));
    }
  };

  // Filter list
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBranch = branchFilter === 'All' || item.branchName === branchFilter;
    const isAlertItem = item.quantity <= item.minLimit;
    const matchesAlert = !alertFilter || isAlertItem;

    return matchesSearch && matchesBranch && matchesAlert;
  });

  const uniqueBranches = ['All', ...new Set(items.map(i => i.branchName).filter(Boolean))];

  return (
    <div id="inventory-panel" className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Stock & Supply Inventory</h2>
          <p className="text-xs text-slate-500 font-semibold">Track key ingredients, kitchen utensils, and threshold triggers.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
        >
          <Plus size={14} /> Add Stock Item
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tracked Items</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{items.length}</h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Critical Shortage Triggers</p>
            <h4 className="text-2xl font-black text-amber-600 mt-1">
              {items.filter(i => i.quantity <= i.minLimit).length}
            </h4>
          </div>
          <AlertTriangle className="text-amber-500 animate-pulse" size={24} />
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Supply Depots Connected</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">HQ & Regional Nodes</h4>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search stock catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden"
            />
          </div>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer"
          >
            {uniqueBranches.map(br => (
              <option key={br} value={br}>{br === 'All' ? 'All Locations' : br}</option>
            ))}
          </select>

          <button
            onClick={() => setAlertFilter(!alertFilter)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              alertFilter 
                ? 'bg-amber-150 border-amber-300 text-amber-800' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle size={12} />
            <span>Show Low Stock Only</span>
          </button>
        </div>

        <button 
          onClick={() => { setSearchQuery(''); setBranchFilter('All'); setAlertFilter(false); }}
          className="text-slate-400 hover:text-blue-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Main Table */}
      {filteredItems.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Assigned Location</th>
                  <th className="p-4 text-center">Remaining Quantity</th>
                  <th className="p-4 text-center">Alert Limit</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4 text-center">Action Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => {
                  const isLow = item.quantity <= item.minLimit;
                  return (
                    <tr key={item.id} className={`hover:bg-slate-50/50 ${isLow ? 'bg-amber-50/20' : ''}`}>
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        {isLow && <AlertTriangle size={14} className="text-amber-500" title="Restock Required" />}
                        <span>{item.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">{item.branchName || 'All Branches'}</td>
                      <td className="p-4 text-center font-extrabold text-slate-800">
                        <span className={isLow ? 'text-amber-600 font-black' : ''}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-400">{item.minLimit} {item.unit}</td>
                      <td className="p-4 font-medium text-slate-500">{item.supplier || 'Standard HQ Supplier'}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Boxes size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">No Stock Items Found</h4>
          <p className="text-xs text-slate-400 mt-1">Double check search parameters or introduce first stock listing.</p>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingItem ? 'Edit Supply Listing' : 'Introduce Supply Listing'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Stock Item Name*</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Available Quantity*</label>
                  <input
                    required
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Measurement Unit*</label>
                  <input
                    required
                    type="text"
                    name="unit"
                    placeholder="e.g. kg, pieces, liters"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Low Limit Threshold*</label>
                  <input
                    required
                    type="number"
                    name="minLimit"
                    value={formData.minLimit}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Node Location</label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Wholesale Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
