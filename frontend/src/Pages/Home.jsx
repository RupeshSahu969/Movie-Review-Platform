import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../Components/MovieCard";
import Loader from "../Components/Loader";
import ErrorMessage from "../Components/ErrorMessage";
import { FiSearch } from "react-icons/fi";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://moviebackend-ice8.onrender.com/api/movies");
        const allMovies = res.data.data || [];

        const uniqueMap = new Map();
        allMovies.forEach((movie) => {
          if (!uniqueMap.has(movie.title)) {
            uniqueMap.set(movie.title, movie);
          }
        });
        const uniqueMovies = Array.from(uniqueMap.values());

        setMovies(uniqueMovies);
        const sortedByDate = [...uniqueMovies].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setFeatured(sortedByDate.slice(0, 6));

        const sortedByRating = [...uniqueMovies].sort(
          (a, b) => b.averageRating - a.averageRating
        );
        setTrending(sortedByRating.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const genres = Array.from(new Set(movies.flatMap((m) => m.genre)));

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = search
      ? m.title.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesGenre = genre
      ? m.genre.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
      : true;
    const matchesYear = year ? m.releaseYear.toString() === year : true;
    const matchesRating = rating ? m.averageRating >= parseFloat(rating) : true;
    return matchesSearch && matchesGenre && matchesYear && matchesRating;
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mt-16">
    <section className="bg-gradient-to-r from-black to-gray-900 text-white px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Discover Your Next Favorite Movie
          </h1>
          <p className="text-lg text-gray-300">
            Explore trending, top-rated, and new releases. Search, filter, and
            dive into details.
          </p>
        </div>
      </section>
      
      <section className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            All Movies
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="flex items-center w-full md:w-1/2 border rounded px-3 py-2">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search movies..."
                className="outline-none w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="border rounded px-3 py-2"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Year"
              className="border rounded px-3 py-2 w-24"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <select
              className="border rounded px-3 py-2"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Rating</option>
              <option value="4">4+ ⭐</option>
              <option value="3">3+ ⭐</option>
              <option value="2">2+ ⭐</option>
            </select>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No movies found matching your filters.
            </p>
          )}
        </div>
      </section>

  

      {/* Featured Movies Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Featured Movies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;
