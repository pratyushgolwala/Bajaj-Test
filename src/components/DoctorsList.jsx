import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorsList = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return <div className="no-doctors">No doctors available</div>;
  }

  return (
    <div className="doctors-list-container">
      <h1>Available Doctors</h1>
      <div className="doctors-list">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;