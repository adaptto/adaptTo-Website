import { append } from '../../scripts/dom-utils.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { getScheduleData } from '../../scripts/ScheduleData.js';
import { getSiteRoot } from '../../scripts/site-utils.js';

const dayIdPattern = /^#day-(\d)$/;

/**
 * Gets the active day from current location hash.
 * @returns {number} Active day or undefined.
 */
function getActiveDayFromHash() {
  const dayIdMatch = window.location.hash.match(dayIdPattern);
  if (dayIdMatch) {
    return parseInt(dayIdMatch[1], 10);
  }
  return undefined;
}

/**
 * Displays schedule for given day.
 * @param {Element} block
 * @param {number} day
 */
function displayDay(block, day) {
  block.querySelectorAll('a.active').forEach((a) => a.classList.remove('active'));
  block.querySelector(`a[rel="id-day-${day}"]`)?.classList.add('active');
  block.querySelectorAll('.tab-content.active').forEach((div) => div.classList.remove('active'));
  block.querySelector(`#id-day-${day}`)?.classList.add('active');
}

/**
 * Build tab navigation links.
 * @typedef {import('../../scripts/ScheduleDay').default} ScheduleDay
 * @param {Element} element
 * @param {ScheduleDay[]} days
 * @param {number} activeDay
 */
function buildTabNavigation(parent, days, activeDay) {
  const tabNav = append(parent, 'div', 'tab-navigation');
  days.forEach((day) => {
    const link = append(tabNav, 'a');
    link.href = `#day-${day.day}`;
    link.rel = `id-day-${day.day}`;
    link.textContent = `Day ${day.day}`;
    if (day.day === activeDay) {
      link.classList.add('active');
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      displayDay(parent, day.day);
      window.history.pushState(null, null, `#day-${day.day}`);
    });
  });
}

/**
 * Build schedule entry cells markup.
 * @typedef {import('../../scripts/ScheduleEntry').default} ScheduleEntry
 * @param {Element} tr
 * @param {ScheduleEntry} entry
 * @param {number} colSpan
 * @param {boolean} speakerColumn
 */
function buildDayEntryCells(tr, entry, colSpan, speakerColumn) {
  // time
  const tdTime = append(tr, 'td', 'time');
  const timeOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
  append(tdTime, 'time').textContent = entry.start.toLocaleTimeString('en-GB', timeOptions);
  tdTime.append(' - ');
  append(tdTime, 'time').textContent = entry.end.toLocaleTimeString('en-GB', timeOptions);

  // title & link
  const tdTitle = append(tr, 'td', 'title');
  if (colSpan > 1) {
    tdTitle.setAttribute('colspan', colSpan);
  }
  if (entry.talkPath) {
    const link = append(tdTitle, 'a');
    link.href = entry.talkPath;
    link.textContent = entry.title;
  } else {
    tdTitle.textContent = entry.title;
  }

  // speaker
  if (speakerColumn) {
    append(tr, 'td', 'speaker').textContent = entry.speakers.join(', ');
  } else {
    append(tdTitle, 'div', 'speaker').textContent = entry.speakers.join(', ');
  }
}

/**
 * Build schedule entry row markup.
 * @typedef {import('../../scripts/ScheduleEntry').default} ScheduleEntry
 * @param {Element} tbody
 * @param {ScheduleEntry[]} entries Entries, possible multiple parallel
 * @param {number} trackCount Max. number of parallel tracks this day
 */
function buildDayEntryRow(tbody, entries, trackCount) {
  const tr = append(tbody, 'tr', entries[0].type);

  entries.forEach((entry) => {
    const colSpan = (trackCount - entries.length) * 2 + 1;
    buildDayEntryCells(tr, entry, colSpan, trackCount === 1);
  });
}

/**
 * Build schedule markup for day.
 * @typedef {import('../../scripts/ScheduleDay').default} ScheduleDay
 * @param {Element} parent
 * @param {ScheduleDay} day
 * @param {number} activeDay
 */
function buildDaySchedule(parent, day, activeDay) {
  const tabContent = append(parent, 'div', 'tab-content');
  tabContent.id = `id-day-${day.day}`;
  if (day.day === activeDay) {
    tabContent.classList.add('active');
  }

  // parallelize entries with multiple tracks
  let trackCount = 1;
  const groupedEntries = [];
  day.entries.forEach((entry) => {
    if (entry.track > 0) {
      if (entry.track === 1) {
        const parallelEntries = [entry,
          ...day.entries.filter((e) => e.start.getTime() === entry.start.getTime() && e.track > 1)];
        if (parallelEntries.length > trackCount) {
          trackCount = parallelEntries.length;
        }
        groupedEntries.push(parallelEntries);
      }
    } else {
      groupedEntries.push([entry]);
    }
  });

  // show date
  const dateOptions = { dateStyle: 'full' };
  const h4 = append(tabContent, 'h4');
  const date = append(h4, 'date');
  date.setAttribute('datetime', day.start.toISOString().substring(0, 10));
  date.textContent = day.start.toLocaleDateString('en-GB', dateOptions);

  // table header
  const table = append(tabContent, 'table');
  const thead = append(table, 'thead');
  const tr = append(thead, 'tr');
  append(tr, 'th', 'time').textContent = 'Time';
  append(tr, 'th', 'title').textContent = 'Topic';
  if (trackCount === 1) {
    append(tr, 'th', 'speaker').textContent = 'Speaker';
  }

  // table content
  const tbody = append(table, 'tbody');
  groupedEntries.forEach((entries) => buildDayEntryRow(tbody, entries, trackCount));
}

/**
 * Builds schedule based on schedule-data sheet.
 * @param {Element} block
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // load schedule data
  const siteRoot = getSiteRoot(document.location.pathname);
  const scheduleDataUrl = cfg.scheduledataurl || `${siteRoot}schedule-data.json`;
  const queryIndexUrl = cfg.queryindexurl || '/query-index.json';
  const scheduleData = await getScheduleData(scheduleDataUrl, queryIndexUrl);

  // detect active day
  let activeDay = getActiveDayFromHash();
  if (!activeDay) {
    activeDay = 1;
    window.history.replaceState(null, null, `#day-${activeDay}`);
  }

  // react to stage changes via hash
  window.addEventListener('hashchange', () => {
    const day = getActiveDayFromHash();
    if (day) {
      displayDay(block, day);
    }
  });

  // render schedule
  const days = scheduleData.getDays();
  if (days.length > 0) {
    buildTabNavigation(block, days, activeDay);
    days.forEach((day) => buildDaySchedule(block, day, activeDay));
  }
}
