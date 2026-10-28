// server/api/wp-draft/[id].js
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const config = useRuntimeConfig();

  const wpUser = config.wpUser || process.env.NUXT_WP_USER;
  const wpPass = config.wpAuthToken || process.env.NUXT_WP_AUTH_TOKEN;
  const wpBaseUrl = (config.wpUrl || config.public?.wpUrl || process.env.NUXT_PUBLIC_PREVIEW_WP_URL).replace(/\/$/, '');

  const authHeader = 'Basic ' + Buffer.from(`${wpUser}:${wpPass}`).toString('base64');

  // Map query.type to the correct WordPress REST API endpoint
  const postType = query.type || 'page';
  let endpoint = 'pages';

  if (postType === 'post') {
    endpoint = 'posts';
  } else if (postType === 'media' || postType === 'attachment') {
    endpoint = 'media';
  } else if (postType !== 'page') {
    endpoint = postType; // Custom post types (exhibitions, events, etc.)
  }

  setResponseHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    const data = await $fetch(`${wpBaseUrl}/wp-json/wp/v2/${endpoint}/${id}`, {
      headers: {
        Authorization: authHeader,
      },
      query: {
        _t: Date.now(),
      },
    });

    return data;
  } catch (error) {
    console.error(`❌ Proxy Fetch Error for ${endpoint}/${id}:`, error.message);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: `Failed to fetch ${endpoint}/${id} from WordPress`,
    });
  }
});