document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const locationmessage=document.getElementById('locationmessage');
     const outputDiv = document.getElementById("outputDiv"); 
    function show(){
    const formObj={
      incident_type:document.getElementById("incident_type").value,
      description:document.getElementById("description").value,
      user_type:document.getElementById("user_type").value,
      user_phone:document.getElementById("telephone").value,
      address:document.getElementById("address").value,
      lat:document.getElementById("lat").value ,
      lon:document.getElementById("lon").value ,
      prefecture:document.getElementById("prefecture").value ,
      municipality:document.getElementById("municipality").value,
      status: "submitted"

    };
       const key = localStorage.key(0);
        const userData = localStorage.getItem(key);
        const userObj = JSON.parse(userData); 
        if(userObj.username==="admin"){
            formObj.status = 'running'; 
            
        }
    return JSON.stringify(formObj, null, 3);



  }
  
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const jsonData = show(); 

        console.log(jsonData); 
     
   
        sendIncidentData(jsonData);

      

            

        
      });
      
  async function sendIncidentData(jsonData) {
    try {
     
      const response = await fetch("http://localhost:8080/359project/RegisterIncident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });
      console.log(jsonData);
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert("Η εγγραφή σας πραγματοποιήθηκε επιτυχώς!");
      } else {
        console.error("Failed to register incident:", response.status);
        alert("Σφάλμα κατά την εγγραφή του συμβάντος.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Σφάλμα δικτύου κατά την αποστολή των δεδομένων.");
    }
  }
  
  async function checklocation(){
 
  const street=document.getElementById("address").value;
  const dhmos=document.getElementById("municipality").value;
  const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?format=json&street=${street}&state=${dhmos}&country=Greece&accept-language=en&namedetails=0&limit=1&bounded=0&polygon_text=0&polygon_kml=0&polygon_svg=0&polygon_geojson=0&polygon_threshold=0.0`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '27ebfd22famshf3f184f15387a0ap13fa60jsn18c66e02855e',
      'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
     
    globalmapjsonlength=result.length;
    if(result.length==0){

      locationmessage.innerText = "Η τοποθεσία δεν βρέθηκε.Δοκιμάστε ελληνικούς χαρακτήρες";
      locationexists=0;
      hidemapbutton=0;
      return;
    }
    

    const location = result[0];
    const displayName = location.display_name;
    const latitude = location.lat;
    const longitude = location.lon;
      
    globallatitude=latitude;
    globallongtitude=longitude;

   
    if (displayName.includes("Crete")) {

        locationmessage.innerText = `Η τοποθεσία βρέθηκε στην Κρήτη. Συντεταγμένες: (${latitude}, ${longitude})`;
        locationexists=1;
        hidemapbutton=1;
     } else {
       locationmessage.innerText = "Η υπηρεσία είναι διαθέσιμη μόνο για τοποθεσίες στην Κρήτη.";
       locationexists=0;
       hidemapbutton=0;
     }
 
  
  
  } catch (error) {
    console.error(error);
    locationmessage.innerText = "Σφάλμα κατά την επικοινωνία με την υπηρεσία. Δοκιμάστε ελληνικούς χαρακτήρες.";
    locationexists=0;
    hidemapbutton=0;
  }


}

  document.getElementById('checkLocationButton').addEventListener('click', async function() {
      await checklocation();
    
    
  });
});



function back_to_page() {
    const key = localStorage.key(0);
    const userData = localStorage.getItem(key);
    if (userData) {
        const userObj = JSON.parse(userData); 
        if(userObj.username==="admin"){
            window.location.href = "adminpage.html";
        }else if(key === "user"){
        window.location.href = "userpage.html";
        } else if (key === "volunteer") {
        window.location.href = "volunteerpage.html";
        }
    }else {
        window.location.href = "guestpage.html";
    }
}
