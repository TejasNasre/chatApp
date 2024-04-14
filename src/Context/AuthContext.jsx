import { createContext, useState, useEffect, useContext } from "react";
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
  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading Page....</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
