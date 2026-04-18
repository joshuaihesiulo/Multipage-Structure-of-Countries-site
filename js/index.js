// ── DOM references ──
const grid       = document.getElementById("country");
const loading    = document.getElementById("loading");
const errorMsg   = document.getElementById("error-msg");
const pagination = document.getElementById("pagination");
const prevBtn    = document.getElementById("prev-btn");
const nextBtn    = document.getElementById("next-btn");
const pageInfo   = document.getElementById("page-info");
const searchInput  = document.getElementById("search-input");
const regionFilter = document.getElementById("region-filter");

// ── State ──
let total   = 0;
let allCountires= [];

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
    allCountries= data
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

    const card = document.createElement("a");
    card.href = `country.html?code=${country.cca3}`;
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

}
)}

// Loading State
function showLoading(isLoading) {
    if (isLoading) {
        loading.classList.remove("hidden");
    } else {
        loading.classList.add("hidden");
    }
}

// Show Error
function clearError() {
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
}

function showError(message) {
    errorMsg.classList.remove("hidden");
    errorMsg.textContent = message;
}


// Filters Countries by searching
function applyFilters() {
  const term   = searchInput.value.toLowerCase().trim();
  const region = regionFilter.value;

// Retrieves the country's region and checks if it matches a region and renders the data partainig only to that region.
  const filtered = allCountries.filter(country => {
    const matchesName   = country.name.common.toLowerCase().includes(term);
    const matchesRegion = region === "" || country.region === region;
    return matchesName && matchesRegion;
  });

  console.log(country.region)

  renderGrid(filtered);
}

// Activates the rendering when an input is amde on the search-bar and also when the region dropdown is changed.

searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);

document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
});