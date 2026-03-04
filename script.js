// SLIDER
let slides = document.querySelectorAll(".slider img");
let index = 0;

setInterval(() => {
slides[index].classList.remove("active");
index = (index + 1) % slides.length;
slides[index].classList.add("active");
}, 3000);

// POPUP
function openPopup(){
document.getElementById("popupForm").style.display = "flex";
}

function closePopup(){
document.getElementById("popupForm").style.display = "none";
}

/* AUTO BOOKING POPUP + SERVICE SELECT */

const params = new URLSearchParams(window.location.search);

// popup open
if(params.get("book") === "true"){
setTimeout(()=>{
openPopup();
},300);
}

// service auto select
const service = params.get("service");

if(service){
const dropdown = document.querySelector("select[name='service']");
if(dropdown){
dropdown.value = service;
}
}
