// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import CreatePact from "./pages/CreatePact";
import NotFound from "./pages/NotFound";
import PactDetails from "./pages/PactDetails";
import ParticipantPay from "./pages/ParticipantPay";
import MyPacts from "./pages/MyPacts";
import LandingPage from "./pages/LandingPage";
import { NavbarDemo } from "./components/Home Modules/NavbarDemo";
import Profile from "./pages/Profile";
import ContactsPage from "./pages/ContactsPage";


const App: React.FC = () => {
  return (
    <Router>
          <NavbarDemo />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePact />} />
            <Route path="/pact/:id" element={<PactDetails />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/pay/:pactId/:index" element={<ParticipantPay />} />
            <Route path="/my" element={<MyPacts />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
     
    </Router>
  );
};

export default App;
