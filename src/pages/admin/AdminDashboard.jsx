import { NavLink } from 'react-router';
import { auth } from '../../firebase-config';
import './admin-dashboard.css';

function AdminDashboard() {

  {/* Shows when Admin is Logged in */}
  function logOut(){
    alert('Admin logged out successfully!');
    auth.signOut();
  }

  return (
    <div>
      <div>
        <h1>Admin Dashboard Page</h1>
        <NavLink to={'/login'}><button onClick={logOut}>Logout</button></NavLink>
      </div>
    </div>
  )
}

export default AdminDashboard;
