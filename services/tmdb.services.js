// ================== CACHE SETUP ==================
const cache = {};
const cacheTimers = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

const setCache = (key, data) => {
  cache[key] = data;

  // Clear existing timer if any
  if (cacheTimers[key]) {
    clearTimeout(cacheTimers[key]);
  }

  // Set expiration timer
  cacheTimers[key] = setTimeout(() => {
    delete cache[key];
    delete cacheTimers[key];
  }, CACHE_DURATION);
};

const getCache = (key) => {
  return cache[key];
};

// Helper sleep function for retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ================== API CONFIG ==================
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.TMDB_KEY}`, // ✅ removed trailing space
};

const imageBASEURL = "https://image.tmdb.org/t/p/original/";
const tmdbBASEURL = "https://api.themoviedb.org/3/";

// ================== ENDPOINTS ==================
export const TMDB_ENDPOINT = {
  // Discover
  fetchNowPlaying: "/movie/now_playing",
  fetchTrending: "/trending/all/week",
  fetchPopular: "/trending/all/week",
  fetchUpcoming: "/movie/upcoming?include_video=true",
  fetchTopRated: "/movie/top_rated?include_video=true",

  // Movies
  fetchActionMovies: "/discover/movie?language=en-US&with_genres=28",
  fetchComedyMovies: "/discover/movie?language=en-US&with_genres=35",
  fetchHorrorMovies: "/discover/movie?language=en-US&with_genres=27",
  fetchRomanceMovies: "/discover/movie?language=en-US&with_genres=10749",
  fetchAnimeMovies: "/discover/movie?language=en-US&with_genres=16",
  fetchMovieVideos: (id) => `/movie/${id}/videos`,
  fetchMovieDetails: (id) => `/movie/${id}`,

  // TV Shows
  fetchActionTvShows: "/discover/tv?language=en-US&with_genres=10759",
  fetchComedyTvShows: "/discover/tv?language=en-US&with_genres=35",
  fetchMysteryTvShows: "/discover/tv?language=en-US&with_genres=9648",
  fetchDramaTvShows: "/discover/tv?language=en-US&with_genres=18",
  fetchCrimeTvShows: "/discover/tv?language=en-US&with_genres=80",
  fetchTvShowVideos: (id) => `/tv/${id}/videos`,
  fetchTvShowDetails: (id) => `/tv/${id}`,
};

// ================== API WRAPPER ==================
export const tmdbApi = {
  get: async (endpoint) => {
    const cacheKey = `tmdb_${endpoint}`;

    // ✅ Check cache first
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${endpoint}`);
      return cachedData;
    }

    console.log(`Cache miss for: ${endpoint}`);

    const url = tmdbBASEURL + endpoint;
    let lastError;

    // Retry mechanism (3 attempts with backoff)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // ✅ Add timeout using AbortController
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Cache successful response
        setCache(cacheKey, data);
        console.log(`Data cached for: ${endpoint}`);

        return data;
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${attempt} failed: ${error.message}`);

        if (attempt < 3) {
          const waitTime = attempt * 100; // 100ms, 200ms
          console.log(`Waiting ${waitTime}ms before retry...`);
          await sleep(waitTime);
        }
      }
    }

    console.error(`All 3 attempts failed for ${endpoint}`);
    throw lastError;
  },
};

export { imageBASEURL, tmdbBASEURL };
