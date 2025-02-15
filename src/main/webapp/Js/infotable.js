
function createTableFromJSON(data) {
    var html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        if (x === "username" || x === "telephone" || x === "afm") {
            html += "<tr><td>" + category + "</td><td><input type='text' value='" + value + "' readonly></td></tr>";
        } else {
            html += "<tr><td>" + category + "</td><td><input type='text' value='" + value + "'></td></tr>";
            
        }
    }
    html += "</table>";
    return html;

}  
const key = localStorage.key(0);
document.addEventListener("DOMContentLoaded", function () {
  
     const userData = localStorage.getItem(key);
    if (userData) {
        const userObj = JSON.parse(userData);
        const ajaxContentDiv = document.getElementById("ajaxcontent");
        if (ajaxContentDiv) {
            ajaxContentDiv.innerHTML = createTableFromJSON(userObj);
        } else {
            console.log('No ajaxcontent div found on this page.');
        }
    }
});

if(key==='user'){
    function saveUserUpdates() {
    const updatedUser = {}; 
    const tableRows = document.querySelectorAll("#ajaxcontent table tr");

    tableRows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length === 2) {
            const key = cells[0].innerText;
            const input = cells[1].querySelector("input");
            if (input) {
                updatedUser[key] = input.value;
            }
        }
    });

  
    fetch('http://localhost:8080/359project/SaveUserChanges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
    })
    .then(response => response.json())  
    .then(data => {
        if (data.status === "success") {
            alert("User updated successfully!");

            
            const updatedUserFromResponse = data.updatedUser || updatedUser;

            localStorage.setItem('user', JSON.stringify(updatedUserFromResponse));

            
            document.getElementById("ajaxcontent").innerHTML = createTableFromJSON(updatedUserFromResponse);
        } else {
            alert("Error updating user: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}


document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('save-button');
    button.addEventListener('click', function() {
        saveUserUpdates();
    });
});
}

if(key==='volunteer'){
    function saveVolunteerUpdates() {
    const updatedVolunteer = {}; 
    const tableRows = document.querySelectorAll("#ajaxcontent table tr");

    tableRows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length === 2) {
            const key = cells[0].innerText;
            const input = cells[1].querySelector("input");
            if (input) {
                updatedVolunteer[key] = input.value;
            }
        }
    });

  
    fetch('http://localhost:8080/359project/SaveVolunteerChanges', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVolunteer),
    })
    .then(response => response.json())  
    .then(data => {
        if (data.status === "success") {
            alert("Volunteer updated successfully!");

            
            const updatedVolunteerFromResponse = data.updatedVolunteer || updatedVolunteer;

            localStorage.setItem('volunteer', JSON.stringify(updatedVolunteerFromResponse));

            
            document.getElementById("ajaxcontent").innerHTML = createTableFromJSON(updatedVolunteerFromResponse);
        } else {
            alert("Error updating volunteer: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}


document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('save-button');
    button.addEventListener('click', function() {
        saveVolunteerUpdates();
    });
});

}




function back_to_page(){
    if(key==="user"){
        window.location.href="userpage.html";
    }
    if(key==="volunteer"){
        window.location.href="volunteerpage.html";
    }
}
