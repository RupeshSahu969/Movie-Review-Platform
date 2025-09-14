import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import Loader from "../Components/Loader";
import ErrorMessage from "../Components/ErrorMessage";
import api from "../Api/api";

const Watchlist = () => {
  const { user, loading: authLoading } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = user?.id || user?._id;
      if (!userId) {
        setWatchlist([]);
        setLoading(false);
        return;
      }

      const { data } = await api.get(`/users/${userId}/watchlist`);
      setWatchlist(data.watchlist || data);
    } catch (err) {
      console.error(err);
      setError("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    try {
      const userId = user?.id || user?._id;
      if (!userId) return;

      await api.delete(`/users/${userId}/watchlist/${movieId}`);
      fetchWatchlist();
    } catch (err) {
      console.error(err);
      setError("Failed to remove movie");
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchWatchlist();
    }
  }, [authLoading, user]);

  if (authLoading || loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (watchlist.length === 0)
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your watchlist is empty</h2>
        <p className="mb-6 text-gray-600">Looks like you haven't added any movies yet.</p>
        <Link
          to="/movies"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
        >
          Browse Movies
        </Link>
      </div>
    );

  return (
  <div className="max-w-6xl mx-auto w-full px-4 py-6 mt-10">
    <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {watchlist.map((movie) => (
        <div key={movie._id} className="bg-white rounded shadow overflow-hidden flex flex-col">
          <Link to={`/movies/${movie._id}`}>
            <img
              src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"}
              alt={movie.title}
              className="w-full object-cover h-64"
            />
          </Link>
          <div className="p-3 flex flex-col flex-grow justify-between">
            <Link
              to={`/movies/${movie._id}`}
              className="font-semibold hover:underline mb-2"
            >
              {movie.title}
            </Link>
            <button
              onClick={() => handleRemove(movie._id)}
              className="mt-auto bg-red-600 hover:bg-red-700 text-white rounded py-2 font-semibold"
              aria-label={`Remove ${movie.title} from watchlist`}
            >
              Remove from Watchlist
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default Watchlist;
