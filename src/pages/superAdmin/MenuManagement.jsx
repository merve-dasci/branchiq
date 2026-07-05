import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  SlidersHorizontal
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addMenuItem, updateMenuItem, deleteMenuItem } from '../../features/menu/menuSlice.js';
import { useNotification } from '../../context/NotificationContext.jsx';

export default function MenuManagement({ menuItems, currentUser }) {
  const dispatch = useDispatch();
  const { showToast, confirm } = useNotification();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'Main Dish',
    description: '',
    isAvailable: true
  });

  // Unique categories list helper
  const categories = ['All', 'Starter', 'Main Dish', 'Dessert', 'Beverage'];

  // Filters
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: 0,
      category: 'Main Dish',
      description: '',
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      isAvailable: item.isAvailable
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      dispatch(updateMenuItem({ id: editingItem.id, ...formData }));
      showToast('Menu item updated successfully!', 'success');
    } else {
      dispatch(addMenuItem(formData));
      showToast('Menu item created successfully!', 'success');
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Menu Item',
      message: 'Are you sure you want to permanently delete this menu item?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (isConfirmed) {
      dispatch(deleteMenuItem(id));
      showToast('Menu item deleted successfully!', 'success');
    }
  };

  const toggleAvailability = (item) => {
    dispatch(updateMenuItem({
      ...item,
      isAvailable: !item.isAvailable
    }));
  };

  return (
    <div id="menu-panel" className="p-8 space-y-6 animate-fade-in">

      {/* Control Actions Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Search dishes, drinks, descriptors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <select
              id="menu-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
          <button
            id="add-menu-item-btn"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Menu Item</span>
          </button>
        )}
      </div>

      {/* Grid List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              id={`menu-item-card-${item.id}`}
              className={`bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col ${
                !item.isAvailable ? 'opacity-70 bg-slate-50/50' : ''
              }`}
            >
              <div className="p-6 pb-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                    {item.category}
                  </span>
                  
                  <button
                    onClick={() => toggleAvailability(item)}
                    id={`menu-item-toggle-${item.id}`}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                      item.isAvailable 
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                        : 'bg-slate-150 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>

                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">{item.name}</h4>
                  <span className="text-sm font-black text-slate-900">${item.price}</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.description}</p>
              </div>

              {/* Configure footer panel */}
              {currentUser && (currentUser.role === 'Super Admin' || currentUser.role === 'superAdmin' || currentUser.role === 'Regional Manager') && (
                <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end gap-3.5">
                  <button
                    id={`menu-item-edit-btn-${item.id}`}
                    onClick={() => handleOpenEditModal(item)}
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-bold transition-all cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    id={`menu-item-delete-btn-${item.id}`}
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
          <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">No Menu Items Found</h4>
          <p className="text-xs text-slate-400 mt-1">Adjust search terms or create standard categories.</p>
        </div>
      )}

      {/* Create / Edit Menu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-blue-400" />
                <h3 className="font-bold">{editingItem ? 'Edit Culinary Listing' : 'Introduce Menu Item'}</h3>
              </div>
              <button 
                id="close-menu-modal-btn"
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Culinary Name*</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Traditional Iskender Kebab"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Main Dish">Main Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Unit Price ($)*</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Culinary Description*</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Summarize cooking methods, ingredients, dietary details..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  id="form-is-available"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="rounded-xs border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="form-is-available" className="text-xs font-bold text-slate-600 cursor-pointer">
                  Activate immediate in-stock listing availability
                </label>
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
                  id="submit-menu-form-btn"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Updates' : 'Publish Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
