const isOpen = (hours, location) => {
  var dt = new Date(); //current Date that gives us current Time also

  // Create an options object to specify the format
  const options = { weekday: 'long' }; // 'long' for the full name

  // Format the date to get the day label
  const dayLabel = dt.toLocaleString('en-US', options);

  const hoursToday = hours.find(day => day[`${location}_day_label`] === dayLabel);
  console.log(hoursToday);
  // Return false (closed) if Monday for Campus or Tuesday for downtown
  if (hoursToday[`${location}_day_open_time`] === '' || hoursToday[`${location}_day_close_time`] === '') {
    return false;

  // Special conditional for Sunday hours. Will clean up duplications later.
  } else {
    var s =  hoursToday[`${location}_day_open_time`].split(':');
    var dt1 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), parseInt(s[0]), parseInt(s[1]), parseInt(s[2]));

    var e =  hoursToday[`${location}_day_close_time`].split(':');
    var dt2 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));

    return (dt >= dt1 && dt <= dt2) ? true : false;
    // alert ('dt = ' + dt  + ',  dt1 = ' + dt1 + ', dt2 =' + dt2);
  }
}

export default isOpen;