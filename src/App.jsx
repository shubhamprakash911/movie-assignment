import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const searchMovies = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSelectedMovie(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=fcfa29f&s=${searchTerm}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getMovieDetails = async (imdbID) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=fcfa29f&i=${imdbID}&plot=full`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setSelectedMovie(data);
      } else {
        setError(data.Error);
      }
    } catch (err) {
      setError("An error occurred while fetching movie details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1>Movie Search App</h1>

        <form onSubmit={searchMovies} className="search-form">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
      </div>

      <div className="content-container">
        {!selectedMovie ? (
          <div className="movie-grid">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="movie-card"
                onClick={() => getMovieDetails(movie.imdbID)}
              >
                {movie.Poster !== "N/A" ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="movie-poster"
                  />
                ) : (
                  <div className="no-poster">No Poster Available</div>
                )}
                <div className="movie-info">
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="movie-details">
            <button
              onClick={() => setSelectedMovie(null)}
              className="back-button"
            >
              Back to Results
            </button>
            <div className="detail-content">
              <div className="detail-poster">
                {selectedMovie.Poster !== "N/A" ? (
                  <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
                ) : (
                  <div className="no-poster large">No Poster Available</div>
                )}
              </div>
              <div className="detail-info">
                <h2>
                  {selectedMovie.Title} ({selectedMovie.Year})
                </h2>
                <p>
                  <strong>Rating:</strong> {selectedMovie.Rated}
                </p>
                <p>
                  <strong>Runtime:</strong> {selectedMovie.Runtime}
                </p>
                <p>
                  <strong>Genre:</strong> {selectedMovie.Genre}
                </p>
                <p>
                  <strong>Director:</strong> {selectedMovie.Director}
                </p>
                <p>
                  <strong>Actors:</strong> {selectedMovie.Actors}
                </p>
                <p>
                  <strong>Plot:</strong> {selectedMovie.Plot}
                </p>
                <p>
                  <strong>Awards:</strong> {selectedMovie.Awards}
                </p>
                <p>
                  <strong>IMDb Rating:</strong> {selectedMovie.imdbRating}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
