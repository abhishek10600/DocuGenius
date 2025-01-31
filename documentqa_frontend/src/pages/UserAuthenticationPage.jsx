// import React from "react";
// import UserAuthenticationForm from "../components/UserAuthenticationPageComponents/UserAuthenticationForm";

// const UserAuthenticationPage = () => {
//   return (
//     <div className="d-flex uap-body">
//       <div className="left-greetings bg-black d-flex flex-column justify-content-center align-items-center">
//         <h1 className="text-white text-center">Welcome To DocuGenius</h1>
//         <p className="text-white text-center fs-5">
//           Simplifying Document Analysis with Genius AI.
//         </p>
//       </div>
//       <div className="authentication-container-right d-flex justify-content-center align-items-center">
//         <UserAuthenticationForm />
//       </div>
//     </div>
//   );
// };

// export default UserAuthenticationPage;

import React from "react";
import UserAuthenticationForm from "../components/UserAuthenticationPageComponents/UserAuthenticationForm";

const UserAuthenticationPage = () => {
  return (
    <div className="d-flex flex-column flex-md-row uap-body">
      <div className="left-greetings bg-black d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-white text-center">Welcome To DocuGenius</h1>
        <p className="text-white text-center fs-5">
          Simplifying Document Analysis with Genius AI.
        </p>
      </div>
      <div className="authentication-container-right d-flex justify-content-center align-items-center">
        <UserAuthenticationForm />
      </div>
    </div>
  );
};

export default UserAuthenticationPage;
