let restaurants = [
  "Kinnera","Bhimas","Biryanis","Haveli","Rest-in",
  "Balagam","Sri Sri Sri","Gayatri","Bahubali",
  "Amoga","Sitara","Pista"
];

const resultEl = document.getElementById("result");
const sponsorResultEl = document.getElementById("sponsorResult");
const listEl = document.getElementById("restaurantList");
const emptyTextEl = document.getElementById("emptyText");
const newRestaurantInput = document.getElementById("newRestaurant");

function renderList() {
  listEl.innerHTML = "";
  emptyTextEl.style.display = restaurants.length === 0 ? "block" : "none";

  restaurants.forEach((name, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="restaurant-name">${name}</span>
      <button class="delete-btn" onclick="removeRestaurant(${index})">Remove</button>
    `;
    listEl.appendChild(li);
  });
}

function removeRestaurant(i) {
  restaurants.splice(i, 1);
  renderList();
}

function launchConfetti() {
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("div");
    c.classList.add("confetti");

    c.style.left = Math.random() * window.innerWidth + "px";
    c.style.backgroundColor = "hsl(" + Math.random() * 360 + ", 80%, 60%)";
    c.style.animationDuration = 1 + Math.random() * 1 + "s";

    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2000);
  }
}

function pickRandomRestaurant() {
  if (restaurants.length === 0) {
    alert("Add at least one restaurant!");
    return;
  }

  // Sponsor
  const sponsors = ["Ashok", "Ramakrishna", "Balu", "Sailaja"];
  const randomSponsor = sponsors[Math.floor(Math.random() * sponsors.length)];

  document.getElementById("sponsorName").textContent = randomSponsor;

  const overlay = document.getElementById("sponsorOverlay");
  overlay.style.opacity = "1";
  overlay.style.pointerEvents = "auto";

  // After 2 sec → hide sponsor overlay → show restaurant
  setTimeout(() => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";

    const randomRestaurant =
      restaurants[Math.floor(Math.random() * restaurants.length)];

    resultEl.textContent = randomRestaurant;
    sponsorResultEl.textContent = "Sponsored by: " + randomSponsor;

    resultEl.classList.remove("pop");
    void resultEl.offsetWidth;
    resultEl.classList.add("pop");

    launchConfetti();
  }, 2000);
}

function clearResult() {
  resultEl.textContent = "— Click 'Pick Restaurant' —";
  sponsorResultEl.textContent = "";
}

function addRestaurant() {
  const name = newRestaurantInput.value.trim();
  if (!name) return;
  restaurants.push(name);
  newRestaurantInput.value = "";
  renderList();
}

document.getElementById("pickBtn").addEventListener("click", pickRandomRestaurant);
document.getElementById("clearBtn").addEventListener("click", clearResult);
document.getElementById("addBtn").addEventListener("click", addRestaurant);

renderList();
