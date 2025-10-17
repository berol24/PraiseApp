import { handleLogout } from "../services/HandleLogout";
import logo_PraiseApp from "../assets/logo_praiseApp.png";
import { Link } from "react-router-dom";

function Header({navigate,user ,number_chants}) {
  return (
       <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center">
            <Link to={"/showChants"}><img
                src={logo_PraiseApp}
                alt="logo_PraiseApp"
                className="h-16 w-16 mr-3 object-contain"
              /></Link>
              <h1 className="text-xl font-bold text-gray-700 sm:hidden">
                Liste des Chants ({number_chants}) 
              </h1>
            </div>
          </div>

          <h1 className="hidden sm:block text-2xl md:text-3xl font-bold text-gray-700 text-center flex-1">
            Liste des Chants ({number_chants}) 
          </h1>
          {user?.role === "admin" && (  <Link to={"/admin"} className="flex items-center justify-center text-lg font-bold text-gray-700 bg-green-500 border-2 border-gray-600 rounded-lg w-17 h-10  sm:mx-6 cursor-pointer">
               Admin
            </Link> )}
          <div className="flex items-center justify-center border-2 border-gray-600 rounded-full w-12 h-12 sm:mx-6">
            
            <span className="text-lg font-bold text-gray-700">
              {" "}
              {user?.nom[0]}
            </span>
          </div>

          <button
            onClick={()=>handleLogout(navigate)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition w-full sm:w-auto"
          >
            Déconnexion
          </button>
        </div>
      </header>
  )
}

export default Header