// server/api/preview.js
export default defineEventHandler((event) => {
    // ES6 Object Destructuring for query parameters
    const { secret, id, type } = getQuery(event)
    const config = useRuntimeConfig();

    const receivedSecret = String(secret || '').trim()
    const storedSecret = String(config.wpPreviewSecret || '').trim()

    // 2. Validate
    if (!receivedSecret || receivedSecret !== storedSecret) {
        throw createError({
        statusCode: 401,
        statusMessage: 'Invalid preview token'
        })
    }
  
    // 2. Set temporary preview session cookie
    setCookie(event, 'preview_id', String(id), {
      httpOnly: true,
      maxAge: 60 * 15 // 15 minutes
    })
  
    // 3. Redirect using ES6 Template Literals
    return sendRedirect(event, `/preview?id=${id}&type=${type}`)
  })