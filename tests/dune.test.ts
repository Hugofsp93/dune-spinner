import { expect, test } from 'claude-code/testing'
import { PHRASES, phraseFor, WIDTH } from '../hooks/scenes'

test('every scene draws exactly WIDTH cells on every frame', () => {
  for (const [word, scene] of PHRASES)
    for (let f = 0; f < 40; f++) expect([word, f, scene(f).length]).toEqual([word, f, WIDTH])
})

test('each cell is a single char', () => {
  for (const [, scene] of PHRASES) for (let f = 0; f < 40; f++) for (const c of scene(f)) expect([...c.ch].length).toBe(1)
})

test('the same engine word always maps to the same phrase', () => {
  expect(phraseFor('Thinking')[0]).toBe(phraseFor('Thinking')[0])
  expect(PHRASES.map(p => p[0])).toContain(phraseFor('Baking')[0])
})

test('the spinner shows a Dune word and the scene beside the engine line', async ($, on) => {
  on('clock.every', () => ({ value: undefined }))
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    const { Text } = $.ui.resolve(e)
    return Text({ children: [`* ${e.props.word}…`] })
  })
  const m = await $.ui.mount({
    plugin: 'dune-spinner', surface: 'terminal', component: 'Spinner',
    props: { word: 'Thinking', message: null, suffix: '…', mode: 'thinking' },
    viewport: { columns: 120, rows: 40 },
  })
  const tree = JSON.stringify(await m.drawn())
  expect(tree).toContain(phraseFor('Thinking')[0])
  expect(tree).toContain('"key":"dune"')
})
