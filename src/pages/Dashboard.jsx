
import axios from "axios"
import moment from 'moment'
import { useEffect, useRef, useState } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useNavigate } from "react-router-dom"
import CalendarToolbar from "../components/CalenderToolbar"
import UpdateAppointmentModal from "../components/UpdateAppointmentModal"
import { showToastMessage } from "../utils"

const localizer = momentLocalizer(moment) // or globalizeLocalizer


const Dashboard = () => {
  const navigate = useNavigate();
  const [calenderView, setCalenderView] = useState("month")
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const calendarRef = useRef(null);

  const getAppointments = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/dentist/appointments/${user._id}`, {
        headers: {
          'Authorization': `${sessionStorage.getItem('authToken')}`
        }
      })
      if (data.success) {
        setEvents(data.appointments.map((appointment) => {
          const [day, month, year] = appointment.startDate.split('/');
          const [startHour, startMinutes] = moment(appointment.startTime, 'hh:mm A').format('HH:mm').split(':');
          const [endHour, endMinutes] = moment(appointment.endTime, 'hh:mm A').format('HH:mm').split(':');
          return {
            amount: appointment.amount,
            title: appointment.title,
            _id: appointment._id,
            userName: appointment.userName,
            serviceName: appointment.serviceName,
            start: new Date(year, month - 1, day, startHour, startMinutes),
            end: new Date(year, month - 1, day, endHour, endMinutes),
            status: appointment.status
          }
        }))
      } else {
        showToastMessage('ERROR', data.message)
      }
    } catch (error) {
      console.log(error)
      if (+error.response?.status === 401) {
        sessionStorage.removeItem('authToken')
        navigate('/')
        return
      }
      showToastMessage('ERROR', error.response.data.message)
    }
  }

  useEffect(() => {
    getAppointments();
    //eslint-disable-next-line
  }, [refresh])


  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };


  const handleSelectEvent = (event) => {
    if (calenderView === 'week') {
      // open modal to update the status of appointment
      setShowModal(true)
      setSelectedEvent(event)
      return
    }
    // Set the view to 'week'
    setCalenderView('week');
    // Navigate to the week containing the event's start date
    if (calendarRef.current) {
      calendarRef.current.handleNavigate('DATE', event.start);
    }
  };

  return (
    <div className="h-[500px] flex flex-col px-8">
      <Calendar
        ref={calendarRef}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onView={() => setCalenderView('week')}
        view={calenderView}
        defaultView="month"
        selectable
        step={60}
        timeslots={1}
        min={new Date(1970, 1, 1, 8, 30)} // Set the minimum time to 8:30 AM, in week view calender
        max={new Date(1970, 1, 1, 17, 30)} // Set the maximum time to 5:30 PM, in week view calender
        onSelectEvent={handleSelectEvent}
        showAllEvents={true}
        components={{
          event: ({ event }) => <div className={`flex text-xs text-gray-800 text-wrap p-1 items-end ${event.status === "completed" ? "bg-green-300" : "bg-white"}`} >{event.title}</div>,
          toolbar: (props) => (<CalendarToolbar {...props} setCalenderView={setCalenderView} />)
        }}
      />
      <UpdateAppointmentModal show={showModal} onClose={handleCloseModal} selectedEvent={selectedEvent} setRefresh={setRefresh} />
    </div>
  )
}

export default Dashboard
