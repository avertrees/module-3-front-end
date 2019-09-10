
mapboxgl.accessToken = 'pk.eyJ1IjoiYXZlcnRyZWVzIiwiYSI6ImNrMGIzNjd0MDBxOGczanI3YXRnMndmb28ifQ.vMs6tdz00Q9KCQ_OSWtn8w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
    center: [-77.38, 39], // starting position
    zoom: 3 // starting zoom
});

// function closeForm() {
//     document.getElementById("myForm").style.display = "none";
// }

function handleEvents(){
    map.on('click', function (e) {
        //debugger
        ///console.log(e)
        if (e.originalEvent.toElement.id.includes("marker")) {
            console.log(e)
            //&& e.originalEvent.target.innerText  === "edit"
        } else if (e.originalEvent.target.classList.contains("edit")) { 
            console.log(e)
        }else {
            let lng = e.lngLat.lng
            let lat = e.lngLat.lat
            console.log(`long ${lng}, lat ${lat}`)
            createPin(lng, lat)
            //createPin(lng, lat, id)
        }
    });
}

function editForm(pinObj){
    const formDiv = document.createElement("div")
    formDiv.classList.add("editForm")
    const form = document.createElement("form")
    form.dataset.id = pinObj.id

    const name = document.createElement("INPUT");
    name.setAttribute("type", "text");
    name.setAttribute("value", pinObj.name);

    const description = document.createElement("INPUT");
    description.setAttribute("type", "text");
    description.setAttribute("value", pinObj.description);

    const imgUrl = document.createElement("INPUT");
    imgUrl.setAttribute("type", "text");
    imgUrl.setAttribute("type", pinObj.image_url);

    const longitude = document.createElement("INPUT");
    longitude.setAttribute("type", "hidden");
    longitude.setAttribute("value", pinObj.longitude);

    const latitude = document.createElement("INPUT");
    latitude.setAttribute("type", "hidden");
    latitude.setAttribute("value", pinObj.latitude);

    var submit = document.createElement("INPUT");
    submit.setAttribute("type", "submit");
    
    //submit.addEventListener("")
    
    form.appendChild(name)
    form.appendChild(description)
    form.appendChild(imgUrl)
    form.appendChild(longitude)
    form.appendChild(latitude)
    form.appendChild(submit)
    formDiv.append(form)
    //formDiv.style.display = "none"
    return formDiv
}

function showInfo(e) {
    let info = document.querySelector(".info")
    info.style.display = "block"
}

function hideInfo(e){
    let info = document.querySelector(".info")
    info.style.display = "none"
}

function hideForm(e){
    showInfo(e)
    let form = document.querySelector(".editForm")
    form.style.display = "none"
}
function showForm(e){
    console.log(e)
    hideInfo(e)
    let form = document.querySelector(".editForm")
    form.style.display = "block"
}

function formController(e){
    let isEdit = e.target.dataset.edit
    isEdit === "true" ? isEdit = "false" : isEdit= "true"
    if (isEdit) {
        showForm(e)
    } else {
        hideForm(e)
    }
}

function slapPinOnDom(pinObj) {
    console.log(pinObj)
    
    const popupDiv = document.createElement("div")
    popupDiv.dataset.id = pinObj.id
    popupDiv.classList.add("popupDiv")

    const div = document.createElement("div")
    div.dataset.id = pinObj.id
    div.classList.add("info")

    const p = document.createElement("p")
    p.innerText = pinObj.description
    
    const dButton = document.createElement("button")
    dButton.innerText = "delete"
    dButton.dataset.id = pinObj.id
    dButton.classList.add("delete")
    dButton.addEventListener("click", deletePin)

    const eButton = document.createElement("button")
    eButton.innerText = "edit"
    eButton.dataset.id = pinObj.id
    eButton.dataset.edit = "false"
    eButton.classList.add("edit")
    eButton.addEventListener("click", formController)

    div.appendChild(p)
    div.appendChild(eButton)
    div.appendChild(dButton)
    popupDiv.append(div)
    popupDiv.append(editForm(pinObj))
    
    var popup = new mapboxgl.Popup({ offset: 25 })
        .setText(pinObj.description)
        .setDOMContent(popupDiv);

    
    // create DOM element for the marker
    var el = document.createElement('div');
    el.classList += ' marker';
    el.id = `marker-${pinObj.id}`;
    el.style.backgroundImage = `url('${pinObj.image_url}')`;
    el.style.backgroundSize = "cover";
    el.style.width= "50px";
    el.style.height = "50px";
    el.style.borderRadius = "50%";
    el.style.cursor = "pointer";

    // create the marker
    new mapboxgl.Marker(el)
        .setLngLat([pinObj.longitude, pinObj.latitude])
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
}

function removePinFromDom(id){
    const marker = document.querySelector(`#marker-${id}`)
    marker.style.display = "none"
}

function getPins() {
    fetch("http://localhost:3000/pins")
        .then(res => res.json())
        .then(data => data.forEach(function (data) { slapPinOnDom(data) }))
}

function createPin(longitude, latitude) {
    fetch("http://localhost:3000/pins",{
        "method": "POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "name": "...name...",
            "longitude": longitude,
            "latitude": latitude,
            "description": "...description...",
            "image_url": "https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg"
        })
    })
    .then(res=>res.json())
    .then(data => slapPinOnDom(data))
}


function deletePin(e) {
    const id = e.target.dataset.id
    //console.log(id)
    fetch(`http://localhost:3000/pins/${id}`,{
        "method": "DELETE",
    })
    .then(res=>res.json())
    .then(removePinFromDom(id))
}    

document.addEventListener("DOMContentLoaded", function(e){
    getPins()
    handleEvents()
})
