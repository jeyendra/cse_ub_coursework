import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(`/${path}`);
  };
  return (
      <div className="about-section">
        <h1>PhoniX</h1>
        <div className="introduction">
          <p>
            Our application is a one-stop destination designed to explore and
            understand the intricacies of word pronunciation. Whether you're a
            language learner, an educator, or just someone curious about
            phonetics, Phonix aims to make the exploration of language sounds
            engaging and accessible.
          </p>
        </div>

        <div className="features-grid">
          <button1
            className="feature-card-search"
            onClick={() => navigateTo("Searchpage")}
          >
              <h2>Search Features</h2>
              <p class="para">
                Curious about searching for a word or words based on Category or Articulation? Use the Search Features.
                Explore and understand the phonetic
                details such as Place of Articulation, Voice, and Manner.
            </p>
          </button1>
          <button1
            className="feature-card-search"
            onClick={() => navigateTo("includeExclude")}
          >
            <h2>Include/Exclude Phonemes</h2>
            <p class="para">
              Dive into phonetics with our Include/Exclude Phoneme search that lets you
              filter and explore words based on specific phonetic criteria.
              Custom tailor your search and explore words that match your
              criteria.
            </p>
          </button1>

          <button1
            className="feature-card-search"
            onClick={() => navigateTo("Position")}
          >
            <h2>Set Position</h2>
            <p class="para">
              Explore words based on the position of specific phonemes with the Position feature. Select the initial, middle, or
              final phoneme and find words that match your selection. This tool
              helps you understand how the placement of sounds can influence
              word formation and pronunciation.
            </p>
          </button1>

          <button1
            className="feature-card-minmax"
            onClick={() => navigateTo("minimalPair")}
          >
            <h2>Minimal/Maximal pairs- Length</h2>
            <p class="para">
              Discover the beauty of language sounds with Minimal/Maximal pairs search with a certain
              phonetical length. Find words that have slight phonetic
              differences, offering a unique perspective on how sounds can
              change word meanings.
            </p>
          </button1>

          <button1
            className="feature-card-minmax"
            onClick={() => navigateTo("minimalPairWord")}
          >
            <h2>Minimal/Maximal pairs - Word</h2>
            <p class="para">
              Engage with language through Minimal/Maximal pair search based on Word.
              Discover pairs of words where the difference of one phoneme
              changes the meaning, offering a deeper insight into the nuances of
              language sounds and their impact on word meanings.
            </p>
          </button1>

          <button1
            className="feature-card-minmax"
            onClick={() => navigateTo("MinimalCat")}
          >
            <h2>Minimal pairs - Category</h2>
            <p class="para">
              The Minimal Category feature allows you to find
              minimal pairs in different phonetic categories. It's a fun and
              engaging way to explore similarities in pronunciation.
            </p>
          </button1>
          <button1
            className="feature-card-conso"
            onClick={() => navigateTo("ConsonantPattern")}
          >
            <h2>Consonant Pattern</h2>
            <p class="para">
              Explore the intricate patterns of consonants with our Consonant Pattern feature.
              This tool allows users to analyze and discover the various ways consonants are combined in words. 
              Understand the complexities of consonant sequencing, frequency of specific patterns, and how they 
              contribute to word formation. 
            </p>
          </button1>
          <button1
            className="feature-card-conso"
            onClick={() => navigateTo("ConsonantCluster")}
          >
            <h2>Consonant Cluster</h2>
            <p class="para">
              Delve into the world of phonetics with our Consonant Cluster feature.
              This tool focuses on the study of consonant clusters that appear 
              together in words without intervening vowels. Examine how different languages utilize 
              these cluster, and understand their role 
              in shaping pronunciation and meaning.
              
            </p>
          </button1>

          <button1
            className="feature-card-stats"
            onClick={() => navigateTo("statistics")}
          >
            <h2>Statistics</h2>
            <p class="para">
              Uncover the fascinating world of phonetics with our Statistics feature. Delve into a comprehensive
              analysis of sound frequency, word distributions, and word counts.
              Visualize data through constant sound versus frequency bar graphs
              and explore diverse data sources to enhance your understanding of
              phonetics.
            </p>
          </button1>
        </div>
      </div>
  
  );
}

export default Home;
