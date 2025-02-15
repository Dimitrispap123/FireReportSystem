document.addEventListener("DOMContentLoaded", () => {
  const passwordField = document.getElementById("password");
  const verifypasswordField = document.getElementById("verifypassword");

  var forbidden_word_flag=0;

  const weakPasswordMessage = document.getElementById("weak-password-message");
  const strongPasswordMessage = document.getElementById("strong-password-message");
  const mediumPasswordMessage = document.getElementById("medium-password-message");

  
  const volunteerRadio = document.getElementById('Volunteer');
  const volunteerOptions = document.getElementById('volunteer-options');
  const simpleRadio = document.getElementById('Simple');
  const aggreement1=document.getElementById('agreement1');
  const aggreement2=document.getElementById('agreement2');
  const locationmessage=document.getElementById('locationmessage');
  const birthInput = document.getElementById('birth');
  const usernamefield=document.getElementById("username");
  const emailfield=document.getElementById("email");
  const telefield=document.getElementById("telephone");

  var globallatitude=0;
  var globallongtitude=0;
  var globalmapjsonlength=0;
  var locationexists=0;
  var hidemapbutton=0;
  var dupusername=0;
  var dupemail=0;
  var duptele=0;
  const forbiddenWords = ["fire", "fotia", "ethelontis", "volunteer"];

  const form = document.getElementById("form");
  const checkLocationButton = document.getElementById('checkLocationButton');

 
  function show(){
    const formObj={
      username:document.getElementById("username").value,
      email:document.getElementById("email").value,
      password:document.getElementById("password").value,
      firstname:document.getElementById("firstname").value,
      lastname:document.getElementById("lastname").value,
      birthdate:document.getElementById("birth").value,
      gender:getCheckedGender(),
      afm:document.getElementById("afm").value,
      type:getCheckedType(),
      volunteerType:getVolunteerype(),
      height:document.getElementById("height").value,
      weight:document.getElementById("weight").value,
      country:document.getElementById("country").value,
      prefecture:document.getElementById("prefecture").value,
      municipality:document.getElementById("municipality").value,
      address:document.getElementById("address").value,
      job:document.getElementById("job").value,
      telephone:document.getElementById("telephone").value,
      lat: globallatitude,
      lon: globallongtitude

    };
    const jsonOutput = JSON.stringify(formObj, null, 3);

    console.log(jsonOutput);

    return jsonOutput;
   
  
  
  }

  function getCheckedGender() {
    const genderRadios = document.getElementsByName("gender");
    let selectedGender = null;

    for (const radio of genderRadios) {
        if (radio.checked) {
            selectedGender = radio.value;
            break;
          
        }
    }

    return selectedGender;
}

function getCheckedType() {
  const typeRadios = document.getElementsByName("type");
  let selectedtype = null;

  for (const radio of typeRadios) {
      if (radio.checked) {
        selectedtype = radio.value;
          break;
      }
  }

  return selectedtype;
}

function getVolunteerype() {
  const volunteertypeRadios = document.getElementsByName("volunteer-type");
  let selectedvolunteertype = null;
  
  for (const radio of volunteertypeRadios) {
      if (radio.checked) {
        selectedvolunteertype = radio.value;
          break;
      }
  }

  return selectedvolunteertype;
}

  function checkPasswordMatch() {
      if (passwordField.value !== verifypasswordField.value) {
         
          verifypasswordField.setCustomValidity("Δεν ταιριάζει με τον κωδικό.");
      } else {
          
          verifypasswordField.setCustomValidity(""); 
      }
  }

  function checkForbiddenWords() {
    const password = passwordField.value.toLowerCase();
    for (const word of forbiddenWords) {
        if (password.includes(word)) {
            
   
          document.getElementById("forbidden-word-mes").innerHTML=`Ο κωδικός δε μπορει να περιέχει τη λέξη: "${word}".`;
          forbidden_word_flag=1;
            return;
        } 
    }
    forbidden_word_flag=0;
    document.getElementById("forbidden-word-mes").innerHTML="";
   
  
}

function checkWeakPassword() {
  const password = passwordField.value;
  
  if (password.length === 0) {
    weakPasswordMessage.textContent = ""; 
    weakPasswordMessage.style.visibility = "hidden"; 
    passwordField.setCustomValidity(""); 
      return;
  }
  const charCount = {};
  for (const char of password) {
      charCount[char] = (charCount[char] || 0) + 1;
  }

  const halfLength = password.length / 2;


  const digitCount = password.split("").filter(char => /\d/.test(char)).length;
  

  if (digitCount >= password.length / 2) {
    weakPasswordMessage.textContent = "Weak password";
    weakPasswordMessage.style.visibility = "visible";
    passwordField.setCustomValidity("Password is too weak.");

  }else if(Object.values(charCount).some(count => count >= halfLength)){ 
    weakPasswordMessage.textContent = "Weak password";
    weakPasswordMessage.style.visibility = "visible";
    passwordField.setCustomValidity("Password is too weak.");

  } else {
    weakPasswordMessage.textContent = "";
    weakPasswordMessage.style.visibility = "hidden"; 
    passwordField.setCustomValidity(""); 
  }
}



function checkStrongPassword() {
  const password = passwordField.value;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasUpperCase && hasLowerCase && hasNumbers && hasSymbols) {
      strongPasswordMessage.textContent = "Strong password.";
      strongPasswordMessage.style.visibility = "visible";
  } else {
      strongPasswordMessage.textContent = "";
      strongPasswordMessage.style.visibility = "hidden"; 
  }
}
function checkMediumPassword() {
  const password = passwordField.value;

  if (weakPasswordMessage.style.visibility === "hidden" && strongPasswordMessage.style.visibility === "hidden" &&password.length > 0) {
      mediumPasswordMessage.textContent = "Medium password.";
      mediumPasswordMessage.style.visibility = "visible";
  } else {
      mediumPasswordMessage.textContent = "";
      mediumPasswordMessage.style.visibility = "hidden"; 
  }
}


var map = new OpenLayers.Map("Map");
var mapnik = new OpenLayers.Layer.OSM();
var markers = new OpenLayers.Layer.Markers("Markers");

map.addLayer(mapnik);
map.addLayer(markers);

function setPosition(lat, lon) {
    var fromProjection = new OpenLayers.Projection("EPSG:4326"); 
    var toProjection = new OpenLayers.Projection("EPSG:900913"); 
    var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    return position;
}

function handler(position, message) {
    var popup = new OpenLayers.Popup.FramedCloud("Popup",
        position, null,
        message, null,
        true 
    );
    map.addPopup(popup);
}
async function checklocation(){
  const xwra=document.getElementById("country").value;
  const street=document.getElementById("address").value;
  const dhmos=document.getElementById("municipality").value;
  const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?format=json&street=${street}&state=${dhmos}&country=${xwra}&accept-language=en&namedetails=0&limit=1&bounded=0&polygon_text=0&polygon_kml=0&polygon_svg=0&polygon_geojson=0&polygon_threshold=0.0`;
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

function initializeMap() {
  if (globallatitude !== null && globallongtitude !== null) {

      
      while (map.popups.length > 0) {
        map.removePopup(map.popups[0]);
    }
      markers.clearMarkers();

      const position = setPosition(globallatitude, globallongtitude);
      const marker = new OpenLayers.Marker(position);
      markers.addMarker(marker);

      marker.events.register('mousedown', marker, function(evt) {
          handler(position, "Location found!");
      });

      const zoom = 11;
      map.setCenter(position, zoom);
  } else {
    if(globalmapjsonlength==0){ 
    globallatitude=null;
    globallongtitude = null

    }
     console.log("Location coordinates are not set.");
  }

}

function themap(){
    if(locationexists!=0){
      document.getElementById("Map").style.display="block";
    }else{
      document.getElementById("Map").style.display="none";
    }
}

function themapbutton(){
  if(hidemapbutton!=0){
    document.getElementById("seeLocationButton").style.display="block";
  }else{
    document.getElementById("seeLocationButton").style.display="none";
    document.getElementById("Map").style.display="none";
  }
}


  checkLocationButton.addEventListener('click', async function() {
      await checklocation();
      themapbutton()
    
  });

  document.getElementById("seeLocationButton").addEventListener("click", async function() {
    await checklocation();
    initializeMap();
    themap();
});

  passwordField.addEventListener("input", () => {
    checkForbiddenWords();  
    checkPasswordMatch();  
    checkWeakPassword();
    checkStrongPassword();
    checkMediumPassword();
  });
  verifypasswordField.addEventListener("input", checkPasswordMatch);

 
  volunteerRadio.addEventListener('change', () => {
    if (volunteerRadio.checked) {
        volunteerOptions.style.display = 'block'; 
        aggreement1.style.display='none';
        aggreement2.style.display='block';
    }
  });


 
  simpleRadio.addEventListener('change', () => {
    if (simpleRadio.checked) {
        volunteerOptions.style.display = 'none';
        aggreement1.style.display='block';
        aggreement2.style.display='none';
    }
  });

  usernamefield.addEventListener("input", async function() {
    const isDup1 = await checkDuplicateusername();

    if (!isDup1) {
        dupusername=1;
        document.getElementById("unameerror").innerText = "Username already exists.";
        document.getElementById("unameerror").style.color = "red";  
        
    } else {
        dupusername=0;
        document.getElementById("unameerror").textContent = "";
        
    }
});

  emailfield.addEventListener("input", async function() {
 
    const isDup2 = await checkDuplicateemail();

    if (!isDup2) {
        dupemail=1;
        document.getElementById("emailerror").innerText = "Email already exists.";
        document.getElementById("emailerror").style.color = "red"; 
    } else {
        dupemail=0;
        document.getElementById("emailerror").textContent = "";
    }
});

  telefield.addEventListener("input", async function() {

    const isDup3 = await checkDuplicatetele();

    if (!isDup3) {
        duptele=1;
        document.getElementById("teleerror").innerText = "Telephone already exists.";
        document.getElementById("teleerror").style.color = "red";
    } else {
        duptele=0;
        document.getElementById("teleerror").textContent = "";
    }
});


     form.addEventListener("submit", (event) => {
      checkForbiddenWords();
      checkPasswordMatch();
      checkWeakPassword();
    

      if (!form.checkValidity()) {
        event.preventDefault(); 
        passwordField.reportValidity(); 
      }else if(forbidden_word_flag==1){
        event.preventDefault(); 
        passwordField.scrollIntoView({ behavior: "smooth", block: "center" }); 
        passwordField.focus(); 
      }else if(dupusername==1){
          event.preventDefault();
          usernamefield.scrollIntoView()
          
      }else if(dupemail==1){
          event.preventDefault();
          emailfield.scrollIntoView();
      
       }else if(duptele==1){
         event.preventDefault();
          telefield.scrollIntoView();
        }else{   

            var data = show();  
            submitR(data);  
            alert("Η εγγραφή σας πραγματοποιήθηκε επιτυχώς");
            

        
      }

 

  });
  

  async function checkDuplicateusername() {
    const urlParams = new URLSearchParams({
        username: document.getElementById("username").value

    }).toString();
    const response = await fetch("http://localhost:8080/359project/CheckDupl?"+ urlParams);
    if(response.status === 200){
        return true;
    }
    return false;
}

  async function checkDuplicateemail() {
    const urlParams = new URLSearchParams({
        email: document.getElementById("email").value

    }).toString();
    const response = await fetch("http://localhost:8080/359project/CheckDupl?"+ urlParams);
    if(response.status === 200){
        return true;
    }
    return false;
}

  async function checkDuplicatetele() {
    const urlParams = new URLSearchParams({
        telephone: document.getElementById("telephone").value

    }).toString();
    const response = await fetch("http://localhost:8080/359project/CheckDupl?"+ urlParams);
    if(response.status === 200){
        return true;
    }
    return false;
}

 

});


 function showFunction() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  function  showVerifyFunction() {
    var x = document.getElementById("verifypassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
    function submitR(data) {
        fetch("http://localhost:8080/359project/Register",{
            method: "POST",
            body: data
        }).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.error(error)
        })
    }


async function checkDuplicates() {
    const urlParams = new URLSearchParams({
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        telephone:document.getElementById("telephone").value

    }).toString();
    const response = await fetch("http://localhost:8080/359project/CheckDupl?"+ urlParams);
    if(response.status === 200){
        return true;
    }
    return false;
}



