import React from "react";
import DashboardDocumentsTable from "../components/DashboardPageComponents/DashboardDocumentsTable";

const DashboardPage = () => {
  return (
    <div className="dashboard-container bg-light shadow px-4 py-2 rounded">
      <h2 className="mt-1">Your Documents</h2>
      <DashboardDocumentsTable />
    </div>
  );
};

export default DashboardPage;
