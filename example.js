require('./index.js').monitor({exprs: ['process.memoryUsage()']})

function broken (arg_a) {
  const local = "string"
  const number = 12345
  const local_arr = [1, 2, 3]
  // de-reference undefined...
  going.to.die()
}

broken('arg_a_contents')
