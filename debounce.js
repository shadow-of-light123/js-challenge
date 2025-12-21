// 防抖函数：限制函数在一段时间内只执行最后一次
// @param {Function} fn - 要执行的原始函数
// @param {number} wait - 时间间隔（毫秒）
function debounce(fn, wait) {
  // 使用闭包保存定时器引用，确保多次调用共享同一个定时器
  let timer = null

  // 返回闭包函数，接收任意参数
  return function (...args) {
    // 检查是否存在未执行的定时器
    if (timer) {
      // 清除之前的定时器，取消待执行的函数
      clearTimeout(timer)
      // 重置定时器状态，避免内存泄漏
      timer = null
    }

    // 设置新的定时器，延迟wait毫秒后执行
    timer = setTimeout(() => {
      // 执行原始函数，正确传递this上下文和参数
      fn.apply(this, args)
    }, wait)
  }
}
