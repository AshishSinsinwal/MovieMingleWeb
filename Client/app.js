// ================ CONSTANTS ================
const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://movie-mingle-app.onrender.com";

const DOM_ELEMENTS = {
  searchInput: document.getElementById('search-input'),
  searchBtn: document.getElementById('search-btn'),
  searchIcon: document.getElementById('search-icon'),
  searchResults: document.getElementById('search-results'),
  resultDiv: document.getElementById('result'),
  trendRes: document.getElementById('trend-res'),
  trendingSection: document.querySelector('.trending'),
  loading: document.getElementById('loading'),
  searchHeader: document.querySelector(".search-res h1")
};

// ================ INITIALIZATION ================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  fetchTrendingMovies();
  setupEventListeners();
}

// ================ EVENT HANDLERS ================
function setupEventListeners() {
  // Search functionality
  DOM_ELEMENTS.searchBtn.addEventListener('click', handleSearch);
  DOM_ELEMENTS.searchInput.addEventListener('keypress', handleKeyPress);
  DOM_ELEMENTS.searchIcon.addEventListener('click', handleSearchIconClick);

}

function handleKeyPress(e) {
  if (e.key === 'Enter') handleSearch();
}

function handleSearchIconClick() {
  DOM_ELEMENTS.searchInput.focus();
  DOM_ELEMENTS.searchInput.classList.add('large');
  setTimeout(() => {
    DOM_ELEMENTS.searchInput.classList.remove('large');
  }, 1000);
}

// ================ DATA FETCHING ================
async function fetchTrendingMovies() {
  try {
    const response = await axios.get(`${BASE_URL}/api/trending`);
    console.log("Trending movies:", response.data.results);
    DOM_ELEMENTS.loading.style.display = 'none';
    renderTrendingMovies(response.data.results);
  } catch (error) {
    handleTrendingMoviesError(error);
  }
}

async function fetchSearchResults(movieName) {
  try {
    const response = await axios.get(`${BASE_URL}/api/search/${movieName}`);
    console.log("Search results:", response.data.results);
    DOM_ELEMENTS.loading.style.display = 'none';
    renderSearchResults(response.data.results, movieName);
  } catch (error) {
    handleSearchError(error);
  }
}

// ================ RENDER FUNCTIONS ================
function renderTrendingMovies(movies) {
  DOM_ELEMENTS.trendRes.innerHTML = '';
  movies.forEach(movie => {
    DOM_ELEMENTS.trendRes.appendChild(createMovieCard(movie));
  });
}

function renderSearchResults(movies, searchTerm) {
  DOM_ELEMENTS.searchHeader.textContent = `Results for "${searchTerm}"`;
  DOM_ELEMENTS.resultDiv.innerHTML = '';
  
  if (movies.length === 0) {
    DOM_ELEMENTS.resultDiv.innerHTML = '<p>No movies found. Try a different search term.</p>';
    return;
  }
  
  movies.forEach(movie => {
    DOM_ELEMENTS.resultDiv.appendChild(createMovieCard(movie));
  });
}

function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = movie.id;
  
  const img = document.createElement('img');
  img.className = 'img';
  img.src = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';
  img.alt = movie.title;
  
  const info = document.createElement('div');
  info.className = 'info';
  info.innerHTML = `<h3>${movie.title}</h3>`;
  
  card.appendChild(img);
  card.appendChild(info);

  
  // ✅ Attach the event here directly for testing
  card.addEventListener('click', () => {
    console.log("Navigating to:", `index2.html?id=${movie.id}`);
    navigateToMovieDetails(movie.id);
  });

  
  return card;
}

// ================ SEARCH HANDLING ================
function handleSearch() {
  const movieName = DOM_ELEMENTS.searchInput.value.trim();
  if (!movieName) return;

  prepareSearchUI();
  
  fetchSearchResults(movieName);
}

function prepareSearchUI() {
  DOM_ELEMENTS.searchResults.style.display = "block";
  DOM_ELEMENTS.trendingSection.style.display = "none";
  DOM_ELEMENTS.resultDiv.innerHTML = '<p>Loading...</p>';
}

// ================ ERROR HANDLING ================
function handleTrendingMoviesError(error) {
  console.error("Error fetching trending movies:", error);
  setTimeout(() => {
    location.reload();
  }, 2000);
}

function handleSearchError(error) {
  console.error("Search error:", error);
  DOM_ELEMENTS.resultDiv.innerHTML = '<p>Failed to load data. Please try again.</p>';
  triggerSearchButton();
}

function triggerSearchButton() {
  if (DOM_ELEMENTS.searchBtn) {
    DOM_ELEMENTS.searchBtn.click();
  } else {
    console.error('Search button not found');
  }
}

// ================ NAVIGATION ================
function navigateToMovieDetails(movieId) {
  window.open(`index2.html?id=${movieId}`, '_blank');
}
