import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useGymConfig } from './hooks/useGymConfig';
import { loadGymData, saveGymData, resetGymData } from './data/demoData';
import PublicSite from './pages/PublicSite';
import OwnerDashboard from './pages/OwnerDashboard';
import MemberPortal from './pages/MemberPortal';
import LoginModal from './components/LoginModal';

function GymApp() {
  const config = useGymConfig();
  const [data, setData] = useState(() => loadGymData());
  const [authRole, setAuthRole] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => { saveGymData(data); }, [data]);

  const handleAddLead = (leadInput) => {
    const newLead = { id: `LD-0${data.leads.length + 1}`, ...leadInput, status: 'Trial Booked' };
    setData((prev) => ({ ...prev, leads: [newLead, ...prev.leads] }));
  };

  if (authRole === 'owner') {
    return <OwnerDashboard config={config} data={data} onUpdateData={setData} onResetData={() => setData(resetGymData())} onLogout={() => setAuthRole(null)} />;
  }

  if (authRole === 'member') {
    return <MemberPortal config={config} member={data.members[0]} workoutPlan={data.workoutPlan} onLogout={() => setAuthRole(null)} />;
  }

  return (
    <>
      <PublicSite config={config} trainers={data.trainers} onOpenLogin={() => setLoginOpen(true)} onAddLead={handleAddLead} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onLogin={(role) => setAuthRole(role)} gymName={config.gymName} />
    </>
  );
}

export default function App() {
  return <BrowserRouter><GymApp /></BrowserRouter>;
}
