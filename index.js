function E() {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  getOfflineEmits() {
    return this.st || (this.st = {});
  },
  reemit(name) {
    if (!this.getOfflineEmits()[name]) return;
    this.getOfflineEmits()[name].forEach(f => f());
    // 重新发布的操作只能执行1次
    delete this.getOfflineEmits()[name];
  },
  on: function(name, callback, ctx) {
    var e = this.e || (this.e = {});
    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx,
    });
    this.reemit(name);
    return this;
  },
  once: function(name, callback, ctx) {
    var self = this;
    function listener() {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    }
    // listener 是对 callback 的一个装饰
    listener._ = callback;
    this.on(name, listener, ctx);
    this.reemit(name);
    return this;
  },
  emit: function(name, reemitFunction) {
    // 这里如果希望给data参数，就必须传入reemitFunction参数了。这是tiny-emitter设计上因为时效性（这个库完全没有用到ES6语法）引起的缺陷
    var data = [].slice.call(arguments, 2);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    if (typeof reemitFunction === 'function') {
      this.getOfflineEmits()[name] = this.getOfflineEmits()[name] || [];
      this.getOfflineEmits()[name].push(reemitFunction);
    }
    return this;
  },
  off: function(name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];
    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        // once 的事件会有 _ 这个属性
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }
    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910
    (liveEvents.length) ? e[name] = liveEvents : delete e[name];
    return this;
  },
};

module.exports = E;
module.exports.TinyEmitter = E;
