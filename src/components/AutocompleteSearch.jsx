import React, { useState, useEffect, useRef } from 'react';

const AutocompleteSearch = ({ doctors, onSearch, initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Update search term if initialSearch changes (e.g., when navigating back)
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      // Filter doctors based on the search term
      const matches = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(matches.slice(0, 3)); // Limit to top 3 matches
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, doctors]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (doctorName) => {
    setSearchTerm(doctorName);
    onSearch(doctorName);
    setShowSuggestions(false);
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-wrapper" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for doctors by name"
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
          data-testid="autocomplete-input"
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map(doctor => (
            <li 
              key={doctor.id} 
              onClick={() => handleSuggestionClick(doctor.name)}
              className="suggestion-item"
              data-testid="suggestion-item"
            >
              {doctor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;