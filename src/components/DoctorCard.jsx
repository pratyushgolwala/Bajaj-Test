import React from 'react';

const DoctorCard = ({ doctor }) => {
  const {
    name,
    name_initials,
    photo,
    doctor_introduction,
    specialities,
    fees,
    experience,
    languages,
    clinic,
    video_consult,
    in_clinic
  } = doctor;

  const defaultImage = "https://via.placeholder.com/150?text=Doctor";
  
  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-card-header">
        <div className="doctor-image">
          <img src={photo || defaultImage} alt={name} onError={(e) => { e.target.src = defaultImage; }} />
        </div>
        <div className="doctor-info">
          <h2 data-testid="doctor-name">{name}</h2>
          <p className="doctor-specialities" data-testid="doctor-specialty">
            {specialities.map(spec => spec.name).join(', ')}
          </p>
          <p className="doctor-experience" data-testid="doctor-experience">{experience}</p>
        </div>
      </div>
      
      <div className="doctor-card-content">
        <div className="doctor-details">
          <div className="detail-item">
            <span className="detail-label">Languages:</span>
            <span>{languages.join(', ')}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Fees:</span>
            <span data-testid="doctor-fee">{fees}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Clinic:</span>
            <span>{clinic.name}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span>
              {[clinic.address.address_line1, clinic.address.locality, clinic.address.city]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        </div>
        
        <div className="doctor-availability">
          {video_consult && (
            <span className="availability-tag video">Video Consultation</span>
          )}
          {in_clinic && (
            <span className="availability-tag in-clinic">In-Clinic</span>
          )}
        </div>
      </div>
      
      <div className="doctor-card-footer">
        <button className="btn-book">Book Appointment</button>
        <button className="btn-profile">View Profile</button>
      </div>
    </div>
  );
};

export default DoctorCard;