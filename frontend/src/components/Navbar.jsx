import { useState } from "react";
import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signoutFailure,
  signoutStart,
  signoutSuccess,
} from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { signout } from "../Service/AuthService";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchQuery) onSearchNote(searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = async () => {
    try {
      dispatch(signoutStart());
      const res = await signout();

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      dispatch(signoutSuccess());
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      dispatch(signoutFailure(error.response?.data?.message));
    }
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3">
        {/* Logo */}
        <Link to={"/"}>
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-[#3B82F6]">Good</span>
            <span className="text-gray-900">Notes</span>
          </h2>
        </Link>

        {/* Search Bar */}
        <div className="w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>

        {/* Profile Section */}
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;
