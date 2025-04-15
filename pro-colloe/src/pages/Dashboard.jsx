import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';
import '../style/dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) navigate('/auth', { replace: true });
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Welcome to your scheduler!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Upcoming Events</h3>
          <div className="dashboard-card-content">
            <p>You have no upcoming events scheduled.</p>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Recent Activity</h3>
          <div className="dashboard-card-content">
            <p>No recent activity to display.</p>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Quick Actions</h3>
          <div className="dashboard-card-content">
            <p>Create a new event or view your calendar.</p>
          </div>
        </div>
        <div className="dashboard-card">
        <button
        onClick={() => navigate('/courses')}
      >
        Manage Courses
      </button>
        </div>
      </div>
    </div>
  );
}