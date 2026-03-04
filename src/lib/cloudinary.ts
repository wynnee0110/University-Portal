import { CLOUDINARY_CLOUD_NAME } from '@/constants';

/**
 * Extracts the Cloudinary public ID from either:
 *  - A full Cloudinary URL  (https://res.cloudinary.com/<cloud>/image/upload/v123/folder/file.jpg)
 *  - A bare public ID       (folder/file  or  folder/file.jpg)
 *
 * The returned value has no leading slash and no file extension.
 */
export const extractPublicId = (value: string): string => {
    // If it looks like a full URL, parse out the public ID portion
    if (value.startsWith('http')) {
        // Everything after "/upload/" (and an optional version segment like "v1234567890/")
        const match = value.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]{2,4})?$/i);
        return match ? match[1] : value;
    }
    // Already a public ID — strip extension if present
    return value.replace(/\.[a-z]{2,4}$/i, '');
};

/**
 * Builds an optimised Cloudinary image URL for a banner photo.
 * Accepts either a Cloudinary public ID or a full Cloudinary URL.
 * Uses the Cloudinary URL API directly — no SDK required.
 *
 * Transformations applied:
 *  - Fill crop 600×400
 *  - Auto format, quality, DPR
 *  - Text overlay (name) in the south-west corner
 */
export const bannerPhoto = (imageCldPubIdOrUrl: string, name: string): string => {
    const publicId = extractPublicId(imageCldPubIdOrUrl);
    const encodedName = encodeURIComponent(name);
    const transformations = [
        'c_fill,w_600,h_400',
        'f_auto',
        'q_auto',
        'dpr_auto',
        `l_text:Arial_20_bold:${encodedName},co_white,g_west,x_20,y_20`,
    ].join('/');

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};