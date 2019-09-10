
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
            createPin([lng, lat])
            //createPin(lng, lat, id)
        }
    });
}


function getPins(){
    fetch("http://localhost:3000/pins")
    .then(res=>res.json())
        .then(data => data.forEach(function (data) { slapPinOnDom(data) } ) )
}

function editForm(pinObj){
    const form = document.createElement("form")
    form.dataset.id = pinObj.id
    form.class = "edit"
    form.style.display = "none"

    const description = document.createElement("INPUT");
    description.setAttribute("type", "text");

    const imgUrl = document.createElement("INPUT");
    imgUrl.setAttribute("type", "text");

    const coord = document.createElement("INPUT");
    coord.setAttribute("type", "hidden");
    coord.setAttribute("value", pinObj.coordinates);

    var submit = document.createElement("INPUT");
    submit.setAttribute("type", "submit");

    form.appendChild(description)
    form.appendChild(imgUrl)
    form.appendChild(coord)
    form.appendChild(submit)
    return form
}

function slapPinOnDom(pinObj) {
    console.log(pinObj)

    const div = document.createElement("div")
    div.dataset.id = pinObj.id
    div.class = "info"

    const p = document.createElement("p")
    p.innerText = pinObj.description
    
    const dButton = document.createElement("button")
    dButton.innerText = "delete"
    dButton.dataset.id = pinObj.id
    dButton.classList.add("delete")
    dButton.addEventListener("click", function (e) {
        console.log("delete", e)
    })
    const eButton = document.createElement("button")
    eButton.innerText = "edit"
    eButton.dataset.id = pinObj.id
    eButton.classList.add("edit")
    eButton.addEventListener("click", function(e){
        console.log("edit", e)
    })
    
    div.appendChild(p)
    div.appendChild(eButton)
    div.appendChild(dButton)
    div.append(editForm(pinObj))

    var popup = new mapboxgl.Popup({ offset: 25 })
        .setText(pinObj.description)
        .setDOMContent(div);

    
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

function createPin(pinCoord) {
    fetch("http://localhost:3000/pins",{
        "method": "POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "coordinates": pinCoord,
            "description": "lorem impsum",
            "img_url": "https://docs.mapbox.com/mapbox-gl-js/assets/washington-monument.jpg"
        })
    })
    .then(res=>res.json())
    .then(data => slapPinOnDom(data))
}


document.addEventListener("DOMContentLoaded", function(e){
    getPins()
    handleEvents()
})
