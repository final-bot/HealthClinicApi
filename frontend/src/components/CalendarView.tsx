import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enGB } from "date-fns/locale/en-GB";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-GB": enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView({ appointments, onSelectSlot }: any) {
  const events = appointments.map((appt: any) => ({
    title: `${appt.clinicianId} → ${appt.patientId}`,
    start: new Date(appt.start),
    end: new Date(appt.end),
  }));

  return (
    <div style={{ height: "600px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["week", "day"]}
        defaultView="week"
        min={new Date(0, 0, 0, 9, 0, 0)}
        max={new Date(0, 0, 0, 17, 0, 0)}
        eventPropGetter={() => ({
          style: {
            backgroundColor: "#0B3C5D",
            borderRadius: "6px",
            color: "white",
            border: "none",
          },
        })}
        step={15}
        timeslots={2}
        selectable
        onSelectSlot={onSelectSlot}
        scrollToTime={new Date()}
        dayPropGetter={(date) => ({
          style: {
            backgroundColor:
              date.toDateString() === new Date().toDateString()
                ? "#f0f4f8"
                : undefined,
          },
        })}
      />
    </div>
  );
}
