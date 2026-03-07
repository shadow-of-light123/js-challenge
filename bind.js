/**
 * 自定义 bind 方法实现
 * @param {*} context - 绑定的 this 上下文
 * @param {...*} args - 预设的参数
 * @returns {Function} - 绑定后的函数
 */
Function.prototype.myBind = function (context, ...args) {
  // 类型检查：确保只能在函数上调用
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }

  // 设置默认上下文为全局对象
  context = context || globalThis
  // 保存原函数引用
  const fn = this

  // 创建绑定函数
  const bound = function (...rest) {
    // 检查是否作为构造函数调用（使用 new 关键字）
    if (this instanceof bound) {
      // 作为构造函数时，this 指向新创建的实例
      return new fn(...args, ...rest)
    }
    // 普通调用时，绑定指定的 context
    return fn.call(context, ...args, ...rest)
  }

  // 继承原函数的原型链，确保 new 调用时能访问原函数的原型方法
  bound.prototype = Object.create(fn.prototype)

  // 返回绑定后的函数
  return bound
}
