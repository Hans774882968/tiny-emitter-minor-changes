# tiny-emitter

A tiny (less than 1k) event emitter library.

## Install

### npm

```
npm install tiny-emitter --save
```

## Usage

```js
var Emitter = require('tiny-emitter');
var emitter = new Emitter();

emitter.on('some-event', function (arg1, arg2, arg3) {
 //
});

emitter.emit('some-event', 'arg1 value', 'arg2 value', 'arg3 value');
```

Alternatively, you can skip the initialization step by requiring `tiny-emitter/instance` instead. This pulls in an already initialized emitter.

```js
var emitter = require('tiny-emitter/instance');

emitter.on('some-event', function (arg1, arg2, arg3) {
 //
});

emitter.emit('some-event', 'arg1 value', 'arg2 value', 'arg3 value');
```

## Instance Methods

### on(event, callback[, context])

Subscribe to an event

* `event` - the name of the event to subscribe to
* `callback` - the function to call when event is emitted
* `context` - (OPTIONAL) - the context to bind the event callback to

### once(event, callback[, context])

Subscribe to an event only **once**

* `event` - the name of the event to subscribe to
* `callback` - the function to call when event is emitted
* `context` - (OPTIONAL) - the context to bind the event callback to

### off(event[, callback])

Unsubscribe from an event or all events. If no callback is provided, it unsubscribes you from all events.

* `event` - the name of the event to unsubscribe from
* `callback` - the function used when binding to the event

### emit(event[, arguments...])

Trigger a named event

* `event` - the event name to emit
* `arguments...` - any number of arguments to pass to the event subscribers

## Test and Build

Build (Tests, Browserifies, and minifies)

```
npm install
npm run build
```

Test

```
yarn
npm test
```

如果你运行`npm test`时遇到报错：`No headless browser found.`，你会发现搜索引擎无法找到解决方案。下面我分享一下。

`testling 1.7.1`这句提示在`bin/cmd.js`，不够友好，在1.7.4版本进行了更改。从[代码](https://github.com/ljharb/testling/compare/v1.7.1...v1.7.4)的`bin/cmd.js`中可以看到，我们首先要安装`phantomjs`，然后要手动删除`~/.config/browser-launcher/config.json`来迫使`browser-launcher`（`testling`的依赖）重新检测并生成上述json文件。最后再次运行`npm test`即可。

如果发现`npm test`没反应，那么说明测试没在进行。我们在`node_modules/testling/bin/cmd.js`的`launch`函数调用前加一行代码：

```js
console.log(href, opts);
launch(href, opts, function (err, ps) {
    if (err) return console.error(err);
});
```

这样可以得到`href`，举例：http://localhost:49948/__testling?show=true。我们点开这个链接，测试就可以开始运行了。期望的输出如下：

```
TAP version 13
# subscribes to an event
ok 1 subscribed to event
# subscribes to an event with context
ok 2 is in context
# subscibes only once to an event
ok 3 removed event from list
# keeps context when subscribed only once
ok 4 is in context
ok 5 not subscribed anymore
# emits an event
ok 6 triggered event
# passes all arguments to event listener
ok 7 passed the first argument
ok 8 passed the second argument
# unsubscribes from all events with name
# unsubscribes single event with name and callback
# unsubscribes single event with name and callback when subscribed twice
ok 9 removes all events
# unsubscribes single event with name and callback when subscribed twice out of order
ok 10 callback was called
# removes an event inside another event
ok 11 event is still in list
ok 12
# event is emitted even if unsubscribed in the event callback
ok 13 all callbacks were called
# calling off before any events added does nothing
# emitting event that has not been subscribed to yet
# unsubscribes single event with name and callback which was subscribed once
# exports an instance
ok 14 exports an instance
ok 15 an instance of the Emitter class
# emit before listen test 1
function installToast()
ok 16 should be equivalent

1..16
# tests 16
# pass  16

# ok
```

npm显示错误退出不用管，看到浏览器显示上面的内容即可。

测试失败的输出内容举例：

```
# emit before listen test 1
function installToast()
not ok 16 should be equivalent
  ---
    operator: deepEqual
    expected: [ 'reemit1', 'ctf11', 'reemit2', 'ctf2', 'ctf0' ]
    actual:   [ 'reemit1', 'ctf1', 'reemit2', 'ctf2', 'ctf0' ]
    at: Test.assert [as _assert] (http://localhost:50433/__testling?show=true:14152:17)
  ...

1..16
# tests 16
# pass  15
# fail  1
```

## License

[MIT](https://github.com/scottcorgan/tiny-emitter/blob/master/LICENSE)
