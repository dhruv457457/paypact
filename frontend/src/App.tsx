// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import CreatePact from "./pages/CreatePact";
import NotFound from "./pages/NotFound";
import PactDetails from "./pages/PactDetails";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ParticipantPay from "./pages/ParticipantPay";
import MyPacts from "./pages/MyPacts";
import LandingPage from "./pages/LandingPage";
import { NavbarDemo } from "./components/Home Modules/NavbarDemo";
import { cn } from "./lib/utils";

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative w-full items-center justify-cente bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(rgba(212,212,212,0.2)_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(rgba(64,64,64,0.6)_1px,transparent_1px)]"
          )}
        />

        <div className="relative z-10">
          <NavbarDemo />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePact />} />
            <Route path="/pact/:id" element={<PactDetails />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/pay/:pactId/:index" element={<ParticipantPay />} />
            <Route path="/my" element={<MyPacts />} />
            <Route path="/home" element={<LandingPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
