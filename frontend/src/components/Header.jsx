import { handleLogout } from "../services/HandleLogout";
import logo_PraiseApp from "../assets/logo_praiseApp.png";
import { Link, useNavigate } from "react-router-dom";
import Button from "./common/Button";

function Header({ user, number_chants, titre }) {
  const nav = useNavigate();
  console.log("number_chants dans header", number_chants);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center">
              <Link to={"/showChants"}>
                {logo_PraiseApp ? (
                  <img
                    src={logo_PraiseApp}
                    alt="logo_PraiseApp"
                    className="h-16 w-16 mr-3 object-contain"
                  />
                ) : (
                  <span className="h-16 w-16 mr-3 flex items-center justify-center bg-gray-200 rounded-full font-bold text-lg">P</span>
                )}
              </Link>
              <h1 className="text-xl font-bold text-gray-700 sm:hidden">
                {titre} {number_chants ? number_chants : ""}
              </h1>
            </div>
          </div>

          <h1 className="hidden sm:block text-2xl md:text-3xl font-bold text-gray-700 text-center flex-1">
            {titre} {number_chants ? (number_chants) : ""}
          </h1>
          <Button to={"/favoris"} variant="secondary" className="sm:mx-4">
            Favoris
          </Button>
          {user?.role === "admin" && (
            <Button to={"/admin"} variant="secondary" className="sm:mx-4">
              Admin
            </Button>
          )}
          <div className="flex items-center justify-center border-2 border-gray-600 rounded-full w-12 h-12 sm:mx-6">
            <span className="text-lg font-bold text-gray-700">{user?.nom[0]}</span>
          </div>

          <Button variant="danger" onClick={() => handleLogout(nav)}>
            Déconnexion
          </Button>
        </div>
      </header>
  )
}

export default Header