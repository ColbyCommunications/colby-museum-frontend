/**
 * @function formatDate
 * 
 * @param {String} d Date to format
 * @param {String} style Style constant to use
 * 
 **/

const formatDate = (d, style) => {
  let formattedDate;

  if (style == 'numeric') {
    formattedDate = new Date(d).toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour12: false
    })
    .replaceAll('/', '.');
  } else if (style == 'events') {
    formattedDate = new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour12: false
    });
  } else if (style == 'events-raw') {
    formattedDate = new Date(`${d.substr(0,4)}-${d.substr(4,2)}-${d.substr(6,2)}T00:00:00`);
  } else {
    formattedDate = new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour12: false
    });
  }

  return formattedDate;
}

export default formatDate;