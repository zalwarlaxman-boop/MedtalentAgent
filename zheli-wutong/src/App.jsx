import { Routes, Route } from 'react-router-dom';
import MainPortalLayout from './MainPortalLayout';
import HomeTab from './portal-pages/HomeTab';
import OverviewTab from './portal-pages/OverviewTab';
import OsTab from './portal-pages/OsTab';
import KnowledgeTab from './portal-pages/KnowledgeTab';

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPortalLayout />}>
        <Route index element={<HomeTab />} />
        <Route path="overview" element={<OverviewTab />} />
        <Route path="os" element={<OsTab />} />
        <Route path="knowledge" element={<KnowledgeTab />} />
        
        {/* 大众端 (原 zheli-wutong) */}
        <Route path="patient/*" element={
          <HealthDataProvider>
            <PatientAppLayout />
          </HealthDataProvider>
        }>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Interaction />} />
          <Route path="profile" element={<HealthProfile />} />
          <Route path="weight" element={<WeightTracking />} />
          <Route path="dietitians" element={<Dietitians />} />
          <Route path="experts" element={<Experts />} />
          <Route path="goods" element={<Goods />} />
          <Route path="hospital" element={<Hospital />} />
          <Route path="cluster" element={<AgentCluster />} />
        </Route>

        {/* 医生端 (原 demo) */}
        <Route path="doctor/*" element={<DoctorAppLayout />}>
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
      </Route>
    </Routes>
  );
}