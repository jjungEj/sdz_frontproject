import { create } from 'zustand';
import { createCategoryAPI, deleteCategoryAPI, getCategoriesAPI, updateCategoryAPI } from '@/services/CategoryAPI';

const useCategoryStore = create((set) => ({
    categories: [],
    error: null,
    setCategories: (categories) => set({ categories }),
    setError: (error) => set({error}),

    getCategories: async () => {
        try {
            const data = await getCategoriesAPI();
            set({ categories: data, error: null });
        } catch (error) {
            set({ error: error.message });
        }
    },

    createCategory: async (categoryName) => {
        try {
            const newCategory = await createCategoryAPI(categoryName);
            set((state) => ({
                categories: [...state.categories, newCategory], error: null
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    updateCategory: async (updatedCategory) => {
        try {
            await updateCategoryAPI(updatedCategory);
            set((state) => ({
                categories: state.categories.map((category) =>
                    category.categoryId === updatedCategory.categoryId ? updatedCategory : category
                ),
                error: null
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    deleteCategory: async (categoryId) => {
        try {
            await deleteCategoryAPI(categoryId);
            set((state) => ({
                categories: state.categories.filter((category) => category.categoryId !== categoryId),
                error: null
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },
}));

export default useCategoryStore;