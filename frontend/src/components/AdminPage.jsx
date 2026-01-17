import React, { useEffect, useState } from "react";
import { Users, Search, Edit, Trash2, Filter } from "lucide-react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/FormatDate";
import { handleDeleteUser } from "../services/HandleDeleteUser";
import api from "../services/api";
import ConfirmModal from "./common/ConfirmModal";

function AdminPage() {
  const [user, setUser] = useState(null);
  const [myUsers, setMyUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    setUser(JSON.parse(storedUser));
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setMyUsers(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des chants", err);
    }
  };

  //  Filtrage automatique à chaque saisie et par rôle
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let filtered = myUsers.filter(
      (user) =>
        user.nom?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
    );
    
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, myUsers, roleFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-yellow-50">
      <Header navigate={navigate} user={user} titre="Gestion des utilisateurs"/>
      
      <main className="container mx-auto p-6 sm:p-8 md:p-10 max-w-7xl">
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-800">{myUsers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-800">{myUsers.filter(u => u.role === "admin").length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Managers</p>
                <p className="text-2xl font-bold text-gray-800">{myUsers.filter(u => u.role === "manager").length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-gray-800">{myUsers.filter(u => u.role === "client").length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Barre de recherche et filtres */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un utilisateur..."
                  className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 pl-12 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all bg-white shadow-md"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl py-3 px-4 text-base text-gray-800 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all bg-white shadow-md"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="client">Client</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-800 via-blue-700 to-orange-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    N°
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, index) => (
                    <tr key={u._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{u.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                        {formatDate(u.date_inscription)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/editUser/${u._id}`}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </Link>
                          <button
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteModal({ isOpen: true, userId: u._id, userName: u.nom });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center"
                    >
                      <div className="text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-lg font-semibold">Aucun utilisateur trouvé</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: "" })}
        onConfirm={() => {
          if (deleteModal.userId) {
            handleDeleteUser(deleteModal.userId, navigate, fetchUsers);
          }
        }}
        title="Supprimer l'utilisateur"
        message={`Voulez-vous vraiment supprimer l'utilisateur "${deleteModal.userName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}

export default AdminPage;
