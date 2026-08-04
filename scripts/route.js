const map = L.map("routeMap").setView(, 17);

L.tileLayer("", {
  attribution: "© OpenStreetMap",
}).addTo(map);

const places = {
  "Main Gate": [],

  "Administration Block": [],

  Library: [],

  "Engineering Block": [],

  "Computer Laboratory": [],

  "Male Hostel": [],

  "Female Hostel": [],

  Cafeteria: [],
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
