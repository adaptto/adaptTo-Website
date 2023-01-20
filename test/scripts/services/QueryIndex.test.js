/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getQueryIndex } from '../../../scripts/services/QueryIndex.js';
import { stubFetchUrlMap } from '../test-utils.js';

stubFetchUrlMap({ '/query-index.json': '/test/test-data/query-index-sample.json' });
const queryIndex = await getQueryIndex();

describe('services/QueryIndex', () => {
  it('getItem-all-properties', () => {
    const item = queryIndex.getItem('/sample-all-properties');
    expect(item).to.exist;
    expect({
      path: '/sample-all-properties',
      title: 'Sample Title',
      robots: 'no-index, no-follow',
      image: '/sample-image.jpg',
      tags: '["Tag1","Tag2"]',
      affiliation: 'Company 1',
      twitter: '@twitter1',
      'speaker-alias': 'speaker-1',
      uptoyear: '2020',
      speakers: 'Speaker 1, Speaker 2',
    }).to.eql(item);
    expect(item.getRobots()).to.eql(['no-index', 'no-follow']);
    expect(item.getTags()).to.eql(['Tag1', 'Tag2']);
    expect(item.getSpeakers()).to.eql(['Speaker 1', 'Speaker 2']);
  });

  it('getItem-missing-properties', () => {
    const item = queryIndex.getItem('/sample-missing-properties');
    expect(item).to.exist;
    expect(item.getRobots()).to.eql([]);
    expect(item.getTags()).to.eql([]);
  });

  it('getItem-tags-csv-fallback', () => {
    const item = queryIndex.getItem('/sample-tags-csv-fallback');
    expect(item).to.exist;
    expect(item.getTags()).to.eql(['Tag1', 'Tag2']);
  });

  it('getItem-invalid-path', () => {
    const item = queryIndex.getItem('/invalid-path');
    expect(item).to.not.exist;
  });

  it('getAllSiteRoots', () => {
    const result = queryIndex.getAllSiteRoots();
    expect(result.map((item) => item.path)).to.eql(['/2021/', '/2020/']);
  });

  it('getSpeaker-by-name', () => {
    const item = queryIndex.getSpeaker('Speaker #1');
    expect(item?.path).to.eq('/speakers/speaker1');
  });

  it('getSpeaker-by-document-name', () => {
    const item = queryIndex.getSpeaker('speaker1');
    expect(item?.path).to.eq('/speakers/speaker1');
  });

  it('getSpeaker-by-pathname', () => {
    const item = queryIndex.getSpeaker('/speakers/speaker1');
    expect(item?.path).to.eq('/speakers/speaker1');
  });

  it('getSpeaker-by-url', () => {
    const item = queryIndex.getSpeaker('https://my.host.com/speakers/speaker1');
    expect(item?.path).to.eq('/speakers/speaker1');
  });

  it('getSpeaker-invalid-name', () => {
    const item = queryIndex.getSpeaker('Speaker XYZ');
    expect(item).to.not.exist;
  });

  it('getSpeaker-valid-path-invalid-speaker', () => {
    const item = queryIndex.getSpeaker('/sample-all-properties');
    expect(item).to.not.exist;
  });
});
