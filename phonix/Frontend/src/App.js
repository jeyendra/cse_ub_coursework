import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import IncludeExclude from "./Include_exclude";
import MinimalPair from "./minimal_maximal_len";
import SearchBar from "./SearchBar";
import WordDetails from "./WordDetails";
import MinimalCat from "./minimal_category";
import CategorySearch from "./Search_category";
import Searchpage from "./searchpage";
import ArticulationSearch from "./Search_articulation";
import About from "./About";
import Home from "./Home";
import DisplayStats from "./statistics";
import Position from "./Position";
import MinimalPairWord from "./minimal_maximal_word";
import ConsonantPattern from "./ConsonantPattern";
import ConsonantCluster from "./ConsonantCluster";
import CategoryList from "./categoryList";
import "./App.css";
import SearchHandler from "./SearchHandler";
import logo from "./Assets/Logo.jpg";

function App() {
  const [wordDetails, setWordDetails] = useState(null);
  const [selectedWord, setSelectedWord] = useState("");

  const handleWordClick = (word) => {
    setSelectedWord(String(word));
  };

  const handleSearch = (word) => {
    setWordDetails(word);
    setSelectedWord(word);
  };
  useEffect(() => {
    const handleResize = () => {
      // You can perform actions here when the window is resized
      console.log('Window resized');
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <img src={logo} alt="Logo" className="logo-class" />
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Home</span>
          </NavLink>
          {/* <NavLink
            to="/searchbar"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Search Word</span>
          </NavLink> */}

          <NavLink
            to="/searchpage"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Search</span>
          </NavLink>


          {/* <NavLink
            to="/categorySearch"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Category Search</span>
          </NavLink>

          <NavLink
            to="/articulationSearch"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Articulation Search</span>
          </NavLink> */}

          <NavLink
            to="/includeExclude"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Include/Exclude Phonemes</span>
          </NavLink>
          <NavLink
            to="/position"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Set Position</span>
          </NavLink>
          <NavLink
            to="/minimalPair"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Minimal/Maximal pairs - Length</span>
          </NavLink>

          <NavLink
            to="/minimalPairWord"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Minimal/Maximal pairs - Words</span>
          </NavLink>
          <NavLink
            to="/minimalCat"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Minimal pairs - Category</span>
          </NavLink>
          <NavLink
            to="/ConsonantPattern"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Consonant Pattern</span>
          </NavLink>  
          <NavLink
            to="/ConsonantCluster"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Consonant Cluster</span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>About</span>
          </NavLink>
          <NavLink
            to="/statistics"
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >
            <span>Statistics</span>
          </NavLink>
          
          <NavLink
            to="/categoryList"  // Ensure the path matches the one used in <Route>
            className={({ isActive }) => `nav-link ${isActive ? "activeLink" : ""}`}
            onClick={() => setWordDetails(null)}
          >

          </NavLink>
          <SearchHandler
            wordDetails={wordDetails}
            setWordDetails={setWordDetails}
          />
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home onSearch={handleSearch} />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/includeExclude"
              element={
                <IncludeExclude
                  onWordClick={handleWordClick}
                  selectedWord={selectedWord}
                />
              }
            />

            <Route path="/searchpage" element={<Searchpage onWordClick={handleWordClick}/>} />
  
            <Route path="/categorySearch" element={<CategorySearch   onWordClick={handleWordClick}/>} />
            <Route
              path="/articulationSearch"
              element={<ArticulationSearch onWordClick={handleWordClick}/>}
            />
             <Route
              path="/ConsonantPattern"
              element={<ConsonantPattern onWordClick={handleWordClick}/>}
            />
            <Route
              path="/ConsonantCluster"
              element={<ConsonantCluster onWordClick={handleWordClick}/>}
            />
            <Route
              path="/minimalPair"
              element={<MinimalPair onWordClick={handleWordClick} />}
            />
            <Route
              path="/minimalPairWord"
              element={<MinimalPairWord onWordClick={handleWordClick} />}
            />
            <Route
              path="/minimalCat"
              element={<MinimalCat onWordClick={handleWordClick} />}
            />
            <Route
              path="/categoryList"
              element={<CategoryList />}
            />
            <Route
              path="/position"
              element={<Position onWordClick={handleWordClick} />}
            />
            <Route path="/statistics" element={<DisplayStats />} />
            <Route
              path="/searchbar"
              element={
                <>
                  <SearchBar
                    initialSearchTerm={selectedWord}
                    setWordDetails={setWordDetails}
                  />
                  {wordDetails && <WordDetails wordDetails={wordDetails} />}
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
