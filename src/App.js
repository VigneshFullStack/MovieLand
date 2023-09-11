import "./App.css";
import "primereact/resources/primereact.min.css"; // Core CSS
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css"; // Theme CSS
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import SearchIcon from "./search.svg";
import MovieCard from "./MovieCard";
import { Toast } from "primereact/toast";

const API_URL = "https://www.omdbapi.com?apikey=4f770783";

const mystyle = {
  color: "white",
  marginTop: "30px",
  position: "relative",
  bottom: "30px",
};

const App = () => {
  const toast = useRef(null);

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchMovies = async (title) => {
    if (title == "") {
      toast.current.show({
        severity: "error",
        summary: "Please enter movie name",
        detail: "Failed!",
        life: 3000,
      });
    } else {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();
      console.log("data : ", data);
      if (data.Response == "False") {
        toast.current.show({
          severity: "error",
          summary: "Please enter a valid movie name",
          detail: "Failed!",
          life: 3000,
        });
        setSearchTerm("");
      } else {
        setMovies(data.Search.length > 0 ? data.Search : []);
        setSearchTerm("");
      }
    }
  };

  useEffect(() => {
    searchMovies("Captain America");
  }, []);

  const searchMoviesByEnter = (e) => {
    if (e.key === "Enter") {
      if (e.target.value == "") {
        toast.current.show({
          severity: "error",
          summary: "Please enter movie name",
          detail: "Failed!",
          life: 3000,
        });
      } else {
        searchMovies(e.target.value);
        setSearchTerm("");
      }
    }
  };

  return (
    <div className="app">
      <Toast ref={toast} />
      <h1>MovieLand</h1>

      <div className="search">
        <input
          placeholder="Search for movies"
          id="searchInput"
          value={searchTerm}
          onKeyDown={searchMoviesByEnter}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {movies.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.imdbID} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found</h2>
        </div>
      )}
    </div>
  );
};

export default App;
