
document.addEventListener("DOMContentLoaded", function () {
        
const usertypefield=document.getElementById("user_type");
const usernamefield=document.getElementById("username");
   const loginForm = document.getElementById('loginForm');

    
    if (loginForm) { 
        loginForm.addEventListener('submit', getUser);
        
        function display_login_fields(){
      if(usertypefield.value.trim() === "Guest"){
        document.getElementById("fields_div").style.display='none';
        document.getElementById("new_fields_div").style.display='block';
        

    }else{
        document.getElementById("fields_div").style.display='block';
        document.getElementById("new_fields_div").style.display='none';
    }  
}

    usertypefield.addEventListener("change", display_login_fields);
    display_login_fields();
    
    }
    

    




function getUser() {
    event.preventDefault(); 
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const x = JSON.parse(xhr.responseText);

            console.log(x);
            
            
            
            document.getElementById("loginmess").innerText="";
           if(usertypefield.value.trim() === "Admin"){
                 localStorage.setItem('user',JSON.stringify(x));
                 window.location.href = 'adminpage.html';
            }
            
            if(usertypefield.value.trim() === "User"){
                localStorage.setItem('user',JSON.stringify(x));
                 window.location.href = 'userpage.html';
            }
            
            if(usertypefield.value.trim() === "Volunteer"){
            
                 localStorage.setItem('volunteer',JSON.stringify(x));
                 window.location.href = 'volunteerpage.html';
            }
 
          

        } else if (xhr.status !== 200) {
            document.getElementById("loginmess").innerText="User not exists or incorrect password";
            document.getElementById("loginmess").style.color="red";
            console.log(xhr.status);
            
        }
    };
    var data = $('#loginForm').serialize();
    if(usertypefield.value.trim() === "User" || usertypefield.value.trim() === "Admin" ){
         xhr.open('GET', 'http://localhost:8080/359project/GetUser?'+data);
    }
    if(usertypefield.value.trim() === "Volunteer"){
         xhr.open('GET', 'http://localhost:8080/359project/GetVolunteer?'+data);
    }
   
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

const key = localStorage.key(0);
const userData = localStorage.getItem(key);

 $(document).ready(function() {
     if (userData) {
        const userObj = JSON.parse(userData); 
            $.get("http://localhost:8080/359project/GetIncident", function(data) {
                if (data && data.length > 0) {
                    const runningIncidents = data.filter(incident=>incident.municipality=== userObj.municipality && incident.status === 'running');
                    if(runningIncidents.length!==0){
                        let allDescriptions = "";
                        runningIncidents.forEach(function(incident) {
                          allDescriptions += "Danger: " + incident.description + "<br>";
                    });
                    
                    displayDangerMessage(allDescriptions);
                    }
                    
                   if(userObj.username==="admin"){
                    const runningIncidents2 = data.filter(incident => incident.status === 'submitted');
                    if(runningIncidents2.length!==0){
                        let allDescriptions = "Νέα Καταχώρηση Συμβάντος!";
                  
                                  
                         displayDangerMessageAdmin(allDescriptions);
                     }
                    }
                 

                }
            }).fail(function() {
                alert("Error loading incidents.");
            });
        }
        });
       
       
function displayDangerMessage(message) {
        const dangerMessageDiv = document.getElementById("dangerMessage");
        if (dangerMessageDiv) {
            dangerMessageDiv.innerHTML = message;
            dangerMessageDiv.style.display = "block"; 
             window.addEventListener('load', function() {
             document.getElementById('audioPlayer').play();
    });
    }
}

if(key==="volunteer"){
   $(document).ready(function() {
     if (userData) {
        const userObj = JSON.parse(userData); 
            $.get("http://localhost:8080/359project/GetIncident", function(data) {
                if (data && data.length > 0) {
                    const runningIncidents = data.filter(incident => incident.status === 'running');
                    if(runningIncidents.length!==0){
                        let allDescriptions = "Ενεργά Συμβάντα, Δήλωσε Συμμετοχή!";
                  
                                  
                         displayDangerMessageVolunteer(allDescriptions);
                    
                    }
   
                 

                }
            }).fail(function() {
                alert("Error loading incidents.");
            });
        }
        });  
}
function displayDangerMessageVolunteer(message) {
        const dangerMessageDiv = document.getElementById("dangerMessage2");
        if (dangerMessageDiv) {
            dangerMessageDiv.innerHTML = message;
            dangerMessageDiv.style.display = "block"; 
             window.addEventListener('load', function() {
             document.getElementById('audioPlayer').play();
    });
    }
}

  
  function displayDangerMessageAdmin(message) {
        const dangerMessageDiv = document.getElementById("dangerMessage3");
        if (dangerMessageDiv) {
            dangerMessageDiv.innerHTML = message;
            dangerMessageDiv.style.display = "block"; 
             window.addEventListener('load', function() {
             document.getElementById('audioPlayer').play();
    });
    }
}
  
  
     $(document).ready(function() {
     if (userData) {
        const userObj = JSON.parse(userData); 
            $.get("http://localhost:8080/359project/GetParticipants", function(data) {
                if (data && data.length > 0) {
                    const runningIncidents = data.filter(participant => participant.success === 'pending');
                    if(runningIncidents.length!==0){
                        let allDescriptions = "Νέος Πιθανός Εθελοντής!";
                  
                                  
                         displayParticipantMessage(allDescriptions);
                    
                    }
   
                 

                }
            }).fail(function() {
                alert("Error loading incidents.");
            });
        }
        }); 
        
 
  function displayParticipantMessage(message) {
        const dangerMessageDiv = document.getElementById("participantMessage");
        if (dangerMessageDiv) {
            dangerMessageDiv.innerHTML = message;
            dangerMessageDiv.style.display = "block"; 
             window.addEventListener('load', function() {
             document.getElementById('audioPlayer').play();
    });
    }
}
  
  
  
});
        
        function redirectToMainPage(){
            window.location.href = 'mainpage.html'; 
        }
        
         function redirectToIncidentPage() {
            window.location.href = 'reg_incident.html';
         }
        
         function redirectToHistoryPage() {
            window.location.href = 'showhistory.html';
        }
         function redirectToUpdateIncidentPage() {
            window.location.href = 'reg_incident.html';
        }
         function redirectToDeleteIncidentPage() {
            window.location.href = 'deleteinc.html';
        }
         function redirectToGuestPage() {
            window.location.href = 'guestpage.html';
        }
         function redirectAdminIncidentsPage() {
            window.location.href = 'adminincidentspage.html';
        }
        
        function redirectToRunningIncidentsPage() {
            window.location.href = 'showrunningincidents.html';
        }
        function redirectToAIChatPage() {
            window.location.href = 'aichatpage.html';
        }
         function redirectToRunningIncidentsVolunteerPage() {
            window.location.href = 'showrunningincidents_volunteer.html';
        }
        function redirectToParticipantsPage() {
            window.location.href = 'showparticipants.html';
        }
          function redirectToMessagesPage() {
            window.location.href = 'showmessages.html';
        }
        
        



 function showFunction() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
function logout(){
    localStorage.clear();
    window.location.href="index.html";
}
