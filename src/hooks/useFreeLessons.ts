import { useState, useEffect } from 'react';
import { FreeLesson } from '@/types/course';

interface UseFreeLessonsResult {
    freeLessons: FreeLesson[];
    loading: boolean;
    error: string | null;
}

export function useFreeLessons(courseId: string): UseFreeLessonsResult {
    const [freeLessons, setFreeLessons] = useState<FreeLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFreeLessons = async () => {
            if (!courseId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/featured/free-lessons?courseId=${courseId}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch free lessons: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'success') {
                    setFreeLessons(data.data || []);
                } else {
                    throw new Error(data.message || 'Failed to fetch free lessons');
                }

            } catch (err) {
                console.error('Error fetching free lessons:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch free lessons');
                setFreeLessons([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFreeLessons();
    }, [courseId]);

    return { freeLessons, loading, error };
}

export function useAllFreeLessonsGrouped() {
    const [groupedFreeLessons, setGroupedFreeLessons] = useState<Record<string, FreeLesson[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroupedFreeLessons = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/featured/free-lessons-grouped`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch grouped free lessons: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'success') {
                    setGroupedFreeLessons(data.data || {});
                } else {
                    throw new Error(data.message || 'Failed to fetch grouped free lessons');
                }

            } catch (err) {
                console.error('Error fetching grouped free lessons:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch grouped free lessons');
                setGroupedFreeLessons({});
            } finally {
                setLoading(false);
            }
        };

        fetchGroupedFreeLessons();
    }, []);

    return { groupedFreeLessons, loading, error };
}