// Campus map page.
// Renders every place from campus-data.js onto one Leaflet map and filters
// the markers by category and free-text search.

// Satellite imagery is the default base layer: OpenStreetMap has no building
// data mapped for this part of Bamenda, so its rendered tiles come out almost
// empty. Esri World Imagery shows the actual rooftops and needs no API key.

const satelliteLayer = L.tileLayer(

    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

    {
        maxZoom: 19,

        // Imagery over Bamenda runs out around z18; beyond that Leaflet
        // upscales the last real tile instead of showing blank squares.
        maxNativeZoom: 18,

        attribution:
            'Imagery &copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
    }

);

const streetLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {

    maxZoom: 19,

    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

});

// Place and road names to lay over the satellite imagery, which has none.
const labelLayer = L.tileLayer(

    "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",

    {
        maxZoom: 19,

        maxNativeZoom: 18,

        attribution: "Labels &copy; Esri"
    }

);


const campusMap = L.map("campusMap", {

    center: CAMPUS_CENTER,

    zoom: 18,

    scrollWheelZoom: false,

    // Satellite only by default — the label overlay is boundary/place level and
    // adds little at campus zoom, so it stays an opt-in in the layer control.
    layers: [satelliteLayer]

});

L.control.layers(

    {
        "Satellite": satelliteLayer,

        "Street Map": streetLayer
    },

    {
        "Place labels": labelLayer
    },

    { position: "topright" }

).addTo(campusMap);

L.control.scale({ imperial: false }).addTo(campusMap);

// Wheel zoom stays off until the user clicks into the map, so scrolling the
// page past a full-width map does not trap the scroll.
campusMap.on("click", () => campusMap.scrollWheelZoom.enable());
campusMap.on("mouseout", () => campusMap.scrollWheelZoom.disable());


// featureGroup rather than layerGroup so getBounds() covers both the pins and
// any building footprints.
const featureLayer = L.featureGroup().addTo(campusMap);

const searchInput = document.getElementById("mapSearch");
const chipContainer = document.getElementById("categoryChips");
const legendContainer = document.getElementById("mapLegend");
const countLabel = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const resetButton = document.getElementById("resetMap");
const pickButton = document.getElementById("pickCoords");
const pickNotice = document.getElementById("pickNotice");

const state = { query: "", category: "all", picking: false };

// Layer lookup by place name, used by the ?place= deep link.
let layersByName = {};


function pinIcon(color) {

    return L.divIcon({

        className: "campus-pin-wrap",

        html: `<span class="campus-pin" style="--pin:${color}"></span>`,

        iconSize: [26, 26],

        iconAnchor: [13, 26],

        popupAnchor: [0, -24]

    });

}


function popupHtml(place) {

    const category = CAMPUS_CATEGORIES[place.category];

    return `

        <div class="map-popup">

            <span class="map-popup-badge" style="--badge:${category.color}">
                ${category.label}
            </span>

            <h3>${place.name}</h3>

            <p>${place.description}</p>

            <a class="map-popup-link"
               href="./route.html?destination=${encodeURIComponent(place.name)}">
                Get route
            </a>

        </div>

    `;

}


// A place with a traced footprint is drawn as the building outline itself.
// Without one it falls back to a single pin.
function buildLayer(place) {

    const color = CAMPUS_CATEGORIES[place.category].color;

    if (place.footprint && place.footprint.length >= 3) {

        const polygon = L.polygon(place.footprint, {

            color: color,

            weight: 2,

            fillColor: color,

            fillOpacity: 0.35

        });

        polygon.bindTooltip(place.name, {

            permanent: true,

            direction: "center",

            className: "building-label"

        });

        return polygon;

    }

    return L.marker([place.lat, place.lng], {

        icon: pinIcon(color),

        title: place.name

    });

}


// fitBounds throws on empty bounds, so only move the camera when there is
// something left to frame.
function frame() {

    const bounds = featureLayer.getBounds();

    if (!bounds.isValid()) {
        return;
    }

    campusMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });

}


function matches(place) {

    const query = state.query.trim().toLowerCase();

    const inCategory =
        state.category === "all" || place.category === state.category;

    const inQuery =
        query === "" ||
        place.name.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query);

    return inCategory && inQuery;

}


