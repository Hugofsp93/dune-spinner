# Dune Spinner

Dune mode for [Claude Code](https://claude.com/claude-code). While Claude works, a little Arrakis scene animates beside the spinner, and the spinner words come from Dune.

```
( ( ◉ )_.~'~ ✻ Riding the sandworm…
   -=◇=-  ⌒⌒ ✻ Flying the ornithopter…
· ✦ · · · ·  ✻ Harvesting spice…
‹(◉)›_‹(◉)›  ✻ Watching through the distrans…
 ▬▬ι═══✦══ﺤ  ✻ Drawing the crysknife…
‹(◉)› ~ )))  ✻ Using the Voice…
[=≡( ✦ )≡=]  ✻ Guiding the Heighliner…
```

19 phrases, 7 scenes: a sandworm longer than the line crawling across the dunes, an ornithopter flapping over them, spice glittering orange and blue, a Fremen's eyes of Ibad above the distrans, a glint running along the crysknife, the Voice rippling out, and a Guild Heighliner with its core pulsing.

## Install

From a terminal:

```sh
claude plugin marketplace add Hugofsp93/dune-spinner
claude plugin install dune-spinner@hugofsp93
```

Or inside Claude Code:

```
/plugin marketplace add Hugofsp93/dune-spinner
/plugin install dune-spinner@hugofsp93
```

Then start a new session, or run `/reload-plugins`.

## Usage

| Command     | Effect                  |
| ----------- | ----------------------- |
| `/dune`     | Toggle the Dune spinner |
| `/dune on`  | Turn it on              |
| `/dune off` | Turn it off             |

It is on after install, and your choice persists across sessions.

- Terminal only. The desktop app keeps its own spinner.
- In a terminal narrower than 50 columns, the scene steps aside and only the Dune words show.
- If a glyph shows up wrong (a star drawn as an `F`, say), restart the terminal: it is usually a stale font cache.

## What it does

One hooks module, `hooks/register.ts`, with the scenes in `hooks/scenes.ts`.

- `ui.render` on `Spinner`: swaps the spinner word for a Dune phrase and draws its scene beside Claude Code's own spinner line, one frame every 120 ms while the spinner shows.
- `ui.render` on `TurnDuration`: the line that closes a turn says "Harvested".
- `/dune` and `$.store`: the on/off switch, saved on your machine.

It sends no data anywhere, makes no network requests and runs no processes.

## License

MIT. A fan project, not affiliated with the Dune rights holders.
