import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-4">Sorry, the page you’re looking for doesn’t exist.</p>
      <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
