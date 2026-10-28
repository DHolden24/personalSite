// Turns a project's `theme` (see README.md) into Naive UI theme overrides, so a
// project's pages can wear the colours and type of the app they describe.
export function projectThemeOverrides(theme, dark) {
  const c = dark ? theme.dark : theme.light;
  const statusTag = (type) => ({
    [`textColor${type}`]: c.text,
    [`color${type}`]: c.surface,
    [`border${type}`]: `1px solid ${c.accent}`,
  });
  return {
    common: {
      fontFamily: theme.font,
      fontSize: theme.fontSize,
      fontWeightStrong: '600',
      borderRadius: '0',
      bodyColor: c.page,
      cardColor: 'transparent',
      modalColor: c.page,
      popoverColor: c.page,
      tagColor: c.surface,
      textColorBase: c.text,
      textColor1: c.text,
      textColor2: c.text,
      textColor3: c.textSoft,
      dividerColor: c.surface,
      borderColor: c.rule,
      primaryColor: c.accent,
      primaryColorHover: c.accent,
      primaryColorPressed: c.text,
      primaryColorSuppl: c.accent,
    },
    Tag: { ...statusTag('Warning'), ...statusTag('Success') },
    // Naive's translucent rail and white knob all but vanish on parchment. The
    // knob's icon defaults to black, which disappears on the dark ink knob.
    Switch: { railColor: c.textSoft, buttonColor: c.page, iconColor: c.textSoft },
  };
}
