// 1. Helper: Parses time and returns the parts separately
// Returns object: { timeText: "2:30", ampm: "p.m." }
const parseTimeData = (timeString) => {
    if (!timeString) return null;

    const lowerStr = timeString.toLowerCase();
    const parts = lowerStr.split(':');
    if (parts.length < 2) return null;

    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    let ampm;
    const is12HourFormat = lowerStr.includes('a') || lowerStr.includes('p');

    if (is12HourFormat) {
        ampm = lowerStr.includes('p') ? 'p.m.' : 'a.m.';
    } else {
        ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        hours = hours % 12;
        hours = hours ? hours : 12; 
    }

    const timeText = minutes === 0 
        ? `${hours}` 
        : `${hours}:${minutes.toString().padStart(2, '0')}`;

    return { timeText, ampm };
};

// 2. Formats a single time string (e.g. "2 p.m.")
const formatAcfTime = (timeString) => {
    const data = parseTimeData(timeString);
    if (!data) return '';
    return `${data.timeText} ${data.ampm}`;
};

// 3. Formats a range with intelligent AM/PM display
const formatTimeRange = (start, end) => {
    const startData = parseTimeData(start);
    const endData = parseTimeData(end);

    if (!startData || !endData) return '';

    // COMPARE THE SUFFIXES:
    // If start is 'a.m.' and end is 'p.m.' (or vice versa), show both.
    if (startData.ampm !== endData.ampm) {
         return `${startData.timeText} ${startData.ampm}–${endData.timeText} ${endData.ampm}`;
    } 
    
    // If suffixes are the same (e.g. both p.m.), only show the last one.
    return `${startData.timeText}–${endData.timeText} ${endData.ampm}`;
};

export { formatTimeRange, formatAcfTime };