import { useState } from "react";
import api from "../Api/api";

const AdminMovie = () => {
  const [form, setForm] = useState({
    title: "",
    genre: "",
    releaseYear: "",
    director: "",
    cast: "",
    synopsis: "",
    posterUrl: "",
  });
  

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      ...form,
      genre: form.genre.split(",").map((g) => g.trim()),
      cast: form.cast.split(",").map((c) => c.trim()),
      releaseYear: parseInt(form.releaseYear, 10),
    };

    try {
      await api.post("/movies", payload);
      setMessage("Movie uploaded successfully!");
      setForm({
        title: "",
        genre: "",
        releaseYear: "",
        director: "",
        cast: "",
        synopsis: "",
        posterUrl: "",
      });
    } catch (err) {
      console.error("Movie upload failed:", err);
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Upload New Movie</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Matrix"
              required
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <input
              type="text"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Action, Sci-Fi"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple genres with commas.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700">Release Year</label>
            <input
              type="number"
              name="releaseYear"
              value={form.releaseYear}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1999"
              required
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700">Director</label>
            <input
              type="text"
              name="director"
              value={form.director}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lana Wachowski"
              required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700">Cast</label>
            <input
              type="text"
              name="cast"
              value={form.cast}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Keanu Reeves, Carrie-Anne Moss"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple cast members with commas.
            </p>
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700">Poster URL</label>
            <input
              type="url"
              name="posterUrl"
              value={form.posterUrl}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
              required
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">Synopsis</label>
          <textarea
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A hacker discovers reality..."
            rows={6}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 mt-6 text-white rounded-lg hover:text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Movie"}
        </button>
      </form>
    </div>
  );
};

export default AdminMovie;
