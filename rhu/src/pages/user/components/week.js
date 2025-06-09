export const Week = () => {
  const today = new Date();

  // Get the start of the week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  // Create an array for the days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(), 
      isToday: date.toDateString() === today.toDateString(), // Highlight today
    };
  });

  return (
    <div className="week-grid">
      {daysOfWeek.map(({ day, date, isToday }, index) => (
        <div key={index} className={`item ${isToday ? 'active' : ''}`}>
          <div className="day-info">
            <div className="date">{date}</div>
            <div className="day">{day}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
