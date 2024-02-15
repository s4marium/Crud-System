
const apiUrl = "http://localhost:5500/socposts";

let selectedRow = null;

function onSocPost() {
    if (validateUsrname()) {
        const postData = readPostData();
        if (selectedRow === null) {
            insertNewPost(postData);
        } else {
            updatePosts(postData);
        }
    }
}

function validateUsrname() {
    const usrName = document.getElementById("usrName").value.trim();
    const usrNameValidationError = document.getElementById("usrNameValidationError");

    if (usrName === "") {
        showError(usrNameValidationError, "UserName is required.", true);
        return false;
    } else {
        showError(usrNameValidationError, "", false);
        return true;
    }
}

function insertNewPost(data) {
    $.ajax({
        url: apiUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log("Social Media added successfully:", response);
            fetchPosts();
            resetForm();
        },
        error: function (error) {
            console.error("Error adding socposts:", error);
            showError("Error adding social media post. Please try again.");
        }
    });
}

function updatePosts(postData) {
    const postID = selectedRow.cells[2].querySelector('a[data-id]').dataset.id;
    $.ajax({
        url: `${apiUrl}/${postID}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(postData),
        success: function (response) {
            console.log("Social Media updated successfully:", response);
            fetchPosts();
            resetForm();
        },
        error: function (error) {
            console.error("Error updating socposts:", error);
            showError("Error updating social media post. Please try again.");
        }
    });
}

function readPostData() {
    return {
        usrName: document.getElementById("usrName").value,
        posts: document.getElementById("posts").value,
    };
}

function fetchPosts() {
    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function (socposts) {
            renderPosts(socposts);
        },
        error: function (error) {
            console.error("Error fetching socposts:", error);
        }
    });
}

function renderPosts(socposts) {
    const tableBody = $("#socmediaPosts tbody");
    tableBody.empty();

    socposts.forEach((post, index) => {
        const row = $("<tr>");
        row.append($("<td>").text(post.usrName));
        row.append($("<td>").text(post.posts));
        row.append($("<td>").html(`<a href="#" onclick="onEditPosts(this)" data-id="${index}">Edit</a> 
                                   <a href="#" onclick="onDeletePosts(this)" data-id="${index}">Delete</a>`));
        tableBody.append(row);
    });
}

function onDeletePosts(td) {
    const postID = td.dataset.id;
    $.ajax({
        url: `${apiUrl}/${postID}`,
        type: 'DELETE',
        success: function (response) {
            console.log("Social Media deleted successfully:", response);
            fetchPosts();
            resetForm();
        },
        error: function (error) {
            console.error("Error deleting socposts:", error);
        }
    });
}

function onEditPosts(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("usrName").value = selectedRow.cells[0].innerText;
    document.getElementById("posts").value = selectedRow.cells[1].innerText;
}

function resetForm() {
    selectedRow = null;
    document.getElementById("usrName").value = "";
    document.getElementById("posts").value = "";
}

function showError(errorElement, message, isVisible) {
    errorElement.innerText = message;
    errorElement.style.color = "red";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "5px";
    errorElement.style.display = isVisible ? "block" : "none";

    setTimeout(() => {
        errorElement.style.display = "none";
    }, 5000);
}

$(function () {
    fetchPosts();
});
