import "./index.css";
import RouteRoutes from './config/routerconfig/index.jsx';
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/useUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading/Loading";
import Cookies from "js-cookie";

function App() {
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const [isLoading, setIsLoading] = useState(false);  
  const getUser = async () => {
    try {
      setIsLoading(true); // Zapros ketayotgani belgilanadi
      const response = await api.get("auth/profile");

      if (response?.status === 200) {
        setUser(response?.data?.data);
      } else {
        localStorage.removeItem("tokenWall");
        navigate("/");
      }
    } catch (error) {
      localStorage.removeItem("tokenWall");
      navigate("/");
    } finally {
      setIsLoading(false); // Zapros tugagandan keyin yuklanish tugaydi
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
    } else {
      navigate("/");
    }
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
     <RouteRoutes/>
     <ToastContainer />
    </>
  );
}

export default App;
