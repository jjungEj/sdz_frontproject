const url = "http://localhost:8080/api/categories";

async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    if (response.status === 204) {
        return;
    }
    return await response.json();
}

async function createCategory(categoryName) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryName: categoryName }),
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

async function getCategories() {
    try {
        const response = await fetch(url);
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

async function getCategory(categoryId) {
    try {
        const response = await fetch(`${url}/${categoryId}`);
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
}

async function updateCategory(categoryId, categoryName) {
    try {
        const response = await fetch(`${url}/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryName: categoryName }),
        });
        return await handleResponse(response); 
    } catch (error) {
        throw error;
    }
}

async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`${url}/${categoryId}`, {
            method: "DELETE",
        });
        return await handleResponse(response);
    } catch {
        throw error;
    }
}

export { createCategory, getCategories, getCategory, updateCategory, deleteCategory };