require('./index.js').monitor({frames: 1, refs: ['global_ref']})

var global_ref = 'global variable contents';

function broken (arg_a) {
  const local = "local_value"
  const number = 12345
  const local_arr = [1, 2, 3]
  const local_f = () => going.to.die()
  // de-reference undefined...

  local_f()
}

broken('arg_a_contents')
