import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  const { user } = useAuth();
  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <Navbar user={user} />

        <main className="mb-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
};

export { Layout };
