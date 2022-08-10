import { Link } from "react-router-dom";

const NotfoundPage = () => {
  return (
    <div className="mx-10 my-3 px-2 py-2 text-2xl">
      This page doesn't exist. Go{" "}
      <Link to="/" className="text-blue-400">
        home
      </Link>
    </div>
  );
};

export { NotfoundPage };
