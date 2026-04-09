'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const operations = [
  'Collar Making',
  'Cuff Making',
  'Front',
  'Lable',
  'Sleve Patti',
  'Half Dab',
  'Collar Att',
  'Cuff Attaching',
  'Side Munda',
  'Side Pocket',
  'Bottom',
  'Press',
  'Gaj Button',
];

export function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 UPDATED STATES
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(-1);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    employee_name: '',
    employee_id: '',
    operation: '',
    design_no: '',
    colour_no: '',
    piece: '',
    rate: '',
  });

  const fetchEntries = async () => {
    const res = await fetch('/api/entries');
    const data = await res.json();
    if (data.status === 'success') setEntries(data.data);
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employee');
      const data = await res.json();

      if (data.success) {
        setEmployeeList(data.employees);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchEmployees();
  }, []);

  // 🔥 UPDATED FILTER LOGIC
  const filteredEntries = entries.filter((entry) => {
    // Filter by date range
    const dateMatches =
      startDate && endDate
        ? entry.date >= startDate && entry.date <= endDate
        : entry.date === startDate;

    // Filter by search query
    const searchMatches = searchQuery === '' ? true : (
      entry.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.design_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.colour_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.employee_id.toString().includes(searchQuery)
    );

    return dateMatches && searchMatches;
  });

  const handleEmployeeSearch = (value: string) => {
    setForm({ ...form, employee_name: value });
    setSelectedEmployeeIndex(-1);

    if (!value) {
      setShowEmployeeDropdown(false);
      return;
    }

    const filtered = employeeList.filter((emp) =>
      emp.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredEmployees(filtered);
    setShowEmployeeDropdown(true);
  };

  const handleEmployeeKeyDown = (e: React.KeyboardEvent) => {
    if (!showEmployeeDropdown || filteredEmployees.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedEmployeeIndex((prev) =>
          prev < filteredEmployees.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedEmployeeIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedEmployeeIndex >= 0) {
          const emp = filteredEmployees[selectedEmployeeIndex];
          setForm({
            ...form,
            employee_name: emp.name,
            employee_id: emp.employee_number,
            operation: emp.operation,
          });
          setShowEmployeeDropdown(false);
          setSelectedEmployeeIndex(-1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowEmployeeDropdown(false);
        setSelectedEmployeeIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const url = editData
      ? `/api/entries/${editData.id}`
      : '/api/entries';

    const method = editData ? 'PUT' : 'POST';

    const body = editData ? { ...form, id: editData.id } : form;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.status === 'error') {
        toast.error(`${data.message}`);
        return;
      }

      toast.success(editData ? 'Entry updated successfully' : 'Entry added successfully');

      setShowModal(false);
      setEditData(null);
      fetchEntries();

    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleEdit = (entry: any) => {
    setEditData(entry);
    setForm({
      date: entry.date,
      employee_name: entry.employee_name,
      employee_id: entry.employee_id,
      operation: entry.operation,
      design_no: entry.design_no,
      colour_no: entry.colour_no,
      piece: entry.piece,
      rate: entry.rate,
    });
    setShowModal(true);
  };

  const handleDelete = async (entry: any) => {
    if (!confirm('Are you sure to delete?')) return;

    await fetch(`/api/entries/${entry.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: entry.id }),
    });

    fetchEntries();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="space-y-6">

      {/* 🔥 UPDATED TOP BAR - MOBILE RESPONSIVE */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center bg-white p-3 md:p-4 rounded-xl shadow-md md:gap-4">

        {/* Date Range Section */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center w-full md:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
          />

          <span className="hidden sm:block text-sm">to</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
          />
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, operation, design..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:flex-1 px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
        />

        {/* Add Entry Button */}
        <button
          onClick={() => {
            setForm({
              date: new Date().toISOString().split('T')[0],
              employee_name: '',
              employee_id: '',
              operation: '',
              design_no: '',
              colour_no: '',
              piece: '',
              rate: '',
            });
            setEditData(null);
            setShowModal(true);
            setShowEmployeeDropdown(false);
          }}
          className="w-full md:w-auto px-4 md:px-5 py-2 text-white rounded-lg text-sm sm:text-base font-medium whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg,#00885a,#00a86b)' }}
        >
          + Add Entry
        </button>
      </div>



      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white rounded-xl">
          <thead className="bg-primary text-white text-center text-sm">
            <tr>
              <th className="p-3 md:p-4">Date</th>
              <th className="p-3 md:p-4">Employee</th>
              <th className="p-3 md:p-4">Operation</th>
              <th className="p-3 md:p-4">Design</th>
              <th className="p-3 md:p-4">Colour</th>
              <th className="p-3 md:p-4">Piece</th>
              <th className="p-3 md:p-4">Rate</th>
              <th className="p-3 md:p-4">Total</th>
              <th className="p-3 md:p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="border-t text-center text-sm hover:bg-gray-50">
                <td className="p-3 md:p-4">{entry.date}</td>
                <td className="p-3 md:p-4">{entry.employee_name}</td>
                <td className="p-3 md:p-4">{entry.operation}</td>
                <td className="p-3 md:p-4">{entry.design_no}</td>
                <td className="p-3 md:p-4">{entry.colour_no}</td>
                <td className="p-3 md:p-4">{entry.piece}</td>
                <td className="p-3 md:p-4">₹{entry.rate}</td>
                <td className="p-3 md:p-4 font-bold">₹{entry.total}</td>

                <td className="p-3 md:p-4  items-center justify-center relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === Number(entry.id) ? null : Number(entry.id))
                    }
                  >
                    ⋮
                  </button>

                  {openMenu === Number(entry.id) && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50">
                      <button
                        onClick={() => {
                          handleEdit(entry);
                          setOpenMenu(null);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => {
                          handleDelete(entry);
                          setOpenMenu(null);
                        }}
                        className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 text-sm"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-3">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Date</span>
                  <p className="text-gray-700">{entry.date}</p>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Employee</span>
                  <p className="text-gray-700">{entry.employee_name}</p>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Operation</span>
                  <p className="text-gray-700">{entry.operation}</p>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Design</span>
                  <p className="text-gray-700">{entry.design_no}</p>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Colour</span>
                  <p className="text-gray-700">{entry.colour_no}</p>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Piece</span>
                  <p className="text-gray-700">{entry.piece}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-200 mb-3">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Rate</span>
                  <p className="text-gray-700">₹{entry.rate}</p>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Total</span>
                  <p className="font-bold text-primary">₹{entry.total}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(entry)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-6 text-center text-gray-500">
            No entries found
          </div>
        )}
      </div>

      {/* MODAL - MOBILE RESPONSIVE */}
      {
        showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">

              <div className="bg-gradient-to-r from-[#00885a] to-[#00a86b] px-4 md:px-6 py-3 md:py-4 text-white sticky top-0">
                <h3 className="text-lg md:text-xl font-semibold">
                  {editData ? 'Edit Entry' : 'Add Entry'}
                </h3>
              </div>

              <div className="p-4 md:p-6 space-y-3 md:space-y-4">

                <input type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base" />

                <div className="relative">
                  <input
                    placeholder="Employee Name (Type to search)"
                    value={form.employee_name}
                    onChange={(e) => handleEmployeeSearch(e.target.value)}
                    onFocus={() => {
                      if (form.employee_name) {
                        setShowEmployeeDropdown(true);
                      }
                    }}
                    onKeyDown={handleEmployeeKeyDown}
                    className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base"
                  />

                  {showEmployeeDropdown && filteredEmployees.length > 0 && (
                    <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
                      {filteredEmployees.map((emp, index) => (
                        <div
                          key={emp.id}
                          className={`px-3 md:px-4 py-2 text-sm md:text-base ${index === selectedEmployeeIndex
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-900'
                            }`}
                        >
                          <div className="font-semibold">{emp.name}</div>
                          <div className="text-xs opacity-80">
                            ID: {emp.employee_number} | {emp.operation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input placeholder="Employee ID" value={form.employee_id}
                  className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base" readOnly />

                <select
                  value={form.operation}
                  onChange={(e) => setForm({ ...form, operation: e.target.value })}
                  className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base"
                >
                  <option value="">Select Operation</option>

                  {operations.map((op, index) => (
                    <option key={index} value={op}>
                      {op}
                    </option>
                  ))}
                </select>

                <input placeholder="Design No" value={form.design_no}
                  onChange={(e) => setForm({ ...form, design_no: e.target.value })}
                  className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base" />

                <input placeholder="Colour No" value={form.colour_no}
                  onChange={(e) => setForm({ ...form, colour_no: e.target.value })}
                  className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base" />

                <input type="number" placeholder="Piece" value={form.piece}
                  onChange={(e) => setForm({ ...form, piece: e.target.value })}
                  className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base" />

                <input type="number" placeholder="Rate" value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: e.target.value })}
                  className="w-full border border-gray-300 p-2 md:p-3 rounded text-sm md:text-base" />

              </div>

              <div className="flex gap-2 md:gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm md:text-base hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 text-white rounded-lg font-medium text-sm md:text-base hover:opacity-90 transition"
                  style={{ background: '#00885a' }}
                >
                  {editData ? 'Update' : 'Add'}
                </button>
              </div>

            </div>
          </div>
        )
      }
    </div >
  );
}