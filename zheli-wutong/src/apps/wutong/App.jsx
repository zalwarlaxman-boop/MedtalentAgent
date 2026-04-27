import { Route, Routes, MemoryRouter } from 'react-router-dom'
import { HealthDataProvider } from './context/HealthDataContext'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Interaction from './pages/Interaction'
import HealthProfile from './pages/HealthProfile'
import WeightTracking from './pages/WeightTracking'
import AgentCluster from './pages/AgentCluster'
import Goods from './pages/Goods'
import Hospital from './pages/Hospital'
import Experts from './pages/Experts'
import Dietitians from './pages/Dietitians'
import NotFound from './pages/NotFound'

export default function WutongApp() {
  return (
    <MemoryRouter>
      <HealthDataProvider>
        <Routes>
          <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="interaction" element={<Interaction />} />
          <Route path="profile" element={<HealthProfile />} />
          <Route path="tracking/weight" element={<WeightTracking />} />
          <Route path="tracking/agents" element={<AgentCluster />} />
          <Route path="goods" element={<Goods />} />
          <Route path="hospital" element={<Hospital />} />
          <Route path="experts" element={<Experts />} />
          <Route path="dietitians" element={<Dietitians />} />
          <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HealthDataProvider>
    </MemoryRouter>
  )
}
