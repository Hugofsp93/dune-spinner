// The scenes: one line of WIDTH cells per frame, each cell a char and a color.

export type Cell = { ch: string; color: string }
export type Scene = (frame: number) => Cell[]

export const WIDTH = 12

const SAND = '#d7af87'
const WORM = '#af875f'
const METAL = '#bcbcbc'
const BLADE = '#eeeeee'
const SHINE = '#ffffaf'
const GLOW = '#00afff'
const MASK = '#875f00'
const VOICE = '#af87ff'
const BLUE = ['#0087ff', '#00afff', '#00d7ff', '#00afff']
const SPICE = ['#ff8700', '#00afff', '#ffaf00', '#0087ff', '#ffd700']
const DUNE = "~._.~'"

const cells = (s: string, color: string): Cell[] => [...s].map(ch => ({ ch, color }))
const blank = (n: number) => cells(' '.repeat(Math.max(0, n)), SAND)
// center a narrow drawing in WIDTH columns
const center = (row: Cell[]): Cell[] => {
  const gap = WIDTH - row.length
  return [...blank(Math.floor(gap / 2)), ...row, ...blank(Math.ceil(gap / 2))]
}
// blue eyes that blink now and then
const eye = (i: number): Cell[] => [...cells('‹(', MASK), { ch: i % 20 === 0 ? '–' : '◉', color: BLUE[i % 4]! }, ...cells(')›', MASK)]

// The worm, a bit longer than the line, crawls across the dunes
const crawling: Scene = i => {
  const body = [...'( '.repeat(6) + '◉ )'] // 15 cols
  const p = i % (WIDTH + body.length)
  return Array.from({ length: WIDTH }, (_, x) => {
    const k = x - (p - body.length)
    return k >= 0 && k < body.length ? { ch: body[k]!, color: WORM } : { ch: DUNE[(x + i) % DUNE.length]!, color: SAND }
  })
}

// The ornithopter in the middle, flapping, dunes rolling under it on both sides
const ornithopter: Scene = i => {
  const d = [...'  ⌒⌒  ⌒   ⌒⌒⌒   ⌒  ⌒⌒ ']
  const left = Math.floor((WIDTH - 7) / 2)
  const land = (from: number, n: number) => cells(Array.from({ length: n }, (_, x) => d[(x + from + i) % d.length]).join(''), SAND)
  return [...land(0, left), ...blank(1), ...cells(i % 2 ? '-=◇=-' : '>=◇=<', METAL), ...blank(1), ...land(left, WIDTH - 7 - left)]
}

// Spice glittering orange, gold and blue across the line
const spice: Scene = i =>
  Array.from({ length: WIDTH }, (_, x) => {
    if (x % 2) return { ch: ' ', color: SAND }
    const v = (i + x * 7) % 9
    return { ch: v < 4 ? '·∙•✦'[v]! : '·', color: SPICE[v % SPICE.length]! }
  })

// A Fremen's eyes of Ibad above the distrans
const distrans: Scene = i => center([...eye(i), ...cells('_', MASK), ...eye(i)])

// The whole crysknife drawn; a glint runs along the blade, then a pause
const crysknife: Scene = i => {
  const blade = cells('══════ﺤ', BLADE)
  const at = i % 13
  if (at < blade.length) blade[at] = { ch: '✦', color: SHINE }
  return center([...cells('▬▬ι', WORM), ...blade])
}

// The Voice ripples out; centered at its widest so the eye stays still
const voice: Scene = i => {
  const row = [...cells('‹(', VOICE), { ch: '◉', color: BLUE[i % 4]! }, ...cells(')› ~ ' + ')'.repeat(1 + (i % 4)), VOICE)]
  return [...row, ...blank(WIDTH - row.length)] // up to 4 waves: 12 cols
}

// A Guild Heighliner: a light runs along the hull, the core pulses
const heighliner: Scene = i => {
  const hull = [...'=='] // 2 each side: 1 + 2 + 5 + 2 + 1 = 11
  hull[i % 2] = '≡'
  return center([
    ...cells('[' + hull.join('') + '( ', METAL),
    { ch: '✦✧·✧'[i % 4]!, color: GLOW },
    ...cells(' )' + [...hull].reverse().join('') + ']', METAL),
  ])
}

export const PHRASES: ReadonlyArray<readonly [string, Scene]> = [
  ['Riding the sandworm', crawling],
  ['Spotting wormsign', crawling],
  ['Summoning Shai-Hulud', crawling],
  ['Flying the ornithopter', ornithopter],
  ['Dwelling in the sietch', ornithopter],
  ['Harvesting spice', spice],
  ['Dreaming of melange', spice],
  ['Entering the spice trance', spice],
  ['Dive into the spice', distrans],
  ['Watching through the distrans', distrans],
  ['Sweating in a stillsuit', distrans],
  ['Crossing the deep desert', distrans],
  ['Drawing the crysknife', crysknife],
  ["Unsheathing the maker's tooth", crysknife],
  ['Using the Voice', voice],
  ['Training with the Bene Gesserit', voice],
  ['Consulting the Guild Navigator', heighliner],
  ['Guiding the Heighliner', heighliner],
  ['Charting a safe path', heighliner],
]

// The engine samples one word per turn, so the same word maps to the same phrase
export const phraseFor = (word: string) => {
  let hash = 0
  for (const ch of word) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PHRASES[hash % PHRASES.length]!
}
