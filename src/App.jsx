import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DoctorListingPage from './pages/DoctorListingPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoctorListingPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
