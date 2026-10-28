import { afterEach, describe, expect, it } from 'vitest';
import { mountAt } from './mountAt.js';
import { findProject } from '../src/projects.js';

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

  it('labels the theme switch with icons, not emoji', async () => {
    ({ wrapper } = await mountAt('/'));
    const toggle = wrapper.find('[role="switch"]');
    expect(toggle.text()).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(toggle.findAll('svg[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it("shows each project's app icon as an image on the home and project pages", async () => {
    const { icon } = findProject('liechtenoter');
    ({ wrapper } = await mountAt('/'));
    expect(wrapper.find('a[href="/projects/liechtenoter"] img[data-test="project-icon"]').attributes('src')).toBe(icon);
    wrapper.unmount();
    ({ wrapper } = await mountAt('/projects/liechtenoter'));
    expect(wrapper.find('img[data-test="project-icon"]').attributes('src')).toBe(icon);
    expect(wrapper.text()).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it("sets the page's prose font from the project's theme, and leaves other pages alone", async () => {
    ({ wrapper } = await mountAt('/'));
    expect(wrapper.find('.page').attributes('style') ?? '').not.toContain('--font-prose');
    wrapper.unmount();
    ({ wrapper } = await mountAt('/projects/liechtenoter/privacy'));
    const { theme } = findProject('liechtenoter');
    expect(wrapper.find('.page').element.style.getPropertyValue('--font-prose')).toBe(theme.font);
  });

  it("squares off tags on a themed project's page, and keeps them round elsewhere", async () => {
    ({ wrapper } = await mountAt('/'));
    expect(wrapper.findAll('.n-tag').every((t) => t.classes('n-tag--round'))).toBe(true);
    wrapper.unmount();
    ({ wrapper } = await mountAt('/projects/liechtenoter'));
    const tags = wrapper.findAll('.n-tag');
    expect(tags.length).toBeGreaterThan(0);
    expect(tags.some((t) => t.classes('n-tag--round'))).toBe(false);
  });

  it('shows a project page with a link to its privacy policy', async () => {
    ({ wrapper } = await mountAt('/projects/liechtenoter'));
    expect(wrapper.find('h1').text()).toBe('Liechtenoter');
    expect(wrapper.find('a[href="/projects/liechtenoter/privacy"]').exists()).toBe(true);
    expect(document.title).toBe('Liechtenoter · Darren Holden');
  });

  it('shows a section per feature, with a placeholder where a screenshot is still to come', async () => {
    ({ wrapper } = await mountAt('/projects/liechtenoter'));
    const { features } = findProject('liechtenoter');
    expect(wrapper.findAll('section h2').map((h) => h.text())).toEqual(features.map((f) => f.title));
    const pending = features.filter((f) => f.screenshot && !f.screenshot.light && !f.screenshot.dark);
    const placeholders = wrapper.findAll('[data-test="screenshot-placeholder"]');
    expect(placeholders).toHaveLength(pending.length);
    placeholders.forEach((p, i) => expect(p.text()).toContain(pending[i].screenshot.alt));
  });

  it('shows the screenshot matching the theme, falling back to the other one', async () => {
    const [first, second] = findProject('liechtenoter').features;
    const saved = [first.screenshot, second.screenshot];
    first.screenshot = { ...first.screenshot, light: 'light.png', dark: 'dark.png' };
    second.screenshot = { ...second.screenshot, light: 'only-light.png', dark: null };
    try {
      localStorage.setItem('theme', 'light');
      ({ wrapper } = await mountAt('/projects/liechtenoter'));
      const srcs = () => wrapper.findAll('section img').slice(0, 2).map((img) => img.attributes('src'));
      expect(srcs()).toEqual(['light.png', 'only-light.png']);

      await wrapper.find('[role="switch"]').trigger('click');
      expect(srcs()).toEqual(['dark.png', 'only-light.png']);
    } finally {
      [first.screenshot, second.screenshot] = saved;
      localStorage.clear();
    }
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
