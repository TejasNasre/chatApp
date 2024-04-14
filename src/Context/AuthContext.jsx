import { createContext, useState, useEffect, useContext } from "react";
import "./Loading.css"
import { ID } from "appwrite";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { account } from "../appWriteConfig";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
    getUserOnLaod();
  }, []);

  const getUserOnLaod = async () => {
    try {
      const accountDetails = await account.get();
      // console.log(accountDetails);
      setUser(accountDetails);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, creditials) => {
    e.preventDefault();
    try {
      const response = await account.createEmailPasswordSession(
        creditials.email,
        creditials.password
      );
      // console.log(response);
      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserRegister = async (e, creditials) => {
    e.preventDefault();

    if (creditials.password1 !== creditials.password2) {
      toast.error("Password Do Not Match!");
      return;
    }

    try {
      const response = await account.create(
        ID.unique(),
        creditials.email,
        creditials.password1,
        creditials.name
      );
      await account.createEmailPasswordSession(
        creditials.email,
        creditials.password1
      );
      const accountDetails = await account.get();
      setUser(accountDetails);
      toast.success("Successfully Register!");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p className="loader"></p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
