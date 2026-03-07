// 实现 call 方法，用于改变函数执行上下文并传入多个参数
Function.prototype.myCall = function (context, ...args) {
  // 检查调用者是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }

  // 设置上下文：如果 context 为 null/undefined，使用全局对象
  context = context || globalThis
  // 使用 Symbol 作为键，避免覆盖原有属性
  const fnKey = Symbol('fn')
  // 将当前函数绑定到上下文上
  context[fnKey] = this

  // 执行函数并传入参数（使用展开运算符）
  let result = context[fnKey](...args)

  // 清理临时属性
  delete context[fnKey]
  // 返回执行结果
  return result
}
