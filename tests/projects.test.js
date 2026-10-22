import { describe, expect, it } from 'vitest';
import { findProject, projects } from '../src/projects.js';

describe('projects', () => {
  it('loads each project folder, using the folder name as the id', () => {
    expect(projects.map((p) => p.id)).toContain('liechtenoter');
    expect(findProject('liechtenoter').name).toBe('Liechtenoter');
  });

  it('attaches the privacy policy Markdown when the project has one', () => {
    expect(findProject('liechtenoter').privacyPolicy).toMatch(/^# Liechtenoter Privacy Policy/);
  });

  it('returns undefined for an unknown project', () => {
    expect(findProject('nope')).toBeUndefined();
  });
});
