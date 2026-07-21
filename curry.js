/**
 * 函数柯里化 —— 将多参数函数转换为可逐个传入参数的链式调用。
 *
 * 核心思想：如果传入的参数数量 >= 原函数形参个数，立即执行；
 *           否则返回一个新函数，等待接收剩余参数。
 *
 * @param {Function} fn 需要柯里化的原函数
 * @returns {Function} 柯里化后的函数
 */
function curry(fn) {
  // curried 是柯里化后返回的函数，可接受部分参数
  return function curried(...args) {
    // 如果已收集的参数数量 >= 原函数期望的参数个数，直接执行
    if (args.length >= fn.length) {
      // 使用 fn.apply 保留 this 上下文
      return fn.apply(this, args)
    }

    // 参数还不够，返回一个新函数继续接收剩余参数
    return (...nextArgs) =>
      // 将新旧参数合并，递归调用 curried
      curried.apply(this, [...args, ...nextArgs])
  }
}

// 使用示例：
const add = (a, b, c) => a + b + c
const curriedAdd = curry(add)

// 逐个传入参数：1 → (2) → (3)
curriedAdd(1)(2)(3) // 6

// 也可分批传入： (1,2) → (3)
curriedAdd(1, 2)(3) // 6
