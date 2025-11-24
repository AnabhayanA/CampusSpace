// Placeholder for now
console.log("CampusSpace loaded successfully 🚀");
// LOGIN CHECK
const njitId = localStorage.getItem("njitId");
const welcomeText = document.getElementById("welcomeText");

if (!njitId) {
  window.location.href = "index.html";
} else {
  welcomeText.textContent = `Welcome, ${njitId}!`;
}

// SECTION TOGGLING
function showSection(type) {
  document.getElementById("room-section").classList.add("hidden");
  document.getElementById("outlet-section").classList.add("hidden");

  if (type === "room") {
    document.getElementById("room-section").classList.remove("hidden");
  } else {
    document.getElementById("outlet-section").classList.remove("hidden");
    requestAnimationFrame(initMap);
  }
}

// MAP SYSTEM
let mapInitialized = false;
let map, marker;

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;

  const bounds = [[0, 0], [1000, 1500]];

  map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
  });

  L.imageOverlay("assets/njit-map.png", bounds).addTo(map);
  map.fitBounds(bounds);

  // Draggable marker pin
  marker = L.marker([500, 750], { draggable: true }).addTo(map);
  marker.bindPopup("Drag this pin to explore outlets").openPopup();

  marker.on("dragend", () => {
    console.log("Pin moved:", marker.getLatLng());
  });

  // Clickable buildings (dummy regions)
  const buildings = [
    { name: "Campus Center", bounds: [[700, 1000], [800, 1100]] },
    { name: "Central King Building", bounds: [[400, 600], [500, 700]] },
    { name: "GITC", bounds: [[200, 800], [300, 900]] },
    { name: "Library", bounds: [[600, 300], [700, 400]] },
  ];

  buildings.forEach(b => {
    const rect = L.rectangle(b.bounds, {
      color: "#b31b1b",
      weight: 2,
      fillOpacity: 0.2
    }).addTo(map);

    rect.on("click", () => highlightOutlets(b.name));
    rect.on("mouseover", () => rect.setStyle({ fillOpacity: 0.4 }));
    rect.on("mouseout", () => rect.setStyle({ fillOpacity: 0.2 }));
  });
}

// Highlight outlets by building
function highlightOutlets(buildingName) {
  const cards = document.querySelectorAll(".outlet-card");

  cards.forEach(card => {
    if (card.dataset.building === buildingName) {
      card.style.backgroundColor = "#b31b1b";
      card.style.color = "white";
    } else {
      card.style.backgroundColor = "#f4f4f4";
      card.style.color = "#222";
    }
  });
}
