export interface GiphyImage {
    type: string;
    id: string;
    url: string;
    slug: string;
    bitly_gif_url: string;
    bitly_url: string;
    embed_url: string;
    username: string;
    source: string;
    title: string;
    rating: string;
    content_url: string;
    source_tld: string;
    source_post_url: string;
    is_sticker: boolean;
    import_datetime: string;
    trending_datetime: string;
    images: Images;
    analytics_response_payload: string;
    analytics: Analytics;
    alt_text: string;
    tags: string[];
    bottle_data: BottleData;
    response_id: string;
    is_anonymous: boolean;
    is_community: boolean;
    is_featured: boolean;
    is_hidden: boolean;
    is_indexable: boolean;
    is_preserve_size: boolean;
    is_realtime: boolean;
    is_removed: boolean;
    is_dynamic: boolean;
}

export interface Images {
    original: Original;
    downsized: Downsized;
    downsized_large: DownsizedLarge;
    downsized_medium: DownsizedMedium;
    downsized_small: DownsizedSmall;
    downsized_still: DownsizedStill;
    fixed_height: FixedHeight;
    fixed_height_downsampled: FixedHeightDownsampled;
    fixed_height_small: FixedHeightSmall;
    fixed_height_small_still: FixedHeightSmallStill;
    fixed_height_still: FixedHeightStill;
    fixed_width: FixedWidth;
    fixed_width_downsampled: FixedWidthDownsampled;
    fixed_width_small: FixedWidthSmall;
    fixed_width_small_still: FixedWidthSmallStill;
    fixed_width_still: FixedWidthStill;
    looping: Looping;
    original_still: OriginalStill;
    original_mp4: OriginalMp4;
    preview: Preview;
    preview_gif: PreviewGif;
    preview_webp: PreviewWebp;
    '480w_still': N480wStill;
}

export interface Original {
    height: number;
    width: number;
    size: string;
    url: string;
    mp4_size: string;
    mp4: string;
    webp_size: string;
    webp: string;
    frames: string;
    hash: string;
}

export interface Downsized {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface DownsizedLarge {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface DownsizedMedium {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface DownsizedSmall {
    height: number;
    width: number;
    mp4_size: string;
    mp4: string;
}

export interface DownsizedStill {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface FixedHeight {
    height: number;
    width: number;
    size: string;
    url: string;
    mp4_size: string;
    mp4: string;
    webp_size: string;
    webp: string;
}

export interface FixedHeightDownsampled {
    height: number;
    width: number;
    size: string;
    url: string;
    webp_size: string;
    webp: string;
}

export interface FixedHeightSmall {
    height: number;
    width: number;
    size: string;
    url: string;
    mp4_size: string;
    mp4: string;
    webp_size: string;
    webp: string;
}

export interface FixedHeightSmallStill {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface FixedHeightStill {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface FixedWidth {
    height: number;
    width: number;
    size: string;
    url: string;
    mp4_size: string;
    mp4: string;
    webp_size: string;
    webp: string;
}

export interface FixedWidthDownsampled {
    height: number;
    width: number;
    size: string;
    url: string;
    webp_size: string;
    webp: string;
}

export interface FixedWidthSmall {
    height: number;
    width: number;
    size: string;
    url: string;
    mp4_size: string;
    mp4: string;
    webp_size: string;
    webp: string;
}

export interface FixedWidthSmallStill {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface FixedWidthStill {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface Looping {
    mp4_size: string;
    mp4: string;
    width: number;
    height: number;
}

export interface OriginalStill {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface OriginalMp4 {
    height: number;
    width: number;
    mp4_size: string;
    mp4: string;
}

export interface Preview {
    height: number;
    width: number;
    mp4_size: string;
    mp4: string;
}

export interface PreviewGif {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface PreviewWebp {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface N480wStill {
    height: number;
    width: number;
    size: string;
    url: string;
}

export interface Analytics {
    onload: Onload;
    onclick: Onclick;
    onsent: Onsent;
}

export interface Onload {
    url: string;
}

export interface Onclick {
    url: string;
}

export interface Onsent {
    url: string;
}

export interface BottleData {
    unknown?: string;
}
