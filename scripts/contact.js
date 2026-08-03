// Contact Form
const form = document.getElementById("contactForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  message.style.color = "green";
  message.textContent = "Your message has been sent successfully.";

  form.reset();
});

// FAQ Accordion
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.classList.toggle("active");
  });
});

// Leaflet Map
const contactMap = L.map("contactMap").setView([5.9246, 10.1074], 17);

L.tileLayer("", {
  attribution: "© OpenStreetMap",
}).addTo(contactMap);

L.marker([5.9246, 10.1074])
  .addTo(contactMap)
  .bindPopup("CATUC Bamenda")
  .openPopup();
