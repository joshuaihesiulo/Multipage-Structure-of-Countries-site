// ── DOM references ──
const grid       = document.getElementById("country");
const loading    = document.getElementById("loading");
const errorMsg   = document.getElementById("error-msg");
const pagination = document.getElementById("pagination");
const prevBtn    = document.getElementById("prev-btn");
const nextBtn    = document.getElementById("next-btn");
const pageInfo   = document.getElementById("page-info");

// ── State ──
let total   = 0;

// ── Initialise ──
fetchList();

// ── Fetch Pokemon list ──
async function fetchList() {
  showLoading(true);
  clearError();

  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3`
    );

    if (!res.ok) throw new Error(`Failed to load list (${res.status})`);

    const data = await res.json();
    total = data.length;

    renderGrid(data);
  } catch (err) {
    showError("Could not load Pokemon list. Please check your connection.");
    console.error("[fetchList]", err.message);
  } finally {
    showLoading(false);
  }
}

// ── Render the grid of cards ──
function renderGrid(countryList) {
  grid.innerHTML = "";

  countryList.forEach(country => {
    // Extract ID from the URL — no second API call needed
    const sprite = country.flags.png;

    const card = document.createElement("div");
    card.className = [
      "bg-white rounded-xl p-4 text-center shadow-sm",
      "border border-gray-100 cursor-pointer",
      "hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    ].join(" ");

    // Use textContent for the name — never innerHTML with API data
    const img = document.createElement("img");
    img.src   = sprite;
    img.alt   = country.name.common;
    img.className = "w-20 h-20 mx-auto";

    const name = document.createElement("p");
    name.textContent = country.name.common;
    name.className = "mt-2 text-sm font-semibold capitalize text-gray-800";

    const population = document.createElement("p");
    population.textContent = country.population.toLocaleString();
    population.className = "text-xs text-gray-400";
  
    const region = document.createElement("p");
    region.textContent = country.region;
    region.className = "text-xs text-gray-400";
  
    const capital = document.createElement("p");
    capital.textContent = country.capital[0];
    capital.className = "text-xs text-gray-400";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(population);
    card.appendChild(region);
    card.appendChild(capital);
    grid.appendChild(card);

    // Clicking a card opens the modal with this Pokemon's data
}
)}

function showLoading(isLoading) {
    if (isLoading) {
        loading.classList.remove("hidden");
    } else {
        loading.classList.add("hidden");
    }
}

function clearError() {
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
}

function showError(message) {
    errorMsg.classList.remove("hidden");
    errorMsg.textContent = message;
}