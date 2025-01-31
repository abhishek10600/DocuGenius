import Navbar from "./Navbar";
import DashboardSideNavigator from "./DashboardSideNavigator";

const DashbaordLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="below-navbar-content d-flex">
        <DashboardSideNavigator />
        <div className="dashboard-main-content w-100">{children}</div>
      </div>
    </div>
  );
};

export default DashbaordLayout;
