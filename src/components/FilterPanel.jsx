import React, { useState, useEffect } from 'react';

const FilterPanel = ({ doctors, onFilter, activeFilters }) => {
  // Initialize state from props or default values
  const [consultationType, setConsultationType] = useState(activeFilters?.consultationType || '');
  const [selectedSpecialties, setSelectedSpecialties] = useState(activeFilters?.selectedSpecialties || []);
  const [sortBy, setSortBy] = useState(activeFilters?.sortBy || '');
  const [showAllSpecialties, setShowAllSpecialties] = useState(true);
  
  // Hard-coded list of specialties based on test requirements
  const specialtiesList = [
    "General Physician", "Dentist", "Dermatologist", "Paediatrician", 
    "Gynaecologist", "ENT", "Diabetologist", "Cardiologist", 
    "Physiotherapist", "Endocrinologist", "Orthopaedic", "Ophthalmologist", 
    "Gastroenterologist", "Pulmonologist", "Psychiatrist", "Urologist", 
    "Dietitian/Nutritionist", "Psychologist", "Sexologist", "Nephrologist", 
    "Neurologist", "Oncologist", "Ayurveda", "Homeopath"
  ];

  // Update local state when activeFilters prop changes
  useEffect(() => {
    if (activeFilters) {
      setConsultationType(activeFilters.consultationType || '');
      setSelectedSpecialties(activeFilters.selectedSpecialties || []);
      setSortBy(activeFilters.sortBy || '');
    }
  }, [activeFilters]);

  // Apply filters automatically when any filter changes
  useEffect(() => {
    onFilter({ consultationType, selectedSpecialties, sortBy });
  }, [consultationType, selectedSpecialties, sortBy]);

  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(item => item !== specialty)
        : [...prev, specialty]
    );
  };

  const clearFilters = () => {
    setConsultationType('');
    setSelectedSpecialties([]);
    setSortBy('');
  };

  const handleConsultationTypeChange = (type) => {
    setConsultationType(prev => prev === type ? '' : type);
  };

  const clearConsultationType = () => {
    setConsultationType('');
  };

  const clearSpecialties = () => {
    setSelectedSpecialties([]);
  };

  const clearSortBy = () => {
    setSortBy('');
  };

  return (
    <div className="filter-panel">
      <h3>Filter Options</h3>

      <div className="filter-section">
        <h4 data-testid="filter-header-moc">Consultation Type</h4>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="consultationType"
              checked={consultationType === 'Video Consult'}
              onChange={() => handleConsultationTypeChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label>
            <input
              type="radio"
              name="consultationType"
              checked={consultationType === 'In Clinic'}
              onChange={() => handleConsultationTypeChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
          {consultationType && (
            <button 
              className="clear-filter" 
              onClick={clearConsultationType}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="filter-section">
        <h4 data-testid="filter-header-speciality">Specialties</h4>
        <div className="checkbox-group" style={{ maxHeight: showAllSpecialties ? 'none' : '200px', overflowY: 'auto' }}>
          {specialtiesList.slice(0, showAllSpecialties ? specialtiesList.length : 4).map(spec => (
            <label key={spec}>
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(spec)}
                onChange={() => toggleSpecialty(spec)}
                data-testid={`filter-specialty-${spec.replace("/", "-")}`}
              />
              {spec}
            </label>
          ))}
        </div>
        {selectedSpecialties.length > 0 && (
          <button 
            className="clear-filter" 
            onClick={clearSpecialties}
          >
            Clear specialties
          </button>
        )}
      </div>

      <div className="filter-section">
        <h4 data-testid="filter-header-sort">Sort By</h4>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="sortBy"
              checked={sortBy === 'fees'}
              onChange={() => setSortBy('fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label>
            <input
              type="radio"
              name="sortBy"
              checked={sortBy === 'experience'}
              onChange={() => setSortBy('experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
          {sortBy && (
            <button 
              className="clear-filter" 
              onClick={clearSortBy}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="filter-actions">
        <button 
          className="clear-all-filters"
          onClick={clearFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;