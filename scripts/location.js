const campusLocations = [
  {
    name: "Main Gate",
    category: "service",
    description: "Main entrance to CATUC Bamenda.",
    lat: 5.9246,
    lng: 10.1074,
  },

  {
    name: "Administration Block",
    category: "office",
    description: "Admissions, Registry and Finance.",
    lat: 5.9251,
    lng: 10.1081,
  },

  {
    name: "Library",
    category: "academic",
    description: "Central University Library.",
    lat: 5.9249,
    lng: 10.1088,
  },

  {
    name: "Engineering Block",
    category: "academic",
    description: "Faculty of Engineering.",
    lat: 5.9242,
    lng: 10.1079,
  },

  {
    name: "Computer Laboratory",
    category: "academic",
    description: "ICT and Programming Laboratory.",
    lat: 5.924,
    lng: 10.1085,
  },

  {
    name: "Male Hostel",
    category: "hostel",
    description: "Accommodation for male students.",
    lat: 5.9238,
    lng: 10.107,
  },

  {
    name: "Female Hostel",
    category: "hostel",
    description: "Accommodation for female students.",
    lat: 5.9234,
    lng: 10.1082,
  },

  {
    name: "Cafeteria",
    category: "service",
    description: "Food and refreshments.",
    lat: 5.9245,
    lng: 10.1089,
  },
];

const map = L.map("map").setView([5.9246, 10.1074], 17);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

  {
    attribution: "© OpenStreetMap",
  },
).addTo(map);

const container = document.getElementById("buildingContainer");

let markers = [];

function displayLocations(data) {
  container.innerHTML = "";

  markers.forEach((marker) => map.removeLayer(marker));

  markers = [];

  data.forEach((location) => {
    const marker = L.marker([location.lat, location.lng])

      .addTo(map)

      .bindPopup(
        `<strong>${location.name}</strong><br>${location.description}`,
      );

    markers.push(marker);

    container.innerHTML += `

<div class="building">

<h3>${location.name}</h3>

<p>${location.description}</p>

<a class="route-btn"

href="./route.html?destination=${encodeURIComponent(location.name)}">

Get Route

</a>

</div>

`;
  });
}

displayLocations(campusLocations);

document

  .getElementById("searchLocation")

  .addEventListener("keyup", function () {
    const search = this.value.toLowerCase();

    const filtered = campusLocations.filter((location) =>
      location.name.toLowerCase().includes(search),
    );

    displayLocations(filtered);
  });

document

  .getElementById("category")

  .addEventListener("change", function () {
    const value = this.value;

    if (value === "all") {
      displayLocations(campusLocations);

      return;
    }

    const filtered = campusLocations.filter(
      (location) => location.category === value,
    );

    displayLocations(filtered);
  });
