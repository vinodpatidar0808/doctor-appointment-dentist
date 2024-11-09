import { toast } from 'react-toastify';


export const getPageHeader = (pathname) => {
  if (pathname === "/dashboard") {
    return "Dashboard"
  }
}

export const showToastMessage = (type, message) => {
  if (type === 'SUCCESS') {
    toast.success(message, {
      position: 'bottom-center',
      autoClose: 700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    return
  }

  if (type === 'ERROR') {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }
  // Add other types when needed
};

export const getMonthName = (monthNumber) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber];
};
