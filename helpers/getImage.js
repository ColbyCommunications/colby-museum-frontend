/**
 * @function getImage
 *
 * @param {String|Number} img Media ID to request
 * @param {String} endpoint WP REST endpoint, ending with "/"
 *
 * @returns {Object} Normalized media response
 */

const cleanMediaCaption = (html = '') => {
    return String(html)
        .replace(/<div[^>]*class=["'][^"']*wp-(?:video|audio)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
        .replace(/<(video|audio)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<source\b[^>]*\/?>/gi, '')
        .replace(/<img\b[^>]*\/?>/gi, '')
        .replace(/<\/?p\b[^>]*>/gi, '')
        .replace(/<\/?a\b[^>]*>/gi, '')
        .replace(/\[(?:video|audio)[^\]]*\][\s\S]*?\[\/(?:video|audio)\]/gi, '')
        .replace(/\[(?:video|audio)[^\]]*\]/gi, '')
        .replace(
            /https?:\/\/[^\s<>"']+\.(?:mp4|m4v|webm|ogv|mov|mp3|m4a|ogg|wav)(?:\?[^\s<>"']*)?/gi,
            '',
        )
        .replace(/\r?\n|\r/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const getImage = async (img, endpoint) => {
    const url = new URL(`media/${img}`, endpoint);

    const imageData = await $fetch(url.href);
    const mediaDetails = imageData?.media_details;

    if (!imageData.guid?.rendered && imageData.source_url) {
        imageData.guid = {
            rendered: imageData.source_url.replace('-scaled.jpg', '.jpg'),
        };
    }

    let imageAspect;

    if (mediaDetails?.height > 0 && mediaDetails?.width > 0) {
        imageAspect = mediaDetails.height / mediaDetails.width;
    }

    const desktopWidth = 1200;
    const mobileWidth = 600;

    const deliverySource = imageData.guid?.rendered
        ?.replace('https://', '')
        .replace('http://', '')
        .replace('wp-content/uploads/', '')
        .replace('wp-json/wp/v2/', '');

    const desktop = {
        aspect_ratio: imageAspect,
        width: desktopWidth,
        height: imageAspect ? desktopWidth * imageAspect : undefined,
        source_url: deliverySource
            ? `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${deliverySource}/w=1800,quality=75,format=webp`
            : imageData.source_url,
    };

    const mobile = {
        aspect_ratio: imageAspect,
        width: mobileWidth,
        height: imageAspect ? mobileWidth * imageAspect : undefined,
        source_url: deliverySource
            ? `https://imagedelivery.net/O3WFf73JpL0l5z5Q_yyhTw/${deliverySource}/w=1200,quality=75,format=webp`
            : imageData.source_url,
    };

    return {
        mime_type: imageData.mime_type,
        source_url: imageData.source_url,
        alt_text: imageData.alt_text || '',

        // Use the actual WordPress attachment caption, not its description.
        caption: {
            rendered: cleanMediaCaption(
                imageData.description?.rendered || imageData.caption?.rendered || '',
            ),
        },

        media_details: {
            sizes: {
                desktop,
                mobile,
            },
        },
    };
};

export default getImage;
