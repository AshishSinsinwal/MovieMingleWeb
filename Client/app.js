


// const BASE_URL = "http://localhost:5000";


// // DOM Elements
// const searchInput = document.getElementById('search-input');
// const searchBtn = document.getElementById('search-btn');
// const searchIcon = document.getElementById('search-icon');
// const searchResults = document.getElementById('search-results');
// const resultDiv = document.getElementById('result');
// const trendRes = document.getElementById('trend-res');
// const trendingSection = document.querySelector('.trending');

// // Initialize the app
// document.addEventListener('DOMContentLoaded', () => {
//   getTrendingMovies();
//   setupEventListeners();
// });

// // Event Listeners
// function setupEventListeners() {
//   // Search button click
//   searchBtn.addEventListener('click', handleSearch);
  
//   // Enter key in search input
//   searchInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   });
  
//   // Search icon click - focuses on search input
//   searchIcon.addEventListener('click', () => {
//     searchInput.focus();
//     searchInput.classList.add('large');
//     setTimeout(() => {
//       searchInput.classList.remove('large');
//     }, 1000);
//   });
  
//   // Movie card clicks
//   trendRes.addEventListener('click', (event) => {
//     const movieDiv = event.target.closest('.card');
//     if (movieDiv) {
//       moveToMovie(movieDiv.id);
//     }
//   });
  
//   resultDiv.addEventListener('click', (event) => {
//     const movieDiv = event.target.closest('.card');
//     if (movieDiv) {
//       moveToMovie(movieDiv.id);
//     }
//   });
// }

// // Fetch trending movies
// async function getTrendingMovies() {
//   try {
//     const res = await axios.get(`${BASE_URL}/api/trending`);
//     console.log("Trending movies:", res.data.results); // for debug
//     document.getElementById('loading').style.display = 'none';
//     showTrendingMovies(res.data.results); // ✅ use .results
//   } catch (err) {
//     console.error("Error fetching trending movies:", err);
//     // trendRes.innerHTML = '<p>Connecting to Server.</p>';
//     setTimeout(()=>{
//       location.href = location.href;
//     } , 2000);
    
// }
// }

// // Display trending movies

// function showTrendingMovies(movies) {
//   trendRes.innerHTML = ''; // Clear previous results
  
//   movies.forEach(movie => {
//     const div = document.createElement('div');
//     div.className = 'card';
//     div.id = movie.id;
    
//     const img = document.createElement('img');
//     img.className = 'img';
//     img.src = movie.poster_path 
//       ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
//       : 'https://via.placeholder.com/200x300?text=No+Image';
//     img.alt = movie.title;
    
//     const info = document.createElement('div');
//     info.className = 'info';
//     info.innerHTML = `
//       <h3>${movie.title}</h3>
//     `;
    
//     div.appendChild(img);
//     div.appendChild(info);
//     trendRes.appendChild(div);
//   });
// }

// // Handle search
// async function handleSearch() {
//   const movieName = searchInput.value.trim();
//   if (!movieName) return;

//   searchResults.style.display = "block";
//   trendingSection.style.display = "none";
//   resultDiv.innerHTML = '<p>Loading...</p>';

//   try {
//     const res = await axios.get(`${BASE_URL}/api/search/${movieName}`);
//     console.log("Search results:", res.data.results); // for debug
//     document.getElementById('loading').style.display = 'none';
//     displaySearchResults(res.data.results, movieName); // ✅ use .results
//   } catch (err) {
//     console.error("Search error:", err);
//     resultDiv.innerHTML = '<p>Failed to load data. Please click on Search Again.</p>';
//     triggerButtonClick();

    
//   }
// }


// // Display search results
// function displaySearchResults(movies, searchTerm) {
//   const h1 = document.querySelector(".search-res h1");
//   h1.textContent = `Results for "${searchTerm}"`;
  
//   if (movies.length === 0) {
//     resultDiv.innerHTML = '<p>No movies found. Try a different search term.</p>';
//     return;
//   }
  
//   resultDiv.innerHTML = ''; // Clear previous results
  
//   movies.forEach(movie => {
//     const div = document.createElement('div');
//     div.className = 'card';
//     div.id = movie.id;
    
//     const img = document.createElement('img');
//     img.className = 'img';
//     img.src = movie.poster_path 
//       ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
//       : 'https://via.placeholder.com/200x300?text=No+Image';
//     img.alt = movie.title;
    
//     const info = document.createElement('div');
//     info.className = 'info';
//     info.innerHTML = `
//       <h3>${movie.title}</h3>
//     `;
    
//     div.appendChild(img);
//     div.appendChild(info);
//     resultDiv.appendChild(div);
//   });
// }

// function triggerButtonClick() {
//   const button = document.getElementById("search-btn");
//   if (button) {
//     button.click();
//   } else {
//     console.error('Button not found');
//   }
// }


// // Navigate to movie details page
// function moveToMovie(id) {
//   window.location.href = `index2.html?id=${id}`;
// }



// ================ CONSTANTS ================
const BASE_URL = "http://localhost:5000";
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
  
  // Movie card interactions
  DOM_ELEMENTS.trendRes.addEventListener('click', handleMovieCardClick);
  DOM_ELEMENTS.resultDiv.addEventListener('click', handleMovieCardClick);
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

function handleMovieCardClick(event) {
  const movieDiv = event.target.closest('.card');
  if (movieDiv) navigateToMovieDetails(movieDiv.id);
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