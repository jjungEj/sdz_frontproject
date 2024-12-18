const url = "http://localhost:8080/api/categories";

function createCategory(categoryName) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({categoryName: categoryName}),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
        return response.json();
    })
    .catch(error => {
        throw error;
    });
}

function getCategories() {
    return fetch(url)
    .then(response => {
        return response.json();
    });
}

function getCategory(categoryId) {
    return fetch(`${url}/${categoryId}`)
    .then(response => {
        return response.json();
    });
}

function updateCategory(categoryId, categoryName) {
    return fetch(`${url}/${categoryId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({categoryName: categoryName}),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
        return response.json();
    })
    .catch(error => {
        throw error;
    });
}

function deleteCategory(categoryId) {
    return fetch(`${url}/${categoryId}`, {
        method: "DELETE",
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
    })
    .catch(error => {
        throw error;
    });
}

export { createCategory, getCategories, getCategory, updateCategory, deleteCategory };