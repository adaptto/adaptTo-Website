// pattern from https://gist.github.com/deunlee/0b45cfacb7e8f788e5bbfa2911f54d3e
const youTubeUrlPattern = /^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w-]{10,20})/i;

const embedYoutube = (vid, autoplay) => {
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  return `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="https://www.youtube.com/embed/${vid}?rel=0&v=${vid}${suffix}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
  </div>`;
};

const loadEmbed = (block, vid, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  block.innerHTML = embedYoutube(vid, autoplay);
  block.classList = 'block embed-youtube';
  block.classList.add('embed-is-loaded');
};

/**
 * Get YouTube Video ID from URL.
 * @param {string} href
 */
function getYouTubeVideoIdByUrl(url) {
  const match = url.match(youTubeUrlPattern);
  if (match) {
    return match[9];
  }
  return undefined;
}

/**
 * Embed YouTube video player.
 * Automatically uses https://i.ytimg.com/vi/<vid>/maxresdefault.jpg as placeholder image (with <vid> = video id).
 * @param {Element} block
 */
export default function decorate(block) {
  const link = block.querySelector('a')?.href;
  const vid = getYouTubeVideoIdByUrl(link);

  if (vid) {
    block.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    wrapper.innerHTML = `<img src="https://i.ytimg.com/vi/${vid}/maxresdefault.jpg"/>
      <div class="embed-placeholder-play"><button title="Play"></button></div>`;
    wrapper.addEventListener('click', () => {
      loadEmbed(block, vid, true);
    });
    block.append(wrapper);
  }
}
