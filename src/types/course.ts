// types/course.ts - UPDATE INTERFACES

interface FreeLesson {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    previewUrl?: string;
    digitalUrl?: string;
    tags?: string[];
    createdAt: string;
}

interface Unit {
    id: string;
    title: string;
    slug: string;
    previewUrl: string | null;
    digitalUrl: string | null;
    description: string;
    price: string;
    imageUrl: string | null;
    isActive: boolean;
    courseId: string;
    createdAt: string;
    updatedAt: string;
}

interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    previewUrl: string;
    digitalUrl: string;
    colorButton: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    units: Unit[];
}

export type { Course, Unit, FreeLesson };