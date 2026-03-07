function throttle(fn, wait) {
  let startTime = 0
  return function (...args) {
    let nowTime = Date.now()
    if (nowTime - startTime >= wait) {
      startTime = nowTime
      return fn.apply(this, args)
    }
  }
}
