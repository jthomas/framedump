# framedump
Log v8 frame context when Node.js traps an _uncaughtException_.

Using the _process.on('uncaughtException', (err) => {})_ handler, we can get notified when an exceptions bubbles to the top of the event loop. The _err_ argument contains the stack trace triggering the exception. 

However, we have no access to the local execution context that triggered the exception. It can be useful when debugging to see the values of local variables, function arguments and other references to allow you to find the source of the issue.

framedump will automatically log the contents of the execution frame whenever an _uncaughtException_ is thrown. 

usage
--

```
// these are the default values, pass in argument to override.
let options = {
  locals: true, // log local variable definitions in frame
  args: true, // log arguments definition in frame
  frames: 1, // number of frames to dump starting from error location
  exprs: [] // log results of evaluating these expressions
}
require('framedump').monitor(options)
```

See the example.js file for sample usage.

output
--

```
[17:27:52 ~/code/v8debugger]$ node example.js
UncaughtException listener triggered, dumping frames...
Frame 0 (/Users/james/code/v8debugger/example.js:8):
local variables =>
    var local = string
    var number = 12345
    var local_arr = [ 1, 2, 3 ]
arguments =>
     arg_a = arg_a_contents
evaluate exprs =>
     process.memoryUsage() = { rss: 23187456, heapTotal: 10619424, heapUsed: 5087904 }

/Users/james/code/v8debugger/example.js:8
  going.to.die()
  ^

ReferenceError: going is not defined
    at broken (/Users/james/code/v8debugger/example.js:8:3)
    at Object.<anonymous> (/Users/james/code/v8debugger/example.js:11:1)
    at Module._compile (module.js:399:26)
    at Object.Module._extensions..js (module.js:406:10)
    at Module.load (module.js:345:32)
    at Function.Module._load (module.js:302:12)
    at Function.Module.runMain (module.js:431:10)
    at startup (node.js:141:18)
    at node.js:977:3
```    

how it works
--

Using the [_vm.runInDebugContent()_](https://nodejs.org/api/vm.html#vm_vm_runindebugcontext_code) method, we dynamically gain access to the [V8 debugger](https://github.com/v8/v8/blob/master/src/debug/debug.js) at runtime. This allows us to add an breakpoint handler [triggered by uncaught exceptions](https://github.com/v8/v8/blob/master/src/debug/debug.js#L820-L822). This callback is executed with a reference to the [current execution frame](https://github.com/v8/v8/blob/master/src/debug/mirrors.js#L1817). Walking the frame stack, we can pull off [local variable definitions](https://github.com/v8/v8/blob/master/src/debug/mirrors.js#L1905-L1917), [function arguments](https://github.com/v8/v8/blob/master/src/debug/mirrors.js#L1890-L1902) and [evaluate JS expressions](https://github.com/v8/v8/blob/master/src/debug/mirrors.js#L2011-L2019). 
