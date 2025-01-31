import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SpinnerSmall from "../../components/SpinnerSmall";
import formatDateTime from "../../helpers/formatTime";

const POLLING_INTERVAL = 2000;

const DashboardDocumentsTable = () => {
  const [userDocumentsData, setUserDocumentsData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  // Fetch user documents
  const getUserDocuments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/documents/user-documents/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success === true) {
        setUserDocumentsData(response.data.document_data);
        return response.data.document_data;
      }
    } catch (error) {
      console.log("Error fetching documents: ", error);
      return [];
    }
  };

  // Initial fetch on component load
  useEffect(() => {
    getUserDocuments();
  }, []);

  // Handle document selection
  const handleDocumentSubmit = async (ev) => {
    ev.preventDefault();
    const file = ev.target.files[0];
    if (file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Please upload a pdf file.");
    }
    // setSelectedFile(file);
  };

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/documents/upload_documents/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success === true) {
        await getUserDocuments(); // Fetch updated data
        toast.success("Document uploaded successfully.");
        setPolling(true); // Start polling for status updates
      } else {
        alert("Failed to upload document.");
      }
    } catch (error) {
      console.log("Error: ", error);
      alert("Error while uploading the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Upload the selected file
  useEffect(() => {
    if (selectedFile) {
      handleUploadDocument();
    }
  }, [selectedFile]);

  // Polling logic to check document status
  useEffect(() => {
    let pollingInterval;
    if (polling) {
      pollingInterval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_API_URL}/documents/user-documents/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (response.data.success === true) {
            const documents = response.data.document_data;
            setUserDocumentsData(documents); // Update the state

            // Check if any document is still processing
            const processingDocuments = documents.some(
              (doc) => doc.status === "pending" || doc.status === "processing"
            );

            if (!processingDocuments) {
              clearInterval(pollingInterval); // Stop polling
              setPolling(false);
            }
          }
        } catch (error) {
          console.log("Polling Error: ", error);
          clearInterval(pollingInterval); // Stop polling on error
          setPolling(false);
        }
      }, POLLING_INTERVAL);
    }
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [polling]);

  // Handle document deletion
  const handleDeleteDocument = async (id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/documents/delete_document/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success === true) {
        await getUserDocuments();
        toast.success("Document deleted successfully.");
      } else {
        alert("Failed to delete the document.");
      }
    } catch (error) {
      console.log("Error: ", error);
      alert("Failed to delete the document. Please try again later!");
    }
  };

  // Render action buttons based on document status
  const renderActionButtons = (document) => {
    if (document.status === "completed") {
      return (
        <div className="d-flex justify-content-center gap-1">
          <Link
            className="btn btn-sm button-custom"
            to={`/chat/document/${document.id}`}
          >
            Chat
          </Link>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteDocument(document.id)}
          >
            Delete
          </button>
        </div>
      );
    } else if (document.status === "processing") {
      return (
        <div className="text-center d-flex gap-2 justify-content-center align-items-center">
          <SpinnerSmall />
          <p className="my-2">Analyzing Your Document...</p>
        </div>
      );
    } else if (document.status === "pending") {
      return (
        <div className="text-center d-flex gap-2 justify-content-center align-items-center">
          <SpinnerSmall />
          <p className="my-2">Analyzing Your Document...</p>
        </div>
      );
    } else {
      <div className="text-center">
        <p>Failed To Analyze Your Document</p>
      </div>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <form className="my-2">
          <input
            type="file"
            id="fileInput"
            className="btn btn-success d-none"
            onChange={handleDocumentSubmit}
          />
          <label htmlFor="fileInput" className="btn button-upload-custom">
            {loading ? <SpinnerSmall /> : "Upload Document"}
          </label>
        </form>
      </div>
      <div className="scrollable-table-container">
        {userDocumentsData.length > 0 ? (
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th scope="col" className="text-center">
                  File Name
                </th>
                <th scope="col" className="text-center">
                  Uploaded On
                </th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {userDocumentsData?.map((data) => (
                <tr key={data.id}>
                  <td className="text-center my-2">
                    <p className="my-2">
                      {data.file === null ? "None" : data.file.slice(30)}
                    </p>
                  </td>
                  <td className="text-center">
                    <p className="my-2">{formatDateTime(data.uploaded_at)}</p>
                  </td>
                  <td>{renderActionButtons(data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="my-4">
            <h4 className="text-center py-4">
              Upload A Document To Analyze It And Interact With It
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDocumentsTable;
