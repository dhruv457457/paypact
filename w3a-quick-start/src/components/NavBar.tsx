import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc", marginBottom: 20 }}>
      <Link to="/" style={{ marginRight: 12 }}>
        Home
      </Link>
      <Link to="/create" style={{ marginRight: 12 }}>
        Create Pact
      </Link>
      <Link to="/join" style={{ marginRight: 12 }}>
        Join Pact
      </Link>
      <Link to="/mypacts" style={{ marginRight: 12 }}>
  My PayPacts
</Link>

      {/* Add other links here if needed */}
    </nav>
  );
};

export default NavBar;
