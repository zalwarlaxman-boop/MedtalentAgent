import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import './index.css'

// 医生端
import DoctorAppLayout from './doctor-app/components/Layout';
import Home from './doctor-app/pages/Home';
import Interact from './doctor-app/pages/Interact';
import PopSci from './doctor-app/pages/PopSci';
import PopSciDetail from './doctor-app/pages/PopSciDetail';
import ContentDetail from './doctor-app/pages/ContentDetail';
import Service from './doctor-app/pages/Service';
import ServiceDetail from './doctor-app/pages/ServiceDetail';
import Faq from './doctor-app/pages/Faq';
import Me from './doctor-app/pages/Me';

// 大众端
import { HealthDataProvider } from './patient-app/context/HealthDataContext';
import PatientAppLayout from './patient-app/layout/AppLayout';
import Dashboard from './patient-app/pages/Dashboard';
import Interaction from './patient-app/pages/Interaction';
import HealthProfile from './patient-app/pages/HealthProfile';
import WeightTracking from './patient-app/pages/WeightTracking';
import Dietitians from './patient-app/pages/Dietitians';
import Experts from './patient-app/pages/Experts';
import Goods from './patient-app/pages/Goods';
import Hospital from './patient-app/pages/Hospital';
import AgentCluster from './patient-app/pages/AgentCluster';

import { Routes, Route } from 'react-router-dom';

const patientRoot = document.getElementById('patient-app-root');
if (patientRoot) {
  createRoot(patientRoot).render(
    <StrictMode>
      <MemoryRouter initialEntries={['/patient']}>
        <HealthDataProvider>
          <Routes>
            <Route path="/patient" element={<PatientAppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="interaction" element={<Interaction />} />
              <Route path="profile" element={<HealthProfile />} />
              <Route path="weight" element={<WeightTracking />} />
              <Route path="dietitians" element={<Dietitians />} />
              <Route path="experts" element={<Experts />} />
              <Route path="goods" element={<Goods />} />
              <Route path="hospital" element={<Hospital />} />
              <Route path="cluster" element={<AgentCluster />} />
            </Route>
          </Routes>
        </HealthDataProvider>
      </MemoryRouter>
    </StrictMode>
  );
}

const doctorRoot = document.getElementById('doctor-app-root');
if (doctorRoot) {
  createRoot(doctorRoot).render(
    <StrictMode>
      <MemoryRouter initialEntries={['/doctor']}>
        <Routes>
          <Route path="/doctor" element={<DoctorAppLayout />}>
            <Route index element={<Home />} />
            <Route path="interact" element={<Interact />} />
            <Route path="popsci" element={<PopSci />} />
            <Route path="popsci/:id" element={<PopSciDetail />} />
            <Route path="content/:id" element={<ContentDetail />} />
            <Route path="service" element={<Service />} />
            <Route path="service/:id" element={<ServiceDetail />} />
            <Route path="faq" element={<Faq />} />
            <Route path="me" element={<Me />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </StrictMode>
  );
}
