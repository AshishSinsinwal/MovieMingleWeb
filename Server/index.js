require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());


app.get("/api/trending", async (req, res) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.log("no api key ");
    return res.status(500).json({ error: "Missing TMDB API key" });
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error in /api/trending:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});


app.get('/api/search/:query', async (req, res) => {
    const apiKey = process.env.API_KEY;
    const query = req.params.query;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to search movies" });
    }
});


// for movie details 
app.get('/api/movie/:id', async (req, res) => {
    const apiKey = process.env.API_KEY;
    const id = req.params.id;
    try {
        const [movie, credits, videos] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`),
            axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`),
            axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`)
        ]);
        res.json({
            movie: movie.data,
            credits: credits.data,
            videos: videos.data
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
