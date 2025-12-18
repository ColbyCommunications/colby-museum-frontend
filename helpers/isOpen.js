import formatTimeRange from "./formatTimeRange";

function convertTo12Hour(time24) {
    // 1. Split the time string into hours and minutes
    const [hours, minutes] = time24.split(':');

    // 2. Parse the hour (base 10)
    const hour = parseInt(hours, 10);

    // 3. Determine AM or PM
    const suffix = hour >= 12 ? 'p.m.' : 'a.m.';

    // 4. Convert 24h to 12h
    // The % 12 converts 13 to 1, but 12 becomes 0.
    // The || 12 converts that 0 back to 12 (for noon/midnight).
    const hour12 = hour % 12 || 12;

    // 5. Return formatted string
    return `${hour12}:${minutes} ${suffix}`;
}

const isOpen = (hours, location) => {
    var dt = new Date(); //current Date that gives us current Time also

    // Create an options object to specify the format
    const options = { weekday: 'long' }; // 'long' for the full name

    // Format the date to get the day label
    const dayLabel = dt.toLocaleString('en-US', options);

    const hoursToday = hours.find((day) => day[`${location}_day_label`] === dayLabel);
    const indexHoursToday = hours.findIndex((day) => day === hoursToday);
    // Return false (closed) if Monday for Campus or Tuesday for downtown
    if (
        hoursToday[`${location}_day_open_time`] === '' ||
        hoursToday[`${location}_day_close_time`] === ''
    ) {
        let nextOpenTime;
        for (let i = indexHoursToday; i < hours.length; i++) {
            if (hours[i][`${location}_day_open_time`] && hours[i][`${location}_day_close_time`]) {
                nextOpenTime =
                    convertTo12Hour(hours[i][`${location}_day_open_time`]) +
                    ` ${hours[i][`${location}_day_label`].slice(0, 3)}`;
                break;
            }
        }

        return {
            isOpen: false,
            until: nextOpenTime,
        };

        // Special conditional for Sunday hours. Will clean up duplications later.
    } else {
        var s = hoursToday[`${location}_day_open_time`].split(':');
        var dt1 = new Date(
            dt.getFullYear(),
            dt.getMonth(),
            dt.getDate(),
            parseInt(s[0]),
            parseInt(s[1]),
            parseInt(s[2])
        );

        var e = hoursToday[`${location}_day_close_time`].split(':');
        var dt2 = new Date(
            dt.getFullYear(),
            dt.getMonth(),
            dt.getDate(),
            parseInt(e[0]),
            parseInt(e[1]),
            parseInt(e[2])
        );

        let isOpen = dt >= dt1 && dt <= dt2 ? true : false;
        let until;

        if (isOpen) {
            until = convertTo12Hour(hoursToday[`${location}_day_close_time`]);
        } else {
            until = convertTo12Hour(hoursToday[`${location}_day_open_time`]);
        }

        return {
            isOpen,
            until,
            hours: formatTimeRange(convertTo12Hour(hoursToday[`${location}_day_open_time`]), convertTo12Hour(
                hoursToday[`${location}_day_close_time`]
            )),
        };
        // alert ('dt = ' + dt  + ',  dt1 = ' + dt1 + ', dt2 =' + dt2);
    }
};

export default isOpen;
