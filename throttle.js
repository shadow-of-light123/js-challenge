// 节流函数：限制函数在一段时间内最多执行一次
// @param {Function} fn - 要执行的原始函数
// @param {number} wait - 时间间隔（毫秒）
function throttle(fn, wait) {
  // 使用闭包保存上一次执行的时间戳
  let startTime = 0

  // 返回闭包函数，接收任意参数
  return function (...args) {
    // 获取当前时间戳
    const nowTime = Date.now()

    // 检查时间间隔是否超过wait
    // 如果当前时间 - 上次执行时间 > wait，则执行函数
    if (nowTime - startTime > wait) {
      // 更新上次执行时间为当前时间
      startTime = nowTime
      // 执行原始函数，正确传递this上下文和参数
      return fn.apply(this, args)
    }
    // 如果时间间隔未超过wait，不执行函数
  }
}
