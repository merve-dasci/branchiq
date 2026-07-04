import React, { useEffect, useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Users, 
  CheckCircle, 
  XCircle, 
  CircleDot,
  Edit2,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTables, 
  addTable, 
  updateTable, 
  deleteTable 
} from '../../features/tables/tablesSlice.js';

export default function TableManagement({ currentUser }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.tables);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  
  const [formData, setFormData] = useState({
    name: 'Table 1',
    capacity: 4,
    status: 'Available',
    section: 'Main Hall'
  });

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingTable(null);
    setFormData({
      name: `Table ${items.length + 1}`,
      capacity: 4,
      status: 'Available',
      section: 'Main Hall'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (table) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      capacity: table.capacity,
      status: table.status,
      section: table.section || 'Main Hall'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTable) {
      dispatch(updateTable({ id: editingTable.id, ...formData }));
    } else {
      dispatch(addTable(formData));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this table layout configuration?')) {
      dispatch(deleteTable(id));
    }
  };

  const handleStatusToggle = (table) => {
    const nextStatus = table.status === 'Available' ? 'Occupied' : 'Available';
    dispatch(updateTable({ ...table, status: nextStatus }));
  };

  return (
    <div id="table-management-panel" className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Interactive Seating Layout</h2>
          <p className="text-xs text-slate-500 font-semibold">Track real-time occupancy, table section densities, and guest seating limits.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
        >
          <Plus size={14} /> Add Table Slot
        </button>
      </div>

      {/* Grid summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Seating Slots</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{items.length}</h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Available Tables</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">
            {items.filter(t => t.status === 'Available').length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-rose-500 uppercase">Occupied Tables</p>
          <h4 className="text-2xl font-black text-rose-600 mt-1">
            {items.filter(t => t.status === 'Occupied').length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Consolidated Seating Cap</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {items.reduce((sum, t) => sum + (t.capacity || 0), 0)} seats
          </h4>
        </div>
      </div>

      {/* Bento Grid layout */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {items.map(table => {
            const isOccupied = table.status === 'Occupied';
            return (
              <div 
                key={table.id}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between h-40 ${
                  isOccupied 
                    ? 'bg-rose-50/30 border-rose-200 shadow-rose-100/10' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Controls */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{table.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{table.section || 'Main'}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(table)}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-md cursor-pointer"
                    >
                      <Edit2 size={10} />
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-md cursor-pointer"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>

                {/* Seating Indicators */}
                <div className="flex items-center gap-1.5 py-3">
                  <Users size={14} className={isOccupied ? 'text-rose-500' : 'text-slate-400'} />
                  <span className="text-xs font-black text-slate-700">{table.capacity} Seats</span>
                </div>

                {/* Seating state toggle button */}
                <button
                  onClick={() => handleStatusToggle(table)}
                  className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    isOccupied 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-1.50 text-slate-700'
                  }`}
                >
                  {isOccupied ? 'Occupied' : 'Mark Occupied'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Layers size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">No Seating Slots Found</h4>
          <p className="text-xs text-slate-400 mt-1">Deploy the first interactive table coordinates above.</p>
        </div>
      )}

      {/* Seating Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingTable ? 'Edit Table Configuration' : 'Introduce Seating Slot'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Seating Label/Code*</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Maximum Capacity (Pax)*</label>
                <input
                  required
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Section Area</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer"
                >
                  <option value="Main Hall">Main Hall</option>
                  <option value="Garden Patio">Garden Patio</option>
                  <option value="VIP Saloon">VIP Saloon</option>
                  <option value="Bar Desk">Bar Desk</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Initial Occupancy</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
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
                  Deploy Table Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
