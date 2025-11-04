import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-9xl font-dancing-script font-bold text-blue-300">404</h1>
      <h2 className="text-4xl font-playfair font-semibold text-blue-600 mt-4">
        Oopsss! Page Introuvable
      </h2>
      <p className="text-gray-600 mt-4 text-center max-w-md">
        Cette page n'existe pas, mais la musique continue de jouer. Retournez à
        l'accueil pour retrouver vos chants préférés.
      </p>
      <Link
        to="/"
        className="mt-8 px-8 py-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors font-semibold shadow-md hover:shadow-lg"
      >
        Retour à l'Accueil
      </Link>
      <div className="absolute opacity-20">
        <span className="text-8xl text-blue-300">♪</span>
      </div>
    </div>
  )
}

export default PageNotFound



