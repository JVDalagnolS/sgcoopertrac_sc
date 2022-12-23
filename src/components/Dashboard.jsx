import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Route, Routes, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CadCliente from "./Clientes/CadCliente";
import Navbar from "./Navbar";
import PgrDiaria from "./ProgramacaoDiaria/PgrDiaria";
import Cotacao from "./Cotacao/Cotacao";
import CadVeiculo from "./Veiculos/CadVeiculos";
import CadMotorista from "./Motoristas/CadMotorista";
import { collection, getDocs, query, where } from "firebase/firestore";
// import CadUsuarios from "./Usuarios/CadUsuarios";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [nome, setNome] = useState("");

  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "usuarios"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setNome(data.nome);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return (
    <div className="dashboard">
      <Navbar nome={nome}/>
      <Routes>
        <Route exact path="/programacaodiaria" element={<PgrDiaria />}/>
        <Route exact path="/cotacao" element={<Cotacao />}/>
        <Route exact path="/veiculos" element={<CadVeiculo />}/>
        <Route exact path="/motoristas" element={<CadMotorista />}/>
        <Route exact path="/clientes" element={<CadCliente />}/>
        {/* <Route exact path="/usuarios" element={<CadUsuarios />}/> */}
      </Routes>
    </div>
  );
}

export default Dashboard;