function render({ moveCamera = true } = {}) {

    featureLayer.clearLayers();

    layersByName = {};

    const visible = CAMPUS_PLACES.filter(matches);

    visible.forEach(place => {

        const layer = buildLayer(place)
            .bindPopup(popupHtml(place))
            .addTo(featureLayer);

        layersByName[place.name] = layer;

    });

    countLabel.textContent =
        visible.length === 1 ? "1 place" : `${visible.length} places`;

    emptyState.hidden = visible.length > 0;

    if (moveCamera) {
        frame();
    }

}


function buildChips() {

    const options = [["all", "All Categories"]].concat(

        Object.entries(CAMPUS_CATEGORIES).map(
            ([key, category]) => [key, category.label]
        )

    );

    options.forEach(([key, label]) => {

        const chip = document.createElement("button");

        chip.type = "button";
        chip.className = "chip";
        chip.dataset.category = key;
        chip.textContent = label;
        chip.setAttribute("aria-pressed", String(key === "all"));

        if (key === "all") {
            chip.classList.add("is-active");
        }

        chip.addEventListener("click", () => {

            state.category = key;

            chipContainer.querySelectorAll(".chip").forEach(other => {

                const isActive = other === chip;

                other.classList.toggle("is-active", isActive);
                other.setAttribute("aria-pressed", String(isActive));

            });

            render();

        });

        chipContainer.appendChild(chip);

    });

}


function buildLegend() {

    Object.values(CAMPUS_CATEGORIES).forEach(category => {

        const item = document.createElement("li");

        item.className = "legend-item";

        const swatch = document.createElement("span");

        swatch.className = "legend-swatch";
        swatch.style.background = category.color;

        item.appendChild(swatch);
        item.appendChild(document.createTextNode(category.label));

        legendContainer.appendChild(item);

    });

}


/* COORDINATE PICKER
   The lat/lng values in campus-data.js are placeholders. Switch to satellite,
   turn this on, click a rooftop and copy the printed pair straight into the
   data file. */

function pickerPopup(latlng) {

    const pair = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;

    const wrapper = document.createElement("div");

    wrapper.className = "picker-popup";

    const code = document.createElement("code");

    code.textContent = pair;

    const copy = document.createElement("button");

    copy.type = "button";
    copy.className = "picker-copy";
    copy.textContent = "Copy";

    copy.addEventListener("click", () => {

        navigator.clipboard
            .writeText(pair)
            .then(() => { copy.textContent = "Copied"; })
            .catch(() => { copy.textContent = "Press Ctrl+C"; });

    });

    wrapper.appendChild(code);
    wrapper.appendChild(copy);

    return wrapper;

}

campusMap.on("click", event => {

    if (!state.picking) {
        return;
    }

    L.popup({ className: "picker-wrap" })
        .setLatLng(event.latlng)
        .setContent(pickerPopup(event.latlng))
        .openOn(campusMap);

});

pickButton.addEventListener("click", () => {

    state.picking = !state.picking;

    pickButton.classList.toggle("is-active", state.picking);
    pickButton.setAttribute("aria-pressed", String(state.picking));

    pickNotice.hidden = !state.picking;

    document
        .getElementById("campusMap")
        .classList.toggle("is-picking", state.picking);

});


searchInput.addEventListener("input", () => {

    state.query = searchInput.value;

    render();

});


resetButton.addEventListener("click", () => {

    state.query = "";
    state.category = "all";

    searchInput.value = "";

    chipContainer.querySelectorAll(".chip").forEach(chip => {

        const isActive = chip.dataset.category === "all";

        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", String(isActive));

    });

    render({ moveCamera: false });

    campusMap.setView(CAMPUS_CENTER, 18);

});


buildChips();
buildLegend();
render();


// Deep link: map.html?place=Library opens straight onto that marker.
const requested = new URLSearchParams(window.location.search).get("place");

if (requested && layersByName[requested]) {

    const layer = layersByName[requested];

    campusMap.setView(

        layer.getLatLng ? layer.getLatLng() : layer.getBounds().getCenter(),

        18

    );

    layer.openPopup();

}
