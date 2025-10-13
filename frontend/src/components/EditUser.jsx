import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });
function EditUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { IdUser } = useParams();

    const [form, setForm] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
    role: ""
  });

  useEffect(() => {
    async function fetchUsers() {
      if (!IdUser) return;

      setLoading(true);
      try {
        const res = await api.get(`/api/users/${IdUser}`);
        const data= res.data
        console.log(data);
        
        setForm({
          nom: data.nom || "",
          email: data.email || "",
          mot_de_passe: data.mot_de_passe || "",
          role: data.role || ""
        });

        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement de l'utilisateur");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [IdUser]);


    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
     const token = localStorage.getItem("token");

      await api.put(`/api/users/${IdUser}`, {
        ...form
      },{
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("User modifié avec succès !");
      navigate("/admin");
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12 mb-12">

            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            {loading && <p className="text-center mb-4">Chargement...</p>}

         <form action={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="sm:col-span-3">
                        <label htmlFor="nom" className="block text-sm/6 font-medium text-gray-900">Nom</label>
                        <div className="mt-2">
                            <input id="nom" type="text" name="nom" value={form.nom} onChange={(e)=>setForm({...form, nom:e.target.value})} autoComplete="given-name" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email</label>
                        <div className="mt-2">
                            <input id="email" type="text" name="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} autoComplete="family-name" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Mot de passe</label>
                        <div className="mt-2">
                            <input id="password" type="password" name="password" onChange={(e)=>setForm({...form, mot_de_passe:e.target.value})} autoComplete="password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="sm:col-span-4">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Rôle</label>
                        <div className="mt-2">
                            <select name="role" id="cars" className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <option value="admin">Volvo</option>
                                <option value="manager">Saab</option>
                                <option value="client">Mercedes</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex flex-col">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition px-4 py-2 rounded-lg flex-1 ">Enregistrer</button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 font-semibold rounded-lg flex-1 mt-6"
                    >
                        Annuler
                    </button>
                </div>
            </div>
</form>
        </div>
    )
}

export default EditUser