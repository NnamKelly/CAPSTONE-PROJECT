const map = L.map("routeMap").setView([5.9246, 10.1074], 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

const places = {
  "Main Gate": [5.9246, 10.1074],

  "Administration Block": [5.9251, 10.1081],

  Library: [5.9249, 10.1088],

  "Engineering Block": [5.9242, 10.1079],

  "Computer Laboratory": [5.924, 10.1085],

  "Male Hostel": [5.9238, 10.107],

  "Female Hostel": [5.9234, 10.1082],

  Cafeteria: [5.9245, 10.1089],
};

let polyline;

document.getElementById("swapBtn").onclick = () => {
  const start = document.getElementById("start");

  const destination = document.getElementById("destination");

  [start.value, destination.value] = [destination.value, start.value];
};

document.getElementById("findRoute").onclick = () => {
  const start = document.getElementById("start").value;

  const destination = document.getElementById("destination").value;

  if (polyline) {
    map.removeLayer(polyline);
  }

  const startPoint = places[start];

  const endPoint = places[destination];

  polyline = L.polyline(
    [startPoint, endPoint],

    {
      color: "#0A4FA3",

      weight: 6,
    },
  ).addTo(map);

  map.fitBounds(polyline.getBounds());

  const distance = (Math.random() * 0.8 + 0.2).toFixed(2);

  const time = Math.ceil(distance * 12);

  document.getElementById("result").innerHTML = `

<h4>${start}</h4>

<i class="fas fa-arrow-down"></i>

<h4>${destination}</h4>

<br>

<p><strong>Distance:</strong> ${distance} km</p>

<p><strong>Estimated Time:</strong> ${time} minutes</p>

<p><strong>Status:</strong> Route generated successfully.</p>

`;
};
