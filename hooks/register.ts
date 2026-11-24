import type { Register } from 'claude-code'
import { phraseFor, WIDTH } from './scenes'

const FRAME_MS = 120
// After this many frames with no spinner drawn, the animation timer stops
const IDLE_FRAMES = 3

let isOn = true
let frame = 0
let timer: { cancel: () => void } | undefined
let idleFrames = 0

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'dune', description: 'Toggle the Dune spinner (/dune, /dune on, /dune off)' })
    const stored = await $.store.get('isOn')
    if (typeof stored === 'boolean') isOn = stored
    return next(e)
  })

  on('command.run', { command: 'dune' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    isOn = arg === 'on' ? true : arg === 'off' ? false : !isOn
    await $.store.set('isOn', isOn)
    $.ui.invalidate('ui.render')
    return { text: isOn ? 'The spice must flow. Dune spinner on.' : 'Dune spinner off.' }
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'terminal' || !isOn) return next(e)

    const [word, scene] = phraseFor(e.props.word)
    const line = await next(e.props.message === null ? { ...e, props: { ...e.props, word } } : e)
    // A narrow terminal keeps the whole row for the engine's line
    if ((e.viewport?.columns ?? 80) < 50) return line

    idleFrames = 0
    if (timer === undefined) {
      timer = $.clock.every(FRAME_MS, () => {
        idleFrames += 1
        if (idleFrames > IDLE_FRAMES) {
          timer?.cancel()
          timer = undefined
          return
        }
        frame += 1
        $.ui.invalidate('ui.render')
      })
    }

    const { Box, Text } = $.ui.resolve(e)
    // The engine draws its line under a blank row, so the scene steps down one row to sit beside it
    return Box({
      flexDirection: 'row',
      children: [
        Box({
          marginTop: 1,
          flexShrink: 0,
          children: [
            Box({
              key: 'dune',
              flexDirection: 'row',
              width: WIDTH,
              flexShrink: 0,
              children: scene(frame).map(c => Text({ color: c.color, children: [c.ch] })),
            }),
            Text({ children: [' '] }),
          ],
        }),
        line,
      ],
    })
  })

  on('ui.render', { component: 'TurnDuration' }, async ($, e, next) =>
    isOn ? next({ ...e, props: { ...e.props, word: 'Harvested' } }) : next(e),
  )
}
