import { afterEach, describe, expect, it } from 'vitest';
import { mountAt } from './mountAt.js';

let wrapper;
afterEach(() => wrapper?.unmount());

describe('routes', () => {
  it('lists projects on the home page, linking to their pages', async () => {
    ({ wrapper } = await mountAt('/'));
    const link = wrapper.find('a[href="/projects/liechtenoter"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain('Liechtenoter');
    expect(document.title).toBe('Darren Holden');
  });

  it('shows a project page with a link to its privacy policy', async () => {
    ({ wrapper } = await mountAt('/projects/liechtenoter'));
    expect(wrapper.find('h1').text()).toBe('Liechtenoter');
    expect(wrapper.find('a[href="/projects/liechtenoter/privacy"]').exists()).toBe(true);
    expect(document.title).toBe('Liechtenoter · Darren Holden');
  });

  it('renders the privacy policy Markdown as HTML', async () => {
    ({ wrapper } = await mountAt('/projects/liechtenoter/privacy'));
    expect(wrapper.find('article h1').text()).toBe('Liechtenoter Privacy Policy');
    expect(wrapper.find('article h2').exists()).toBe(true);
  });

  it.each(['/projects/nope', '/projects/nope/privacy', '/whatever'])('shows not found for %s', async (path) => {
    ({ wrapper } = await mountAt(path));
    expect(wrapper.text()).toContain('Page not found');
    expect(document.title).toBe('Not found · Darren Holden');
  });
});
