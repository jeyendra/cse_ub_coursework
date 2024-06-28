import React from "react";
import { useNavigate } from "react-router-dom";
import "./search.css";
import teacher from './Assets/teacher.png'
function Searchpage({onWordClick}) {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(`/${path}`);
  };

  return (
    <div>
      <h1>Search Features</h1>
      <p> Here are three ways to explore words on our site. You can search for a single word to learn more about its details, find related words within a category, or discover words based on their pronunciation.</p>
      <div className="features-grid">
        <div
          className="feature-card-search"
          onClick={() => navigateTo("searchbar")}
        >
          <h2>Search by Word</h2>
          <p>Search a word directly</p>
        </div>
        <div
          className="feature-card-search"
          onClick={() => navigateTo("categorySearch")}
        >
          <h2>Search by Category</h2>
          <p>Search based on certain Category</p>
        </div>
        <div
          className="feature-card-search"
          onClick={() => navigateTo("articulationSearch")}
        >
          <h2>Search by Articulation</h2>
          <p>Search based on different types of Articulation</p>
        </div>
      </div>
      <img src= {teacher} alt="Descriptive Alt Text" className="bottom-left-image" />
    </div>
  );
}

export default Searchpage;
