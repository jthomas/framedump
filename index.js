'use strict'

const vm = require('vm')
const Debug = vm.runInDebugContext('Debug')

const options = {
  locals: true,
  args: true,
  refs: [],
  frames: 1
}

Debug.setListener((event, exec_state, event_data, data) => {
  if (event !== Debug.DebugEvent.Exception) {
    return
  }

  const max_frames = (options.frames <= exec_state.frameCount()) ? options.frames : exec_state.frameCount()
  let current_frame = 0

  console.log('UncaughtException listener triggered, dumping frames...')
  while(current_frame < max_frames) {
    const frame = exec_state.frame(current_frame)
    const location = frame.func().script().name() + ':' + (1 + frame.sourceLine())
    console.log(`Frame ${current_frame} (${location}):`)
    if (options.locals) {
      console.log(`local variables =>`)
      for (let local = 0; local < frame.localCount(); local++) {
        console.log('    var', frame.localName(local), '=', frame.localValue(local).value_)
      }
    }

    if (options.args) {
      console.log(`arguments =>`)
      for (let arg = 0; arg < frame.argumentCount(); arg++) {
        console.log('    ', frame.argumentName(arg), '=', frame.argumentValue(arg).value_)
      }
    }

    if (options.refs.length) {
      console.log(`scoped refs =>`)
      // haven't worked this out yet...
    }

    current_frame++
    console.log()
  }
})

module.exports = {
  monitor: (_options) => {
    Object.assign(options, _options)
    Debug.setBreakOnUncaughtException()
  },

  stop: () => {
    Debug.clearBreakOnUncaughtException()
  }
}
