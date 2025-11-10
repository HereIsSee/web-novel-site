import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/admin";
import { useToast } from "../../context/useToast";
import styles from "./Admin.module.css";
import InputField from "../../components/FormFields/InputField";
import Button from "../../components/FormFields/Button";
import User from "../../components/User/User";
import Pagination from "../../components/Pagination/Pagination";

const PAGE_SIZE = 5;

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (pageNumber = 1) => {
    const response = await getUsers(search, pageNumber, PAGE_SIZE, false);
    setUsers(response.users);
    setTotalCount(response.totalCount);
    setPage(pageNumber);
  };

  const handleSearch = () => {
    fetchUsers(1);
  };

  const onDelete = async (userId) => {
    try {
      await deleteUser(userId);
      showToast("User deleted successfully", "success");

      const updatedTotal = totalCount - 1;
      const totalPagesAfterDelete = Math.ceil(updatedTotal / PAGE_SIZE);

      const pageToFetch =
        page > totalPagesAfterDelete ? totalPagesAfterDelete : page;

      fetchUsers(pageToFetch);
      setTotalCount(updatedTotal);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <div className="basic-search">
        <InputField
          type="text"
          styleType="search"
          placeholder="Search for username/gmail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className={styles.content}>
        {users.length > 0 ? (
          users.map((user) => (
            <User
              key={user.id}
              user={user}
              onDelete={() => onDelete(user.id)}
            />
          ))
        ) : (
          <h3>No users found</h3>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={(newPage) => fetchUsers(newPage)}
      />
    </>
  );
};

export default AdminUsers;
