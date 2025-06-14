
// Constants
const BASE_URL = "http://localhost:5000";
const MAX_CAST_MEMBERS = 10;
const MAX_TRAILERS = 3;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/500x750?text=No+Poster+Available';

// DOM Elements
const elements = {
  loading: document.getElementById('loading'),
  movieContent: document.getElementById('movie-content'),
  movieImg: document.querySelector("#movie-img img"),
  movieDet: document.getElementById("movie-det"),
  ratingValue: document.getElementById("rating-value"),
  castList: document.getElementById("cast-list"),
  trailersContainer: document.getElementById("trailers")
};

// Main Initialization
document.addEventListener('DOMContentLoaded', initMoviePage);

async function initMoviePage() {
  try {
    const movieId = getMovieIdFromURL();
    
    if (!movieId) {
      showError("No movie ID provided");
      return;
    }
    
    await fetchAndRenderMovieDetails(movieId);
  } catch (error) {
    handleInitializationError(error);
  }
}

// URL Handling
function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Data Fetching
async function fetchAndRenderMovieDetails(movieId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/movie/${movieId}`);
    const { movie, credits, videos } = response.data;
    
    renderAllMovieData(movie, credits, videos);
    toggleLoadingState(false);
  } catch (err) {
    handleFetchError(err);
  }
}

// Rendering Functions
function renderAllMovieData(movie, credits, videos) {
  renderMovieDetails(movie);
  renderCast(credits.cast);
  renderTrailers(videos.results);
}

function renderMovieDetails(movie) {
  // Set movie poster
  elements.movieImg.src = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : PLACEHOLDER_IMAGE;
  elements.movieImg.alt = movie.title;
  
  // Set rating
  elements.ratingValue.textContent = movie.vote_average.toFixed(1);
  
  // Create details HTML
  elements.movieDet.innerHTML = createMovieDetailsHTML(movie);
}

function createMovieDetailsHTML(movie) {
  const runtimeStr = formatRuntime(movie.runtime);
  const releaseYear = movie.release_date.slice(0, 4);
  const genres = movie.genres.map(g => g.name).join(", ");
  
  return `
    <h1>${movie.title} <span class="release-year">(${releaseYear})</span></h1>
    <div class="movie-meta">
      <span>${movie.release_date}</span> •
      <span>${runtimeStr}</span> •
      <span>${genres}</span>
    </div>
    
    <div class="movie-overview">
      <h3>Overview</h3>
      <p>${movie.overview || "No overview available."}</p>
    </div>
    
    ${movie.homepage ? createHomepageLink(movie.homepage) : ''}
  `;
}

function renderCast(cast) {
  elements.castList.innerHTML = '';
  
  if (!cast || cast.length === 0) {
    elements.castList.innerHTML = '<li>No cast information available</li>';
    return;
  }
  
  const topCast = cast.slice(0, MAX_CAST_MEMBERS);
  topCast.forEach(actor => {
    elements.castList.appendChild(createCastMemberElement(actor));
  });
}

function createCastMemberElement(actor) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${actor.name}</strong>
    <div class="character">${actor.character || 'Unknown role'}</div>
  `;
  return li;
}

function renderTrailers(videos) {
  elements.trailersContainer.innerHTML = '';
  
  const trailers = filterTrailers(videos);
  
  if (trailers.length === 0) {
    elements.trailersContainer.innerHTML = '<p>No trailers available</p>';
    return;
  }
  
  trailers.slice(0, MAX_TRAILERS).forEach(trailer => {
    elements.trailersContainer.appendChild(createTrailerIframe(trailer));
  });
}

// Helper Functions
function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function createHomepageLink(url) {
  return `<a href="${url}" target="_blank" rel="noopener">
    <i class="fas fa-external-link-alt"></i> Official Website
  </a>`;
}

function filterTrailers(videos) {
  return videos.filter(v => 
    (v.type === "Trailer" || v.type === "Teaser") && 
    v.site === "YouTube"
  );
}

function createTrailerIframe(trailer) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";
  iframe.title = trailer.name;
  return iframe;
}

function toggleLoadingState(isLoading) {
  elements.loading.style.display = isLoading ? 'block' : 'none';
  elements.movieContent.style.display = isLoading ? 'none' : 'block';
}

// Error Handling
function handleInitializationError(error) {
  showError("Failed to load movie details");
  console.error("Initialization Error:", error);
}

function handleFetchError(error) {
  console.error("Failed to load movie details", error);
  location.href = location.href; // Refresh to reconnect to API
}

function showError(message) {
  elements.loading.innerHTML = `<div class="error-message">${message}</div>`;
  elements.loading.style.color = 'red';
}