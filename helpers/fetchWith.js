/**
 * @function fetchWith
 * 
 * @param {String} endpoint - Elastic endpoint to query
 * @param {Object} query - Elastic query to use
 * @param {String|Null} username - username to use (optional)
 * @param {String|Null} password - password to use (optional)
 * 
 * @returns Data fetched from this query
 **/ 
const fetchWith = async (endpoint, query, username, password) => {
  let headers = {}
  const params = { source_content_type: 'application/json',
                   source: JSON.stringify(query) }
  let options = { params }

  if (process.client && username && password) {
    const token = btoa(`${username}:${password}`)
    headers.authorization = `Basic ${token}`
    options.credentials = 'include'
  }
  else if (username && password) {
    const token = Buffer.from(`${username}:${password}`).toString('base64')
    headers.authorization = `Basic ${token}`
    options.credentials = 'include'
  }

  options.headers = headers
  return await $fetch(endpoint, options)
}

export default fetchWith