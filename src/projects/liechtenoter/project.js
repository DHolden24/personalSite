// A screenshot shows as a placeholder until it has an image. To add one, put the
// light and dark mode images in screenshots/, import them, and set them as light
// and dark (the import handles the base path). If only one is set, it's used in
// both themes.
import calendarLight from './screenshots/calendar-light.png';
import calendarDark from './screenshots/calendar-dark.png';
import tournamentLight from './screenshots/tournament-light.png';
import tournamentDark from './screenshots/tournament-dark.png';
import techniqueLight from './screenshots/technique-light.png';
import techniqueDark from './screenshots/technique-dark.png';
import playLight from './screenshots/play-light.png';
import playDark from './screenshots/play-dark.png';
import personLight from './screenshots/person-light.png';
import personDark from './screenshots/person-dark.png';
import tagsLight from './screenshots/tags-light.png';
import tagsDark from './screenshots/tags-dark.png';
import statsLight from './screenshots/stats-light.png';
import statsDark from './screenshots/stats-dark.png';
import shareLight from './screenshots/share-light.png';
import shareDark from './screenshots/share-dark.png';
import icon from './icon.svg';

export default {
  name: 'Liechtenoter',
  icon, // the app icon, copied from hemaNote's liechtenoter/assets/icon/icon.svg
  color: '#9C2B1F',
  tagline: 'A Fechtbuch for the modern HEMAist.',
  description:
    'Liechtenoter is a training log for HEMA. You record your classes, sparring and tournaments on a calendar, write up the techniques you’re learning, and see your match results add up over time. The name comes from Johannes Liechtenauer, the 14th-century master behind much of the German longsword tradition. Your data is stored on your phone and nowhere else.',
  status: 'In development',
  platforms: ['iOS', 'Android'],
  tags: ['Flutter', 'Dart', 'Isar'],
  order: 1,
  features: [
    {
      title: 'Calendar',
      text: 'The app opens on a month view, with a small coloured icon on each day for each event. You can also set a focus for the month, such as “Krumphau and its counters”, and it shows at the top of the calendar. The event types are:',
      points: [
        'Class, with the instructor and lesson plan',
        'Sparring or tournament, with the matches',
        'Solo drills',
        'Source study: which treatise, which folio or verse, and your notes',
        'Other, for things like seminars or conditioning',
      ],
      screenshot: { light: calendarLight, dark: calendarDark, alt: 'Calendar month view with event icons and a monthly focus' },
    },
    {
      title: 'Matches',
      text: 'A sparring session or tournament can have as many matches as you like. Each match has an opponent (pick someone already in the app or type a new name), a weapon, and the score. For tournaments you can also add where it was, who ran it, how many people entered and where you placed.',
      screenshot: { light: tournamentLight, dark: tournamentDark, alt: 'A tournament with its placement and list of matches' },
    },
    {
      title: 'Techniques',
      text: 'This is the Fechtbuch part. Each technique has a description, any other names it goes by (Zornhau / Wrath Strike), the weapons it’s used with, and references to folios, books or videos. You can sort techniques into groups, and groups can sit inside other groups, for example Liechtenauer → Five Master Cuts → Zornhau.',
      screenshot: { light: techniqueLight, dark: techniqueDark, alt: 'A technique page with alternate names, references and groups' },
    },
    {
      title: 'Plays',
      text: 'A play is a two-person sequence. You write it out step by step, mark each step as the initiator’s or the responder’s, and link each one to its technique.',
      screenshot: { light: playLight, dark: playDark, alt: 'A play with initiator and responder steps' },
    },
    {
      title: 'People',
      text: 'Sparring partners, opponents and instructors each get a page with their club, weapons, notes and an optional link (a HEMA Ratings profile, say). The page also shows your record against them, every match you’ve had with them and any classes they’ve taught you. If you’ve added the same person twice, you can merge them.',
      screenshot: { light: personLight, dark: personDark, alt: 'A person’s page with a head-to-head record and match history' },
    },
    {
      title: 'Tags',
      text: 'In any notes field you can type # followed by a technique name, and the app will suggest matches. A saved tag becomes a link, so #Zornhau in a lesson plan opens the Zornhau page. If the technique doesn’t exist yet, you can pick a close match or create it then and there.',
      screenshot: { light: tagsLight, dark: tagsDark, alt: 'Typing a #tag in an event description, with technique suggestions' },
    },
    {
      title: 'Stats',
      text: 'The Stats page is built from your match results. You can filter it by date, event type and weapon.',
      points: [
        'Wins, losses, draws, win rate and average point margin',
        'Trends by month, week or session',
        'Tournament placements over time, adjusted for the size of each event',
        'Your record with each weapon and against each opponent',
      ],
      screenshot: { light: statsLight, dark: statsDark, alt: 'The Stats page with the overall record and a trend chart' },
    },
    {
      title: 'Sharing',
      text: 'You can send techniques, groups, plays and events to someone else as a QR code, or as a file if there’s too much for a QR code. An instructor could, for example, put together a curriculum and share it with their class. Shared events leave out your match results and placements. If something you import conflicts with what you already have, you choose whether to keep yours, take theirs, keep both or merge them.',
      screenshot: { light: shareLight, dark: shareDark, alt: 'A QR code for sharing the Zornhau technique' },
    },
    {
      title: 'Privacy',
      text: 'There are no accounts, and there is no server, cloud sync, analytics, advertising or tracking. Data only leaves your phone when you share something, export a file or make a backup. A backup can be restored on a new phone, and match results can be exported to or imported from a spreadsheet.',
    },
  ],
};
