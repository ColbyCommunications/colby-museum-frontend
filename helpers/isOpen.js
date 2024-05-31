const isOpen = (start, end, location) => {
  var dt = new Date(); //current Date that gives us current Time also

  var startTime = start;
  var endTime = end;

  if ((dt.getDay() == 1 && location == 'campus') || (dt.getDay() == 2 && location == 'downtown')) {
    return false;
  } else {
    var s =  startTime.split(':');
    var dt1 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), parseInt(s[0]), parseInt(s[1]), parseInt(s[2]));

    var e =  endTime.split(':');
    var dt2 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));

    return (dt >= dt1 && dt <= dt2) ? true : false;
    // alert ('dt = ' + dt  + ',  dt1 = ' + dt1 + ', dt2 =' + dt2);
  }
}

export default isOpen;