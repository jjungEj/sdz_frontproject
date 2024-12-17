const url = "http://localhost:8080/api/categories";

function createCategoty(categoryName) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({categoryName: categoryName}),
    })
    .then(response => {
        return response.json();
    });
}

function getCategories() {
    return fetch(url)
    .then(response => {
        return response.json();
    });
}

// function getCategory(categoryId) {
//     return fetch(`${url}/${categoryId}`)
//     .then(response => {
//         return response.json();
//     });
// }

function updateCategory(categoryId, categoryName) {
    return fetch(`${url}/${categoryId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({categoryName: categoryName}),
    })
    .then(response => {
        return response.json();
    });
}

function deleteCategoty(categoryId) {
    return fetch(`${url}/${categoryId}`, {
        method: "DELETE",
    });
}

export { createCategoty, getCategories, updateCategory, deleteCategoty };