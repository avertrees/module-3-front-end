const numImagesAvailable = 740; //how many total images are in the collection you are pulling from
const imageWidth = 480; //your desired image width in pixels
const imageHeight = 480; //desired image height in pixels
const collectionID = 786921; //the collection ID from the original url

mapboxgl.accessToken = 'pk.eyJ1IjoiYXZlcnRyZWVzIiwiYSI6ImNrMGIzNjd0MDBxOGczanI3YXRnMndmb28ifQ.vMs6tdz00Q9KCQ_OSWtn8w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
    center: [-77.38, 39], // starting position
    zoom: 3 // starting zoom
});

function handleEvents(){
    map.on('click', function (e) {
        if (e.originalEvent.toElement.id.includes("marker")) {
            console.log(e)
        } else if (e.originalEvent.target.classList.contains("edit")) { 
            console.log(e)
        }else {
            let lng = e.lngLat.lng
            let lat = e.lngLat.lat
            console.log(`long ${lng}, lat ${lat}`)
            getMarkerImage(lng,lat,Math.floor(Math.random() * numImagesAvailable))
        }
    });
}

function updatePopup(e, pinObj){
    console.log(pinObj)
    console.log(e)

    const img = document.querySelector(`#marker-${pinObj.id}`)
    img.style.backgroundImage = `url('${pinObj.image_url}')`;
    const h7 = document.querySelector("h7")
    const p = document.querySelector("p")

    h7.innerText = pinObj.name
    p.innerText = pinObj.description

    hideForm(e)
}

function updatePin(e){
    e.preventDefault()
    console.log(e.target.imageUrl.value)
    const id = e.target.dataset.id 
    console.log(id)
    fetch(`https://mapbox-project-backend.herokuapp.com/pins/${id}`,{
        "method": "PATCH",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            name: e.target.name.value,
            description: e.target.description.value,
            longitude: parseFloat(e.target.longitude.value),
            latitude: parseFloat(e.target.latitude.value),
            image_url: e.target.imageUrl.value
        })
    })
    .then(res=>res.json())
    .then(pinObj => updatePopup(e, pinObj))
}

function editForm(pinObj){
    const formDiv = document.createElement("div")
    formDiv.classList.add("editForm")
    const form = document.createElement("form")
    form.dataset.id = pinObj.id

    const name = document.createElement("INPUT");
    name.setAttribute("type", "text");
    name.setAttribute("value", pinObj.name);
    name.id = "name"

    const description = document.createElement("INPUT");
    description.setAttribute("type", "text");
    description.setAttribute("value", pinObj.description);
    description.id = "description"
    
    const imgUrl = document.createElement("INPUT");
    imgUrl.setAttribute("type", "text");
    imgUrl.setAttribute("value", pinObj.image_url);
    imgUrl.id = "imageUrl"
    
    const longitude = document.createElement("INPUT");
    longitude.setAttribute("type", "hidden");
    longitude.setAttribute("value", pinObj.longitude);
    longitude.id = "longitude"
    
    const latitude = document.createElement("INPUT");
    latitude.setAttribute("type", "hidden");
    latitude.setAttribute("value", pinObj.latitude);
    latitude.id = "latitude"

    var submit = document.createElement("INPUT");
    submit.setAttribute("type", "submit");
    
    //const form = document.getElementById("new-to-do")
    form.addEventListener("submit", updatePin)
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

function createLike(e){
    fetch("https://mapbox-project-backend.herokuapp.com/likes",{
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "user_id": 1,
            "pin_id": e.target.dataset.id
        })
    })
    .then(res=>res.json())
    .then(likeObj=> renderLikeOnDom(e,likeObj))    
}

function renderLikeOnDom(e, likeObj){
    let likeCount = document.querySelector("#likes")
    let likes = parseInt(likeCount.innerText)
    likeCount.innerText = likes+=1
    console.log("likeObj", likeObj)
    console.log("event",e)
    console.dir("likeCount", likeCount)
}

function slapPinOnDom(pinObj) {
    // console.log(pinObj)
    
    const popupDiv = document.createElement("div")
    popupDiv.dataset.id = pinObj.id
    popupDiv.classList.add("popupDiv")

    const div = document.createElement("div")
    div.dataset.id = pinObj.id
    div.classList.add("info")

    const h7 = document.createElement("h7")
    h7.innerText = pinObj.name

    const p = document.createElement("p")
    p.innerText = pinObj.description
    
    const likes = document.createElement("p")

    const heart = document.createElement("button")
    heart.innerHTML = `<i data-id=${pinObj.id} class='fa fa-heart' style='color:red'></i>`
    heart.dataset.id  = pinObj.id
    heart.addEventListener("click", createLike)

    const span2 = document.createElement("span")
    span2.id = "likes"
    span2.innerText = pinObj.likes.length

    likes.appendChild(heart)
    likes.appendChild(span2)
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

    div.appendChild(h7)
    div.appendChild(p)

    div.appendChild(likes)
    //div.appendChild(span2)
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

function getMarkerImage(longitude, latitude, randomNumber){
   return fetch(`https://source.unsplash.com/collection/${collectionID}/${imageWidth}x${imageHeight}/?sig=${randomNumber}`) 
  .then((response)=> {    
    createPin(longitude, latitude, response.url)
  })
}

function getPins() {
    fetch("https://mapbox-project-backend.herokuapp.com/pins")
        .then(res => res.json())
        .then(data => data.forEach(function (data) { slapPinOnDom(data) }))
}

function createPin(longitude, latitude,url) {
    console.log(url)
    fetch("https://mapbox-project-backend.herokuapp.com/pins",{
        "method": "POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "name": "...name...",
            "longitude": longitude,
            "latitude": latitude,
            "description": "...description...",
            "image_url": url
        })
    })
    .then(res=>res.json())
    .then(data => slapPinOnDom(data))
}


function deletePin(e) {
    const id = e.target.dataset.id
    
    fetch(`https://mapbox-project-backend.herokuapp.com/pins/${id}`,{
        "method": "DELETE",
    })
    .then(res=>res.json())
    .then(removePinFromDom(id))
}    

document.addEventListener("DOMContentLoaded", function(e){
    getPins()
    handleEvents()
})
