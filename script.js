 // Initial restaurant list
    let restaurants = [
      "Kinnera",
      "Bhimas",
      "Biryanis",
      "Haveli",
      "Rest-in",
      "Balagam",
      "Sri Sri Sri",
      "Gayatri",
      "Bahubali",
      "Amoga",
      "Sitara",
      "Pista"
    ];

    const resultEl = document.getElementById("result");
    const pickBtn = document.getElementById("pickBtn");
    const clearBtn = document.getElementById("clearBtn");
    const listEl = document.getElementById("restaurantList");
    const countEl = document.getElementById("count");
    const emptyTextEl = document.getElementById("emptyText");
    const newRestaurantInput = document.getElementById("newRestaurant");
    const addBtn = document.getElementById("addBtn");

    const sponsorOverlay = document.getElementById("sponsorOverlay");
    const sponsorNameEl = document.getElementById("sponsorName");

    function renderList() {
      listEl.innerHTML = "";

      emptyTextEl.style.display = restaurants.length === 0 ? "block" : "none";

      restaurants.forEach((name, index) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.className = "restaurant-name";
        span.textContent = name;

        const del = document.createElement("button");
        del.textContent = "Remove";
        del.className = "delete-btn";
        del.addEventListener("click", () => {
          restaurants.splice(index, 1);
          renderList();
        });

        li.appendChild(span);
        li.appendChild(del);
        listEl.appendChild(li);
      });

      countEl.textContent = restaurants.length;
    }

    function launchConfetti() {
      for (let i = 0; i < 40; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.backgroundColor =
          "hsl(" + Math.random() * 360 + ", 80%, 60%)";

        confetti.style.animationDuration = 1.5 + Math.random() * 1 + "s";

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2000);
      }
    }

    function pickRandomRestaurant() {
      if (restaurants.length === 0) {
        alert("Add at least one restaurant first!");
        return;
      }

      // Step 1: Show Sponsor Animation
      const sponsors = ["Ashok", "Ramakrishna", "Balu", "Sailaja"];
      const randomSponsor =
        sponsors[Math.floor(Math.random() * sponsors.length)];

      sponsorNameEl.textContent = randomSponsor;
      sponsorOverlay.style.opacity = "1";
      sponsorOverlay.style.pointerEvents = "auto";

      // Step 2: After animation, hide overlay and show restaurant
      setTimeout(() => {
        sponsorOverlay.style.opacity = "0";
        sponsorOverlay.style.pointerEvents = "none";

        // Now select restaurant
        const index = Math.floor(Math.random() * restaurants.length);
        const name = restaurants[index];

        resultEl.textContent = name;
        resultEl.classList.remove("pop");
        void resultEl.offsetWidth; // force reflow for animation
        resultEl.classList.add("pop");

        launchConfetti(); // Celebration
      }, 2500); // 2.5-second sponsor display
    }

    function clearResult() {
      resultEl.textContent = '— Click "Pick Restaurant" —';
      resultEl.classList.remove("pop");
    }

    function addRestaurant() {
      const name = newRestaurantInput.value.trim();
      if (!name) return;
      restaurants.push(name);
      newRestaurantInput.value = "";
      renderList();
      newRestaurantInput.focus();
    }

    // Event listeners
    pickBtn.addEventListener("click", pickRandomRestaurant);
    clearBtn.addEventListener("click", clearResult);
    addBtn.addEventListener("click", addRestaurant);

    newRestaurantInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addRestaurant();
    });

    // Initial render
    renderList();