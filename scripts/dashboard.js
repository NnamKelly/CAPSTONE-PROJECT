let locations = JSON.parse(localStorage.getItem("campusLocations")) || [];

const form = document.getElementById("locationForm");
const table = document.getElementById("locationTable");

function saveData() {
  localStorage.setItem("campusLocations", JSON.stringify(locations));

  document.getElementById("locationCount").textContent = locations.length;

  document.getElementById("routeCount").textContent = locations.length;
}

function renderTable() {
  table.innerHTML = "";

  locations.forEach((location, index) => {
    table.innerHTML += `

<tr>

<td>${location.name}</td>

<td>${location.category}</td>

<td>

<button
class="delete"
onclick="removeLocation(${index})">

Delete

</button>

</td>

</tr>

`;
  });

  saveData();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  locations.push({
    name: document.getElementById("locationName").value,

    category: document.getElementById("category").value,

    description: document.getElementById("description").value,
  });

  form.reset();

  renderTable();
});

function removeLocation(index) {
  locations.splice(index, 1);

  renderTable();
}

renderTable();
