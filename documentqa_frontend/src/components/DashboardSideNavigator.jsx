// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FiMenu } from "react-icons/fi"; // Hamburger icon
// import { AiOutlineClose } from "react-icons/ai"; // Close icon

// const DashboardSideNavigator = () => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const toggleDrawer = () => {
//     setIsDrawerOpen(!isDrawerOpen);
//   };

//   return (
//     <>
//       {/* Hamburger Menu Button for Mobile (visible on small screens) */}
//       <button
//         className="btn btn-menu d-md-none"
//         onClick={toggleDrawer}
//         aria-label="Toggle Menu"
//       >
//         <FiMenu size={30} className="" />
//       </button>

//       {/* Drawer for Mobile */}
//       <div className={`dashboard-drawer ${isDrawerOpen ? "open" : ""}`}>
//         <button
//           className="btn btn-close d-md-none"
//           onClick={toggleDrawer}
//           aria-label="Close Menu"
//         >
//           {/* <AiOutlineClose size={24} /> */}
//         </button>
//         <div className="dashboard-side-navigator-top-links d-flex flex-column justify-content-center align-items-center my-4 gap-2">
//           <Link
//             className="btn btn-dashboard-side-navigator-custom"
//             to="/dashboard"
//             onClick={toggleDrawer}
//           >
//             Dashboard
//           </Link>
//           <Link
//             className="btn btn-dashboard-side-navigator-custom"
//             to="/settings"
//             onClick={toggleDrawer}
//           >
//             Settings
//           </Link>
//         </div>
//         <div className="dashboard-side-navigator-bottom-links d-flex flex-column justify-content-center align-items-center">
//           <Link
//             className="btn btn-dashboard-side-navigator-custom"
//             to="/upgrade"
//             onClick={toggleDrawer}
//           >
//             Upgrade
//           </Link>
//         </div>
//       </div>

//       {/* Static Sidebar for Larger Screens */}
//       <div className="dashboard-static-sidebar d-none d-md-block">
//         <div className="dashboard-side-navigator-top-links d-flex flex-column justify-content-center align-items-center my-4 gap-2">
//           <Link
//             className="btn btn-dashboard-side-navigator-custom"
//             to="/dashboard"
//           >
//             Dashboard
//           </Link>
//           <Link
//             className="btn btn-dashboard-side-navigator-custom"
//             to="/settings"
//           >
//             Settings
//           </Link>
//         </div>
//         <div className="dashboard-side-navigator-bottom-links d-flex flex-column justify-content-center align-items-center">
//           <Link
//             className="btn btn-dashboard-side-navigator-custom"
//             to="/upgrade"
//           >
//             Upgrade
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardSideNavigator;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi"; // Hamburger icon
import { AiOutlineClose } from "react-icons/ai"; // Close icon

const DashboardSideNavigator = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile (visible on small screens) */}
      <button
        className="btn btn-menu d-md-none"
        onClick={toggleDrawer}
        aria-label="Toggle Menu"
      >
        <FiMenu size={28} color="gray" />
      </button>

      {/* Drawer for Mobile */}
      <div className={`dashboard-drawer ${isDrawerOpen ? "open" : ""}`}>
        <button
          className="btn btn-close d-md-none"
          onClick={toggleDrawer}
          aria-label="Close Menu"
        >
          {/* <AiOutlineClose size={28} /> */}
        </button>
        <div className="dashboard-side-navigator-top-links d-flex flex-column justify-content-center align-items-center my-4 gap-2">
          <Link
            className="btn btn-dashboard-side-navigator-custom"
            to="/dashboard"
            onClick={toggleDrawer}
          >
            Dashboard
          </Link>
          <Link
            className="btn btn-dashboard-side-navigator-custom"
            to="/settings"
            onClick={toggleDrawer}
          >
            Settings
          </Link>
        </div>
        <div className="dashboard-side-navigator-bottom-links d-flex flex-column justify-content-center align-items-center">
          <Link
            className="btn btn-dashboard-side-navigator-custom"
            to="/upgrade"
            onClick={toggleDrawer}
          >
            Upgrade
          </Link>
        </div>
      </div>

      {/* Static Sidebar for Larger Screens */}
      <div className="dashboard-static-sidebar d-none d-md-block">
        <div className="dashboard-side-navigator-top-links d-flex flex-column justify-content-center align-items-center my-4 gap-2">
          <Link
            className="btn btn-dashboard-side-navigator-custom"
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="btn btn-dashboard-side-navigator-custom"
            to="/settings"
          >
            Settings
          </Link>
        </div>
        <div className="dashboard-side-navigator-bottom-links d-flex flex-column justify-content-center align-items-center">
          <Link
            className="btn btn-dashboard-side-navigator-custom"
            to="/upgrade"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardSideNavigator;
