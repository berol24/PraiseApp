import React, { useEffect, useState } from 'react'
import Header from './Header';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/FormatDate';
import { handleDeleteUser } from '../services/HandleDeleteUser';

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });
function AdminPage() {
  const [user, setUser] = useState(null);
  const [myUsers,setMyUsers] = useState([])
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    setUser(JSON.parse(storedUser));
    fetchUsers();
  }, []);

   const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setMyUsers(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des chants", err);
    }
  };



// const handleDelete = async (id) => {

//   if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

//   try {
//     const token = localStorage.getItem("token");
//     await api.delete(`/api/users/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     navigate("/admin");
//     fetchUsers();
//   } catch (err) {
//     console.error("Erreur lors de la suppression :", err);
//     alert("Erreur lors de la suppression, veuillez réessayer.");
//   }
// };



  return (<>
    <Header navigate={navigate} user={user} />
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
     <thead className="bg-blue-600">
  <tr>
    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
      N°
    </th>
    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
      Nom
    </th>
    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
      Email
    </th>
    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
      Rôle
    </th>
    <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
      Date d'inscription
    </th>
    <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
      Actions
    </th>
  </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
  {myUsers.length > 0 ? (
    myUsers.map((u, index) => (
      <tr key={u._id} className="hover:bg-gray-50 cursor-pointer">
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {index + 1}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
          <div>{u.nom}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
          <div>{u.email}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          <div>{u.role}</div>
        </td>
        <td className="px-4 py-4 text-right whitespace-nowrap text-sm text-gray-500">
          <div>{formatDate(u.date_inscription)}</div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
                  <Link
                      to={`/editUser/${u._id}`}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      modifier
                    </Link>            <button className="text-red-600 bg-red-600 text-white rounded-lg hover:text-red-900 p-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteUser(u._id,navigate,fetchUsers);
              }}
            >Supprimer</button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
        Aucun invité trouvé
      </td>
    </tr>
  )}
</tbody>


        </table>
      </div>
    </div></>
  )
}

export default AdminPage