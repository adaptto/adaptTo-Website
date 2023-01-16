/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

document.body.innerHTML = await readFile({ path: '../../scripts/dummy.html' });

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/lib-franklin.js');

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const headerBlock = buildBlock('header', [['Nav', '/test/blocks/header/nav']]);
document.querySelector('header').append(headerBlock);
decorateBlock(headerBlock);
await loadBlock(headerBlock);
await sleep();

describe('Header block', () => {
  it('Header', async () => {
    const header = document.querySelector('header .section-header');
    expect(header).to.exist;

    const logo = header.querySelector('a.logo');
    expect(logo).to.exist;
    expect(logo.href).to.eq('http://localhost:2000/');

    const h1 = header.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.textContent).to.eq('adaptTo()');

    const h2 = header.querySelector('h2');
    expect(h2).to.exist;
    expect(h2.textContent).to.eq('Slogan');
  });

  it('Main Navigation', async () => {
    const mainNav = document.querySelector('header .section-mainnav');
    expect(mainNav).to.exist;

    const mobileNav = mainNav.querySelector('h1.mobile-nav a');
    expect(mobileNav).to.exist;

    const navList = mainNav.querySelector(':scope > ul');
    expect(navList).to.exist;

    const a = navList.querySelector(':scope > li > a');
    expect(a).to.exist;
    expect(a.href).to.eq('http://localhost:2000/2021/');
  });
});
