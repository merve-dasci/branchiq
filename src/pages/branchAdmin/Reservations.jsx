import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Trash2, 
  Clock, 
  User, 
  Users, 
  Check, 
  X,
  Edit2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchReservations, 
  addReservation, 
  updateReservation, 
  deleteReservation 
} from '../../features/reservations/reservationsSlice.js';
import { fetchTables, updateTable } from '../../features/tables/tablesSlice.js';

export default function Reservations({ currentUser }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.reservations);
  const { items: tables } = useSelector((state) => state.tables);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    guests: 2,
    date: '2026-07-03',
    time: '19:00',
    tableNumber: '',
    phone: '',
    status: 'Confirmed'
  });

  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchTables());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    const defaultTable = myBranchTables.length > 0 ? myBranchTables[0].name : '';
    setEditingRes(null);
    setFormData({
      customerName: '',
      guests: 2,
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      tableNumber: defaultTable,
      phone: '',
      status: 'Confirmed'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (res) => {
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    const defaultTable = myBranchTables.length > 0 ? myBranchTables[0].name : '';
    setEditingRes(res);
    setFormData({
      customerName: res.customerName,
      guests: res.guests,
      date: res.date,
      time: res.time,
      tableNumber: res.tableNumber || defaultTable,
      phone: res.phone || '',
      status: res.status || 'Confirmed'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRes(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const myBranchTables = tables.filter(t => t.branchId === currentUser?.branchId);
    const selectedTableObj = myBranchTables.find(t => t.name === formData.tableNumber);
    
    if (selectedTableObj && selectedTableObj.capacity < formData.guests) {
      if (!window.confirm(`Warning: Selected table capacity (${selectedTableObj.capacity}) is less than guest count (${formData.guests}). Proceed anyway?`)) {
        return;
      }
    }

    if (editingRes) {
      dispatch(updateReservation({ id: editingRes.id, ...formData }));
    } else {
      dispatch(addReservation(formData));
    }

    // Sync table status
    if (formData.status === 'Confirmed' && selectedTableObj && selectedTableObj.status === 'available') {
      dispatch(updateTable({ ...selectedTableObj, status: 'reserved' }));
    } else if (formData.status === 'Arrived' && selectedTableObj && selectedTableObj.status !== 'occupied') {
      dispatch(updateTable({ ...selectedTableObj, status: 'occupied' }));
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Cancel this guest reservation?')) {
      const res = items.find(r => r.id === id);
      dispatch(deleteReservation(id));
      if (res) {
        const matchingTable = tables.find(t => t.name === res.tableNumber && t.branchId === currentUser?.branchId);
        if (matchingTable && matchingTable.status === 'reserved') {
          dispatch(updateTable({ ...matchingTable, status: 'available' }));
        }
      }
    }
  };

  const handleStatusChange = (res, newStatus) => {
    dispatch(updateReservation({ ...res, status: newStatus }));
    
    const matchingTable = tables.find(t => t.name === res.tableNumber && t.branchId === currentUser?.branchId);
    if (newStatus === 'Arrived' && matchingTable) {
      dispatch(updateTable({ ...matchingTable, status: 'occupied' }));
    } else if (newStatus === 'Cancelled' && matchingTable && matchingTable.status === 'reserved') {
      dispatch(updateTable({ ...matchingTable, status: 'available' }));
    }
  };

  // Filter list
  const filteredReservations = items.filter(res => {
    return res.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           res.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div id="reservations-panel" className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Table Reservations Book</h2>
          <p className="text-xs text-slate-500 font-semibold font-sans">Manage customer seating timetables, vip lists, and guest counts.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl cursor-pointer"
        >
          <Plus size={14} /> Schedule Booking
        </button>
      </div>

      {/* Board parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Confirmed Bookings</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {items.filter(r => r.status === 'Confirmed' || r.status === 'Arrived').length}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">Total Guest Covers</p>
          <h4 className="text-2xl font-black text-blue-600 mt-1">
            {items.reduce((sum, r) => sum + (r.guests || 0), 0)}
          </h4>
        </div>
        <div className="bg-white p-5 border border-slate-200 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Average Seating Size</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {items.length > 0 ? (items.reduce((sum, r) => sum + (r.guests || 0), 0) / items.length).toFixed(1) : 0} pax
          </h4>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-white p-4 border border-slate-200 rounded-2xl">
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search booking list by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-hidden"
          />
        </div>
      </div>

      {/* Main reservation table */}
      {filteredReservations.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Guest Size</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Assigned Table</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Seating Status</th>
                  <th className="p-4 text-center">Action Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredReservations.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <User size={13} className="text-slate-400" />
                      <span>{res.customerName}</span>
                    </td>
                    <td className="p-4 text-slate-800">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-slate-400" />
                        <span>{res.guests} pax</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>{res.date} • {res.time}</span>
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-blue-600">{res.tableNumber}</td>
                    <td className="p-4 font-medium text-slate-500">{res.phone || 'No phone set'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md ${
                        res.status === 'Arrived' ? 'bg-emerald-50 text-emerald-700' :
                        res.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {res.status || 'Confirmed'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {res.status !== 'Arrived' && res.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(res, 'Arrived')}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
                              title="Arrived"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(res, 'Cancelled')}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                              title="Cancel"
                            >
                              <X size={12} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(res)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <h4 className="text-slate-800 font-bold">No Reservations Listed</h4>
          <p className="text-xs text-slate-400 mt-1">Double check active query or create the first booking cover.</p>
        </div>
      )}

      {/* Booking Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingRes ? 'Edit Guest Booking' : 'Schedule Guest Booking'}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Customer Full Name*</label>
                <input
                  required
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Guests Cover Count*</label>
                  <input
                    required
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Seating Assignment*</label>
                  <select
                    required
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold font-bold cursor-pointer text-slate-800"
                  >
                    <option value="">Select a Table</option>
                    {tables.filter(t => t.branchId === currentUser?.branchId).map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.capacity} seats) - {t.status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Date Target*</label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Arrival Time Target*</label>
                  <input
                    required
                    type="text"
                    name="time"
                    placeholder="e.g. 19:30"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Contact Phone Line</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Booking Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden font-bold cursor-pointer"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Arrived">Arrived</option>
                  <option value="Cancelled">Cancelled</option>
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
