import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader";
import ReviewForm from "../Components/ReviewForm";
import ErrorMessage from "../Components/ErrorMessage";
import { useAuth } from "../AuthContext/AuthContext";
import api from "../Api/api";
import { FiPlus, FiCheck, FiAlertCircle, FiXCircle } from "react-icons/fi";


const MovieDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://moviebackend-ice8.onrender.com/api/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      console.error("Error fetching movie:", err);
      setError("Failed to load movie details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const handleAddToWatchlist = async () => {
    if (!user) {
      setErrorMessage("Please log in to add to your watchlist.");
      return;
    }

    setAdding(true);
    setAddedMessage("");
    setErrorMessage("");

    try {
      const userId = user.id || user._id;

      await api.post(
        `/users/${userId}/watchlist`,
        { movieId: id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setAddedMessage("Movie added to your watchlist!");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message ||
        "Failed to add movie to watchlist. It might already be there."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading || authLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return <div className="text-center py-20">No movie found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 md:px-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto p-6 md:p-12 text-gray-900">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Movie Poster */}
          <div className="lg:w-1/3 flex-shrink-0">
            <img
              src={movie.posterUrl || "https://via.placeholder.com/500x750?text=No+Image"}
              alt={movie.title}
              className="w-full h-auto rounded-xl object-cover shadow-2xl"
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
              {movie.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-4">
              {Array.isArray(movie.genre) ? movie.genre.join(", ") : "Genre Unknown"} |{" "}
              {movie.releaseYear}
            </p>
            <div className="flex items-center gap-2 mb-6 text-2xl font-semibold text-yellow-500">
              <span>⭐ {movie.averageRating?.toFixed(1) || "N/A"} / 5</span>
            </div>
            <p className="mb-6 text-gray-700 leading-relaxed">{movie.synopsis}</p>

            {/* Watchlist Button & Messages */}
            {user && (
              <div className="mt-auto">
                <button
                  onClick={handleAddToWatchlist}
                  disabled={adding}
                  className={`w-full md:w-auto py-3 px-6 rounded-full font-bold text-white transition-colors duration-300 flex items-center justify-center gap-2 ${
                    adding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {adding ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5" /> Add to Watchlist
                    </>
                  )}
                </button>
                {addedMessage && (
                  <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold">
                    <FiCheck />
                    <span>{addedMessage}</span>
                  </div>
                )}
                {errorMessage && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 font-semibold">
                    <FiAlertCircle />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            )}
            {!user && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                Please{" "}
                <a href="/login" className="text-blue-600 font-semibold hover:underline">
                  log in
                </a>{" "}
                to add this movie to your watchlist.
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Reviews
          </h2>
          <ul className="space-y-6 max-h-[30rem] overflow-y-auto pr-2">
            {movie.reviews && movie.reviews.length > 0 ? (
              movie.reviews.map((rev) => (
                <li key={rev._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg text-gray-800 font-semibold">
                      {rev.user?.username || "Anonymous User"}
                    </p>
                    <p className="text-yellow-500 font-bold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                      {rev.rating}
                    </p>
                  </div>
                  <p className="text-gray-700 leading-snug">{rev.text}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center text-lg mt-6">
                No reviews yet. Be the first to review!
              </p>
            )}
          </ul>
        </div>

        {/* Review Form Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          {user ? (
            <ReviewForm movieId={id} onReviewAdded={fetchMovie} />
          ) : (
            <p className="text-center text-gray-600 text-lg">
              Please{" "}
              <a href="/login" className="text-blue-600 font-semibold hover:underline">
                log in
              </a>{" "}
              to submit a review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;