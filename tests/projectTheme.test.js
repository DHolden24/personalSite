import { describe, expect, it } from 'vitest';
import { projectThemeOverrides } from '../src/projectTheme.js';
import { projects } from '../src/projects.js';

// WCAG contrast ratio between two #rrggbb colours.
function contrast(a, b) {
  const luminance = (hex) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const theme = {
  font: "'Test Serif', serif",
  fontSize: '18px',
  light: { page: '#eeeeee', surface: '#dddddd', rule: '#999999', text: '#111111', textSoft: '#444444', accent: '#990000' },
  dark: { page: '#111111', surface: '#222222', rule: '#555555', text: '#eeeeee', textSoft: '#bbbbbb', accent: '#ff7777' },
};

describe('projectThemeOverrides', () => {
  it('maps the light palette and font onto Naive UI', () => {
    const { common } = projectThemeOverrides(theme, false);
    expect(common).toMatchObject({
      fontFamily: theme.font,
      fontSize: '18px',
      bodyColor: '#eeeeee',
      tagColor: '#dddddd',
      textColor1: '#111111',
      textColor2: '#111111',
      textColor3: '#444444',
      primaryColor: '#990000',
      borderRadius: '0',
      borderColor: '#999999',
    });
  });

  it('gives pressed controls feedback and draws the switch in the palette', () => {
    const { common, Switch } = projectThemeOverrides(theme, false);
    expect(common.primaryColorPressed).toBe('#111111');
    expect(Switch).toEqual({ railColor: '#444444', buttonColor: '#eeeeee', iconColor: '#444444' });
  });

  it('uses the dark palette in dark mode', () => {
    const { common } = projectThemeOverrides(theme, true);
    expect(common).toMatchObject({ bodyColor: '#111111', textColor1: '#eeeeee', primaryColor: '#ff7777' });
  });

  it('draws status tags as text-coloured chips with an accent border', () => {
    const { Tag } = projectThemeOverrides(theme, false);
    for (const type of ['Warning', 'Success']) {
      expect(Tag[`textColor${type}`]).toBe('#111111');
      expect(Tag[`color${type}`]).toBe('#dddddd');
      expect(Tag[`border${type}`]).toBe('1px solid #990000');
    }
  });
});

describe('project themes', () => {
  const themed = projects.filter((p) => p.theme);

  it('includes at least one themed project', () => {
    expect(themed.length).toBeGreaterThan(0);
  });

  for (const p of themed) {
    for (const mode of ['light', 'dark']) {
      it(`${p.id} (${mode}) keeps every text colour at 4.5:1 or better`, () => {
        const c = p.theme[mode];
        expect(contrast(c.text, c.page)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(c.textSoft, c.page)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(c.accent, c.page)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(c.text, c.surface)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
