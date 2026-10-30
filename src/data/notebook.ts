// Shared navigation and small labels for the V6 notebook. Biographical copy
// remains in home.ts/work.ts; the redesign does not create a second biography.
import type { NBAccentKey } from "./palette";

export const NOTEBOOK_NAV = [
  { key: "home", label: "Home", short: "Home", path: "/", act: "01" },
  { key: "now", label: "Now", short: "Now", path: "/now/", act: "02" },
  { key: "work", label: "Timeline", short: "Timeline", path: "/work/", act: "03" },
  { key: "builds", label: "Projects & tools", short: "Projects", path: "/builds/", act: "04" },
  { key: "writing", label: "Writing", short: "Writing", path: "/writing/", act: "05" },
  { key: "contact", label: "Contact", short: "Contact", path: "/contact/", act: "06" },
] as const;

export const PENS: { key: NBAccentKey; label: string }[] = [
  { key: "blue", label: "AI safety" },
  { key: "purple", label: "AI / ML" },
  { key: "magenta", label: "Mathematics" },
  { key: "prompt", label: "Physics" },
  { key: "red", label: "Biotech" },
  { key: "teal", label: "Geospatial" },
  { key: "ochre", label: "Fintech" },
  { key: "cyan", label: "Hardware" },
  { key: "yellow", label: "Infrastructure" },
  { key: "orange", label: "Outreach" },
];

export const NOTEBOOK_COPY = {
  brand: "Shubz Sharma",
  subtitle: "a field notebook",
  edition: "Notes, experiments & things made along the way.",
  location: "London, UK",
  deskKicker: "The desk · an introduction",
  hello: "Hello, I'm",
  name: "Shubz.",
  bookTitle: "Field notes",
  bookByline: "Shubz Sharma · vol. 06",
  bookHint: "open the notebook",
  bookClose: "close the notebook",
  bookInscription: "A few things I'm working on.",
  terminalTitle: "a small working terminal",
  terminalHelp: "Try help, ls, cat bio, cat .now, open /writing, or pen teal.",
  terminalUnknown: "I don't know that command. Try help.",
  terminalChips: ["help", "ls", "cat .now", "cat bio", "pet"],
  terminalGreeting: "shubz@notebook ~ %",
  empty: "Nothing in this drawer yet.",
};

export const COLLECTION_COPY = {
  title: "Things I've made.",
  lede: "The projects, experiments and tools behind the essays. Open a case to try the working diagram; follow the label for the full story.",
  exhibits: "Working specimens",
  projects: "The project catalogue",
  tools: "The collection drawer",
  appearances: "Out in the world",
  publishedNotes: "read the field notes ↗",
  search: "Search projects, tools or topics…",
};

// Page furniture lives here so copy edits do not require layout changes.
export const WALK_COPY = {
  educationResults: "Education & results",
  complete: 'The complete walk', jump: 'Jump to any entry',
  label: 'The walk · work & study', title: 'A walk through', titleEm: 'the work.',
  lede: 'Engineering, research, and the paths between them. Follow the years, or go straight to the annotated record.',
  conventional: 'The conventional edition', cv: 'Curriculum vitæ', pdf: 'PDF · Shubhangi Sharma',
  record: 'The annotated record', projects: 'projects & tools ↗',
  route: 'Field route / 2019 onwards', fullEntry: 'read the full entry ↓',
  pause: 'pause the walk', play: 'play the walk', slider: 'use the year slider', scroll: 'follow the walk as you scroll', skip: 'skip to the record ↓',
};
export const WRITING_COPY = {
  label: 'The writing · essays & working notes', essays: 'The essays', subscribe: 'subscribe via RSS ↗',
  search: 'Find an essay, idea or project…', all: 'All subjects',
  empty: 'No essays match this search. Try another subject or clear the search.',
};
export const JOURNAL_COPY = {
  label: 'The journal · a weekly-ish snapshot', current: 'Right now.', plate: 'On my plate',
  journal: 'Field journal', notes: 'Notes along the way.', newer: '← newer', older: 'older →',
  reading: 'On the reading shelf', fable: 'the shelf on Fable ↗', conditions: 'Conditions',
};
export const LETTER_COPY = {
  label: 'A letter · contact', compose: 'Write a note', open: 'Open in your mail app ↗',
  handedOff: 'Over to your mail app.', ready: 'Your note is ready to review and send there.',
  edit: 'unfold & edit ↶', elsewhere: 'Other ways to find me',
};
export const TTY_COPY = {
  label: 'A side entrance / ~/tty', title: 'The notebook,', titleEm: 'from the command line.',
  fold: 'fold away the map', unfold: 'unfold the notebook map',
};

export const MARGIN_EXPERIMENT = {
  label: 'Experiments',
  href: '/fisher-wave/',
  link: 'Fisher–KPP · see the equation ↗',
};

export const WORKBENCH_COPY = {
  edition: 'FIELD NOTEBOOK / WORKBENCH 06',
  status: 'systems, sketches & side quests',
  homeCommand: 'whoami',
  sceneNote: 'paper first. terminal second.',
  terminalLabel: 'COMMAND LINE / LIVE INPUT',
};

