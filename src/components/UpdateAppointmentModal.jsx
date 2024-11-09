import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToastMessage } from "../utils";

const UpdateAppointmentModal = ({ show, onClose, selectedEvent, setRefresh }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const completeAppointment = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    try {
      setLoading(true);
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/dentist/updateappointment/${selectedEvent._id}`, {
        dentistId: user._id,
        status: "completed"
      }, {
        headers: {
          'Authorization': `${sessionStorage.getItem('authToken')}`
        }
      })
      if (data.success) {
        showToastMessage('SUCCESS', data.message)
        onClose();
        setRefresh(curr => curr + 1)
      } else {
        showToastMessage('ERROR', data.message)
      }
    } catch (error) {
      console.log(error)
      if (+error?.response?.status === 401) {
        sessionStorage.removeItem('authToken')
        sessionStorage.removeItem('user')
        onClose();
        navigate('/')
      }
      showToastMessage('ERROR', error.response.data.message)
    }
    setLoading(false);

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white flex flex-col p-6 rounded-md shadow-lg w-72 h-80 ">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-lg font-semibold">Appointment Details</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <div>
          <p className="mb-2">Patient: {selectedEvent.userName}</p>
          <p className="mb-2">Service: {selectedEvent.serviceName}</p>
        </div>

        <div className="flex justify-between flex-1 items-end ">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          {selectedEvent.status !== "completed" && <button className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:bg-gray-500" disabled={loading} onClick={completeAppointment}>Complete</button>}
        </div>
      </div>
    </div>
  );
};

export default UpdateAppointmentModal;
