import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { signout } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();

    signout(() => navigate("/", { replace: true }));
  };

  return (
    <div className="my-3 flex max-w-2xl mx-auto shadow border-b">
      <div className="px-8 py-8">
        <div className="font-thin text-2xl tracking wider">
          Are you sure you want to log out?
        </div>

        <form onSubmit={handleSubmit}>
          <div className="items-center justify-center h-14 w-full my-2 space-x-4 pt-4">
            <button className="rounded text-white font-semibold bg-slate-600 hover:bg-slate-700 py-2 px-6">
              Logout
            </button>
            <Link
              to="/"
              className="rounded text-white font-semibold bg-zinc-500 hover:bg-zinc-700 py-2 px-6"
            >
              Go Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export { LogoutPage };
