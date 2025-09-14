import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import api from "../Api/api";
import Loader from "../Components/Loader";
import ErrorMessage from "../Components/ErrorMessage";

const Profile = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(location.state?.edit || false);
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (location.state?.edit) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userId = user._id || user.id;
        const { data } = await api.get(`/users/${userId}`);

        setProfile(data);
        setUsername(data.username);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchWatchlist = async () => {
      try {
        const userId = user._id || user.id;
        const { data } = await api.get(`/users/${userId}/watchlist`);
        setWatchlist(data);
      } catch (err) {
        console.error("Watchlist fetch error:", err);
        setError("Failed to load watchlist.");
      }
    };

    fetchWatchlist();
  }, [authLoading, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const userId = user._id || user.id;
      const { data } = await api.put(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = data.user || data;
      setProfile(updatedUser);
      setUsername(updatedUser.username);
      setEditMode(false);
      setPreviewImage(null);
      setProfilePicture(null);
      console.log("Profile updated:", updatedUser);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) return <Loader />;
  if (!user) return <ErrorMessage message="User not logged in." />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <ErrorMessage message="Profile not found." />;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-10">
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row bg-white shadow rounded p-6 items-center md:items-start gap-6">
        <img
          src={previewImage || profile.profilePicture || "/default-avatar.png"}
          alt={profile.username}
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
        />

        <div className="flex-1">
          {!editMode ? (
            <>
              <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {profile.email}
              </p>
              <p className="text-gray-600">
                <strong>Joined:</strong> {new Date(profile.joinDate).toLocaleDateString()}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-3 w-full">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Username"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  {updating ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setPreviewImage(null);
                    setProfilePicture(null);
                    setUsername(profile.username);
                    setError("");
                    setMessage("");
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Your Reviews</h2>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 bg-gray-50 rounded shadow hover:shadow-lg transition-shadow"
              >
                <strong>{rev.movie?.title || "Unknown Movie"}</strong>
                <p className="mt-1 text-yellow-500">⭐ {rev.rating}</p>
                <p className="mt-2 text-gray-700">{rev.reviewText || rev.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have not submitted any reviews yet.</p>
        )}
      </div>

      {watchlist.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Your Watchlist</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {watchlist.map((movie) => (
              <div key={movie._id} className="bg-white rounded shadow p-2 hover:shadow-lg transition">
                <a href={`/movies/${movie._id}`}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="rounded w-full h-40 object-cover"
                  />
                  <p className="mt-1 text-center text-sm font-medium text-gray-800">
                    {movie.title}
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
