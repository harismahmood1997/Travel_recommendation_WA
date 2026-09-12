const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const conditionInput = document.getElementById('conditionInput');
const resultsContainer = document.getElementById('results');
const heroContent = document.getElementById('heroContent');

btnSearch.addEventListener('click', searchRecommendations);
btnClear.addEventListener('click', clearResults);

function searchRecommendations() {
  const query = conditionInput.value.toLowerCase().trim();
  resultsContainer.innerHTML = '';

  if (!query) {
    resultsContainer.innerHTML = '<p style="color:white; font-size: 18px;">Please enter a keyword.</p>';
    return;
  }

  fetch('travel_Recommendation_api.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      let results = [];

      if (query === 'beach' || query === 'beaches') {
        results = data.beaches || [];
      } else if (query === 'temple' || query === 'temples') {
        results = data.temples || [];
      } else {
        const matchedCountry = data.countries ? data.countries.find(
          country => country.name.toLowerCase() === query || country.name.toLowerCase().includes(query)
        ) : null;

        if (matchedCountry) {
          results = matchedCountry.cities || [];
        }
      }

      displayResults(results);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function displayResults(items) {
  if (!items || items.length === 0) {
    resultsContainer.innerHTML = '<p style="color:white; font-size: 18px;">No matching destinations found.</p>';
    return;
  }

  // Hide default hero text to fit results grid
  if (heroContent) heroContent.style.display = 'none';

  let html = `<h2 class="results-heading">Search Results</h2>`;
  html += `<div class="card-grid">`;

  items.slice(0, 2).forEach(item => {
    html += `
      <div class="card">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <button class="btn-visit">Visit</button>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  resultsContainer.innerHTML = html;
}

function clearResults() {
  conditionInput.value = '';
  resultsContainer.innerHTML = '';
  // Restore default hero text on clear
  if (heroContent) heroContent.style.display = 'block';
}