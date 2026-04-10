'use client';

import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import {
    CloudUpload,
    CloudSync,
    Eye,
    PencilRuler,
    Trash2

} from 'lucide-react';
import { useRouter } from 'next/navigation';
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

const DesignPage = () => {
    const [list, setList] = useState([]);
    const [editData, setEditData] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [images, setImages] = useState<File[]>([]);

    const [form, setForm] = useState({
        name: '',
        operation: '',
        employee_number: '',
        account_number: '',
        bank_name: '',
        old_employee_id: '',
    });
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        // Limit to max 3 images
        const totalImages = [...images, ...newFiles].slice(0, 3);
        setImages(totalImages);
    };
    // 🔥 DATE DEFAULT
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1);
    const currentYear = String(today.getFullYear());

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const router = useRouter();

    // 👉 FETCH LIST
    const fetchList = async () => {
        setLoading(true);
        const res = await fetch('/api/design', { cache: 'no-store' });
        const data = await res.json();

        if (data.status) {
            setList(data.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchList();
    }, []);

    // 🔥 FILTER LOGIC
    const filteredList = list.filter((item) => {
        // 🔍 search by design no
        const matchesSearch = item.design_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        // 📅 month/year filter
        const d = new Date(item.date);

        const matchesDate =
            String(d.getMonth() + 1) === selectedMonth &&
            String(d.getFullYear()) === selectedYear;

        return matchesSearch && matchesDate;
    });

    // 🔥 MONTHS
    const months = [
        { value: '1', label: 'Jan' },
        { value: '2', label: 'Feb' },
        { value: '3', label: 'Mar' },
        { value: '4', label: 'Apr' },
        { value: '5', label: 'May' },
        { value: '6', label: 'Jun' },
        { value: '7', label: 'Jul' },
        { value: '8', label: 'Aug' },
        { value: '9', label: 'Sep' },
        { value: '10', label: 'Oct' },
        { value: '11', label: 'Nov' },
        { value: '12', label: 'Dec' },
    ];

    const years = [
        ...new Set(
            list.map((item) =>
                String(new Date(item.date).getFullYear())
            )
        ),
    ];

    // ADD
    const handleAdd = () => {
        setEditData(null);
        setForm({
            date: new Date().toISOString().split('T')[0],
            design_number: '',
            piece: '',

        });
        setShowModal(true);
    };

    const handleEdit = (entry: any) => {
        setEditData(entry);
        setForm({
            date: entry.date,
            design_number: entry.design_number,
            piece: entry.piece,
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append('design_number', form.design_number);
            formData.append('piece', form.piece);
            formData.append('date', form.date);

            // ✅ IMPORTANT: send ID for edit
            if (editData?.id) {
                formData.append('id', String(editData.id));
            }

            // ✅ Images (optional like Postman)
            if (images[0]) formData.append('image1', images[0]);
            if (images[1]) formData.append('image2', images[1]);
            if (images[2]) formData.append('image3', images[2]);

            // 🔥 Decide API
            const url = editData
                ? '/api/design/edit'   // ✅ EDIT
                : '/api/design';       // ✅ ADD

            const res = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!data.status) {
                toast.error(data.message || 'Failed');
                return;
            }

            toast.success(editData ? 'Updated successfully' : 'Added successfully');

            setShowModal(false);
            setImages([]);
            fetchList();

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    const uploadImage1 = async (file: File, designNo: string) => {
        const formData = new FormData();
        formData.append("design_no", designNo);
        formData.append("image", file);

        const res = await fetch("/api/image", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log(data);

        if (data.status) {
            alert("Image uploaded successfully!");
            setShowUploadForm(false);
        } else {
            alert("Failed to upload image.");
        }

    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const formData = new FormData();
            formData.append('id', String(deleteId));

            const res = await fetch('/api/design/delete', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!data.status) {
                toast.error(data.message || 'Delete failed');
                return;
            }

            toast.success('Design deleted successfully');

            setDeleteId(null);
            fetchList();

        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <Spinner className="size-5 text-primary" />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Loading designs</p>
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
        <>
            <div className="p-6 pt-0 space-y-6 animate-fade-in">
                {/* 🔥 FILTER BAR */}
                <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center bg-white p-3 md:p-4 rounded-xl shadow-md md:gap-4">

                    {/* LEFT: MONTH + YEAR */}
                    <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">

                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full sm:w-auto px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* RIGHT: SEARCH (TAKES REMAINING SPACE) */}
                    <div className="w-full md:flex-1">
                        <input
                            type="text"
                            placeholder="Search Design No..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto px-4 md:px-5 py-2 text-white rounded-lg text-sm sm:text-base font-medium whitespace-nowrap bg-primary"
                    >
                        + Add Design
                    </button>
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center">

                            <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Design No</th>
                                    <th className="px-6 py-4">Total Piece</th>
                                    <th className="px-6 py-4">OutPut Piece</th>
                                    <th className="px-6 py-4">Remaining Piece</th>
                                    <th className="px-6 py-4">Reason</th>
                                    {/* <th className="px-6 py-4">Avg Rate</th>
                    <th className="px-6 py-4">Total Cost</th> */}
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">

                                {filteredList.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-gray-50 cursor-pointer transition"
                                    >
                                        <td className="px-6 py-4">{item.date}</td>
                                        <td className="px-6 py-4 font-semibold text-primary">
                                            {item.design_number}
                                        </td>
                                        <td className="px-6 py-4">{item.piece}</td>
                                        <td className="px-6 py-4">{item.output_piece}</td>
                                        <td className="px-6 py-4 font-bold">
                                            {item.remaining_piece}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.missing_operations.length || '-'}
                                        </td>

                                        {/* ACTION */}
                                        <td className="p-2 sm:p-4 flex justify-center align-middle">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => {
                                                        router.push(`/design/${item.design_number}`);
                                                    }}
                                                    className="p-2 bg-primary/60 hover:bg-primary/90 text-white rounded-md"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleEdit(item);
                                                    }}
                                                    className="p-2 bg-blue-400 hover:bg-blue-700 text-white rounded-md"
                                                >
                                                    <PencilRuler size={15} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteId(item.id);
                                                    }}
                                                    className="p-2 bg-red-400 hover:bg-red-700 text-white rounded-md"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>

                        {/* EMPTY */}
                        {filteredList.length === 0 && !loading && (
                            <div className="p-6 text-center text-gray-500">
                                No designs for selected month/year
                            </div>
                        )}

                        {loading && (
                            <div className="p-6 text-center">Loading...</div>
                        )}

                    </div>
                </div>

                {/* MOBILE CARD VIEW */}
                <div className="md:hidden space-y-3">
                    {filteredList.length > 0 ? (
                        filteredList.map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-200 mb-3">
                                    <div className="text-xs text-gray-600">
                                        <span className="font-semibold text-gray-800">Date</span>
                                        <p className="text-gray-700">{item.date}</p>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-semibold text-gray-800">Design</span>
                                        <p className="text-gray-700">{item.design_number}</p>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-semibold text-gray-800">Total Piece</span>
                                        <p className="text-gray-700">{item.piece}</p>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-semibold text-gray-800">OutPut</span>
                                        <p className="text-gray-700">{item.output_piece}</p>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-semibold text-gray-800">Remaining</span>
                                        <p className="text-gray-700 font-semibold">{item.remaining_piece}</p>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        <span className="font-semibold text-gray-800">Reason</span>
                                        <p className="text-gray-700">{item.missing_operations.length || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.push(`/design/${item.design_number}`)}
                                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                                    >
                                        👁 View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(item.id)}
                                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium"
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                            No designs for selected month/year
                        </div>
                    )}
                </div>

                {/* ================= MODAL ================= */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
                        <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="bg-gradient-to-r from-[#00885a] to-[#00a86b] px-4 md:px-6 py-3 md:py-4 text-white sticky top-0">
                                <h2 className="text-lg md:text-xl font-semibold">
                                    {editData ? 'Edit Design' : 'Add Design'}
                                </h2>
                            </div>

                            <div className="p-4 md:p-6 space-y-3 md:space-y-4">

                                <input type="date" value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full border p-2.5 rounded text-sm md:text-base" />

                                <input placeholder="Design Number"
                                    value={form.design_number}
                                    onChange={(e) => setForm({ ...form, design_number: e.target.value })}
                                    className="w-full border p-2.5 rounded text-sm md:text-base" />

                                <input placeholder="Piece"
                                    value={form.piece}
                                    onChange={(e) => setForm({ ...form, piece: e.target.value })}
                                    className="w-full border p-2.5 rounded text-sm md:text-base" />
                                <div>
                                    <h1 className="text-md font-bold text-primary/70">Images</h1>
                                </div>
                                <div className="flex gap-2 items-center">

                                    {/* Upload Box */}
                                    {images.length < 3 && (
                                        <div
                                            onClick={handleClick}
                                            className="border-2 border-dotted border-gray-400 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition flex items-center justify-center h-10 w-10 cursor-pointer"
                                        >
                                            <CloudUpload size={16} />
                                        </div>
                                    )}

                                    {/* Hidden Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleUpload}
                                    />

                                    {/* Preview Images */}
                                    {images.map((file, index) => (

                                        <img
                                            key={index}
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="h-15 w-15 object-cover rounded-2xl border"
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-2 md:gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 mt-4">
                                    <button
                                        onClick={() => { setShowModal(false); setImages([]); }}
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
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader className="text-center sm:text-center">
                        <AlertDialogTitle>Delete design?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this design.
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
        </>
    );
};

export default DesignPage;