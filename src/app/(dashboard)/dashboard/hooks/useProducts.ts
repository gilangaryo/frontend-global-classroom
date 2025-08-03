// hooks/useProducts.ts
import { useState, useEffect } from 'react';

export type ProductType = 'COURSE' | 'UNIT' | 'SUBUNIT' | 'LESSON';

export interface Product {
    id: string;
    title: string;
    description?: string;
    price?: number;
    digitalUrl?: string;
    previewUrl?: string;
    imageUrl?: string;
    colorButton?: string;
    courseIncluded?: string;
    type: ProductType;
    parentId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseData {
    title: string;
    description?: string;
    courseIncluded?: string;
    price?: number;
    digitalUrl?: string;
    previewUrl?: string;
    imageUrl?: string;
    colorButton?: string;
    ProductType: ProductType;
}

export interface CreateProductData {
    title: string;
    description?: string;
    price?: number;
    digitalUrl?: string;
    previewUrl?: string;
    imageUrl?: string;
    parentId?: string;
    ProductType: ProductType;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
    isActive?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
    isActive?: boolean;
}

// Generic hook untuk fetch products berdasarkan type
export const useProducts = (options?: { type?: ProductType; parentId?: string }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;
            const params = new URLSearchParams();

            if (options?.type) {
                params.append('type', options.type);
            }
            if (options?.parentId) {
                params.append('parentId', options.parentId);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();
            setProducts(data.data || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [options?.type, options?.parentId]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts
    };
};

// Hook khusus untuk Courses (backward compatibility)
export const useCourses = () => {
    return useProducts({ type: 'COURSE' });
};

// Hook khusus untuk Units berdasarkan course
export const useUnits = (courseId?: string) => {
    return useProducts({ type: 'UNIT', parentId: courseId });
};

// Hook untuk single product
export const useProduct = (id: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`
                );

                if (!response.ok) throw new Error('Product not found');

                const data = await response.json();
                setProduct(data.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
};

// Hook untuk single course (backward compatibility)
export const useCourse = (id: string) => {
    return useProduct(id);
};

// Hook untuk Course CRUD operations
export const useCourseActions = () => {
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    const createCourse = async (data: CreateCourseData): Promise<Product | null> => {
        try {
            setLoading(true);

            const requestData = {
                ...data,
                type: data.ProductType,
            };
            delete requestData.ProductType;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
                {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create course');
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Error creating course: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateCourse = async (id: string, data: UpdateCourseData): Promise<Product | null> => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
                {
                    method: 'PATCH',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update course');
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Error updating course: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteCourse = async (id: string): Promise<boolean> => {
        try {
            if (!confirm('Are you sure you want to delete this course? This will also affect all units and lessons under it.')) {
                return false;
            }

            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
                {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete course');
            }

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Error deleting course: ${message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const toggleCourseStatus = async (id: string, isActive: boolean): Promise<boolean> => {
        const result = await updateCourse(id, { isActive });
        return result !== null;
    };

    return {
        loading,
        createCourse,
        updateCourse,
        deleteCourse,
        toggleCourseStatus,
    };
};

// Generic Hook untuk Product CRUD operations (Units, Subunits, Lessons)
export const useProductActions = () => {
    const [loading, setLoading] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    const createProduct = async (data: CreateProductData): Promise<Product | null> => {
        try {
            setLoading(true);

            // Transform ProductType to type for backend compatibility
            const requestData = {
                ...data,
                type: data.ProductType,
            };
            // Remove ProductType as backend expects 'type'
            delete requestData.ProductType;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
                {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create ${data.ProductType.toLowerCase()}`);
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Error creating ${data.ProductType.toLowerCase()}: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id: string, data: UpdateProductData): Promise<Product | null> => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
                {
                    method: 'PATCH',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Error updating product: ${message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string, productType: string = 'product'): Promise<boolean> => {
        try {
            const confirmMessage = productType === 'UNIT'
                ? 'Are you sure you want to delete this unit? This will also affect all sub-units and lessons under it.'
                : `Are you sure you want to delete this ${productType.toLowerCase()}?`;

            if (!confirm(confirmMessage)) {
                return false;
            }

            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
                {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to delete ${productType.toLowerCase()}`);
            }

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            alert(`Error deleting ${productType.toLowerCase()}: ${message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const toggleProductStatus = async (id: string, isActive: boolean): Promise<boolean> => {
        const result = await updateProduct(id, { isActive });
        return result !== null;
    };

    return {
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
    };
};

// Hook khusus untuk Unit operations (lebih specific)
export const useUnitActions = () => {
    const productActions = useProductActions();

    const createUnit = async (data: Omit<CreateProductData, 'ProductType'>): Promise<Product | null> => {
        return productActions.createProduct({ ...data, ProductType: 'UNIT' });
    };

    const deleteUnit = async (id: string): Promise<boolean> => {
        return productActions.deleteProduct(id, 'UNIT');
    };

    return {
        ...productActions,
        createUnit,
        deleteUnit,
    };
};