// server/api/wp-draft/[id].js
export default defineEventHandler(async (event) => {
    // 1. Extract parameters and config
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)
    const config = useRuntimeConfig()
  
    // Fallback checks for env variables if runtimeConfig key mappings differ
    const wpUser = config.wpUser || process.env.NUXT_WP_USER
    const wpPass = config.wpAuthToken || process.env.NUXT_WP_AUTH_TOKEN
    const wpBaseUrl = config.wpUrl || config.public?.previewWpUrl || process.env.NUXT_PUBLIC_PREVIEW_WP_URL
  
    // 2. Build the correct Basic Auth header (Username + App Password)
    const authHeader = 'Basic ' + Buffer.from(`${wpUser}:${wpPass}`).toString('base64')
  
    // 3. Determine endpoint ('pages', 'posts', or custom post types)
    const postType = query.type || 'page'
    const endpoint = postType === 'page' ? 'pages' : (postType === 'post' ? 'posts' : postType)
  
    // 4. Set headers to prevent browser caching
    setResponseHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate')
  
    try {
      const draft = await $fetch(`${wpBaseUrl}/wp-json/wp/v2/${endpoint}/${id}`, {
        headers: {
          Authorization: authHeader, // Uses Basic Auth for WP Application Passwords
        },
        query: {
          _t: Date.now(), // Forces WP to bypass REST API query caches for live previews
        },
      })
  
      return draft
    } catch (error) {
      console.error('❌ Fetch Error Status:', error.response?.status)
      console.error('❌ Fetch Error Message:', error.message)
      console.error('❌ Fetch Error Cause:', error.cause)
  
      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: 'Failed to fetch draft from WordPress',
      })
    }
  })