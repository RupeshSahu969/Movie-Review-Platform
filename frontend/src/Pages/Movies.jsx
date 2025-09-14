import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../Components/MovieCard";
import Loader from "../Components/Loader";
import ErrorMessage from "../Components/ErrorMessage";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("https://moviebackend-ice8.onrender.com/api/movies");
        const allMovies = res.data.data || [];

        // Remove duplicate movies by _id (or title if needed)
        const uniqueMovies = Array.from(
          new Map(allMovies.map((m) => [m._id, m])).values()
        );

        setMovies(uniqueMovies);
      } catch (err) {
        console.error(err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-2 md:mb-4">
      All Movies
      </h1>
      <p className="text-center text-gray-600 mb-8 md:mb-12">
        Browse and discover a world of cinema.
      </p>
      <div className="relative max-w-lg mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for movies by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm text-gray-700 placeholder-gray-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Movie Grid Section */}
      {filteredMovies.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl md:text-2xl text-gray-500 font-semibold text-center">
            No movies found. Try a different search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;