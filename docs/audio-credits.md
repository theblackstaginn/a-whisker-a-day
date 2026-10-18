# Audio credits

A Whisker a Day bundles only redistributable audio for Yarrow and the optional hearth ambience.

## Yarrow purr

- App file: `assets/audio/yarrow-purr.mp3`
- Source recording: **Whiskers' purr edit.ogg**
- Recorder: Adam Cuerden; edited version credited on Wikimedia Commons
- Original source: https://commons.wikimedia.org/wiki/File:Whiskers%27_purr_edit.ogg
- License: Public domain
- The bundled MP3 is a trimmed, levelled, EQ'd derivative. The app fades it before the recording's noisy tail so the hiss at the end is not heard.

## Yarrow meow

- App file: `assets/audio/yarrow-meow.mp3`
- Source recording: **Cute Kitten Meow**
- Creator: Breviceps
- Original source: https://freesound.org/people/Breviceps/sounds/448084/
- License: CC0 1.0
- The bundled MP3 is the creator's publicly distributed preview/derivative of the CC0 kitten recording.

## Hearth music

- App file: `assets/audio/hearth-music.ogg`
- Track: **encounter-tiferet**
- Source project: Sparks of Kether
- Source/license notes: https://github.com/swamp-dev/sparks-of-kether/blob/d9375f04663a1a4c5ac6cbae14e56571cf0882fe/assets/audio/LICENSE.md
- License posture: CC0 / public domain, rights waived by the source project
- The track is a warm C-major loop with celesta-like plucks and a gentle arch melody. It replaces the darker Heavenly Loop candidate.
- Used as an optional low-volume looping background track. Music is off by default and can be toggled in Settings.

## Behavior

- Yarrow's purr and meow respect the existing Yarrow Sounds toggle.
- Hearth music has its own separate toggle and is off by default.
- All three files are cached by the service worker for offline use after the app has loaded online once.
