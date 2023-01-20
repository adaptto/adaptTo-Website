/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { buildBlock } from '../../../scripts/lib-franklin.js';
import decorate from '../../../blocks/schedule/schedule.js';
import { setWindowLocationHref, stubFetchUrlMap } from '../../scripts/test-utils.js';
import { clearQueryIndexCache } from '../../../scripts/services/QueryIndex.js';

/**
 * @param {string} year
 */
async function buildScheduleBlock(year) {
  clearQueryIndexCache();
  // simulate schedule URL and redirect fetch calls to mock data
  setWindowLocationHref(`/${year}/schedule`);
  const stub = stubFetchUrlMap({
    [`/${year}/schedule-data.json`]: `/test/test-data/schedule-data-${year}.json`,
    '/query-index.json': `/test/test-data/query-index-schedule-${year}.json`,
  });
  const block = buildBlock('schedule', []);
  await decorate(block);
  stub.restore();
  return block;
}

describe('blocks/schedule', () => {
  it('2020', async () => {
    const schedule = await buildScheduleBlock('2020');

    expect(schedule.querySelector('.tab-navigation a[rel="id-day-1"].active')).to.exist;
    expect(schedule.querySelector('.tab-navigation a[rel="id-day-2"]')).to.exist;
    expect(schedule.querySelector('.tab-navigation a[rel="id-day-3"]')).to.exist;

    expect(schedule.querySelector('#id-day-1.tab-content.active')).to.exist;
    expect(schedule.querySelector('#id-day-2.tab-content')).to.exist;
    expect(schedule.querySelector('#id-day-3.tab-content')).to.exist;

    const day1 = schedule.querySelector('#id-day-1');
    expect(day1.querySelector('h4 > date').getAttribute('datetime')).to.eq('2020-09-28');
    expect(day1.querySelectorAll('table > tbody > tr').length).to.eq(19);
  });

  it('2021', async () => {
    const schedule = await buildScheduleBlock('2021');

    expect(schedule.querySelector('.tab-navigation a[rel="id-day-1"].active')).to.exist;
    expect(schedule.querySelector('.tab-navigation a[rel="id-day-2"]')).to.exist;
    expect(schedule.querySelector('.tab-navigation a[rel="id-day-3"]')).to.exist;

    expect(schedule.querySelector('#id-day-1.tab-content.active')).to.exist;
    expect(schedule.querySelector('#id-day-2.tab-content')).to.exist;
    expect(schedule.querySelector('#id-day-3.tab-content')).to.exist;

    const day1 = schedule.querySelector('#id-day-1');
    expect(day1.querySelector('h4 > date').getAttribute('datetime')).to.eq('2021-09-27');
    expect(day1.querySelectorAll('table > tbody > tr').length).to.eq(16);
  });
});
