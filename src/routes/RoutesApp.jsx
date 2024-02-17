import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Repertoires } from "../pages/repertoires/Repertoires";
import { Login } from "../pages/login/Login";
import { PrivateRoutes } from "./PrivateRoutes";
import { Form } from "../pages/form/Form";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { RepertoireMusics } from "../pages/repertoireMusics/RepertoireMusics";
import { Music } from "../pages/music/Music";

export const RoutesApp = () => {
  const {user} = useContext(AuthContext)

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PrivateRoutes><Repertoires /></PrivateRoutes>} />
            <Route path="/repertoire/:repertoireId" element={<PrivateRoutes><RepertoireMusics /></PrivateRoutes>} />
            <Route path="/repertoire/:repertoireId/:musicId" element={<PrivateRoutes><Music /></PrivateRoutes>} />
            <Route path="/form" element={<PrivateRoutes><Form /></PrivateRoutes>} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to='/' />} />
        </Routes>
    </BrowserRouter>
  )
}
