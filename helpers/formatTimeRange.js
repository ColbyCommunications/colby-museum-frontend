const formatAcfTime = (timeString) => {
    if (!timeString) return '';

    // 1. Split the string (Expects "HH:mm:ss" or "HH:mm")
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString; // Fallback if format is unexpected

    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // 2. Determine AM/PM
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';

    // 3. Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle 0 becoming 12

    // 4. Format Output
    // If minutes are 0, return just the hour (e.g. "10 a.m.")
    // Otherwise return hour:minutes (e.g. "10:30 a.m.")
    const formattedTime = minutes === 0 
        ? `${hours}` 
        : `${hours}:${minutes.toString().padStart(2, '0')}`;

    return `${formattedTime} ${ampm}`;
};

const formatRange = (start, end) => {
    if (!start || !end) return '';
    return `${formatAcfTime(start)}–${formatAcfTime(end)}`;
};

export default formatTimeRange;
