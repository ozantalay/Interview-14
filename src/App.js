import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  return <Pagination />;
}

const Pagination = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://randomuser.me/api?results=19');
        const data = await response.data;

        const cleanedUsers = data.results.map(user => ({
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          age: user.dob.age
        }));
        setUsers(cleanedUsers);
        setLoading(false);
      } catch (error) {
        setError("Veri çekilirken hata meydana geldi", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      
      <Pages content={users} itemsPerPage={5} />
    </div>
  );
};

const Pages = ({ content, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(content.length / itemsPerPage);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = content.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="user-table">
        <div className="user-table-header flex justify-between gap-x font-bold mb-4">
          <span>İsim</span>
          <span>Yaş</span>
          <span>Email</span>
        </div>
        <ul>
          {currentUsers.map((user, index) => (
            <li key={index} className="user-row flex justify-between gap-x-20 mb-4 px-5">
              <span>{user.name}</span>
              <span>{user.age}</span>
              <span>{user.email}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pagination mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className="px-3 py-1 text-blue-700"
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
