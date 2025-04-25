import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAPI } from "../hooks/apiHooks";
import AutocompleteSearch from "../components/AutocompleteSearch";
import FilterPanel from "../components/FilterPanel";
import DoctorsList from "../components/DoctorsList";

const DoctorListingPage = () => {
  const { isLoading, getDoctors, error, doctors } = useAPI();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  
  // Initialize filters from URL on component mount
  const [activeFilters, setActiveFilters] = useState(() => {
    return {
      consultationType: searchParams.get("consultationType") || '',
      selectedSpecialties: searchParams.getAll("specialty") || [],
      sortBy: searchParams.get("sortBy") || ''
    };
  });

  useEffect(() => {
    // Fetch doctors on component mount
    getDoctors();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Update search params with current filters
    if (activeFilters.consultationType) {
      newSearchParams.set("consultationType", activeFilters.consultationType);
    } else {
      newSearchParams.delete("consultationType");
    }
    
    // Handle specialty array (multiple values for same param)
    newSearchParams.delete("specialty");
    activeFilters.selectedSpecialties.forEach(specialty => {
      newSearchParams.append("specialty", specialty);
    });
    
    if (activeFilters.sortBy) {
      newSearchParams.set("sortBy", activeFilters.sortBy);
    } else {
      newSearchParams.delete("sortBy");
    }
    
    // Only update if search params actually changed
    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams);
    }
  }, [activeFilters]);

  useEffect(() => {
    if (!doctors.length) return;
    
    // Start with search filtering
    let filtered = doctors;
    const searchQuery = searchParams.get("search") || "";
    
    if (searchQuery) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply consultation type filter
    if (activeFilters.consultationType) {
      filtered = filtered.filter(doctor => {
        if (activeFilters.consultationType === 'Video Consult') {
          return doctor.video_consult === true;
        } else if (activeFilters.consultationType === 'In Clinic') {
          return doctor.in_clinic === true;
        }
        return true;
      });
    }
    
    // Apply specialty filters
    if (activeFilters.selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor => {
        // Check if doctor has at least one of the selected specialties
        return doctor.specialities.some(spec => 
          activeFilters.selectedSpecialties.includes(spec.name)
        );
      });
    }
    
    // Apply sorting
    if (activeFilters.sortBy) {
      filtered = [...filtered]; // Create a copy to avoid mutation
      
      if (activeFilters.sortBy === 'fees') {
        filtered.sort((a, b) => {
          // Extract numeric values from fees strings
          const getFeeValue = (fee) => {
            if (!fee) return Infinity;
            const numericValue = parseInt(fee.replace(/[^\d]/g, ''));
            return isNaN(numericValue) ? Infinity : numericValue;
          };
          
          return getFeeValue(a.fees) - getFeeValue(b.fees);
        });
      } else if (activeFilters.sortBy === 'experience') {
        filtered.sort((a, b) => {
          // Extract years from experience strings
          const getExperienceYears = (exp) => {
            if (!exp) return 0;
            const match = exp.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          
          return getExperienceYears(b.experience) - getExperienceYears(a.experience);
        });
      }
    }
    
    setFilteredDoctors(filtered);
  }, [doctors, searchParams, activeFilters]);

  const handleSearch = (searchTerm) => {
    // Preserve existing filter parameters when updating search
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      newSearchParams.set("search", searchTerm);
    } else {
      newSearchParams.delete("search");
    }
    
    setSearchParams(newSearchParams);
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
  };

  // When user returns to the page, initialize filters from URL
  useEffect(() => {
    // Listen for changes in URL and update filters if needed
    const consultationType = searchParams.get("consultationType") || '';
    const selectedSpecialties = searchParams.getAll("specialty") || [];
    const sortBy = searchParams.get("sortBy") || '';
    
    // Only update if different than current active filters to avoid loops
    const filtersChanged = 
      consultationType !== activeFilters.consultationType ||
      selectedSpecialties.join(',') !== activeFilters.selectedSpecialties.join(',') ||
      sortBy !== activeFilters.sortBy;
    
    if (filtersChanged) {
      setActiveFilters({
        consultationType,
        selectedSpecialties,
        sortBy
      });
    }
  }, [searchParams]);

  // Add loading and error states to improve user experience
  if (isLoading) {
    return <div className="loading-state">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div className="doctor-listing-page">
      <div className="sidebar">
        <FilterPanel 
          doctors={doctors} 
          onFilter={handleFilter}
          activeFilters={activeFilters}
        />
      </div>
      <div className="main-content">
        <div className="search-container">
          <AutocompleteSearch 
            doctors={doctors} 
            onSearch={handleSearch} 
            initialSearch={searchParams.get("search") || ""}
          />
          {(activeFilters.consultationType || 
            activeFilters.selectedSpecialties.length > 0 || 
            activeFilters.sortBy) && (
            <div className="active-filters">
              <span>Active filters:</span>
              {activeFilters.consultationType && (
                <span className="filter-tag">{activeFilters.consultationType}</span>
              )}
              {activeFilters.selectedSpecialties.map(spec => (
                <span key={spec} className="filter-tag">{spec}</span>
              ))}
              {activeFilters.sortBy && (
                <span className="filter-tag">
                  {activeFilters.sortBy === 'fees' ? 'Fees (Low to High)' : 'Experience (High to Low)'}
                </span>
              )}
            </div>
          )}
        </div>
        
        <DoctorsList doctors={filteredDoctors} />
        
        {(searchParams.get("search") || 
          activeFilters.consultationType || 
          activeFilters.selectedSpecialties.length > 0) && 
          filteredDoctors.length === 0 && (
          <div className="no-results">
            No doctors found matching your search and filter criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorListingPage;