import { getMonthName } from "../utils";

const CalendarToolbar = (props) => {
  const { label, date, view } = props;
  const month = getMonthName(date.getMonth());

  const goToPrevious = () => {
    props.onNavigate('PREV');
  };

  const goToNext = () => {
    props.onNavigate('NEXT');
  };


  return (
    <div className="flex justify-between items-center ">
      {/* Title */}
      <h2 className="text-base font-semibold">Book Appointment</h2>

      {view === "week" && (
        <h2 className="text-base font-semibold">{label}</h2>
      )}

      {/* Buttons */}
      <div className="justify-end flex text-xs">
        <div className="flex gap-2 px-2 w-[147px] justify-between  items-center border border-b-0">
          <button
            onClick={goToPrevious}
            className=" px-1 "
          >
            &lt;
          </button>
          <span className="cursor-pointer" onClick={() => props.setCalenderView("month")}>{month}</span>
          <button
            onClick={goToNext}
            className=" px-1 "
          >
            &gt;
          </button>
        </div>
        <button className=" px-8  py-1 border border-b-0 " onClick={() => props.setCalenderView(curr => curr === "week" ? "month" : "week")}>
          Booking History
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
