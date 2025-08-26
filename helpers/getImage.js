/**
 * @function getImage
 * 
 * @param {String} img Media to request (usually a media id)
 * @param {String} endpoint WP REST endpoint (must be '/' terminated)
 * 
 * @returns {Object} JSON of media response
 * 
 **/ 

const getImage = async (img, endpoint) => {
  const url = new URL(`media/${img}`, endpoint)

  let imageData = await $fetch(url.href)
  const mediaDetails = imageData?.media_details

  // @TODO -- remove the imagedelivery plugin's -scaled.jpg bit in a smarter way
  if (!imageData.guid?.rendered) {
    imageData.guid = { rendered: imageData.source_url.replace('-scaled.jpg','.jpg') }
  }

  let imageAspect
  if (mediaDetails?.height > 0 && mediaDetails?.width > 0) {
    imageAspect = mediaDetails.height / mediaDetails.width
  }

  const desktopWidth = 1200
  const mobileWidth = 600

  const desktop = { aspect_ratio: imageAspect, width: desktopWidth, height: desktopWidth * imageAspect, source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageData.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=1800,quality=75,format=webp` }
  const mobile = { aspect_ratio: imageAspect, width: mobileWidth, height: mobileWidth * imageAspect, source_url: `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${imageData.guid.rendered.replace('https://', '').replace('http://', '').replace('wp-content/uploads/', '').replace('wp-json/wp/v2/', '')}/w=1200,quality=75,format=webp` }
  const mapped = {
        alt_text: imageData.alt_text,
        caption: {
          rendered: imageData.description.rendered.replace(/<img[^>]*>/g,"").replace(/<p[^>]*>|<\/p>/g, '').replace(/\r?\n|\r/g, "").replace(/<a[^>]*>|<\/a>/g, ''),
        },
        media_details: {
          sizes: {
            desktop,
            mobile,
          }
        }
      };

  return mapped;
}

export default getImage;