export const COMPANION_COPY = {
  name: 'Pixel',
  descriptor: 'the notebook’s resident robo-cat',
  label: 'COMPANION / PX–01',
  pet: 'Pet Pixel',
  rest: 'rest',
  follow: 'follow',
  quiet: 'quiet mode',
  animate: 'allow motion',
  hide: 'hide companion',
  show: 'bring Pixel back',
  idle: 'Keeping an eye on the notebook.',
  curious: 'Something interesting over there?',
  purring: 'A very small, very mechanical purr.',
  sleeping: 'Recharging. The notebook can wait.',
  walking: 'Coming along for the walk.',
  help: 'Try pet, pet sleep, pet wake, pet quiet, pet show, or pet hide.',
  quietResponse: 'Quiet mode on. Pixel will keep still.',
  motionResponse: 'Idle motion restored. Reduced-motion preferences still apply.',
  hiddenResponse: 'Pixel is tucked away. Use pet show to bring the companion back.',
  shownResponse: 'Pixel is back at the notebook.',
};

export const CABINET_COPY = {
 title: 'The tools cabinet',
 total: 'Total inventory',
 intro: 'Ten subjects, one drawer for each. Open a drawer to see the tools, and follow a provenance note to where I used them.',
 search: 'Search every tool, technique and provenance note…',
 all: 'All subjects',
 tools: 'tools',
 provenance: 'Where I used it',
 cv: 'CV · provenance',
 open: 'Open a drawer',
 close: 'Close drawer',
 projects: 'Project index',
 projectHint: 'Open a project for its notes, numbers and links.',
 photographs: 'Away from the screen',
 photoHint: 'Teams, classrooms and a few things that happened in person.',
 noTools: 'No tools match this search. Try a tool name or a subject.',
 noProjects: 'No projects match this search. Try another subject or clear the search.',
 contextExpand: 'More context',
};
// Each signature record belongs to one existing inventory item. The full
// record appears inside that item's provenance disclosure, never as a second card.
export const CORE_TOOL_BINDINGS: Record<string,string> = {
 'LLM eng · tool schemas · evals': 'LLM evaluation',
 'Rust · Golang': 'Rust · Golang',
 'Claude API · Anthropic SDK': 'Claude API',
 'Quantum Information · ZX': 'Quantum Information',
 'Founding / building from zero': 'Founding from zero',
};

export const DISCOVERY_COPY = {
 find: 'Find', title: 'The field index',
 description: 'Search the work, writing, tools, biography and journal. Each result opens its original record.',
 search: 'Search the notebook', placeholder: 'Try Python, quantum, Oxford, or a project…',
 index: 'Search', atlas: 'Subject atlas', close: 'Close field index',
 empty: 'Nothing in the notebook matches that yet. Try a subject or a shorter name.',
 keyboard: '↑ ↓ move through results · Enter opens · Esc closes',
 atlasNote: 'Ten inks connect the essays, projects and tools. Each subject opens its drawer in the collection.',
 soundHelp: 'Try sound on, sound off, or sound test. Sounds start muted and only play after deliberate actions.',
 soundTest: 'A short sound check.',
 soundMuted: 'Sound is off. Use sound on to enable it.',
 soundEnabled: 'Sound on. Soft interaction cues are enabled.',
 soundDisabled: 'Sound off.',
 soundOn: 'Sound: on', soundOff: 'Sound: off', soundUnavailable: 'Sound unavailable',
 soundHint: 'Soft sounds for deliberate interactions. No background audio.',
};

export const GUIDE_COPY = {
 title: 'Follow a thread.',
 label: 'Projects, writing & the tools behind them',
 intro: 'Start with a project, look inside the toolbox, or follow a subject across the work and writing.',
 subjects: 'Follow a subject',
 projects: 'All projects', tools: 'All tools', lab: 'Essay experiments',
 subjectIntro: 'Projects, writing, tools and career notes filed under this subject.',
 writing: 'Writing in this thread', career: 'Where it appears in the work',
 noProjects: 'No project is filed under this subject yet.',
 noWriting: 'No writing is filed under this subject yet.',
 homeProjects: 'Projects',
 homeWriting: 'Read a little further',
 homeAbout: 'About me, in full',
 homeNotes: 'At the desk',
};

export const PAGE_JUMPS = {about:'About me ↓',now:[{label:'Current work',href:'#current-work'},{label:'Journal',href:'#journal-notes'}]};

export const FILTER_COPY = {
  subjectTools: "Search tools in this subject…",
  clear: "Clear search",
  reset: "Reset filters",
  allProjects: "Show all projects",
};

export const EDITORIAL_COPY = {
  published: "Published editions", shelf: "The publishing shelf", imprint: "SHUBZ / FIELD EDITIONS",
  read: "Read the essay", contents: "Inside this edition", allNotes: "Every entry, newest first.",
  desk: "On the current desk", threads: "Open threads", snapshot: "Snapshot", archive: "The field journal",
  years: "Jump to a year", note: "Journal note", dateLink: "Link to this note", conditions: "Desk notes",
  source: "From the notebook", current: "Current work", reading: "Reading beside the notebook",
};
