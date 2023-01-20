import { createOptimizedPicture, getMetadata, readBlockConfig } from '../../scripts/lib-franklin.js';
import { getQueryIndex } from '../../scripts/services/QueryIndex.js';
import { append } from '../../scripts/utils/dom.js';
import { parseCSVArray } from '../../scripts/utils/metadata.js';
import { getDocumentName } from '../../scripts/utils/path.js';
import { getSiteRootPath, getSpeakerOverviewPath } from '../../scripts/utils/site.js';

/**
 * Create speaker image (or fallback image);
 * @typedef {import('../../scripts/services/QueryIndexItem').default} QueryIndexItem
 * @param {QueryIndexItem} speakerItem
 */
function createSpeakerImage(speakerItem) {
  if (speakerItem.image) {
    return createOptimizedPicture(
      speakerItem.image,
      speakerItem.title,
      false,
      [{ width: '500' }],
    );
  }

  // use fallback image
  const img = document.createElement('img');
  img.src = '/resources/img/speaker_placeholder.svg';
  return img;
}

/**
 * Add markup for speaker
 * @typedef {import('../../scripts/services/QueryIndex').default} QueryIndex
 * @param {Element} parent Parent element
 * @param {string} speaker Speaker name or reference
 * @param {QueryIndex} queryIndex Query index
 */
function addSpeaker(parent, speaker, queryIndex) {
  const speakerItem = queryIndex.getSpeaker(speaker);
  if (!speakerItem) {
    return;
  }

  const speakerUrl = `${getSpeakerOverviewPath(window.location.pathname)}#${getDocumentName(speakerItem.path)}`;

  const div = append(parent, 'div', 'speaker');

  const imageAnchor = append(div, 'a');
  imageAnchor.href = speakerUrl;
  imageAnchor.append(createSpeakerImage(speakerItem));

  const nameDiv = append(div, 'div', 'name');
  const a = append(nameDiv, 'a');
  a.href = speakerUrl;
  a.textContent = speakerItem.title;

  if (speakerItem.twitter) {
    const twitterDiv = append(div, 'div', 'twitter');
    const twitterAnchor = append(twitterDiv, 'a');
    twitterAnchor.textContent = speakerItem.twitter;
    twitterAnchor.href = `https://twitter.com/${speakerItem.twitter}`;
  }

  if (speakerItem.affiliation) {
    const affiliationDiv = append(div, 'div', 'affiliation');
    affiliationDiv.textContent = speakerItem.affiliation;
  }
}

/**
 * List speakers.
 * @typedef {import('../../scripts/services/QueryIndex').default} QueryIndex
 * @param {Element} parent Parent element
 * @param {string[]} speakers Speaker names or references
 * @param {QueryIndex} queryIndex Query index
 */
function listSpeakers(parent, speakers, queryIndex) {
  if (speakers.length === 0) {
    return;
  }

  const div = append(parent, 'div', 'speakers');
  speakers.forEach((speaker) => addSpeaker(div, speaker, queryIndex));
}

/**
 * List lightning talk speakers.
 * @param {Element} parent Parent element
 * @param {string[]} speakers Speaker names or references
 * @param {QueryIndex} queryIndex Query index
 */
function listLightningTalkSpeakers(parent, speakers, queryIndex) {
  if (speakers.length === 0) {
    return;
  }
  const h4 = append(parent, 'h4');
  h4.textContent = 'Additional speakers (Lightning Talks)';

  const div = append(parent, 'div', 'speakers', 'lightning-talk');
  speakers.forEach((speaker) => addSpeaker(div, speaker, queryIndex));
}

/**
 * Speaker Gallery.
 * @param {Element} block
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const queryIndex = await getQueryIndex();

  // check for list of speakers from block config
  const speakers = parseCSVArray(cfg.speakers);
  if (speakers.length > 0) {
    listSpeakers(block, speakers, queryIndex);

  // otherwise render gallery with all speakers in the schedule
  } else {
    // get all speakers from schedule
    const siteRoot = getSiteRootPath(document.location.pathname);

    // headline for speaker gallery
    const h1 = append(block, 'h1');
    h1.textContent = getMetadata('og:title');

    listSpeakers(block, queryIndex.getTalkSpeakerNames(siteRoot), queryIndex);
    listLightningTalkSpeakers(block, queryIndex.getLightningTalkSpeakerNames(siteRoot), queryIndex);
  }
}
