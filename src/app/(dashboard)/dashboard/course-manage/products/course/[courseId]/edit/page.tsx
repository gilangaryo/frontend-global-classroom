'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Category = {
    id: number;
    name: string;
};

export default function EditCoursePage() {
    const router = useRouter();
    const { courseId } = useParams<{ courseId: string }>();

    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [digitalUrl, setDigitalUrl] = useState('');
    const [colorButton, setColorButton] = useState('#3E724A');
    const [loading, setLoading] = useState(true);

    // Fetch existing course
    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                const c = data.data;

                setTitle(c.title || '');
                setCategoryId(c.categoryId || '');
                setDescription(c.description || '');
                setPrice(parseFloat(c.price) || 0);
                setDigitalUrl(c.digitalUrl || '');
                setColorButton(c.colorButton || '#3E724A');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await res.json();
                setCategories(data.data || []);
            } catch {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${courseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                categoryId,
                description,
                price,
                digitalUrl,
                colorButton,
            }),
        });

        if (res.ok) {
            alert('Course updated!');
            router.push('/dashboard/course-manage/products/course');
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to update course.');
        }
    };

    if (loading) return <p className="p-8">Loading…</p>;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Edit Course</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Name Course"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                    />

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                    >
                        <option value="">-- Product Category --</option>
                        {categories.map((cat) => (
                            <option value={cat.id} key={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <textarea
                    rows={5}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                />

                <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2 h-12">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorButton }} />
                    <label className="text-sm text-gray-600 whitespace-nowrap">
                        Change Color Template (for button)
                    </label>
                    <input
                        type="color"
                        value={colorButton}
                        onChange={(e) => setColorButton(e.target.value)}
                        className="ml-auto h-6 w-6 border-none cursor-pointer bg-transparent"
                    />
                </div>

                <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                    <div className="flex-shrink-0 flex items-center justify-center border-2 border-sky-500 bg-sky-100 px-4 m-2 rounded-md">
                        <span className="text-sky-500 text-sm font-bold">$</span>
                    </div>
                    <input
                        type="number"
                        placeholder="0.00 (price all units)"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Link Product After Purchase"
                    value={digitalUrl}
                    onChange={(e) => setDigitalUrl(e.target.value)}
                    className="h-12 w-full rounded-lg border border-gray-300 px-5 text-sm placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-sky-400"
                />

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-sky-500 px-8 py-2 text-sm font-medium text-white hover:bg-sky-600"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
