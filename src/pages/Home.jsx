import React from "react";
import ImageSlider from "../components/ImageSlider";
import ServicesSection from "../components/ServicesSection";
import BranchesSection from "../components/BranchesSection";
import "./Home.css";

function Home({ onNavigate }) {
  return (
    <div id="home" className="home-container">
      <ImageSlider />
      <ServicesSection onNavigate={onNavigate} />
      <BranchesSection onNavigate={onNavigate} />
    </div>
  );
}

export default Home;
