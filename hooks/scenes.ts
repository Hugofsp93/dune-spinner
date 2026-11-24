// The scenes: one line of WIDTH cells per frame, each cell a char and a color.

export type Cell = { ch: string; color: string }
export type Scene = (frame: number) => Cell[]

export const WIDTH = 12

const SAND = '#d7af87'
const WORM = '#af875f'
const METAL = '#bcbcbc'
const BLADE = '#eeeeee'
const SHINE = '#ffffaf'
const SPICE = ['#ff8700', '#00afff', '#ffaf00', '#0087ff', '#ffd700']
const WATER = '#00afff'
const VOICE = '#af87ff'

const cells = (s: string, color: string): Cell[] => [...s].map(ch => ({ ch, color }))
const fill = (row: Cell[]): Cell[] => [...row, ...cells(' '.repeat(Math.max(0, WIDTH - row.length)), SAND)]

const worm: Scene = i => {
  const body = [...'╭──◉']
  const p = i % (WIDTH + body.length)
  return [...'∴∵'.repeat(WIDTH)].slice(0, WIDTH).map((ch, x) => {
    const k = x - (p - body.length)
    return k >= 0 && k < body.length ? { ch: body[k]!, color: WORM } : { ch, color: SAND }
  })
}

const ornithopter: Scene = i => {
  const dunes = [...'  ⌒⌒   ⌒  '.repeat(2)]
  const off = i % 11
  return [...cells(i % 2 ? '-=◇=-' : '>=◇=<', METAL), ...cells(' ', SAND), ...cells(dunes.slice(off, off + WIDTH - 6).join(''), SAND)]
}

const spice: Scene = i => {
  const dots = '·∙•✦'
  const row: Cell[] = []
  for (let x = 0; x < WIDTH; x += 2) {
    const v = (i + x * 7) % 9
    row.push({ ch: v < 4 ? dots[v]! : '·', color: SPICE[v % SPICE.length]! }, { ch: ' ', color: SAND })
  }
  return row
}

// The blade slides out of the sheath, then a glint runs along it
const crysknife: Scene = i => {
  const f = i % 16
  const len = Math.min(f, 6)
  const blade = cells('═'.repeat(len) + (f >= 6 ? 'ﺤ' : ''), BLADE)
  if (f >= 7) blade[(f - 7) % 7] = { ch: '✦', color: SHINE }
  return fill([...cells('▬▬ι', WORM), ...blade])
}

// A drop of sweat falls and climbs back, recycled by the suit
const stillsuit: Scene = i => fill(cells(`( ${'˚·.∘○∘.·'[i % 8]} )`, WATER))

const voice: Scene = i => fill(cells('◉' + ' )'.repeat(i % 4), VOICE))

export const PHRASES: ReadonlyArray<readonly [string, Scene]> = [
  ['Harvesting spice', spice],
  ['Riding the sandworm', worm],
  ['Training with the Bene Gesserit', voice],
  ['Sweating in a stillsuit', stillsuit],
  ['Dwelling in the sietch', worm],
  ['Drawing the crysknife', crysknife],
  ['Spotting wormsign', worm],
  ['Dreaming of melange', spice],
  ['Entering the spice trance', spice],
  ['Summoning Shai-Hulud', worm],
  ['Using the Voice', voice],
  ['Flying the ornithopter', ornithopter],
]

// The engine samples one word per turn, so the same word maps to the same phrase
export const phraseFor = (word: string) => {
  let hash = 0
  for (const ch of word) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PHRASES[hash % PHRASES.length]!
}
