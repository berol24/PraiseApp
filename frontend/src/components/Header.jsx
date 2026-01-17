import { handleLogout } from "../services/HandleLogout";
import logo_PraiseApp from "../assets/logo_praiseApp.png";
import { Link, useNavigate } from "react-router-dom";
import { Star, Settings, LogOut } from "lucide-react";
import Button from "./common/Button";

function Header({ user, number_chants, titre }) {
  const nav = useNavigate();
  console.log("number_chants dans header", number_chants);

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4 gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <Link to={"/showChants"} className="hover:opacity-80 transition-opacity">
              {logo_PraiseApp ? (
                <img
                  src={logo_PraiseApp}
                  alt="logo_PraiseApp"
                  className="h-14 w-14 sm:h-16 sm:w-16 object-contain rounded-xl shadow-md"
                />
              ) : (
                <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-orange-500 rounded-xl font-bold text-white text-xl shadow-lg">
                  P
                </div>
              )}
            </Link>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent sm:hidden">
              {titre} {number_chants ? `(${number_chants})` : ""}
            </h1>
          </div>
        </div>

        <h1 className="hidden sm:block text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500 bg-clip-text text-transparent text-center flex-1">
          {titre} {number_chants ? `(${number_chants})` : ""}
        </h1>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end w-full sm:w-auto">
          <Button to={"/favoris"} variant="success" className="text-sm sm:text-base flex items-center gap-1">
            <Star className="w-4 h-4" />
            Favoris
          </Button>
          {user?.role === "admin" && (
            <Button to={"/admin"} variant="secondary" className="text-sm sm:text-base flex items-center gap-1">
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          )}
          <Link
            to="/profile"
            className="flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-orange-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer"
            title="Voir mon profil"
          >
            <span className="text-base sm:text-lg font-bold text-white">{user?.nom[0]?.toUpperCase()}</span>
          </Link>
          <Button variant="danger" onClick={() => handleLogout(nav)} className="text-sm sm:text-base flex items-center gap-1">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header