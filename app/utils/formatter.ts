const formatter = {
  formatTime: (date: Date | string | null): string => {
    const d = typeof date === 'string' ? new Date(date) : date;

    const parsed = {
      hours: d?.getHours() ?? 0,
      mins: d?.getMinutes() ?? 0,
    };

    const meridiem = parsed.hours > 11 ? 'PM' : 'AM';
    const formattedHours = parsed.hours > 12 ? parsed.hours - 12 : parsed.hours; // hours in 12-hour format

    const hours = `${formattedHours < 10 ? 0 : ''}${formattedHours}`;
    const mins = `${parsed.mins < 10 ? 0 : ''}${parsed.mins}`;

    return `${hours}:${mins}${meridiem}`;
  },
  getNumberSuffix: (date: number): 'st' | 'nd' | 'rd' | 'th' => {
    const remainder = date % 10;
    switch (remainder) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  },
};

export default formatter;
