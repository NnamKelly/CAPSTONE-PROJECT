const about = [
  {
    assets: "../assets/nnam.jpg",
    title: "NNAM",
    description: "Frontend developer",
  },

  {
    assets: "../assets/icon.png",
    title: "Supervisor",
    description: "Project supervisor",
  },

  {
    assets: "../assets/catuc.png",
    title: "CATUC",
    description: "Case study institution",
  },
];

const teamGrid = document.getElementById("team-grid");
about.forEach((about) => {
  const card = document.createElement("div");
  //   card.classList.add("team-grid");

  card.innerHTML = `
    <img src="${about.assets}" alt="${about.title}">
    <h2> ${about.title}</h2>
    <p> ${about.description}</p>
    `;

  teamGrid.appendChild(card);
});
