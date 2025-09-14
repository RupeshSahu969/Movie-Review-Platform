import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition transform hover:scale-105">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Genre:</strong> {movie.genre.join(", ")}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Year:</strong> {movie.releaseYear}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Director:</strong> {movie.director}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Rating:</strong> ⭐ {movie.averageRating || 0} / 5
        </p>
        <Link
          to={`/movies/${movie._id}`}
          className="inline-block mt-3 text-blue-600 hover:underline text-sm"
        >
          View Details →
        </Link>

      </div>
    </div>
  );
};

export default MovieCard;
