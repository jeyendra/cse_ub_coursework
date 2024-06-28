// SearchHandler.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchHandler = ({ wordDetails, setWordDetails }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (wordDetails) {
      navigate('/searchbar');
    }
  }, [wordDetails, navigate]);

  return null; 
};

export default SearchHandler;
