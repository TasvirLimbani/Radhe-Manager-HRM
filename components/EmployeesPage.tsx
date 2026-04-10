'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

export function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  const [deleteEmployee, setDeleteEmployee] = useState<any>(null);

  const getCurrentMonth = () => {
    const d = new Date();
    return d.toISOString().slice(0, 7); // "YYYY-MM"
  };

  const START_YEAR = 2026;
  const START_MONTH = 3;

  const getCurrent = () => {
    const d = new Date();
    return {
      month: String(d.getMonth() + 1).padStart(2, '0'),
      year: String(d.getFullYear()),
    };
  };

  const current = getCurrent();

  const [selectedMonth, setSelectedMonth] = useState(current.month);
  const [selectedYear, setSelectedYear] = useState(current.year);

  const [form, setForm] = useState({
    name: '',
    operation: '',
    employee_number: '',
    account_number: '',
    bank_name: '',
    old_employee_id: '',
  });

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let y = START_YEAR; y <= currentYear; y++) {
      years.push(String(y));
    }

    return years.reverse();
  };

  const getMonths = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let start = 1;
    let end = 12;

    if (Number(selectedYear) === START_YEAR) {
      start = START_MONTH;
    }

    if (Number(selectedYear) === currentYear) {
      end = currentMonth;
    }

    const allMonths = [
      { label: 'Jan', value: '01' },
      { label: 'Feb', value: '02' },
      { label: 'Mar', value: '03' },
      { label: 'Apr', value: '04' },
      { label: 'May', value: '05' },
      { label: 'Jun', value: '06' },
      { label: 'Jul', value: '07' },
      { label: 'Aug', value: '08' },
      { label: 'Sep', value: '09' },
      { label: 'Oct', value: '10' },
      { label: 'Nov', value: '11' },
      { label: 'Dec', value: '12' },
    ];

    return allMonths.slice(start - 1, end);
  };

  useEffect(() => {
    if (selectedEmployee) {
      const monthYear = `${selectedYear}-${selectedMonth}`;
      fetchDetail(selectedEmployee.employee_number, monthYear);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const validMonths = getMonths();

    const exists = validMonths.find(m => m.value === selectedMonth);

    if (!exists && validMonths.length > 0) {
      setSelectedMonth(validMonths[0].value);
    }
  }, [selectedYear]);

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    const res = await fetch('/api/employee', { cache: 'no-store' });
    const data = await res.json();
    if (data.success) setEmployees(data.employees);
    setEmployeesLoading(false);
  };

  // FETCH DETAIL
  const fetchDetail = async (employee_number: string, month?: string) => {
    setLoading(true);

    const res = await fetch('/api/employee/detail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employee_number,
        month_year: month || selectedMonth, // ✅ important
      }),
    });

    const data = await res.json();

    if (data.status) {
      setDetail(data.data);
    } else {
      toast.error('Failed to fetch detail');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Only close if click is NOT inside dropdown
      if (!target.closest('.dropdown-menu')) {
        setOpenMenu(null);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // ADD
  const handleAdd = () => {
    setEditData(null);
    setForm({
      name: '',
      operation: '',
      employee_number: '',
      account_number: '',
      bank_name: '',
      old_employee_id: '',
    });
    setShowModal(true);
  };

  // EDIT
  const handleEdit = (emp: any) => {
    setEditData(emp);
    setForm({
      name: emp.name,
      operation: emp.operation,
      employee_number: emp.employee_number,
      account_number: emp.account_number,
      bank_name: emp.bank_name,
      old_employee_id: emp.id,
    });
    setShowModal(true);
  };

  // DELETE
  const handleDelete = async () => {
    if (!deleteEmployee) return;

    try {
      await fetch(
        `/api/employee/delete?employee_number=${deleteEmployee.employee_number}`,
        {
          method: 'DELETE',
        }
      );

      toast.success('Deleted successfully');

      setDeleteEmployee(null);

      fetchEmployees();

    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    const isEdit = !!editData;

    const url = isEdit ? '/api/employee/edit' : '/api/employee/add';

    const payload = isEdit
      ? { ...form }
      : { ...form };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(isEdit ? 'Updated' : 'Added');
    setShowModal(false);
    fetchEmployees();
  };

  const filteredEmployees = employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.employee_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (employeesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Spinner className="size-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Loading employees</p>
            <p className="text-xs text-gray-500">Please wait while we fetch the latest data.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-10 bg-gray-100 rounded-lg mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="h-12 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= LIST VIEW ================= */}
      {!selectedEmployee && (
        <>
          {/* TOP BAR */}
          <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center bg-white p-3 md:p-4 rounded-xl shadow-md md:gap-4">
            <div className="relative w-full md:flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                placeholder="Search employee..."
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm md:text-base"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleAdd}
              className="w-full md:w-auto px-4 md:px-5 py-2 text-white rounded-lg text-sm sm:text-base font-medium whitespace-nowrap bg-primary"
            >
              + Add Employee
            </button>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm sm:text-base text-center">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className='p-4'>ID</th>
                    <th>Name</th>
                    <th>Operation</th>
                    <th>Account</th>
                    <th>Bank</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map((emp: any) => (
                    <tr
                      key={emp.id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        const current = getCurrent();

                        setSelectedMonth(current.month);
                        setSelectedYear(current.year);
                        setSelectedEmployee(emp);

                        const monthYear = `${current.year}-${current.month}`;
                        fetchDetail(emp.employee_number, monthYear);
                      }}
                    >
                      <td>{emp.employee_number}</td>
                      <td className="p-4">{emp.name}</td>
                      <td>{emp.operation}</td>
                      <td>{emp.account_number}</td>
                      <td>{emp.bank_name}</td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="flex justify-center align-middle p-4 "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === emp.id ? null : emp.id);
                          }}
                          hitSlop
                        >
                          ⋮
                        </button>

                        {openMenu === emp.id && (
                          <div className="dropdown-menu absolute right-2 mt-8 w-40 bg-white border rounded-lg shadow">

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(emp);
                                setOpenMenu(null);
                              }}
                              className="block w-full p-2 hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteEmployee(emp);
                                setOpenMenu(null);
                              }}
                              className="block w-full p-2 text-red-500 hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-3">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp: any) => (
                <div
                  key={emp.id}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
                  onClick={() => {
                    const currentValue = getCurrent();
                    setSelectedMonth(currentValue.month);
                    setSelectedYear(currentValue.year);
                    setSelectedEmployee(emp);
                    const monthYear = `${currentValue.year}-${currentValue.month}`;
                    fetchDetail(emp.employee_number, monthYear);
                  }}
                >
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-200 mb-3">
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">ID</span>
                      <p className="text-gray-700 break-all">{emp.employee_number}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">Name</span>
                      <p className="text-gray-700">{emp.name}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">Operation</span>
                      <p className="text-gray-700">{emp.operation}</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-800">Account</span>
                      <p className="text-gray-700 break-all">{emp.account_number || '-'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(emp)}
                      className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteEmployee(emp)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                No employees found
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= DETAIL VIEW ================= */}
      {selectedEmployee && (
        <div className="space-y-6">

          {/* ================= HEADER ================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setDetail(null);
                }}
                className="px-2 py-2 bg-primary text-white rounded-4xl hover:bg-primary/80 transition"
              >
                <ChevronLeft />
              </button>

              <h2 className="text-xl font-semibold">
                Employee Details
              </h2>
            </div>

            {/* RIGHT FILTERS */}
            <div className="flex gap-3">

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-white"
              >
                {getMonths().map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-white"
              >
                {getYears().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

            </div>
          </div>


          <div className="flex"> {/* IMPORTANT */}
            {loading && (
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <Spinner className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Loading entries</p>
                    <p className="text-xs text-gray-500">Please wait while we fetch the latest data.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-10 bg-gray-100 rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="h-12 bg-gray-100 rounded-lg" />
                    <div className="h-12 bg-gray-100 rounded-lg" />
                    <div className="h-12 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              </div>
            )}

            {/* Your page content */}
          </div>

          {detail && (
            <>
              {/* ================= EMPLOYEE CARDS ================= */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-lg">{detail.employee.name}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Operation</p>
                  <p className="font-medium">{detail.employee.operation}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="font-medium">{detail.employee.employee_number}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Account</p>
                  <p className="font-medium">{detail.employee.account_number}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Bank</p>
                  <p className="font-medium">{detail.employee.bank_name}</p>
                </div>

                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-xl shadow">
                  <p className="text-xs">Month</p>
                  <p className="font-semibold text-lg">{detail.month_year}</p>
                </div>

              </div>

              {/* ================= TOTAL ================= */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow flex justify-between items-center">
                <p className="text-lg font-medium">Total Salary</p>
                <p className="text-3xl font-bold">
                  ₹{Number(detail.total_amount).toFixed(2)}
                </p>
              </div>

              {/* ================= TABLE ================= */}
              <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-4 border-b font-semibold">
                  Entries
                </div>

                <table className="w-full text-sm text-center">

                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3">Date</th>
                      <th>Operation</th>
                      <th>Design</th>
                      <th>Colour</th>
                      <th>Piece</th>
                      <th>Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {detail.entries.map((e: any) => (
                      <tr key={e.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{e.date}</td>
                        <td>{e.operation}</td>
                        <td>{e.design_no}</td>
                        <td>{e.colour_no}</td>
                        <td>{e.piece}</td>
                        <td>₹{Number(e.rate).toFixed(2)}</td>
                        <td className="font-semibold text-green-600">
                          ₹{Number(e.total).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </>
          )}

        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#00885a] to-[#00a86b] px-4 md:px-6 py-3 md:py-4 text-white sticky top-0">
              <h2 className="text-lg md:text-xl font-semibold">
                {editData ? 'Edit Employee' : 'Add Employee'}
              </h2>
            </div>

            <div className="p-4 md:p-6 space-y-3 md:space-y-4">

              <input placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2.5 rounded text-sm md:text-base" />

              <select value={form.operation}
                onChange={(e) => setForm({ ...form, operation: e.target.value })}
                className="w-full border p-2.5 rounded text-sm md:text-base">
                <option>Select Operation</option>
                {operations.map(op => <option key={op}>{op}</option>)}
              </select>

              <input placeholder="Employee No"
                value={form.employee_number}
                onChange={(e) => setForm({ ...form, employee_number: e.target.value })}
                className="w-full border p-2.5 rounded text-sm md:text-base" />

              <input placeholder="Account"
                value={form.account_number}
                onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                className="w-full border p-2.5 rounded text-sm md:text-base" />

              <input placeholder="Bank"
                value={form.bank_name}
                onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                className="w-full border p-2.5 rounded text-sm md:text-base" />
            </div>

            <div className="flex gap-2 md:gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm md:text-base hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-primary text-white rounded-lg font-medium text-sm md:text-base">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteEmployee} onOpenChange={(open) => !open && setDeleteEmployee(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader className="text-center sm:text-center">
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete employee
              {' '}
              {deleteEmployee?.name || ''}
              {' '}
              (ID:
              {' '}
              {deleteEmployee?.employee_number || '-'})
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}