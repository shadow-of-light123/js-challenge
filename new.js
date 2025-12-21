function Phone(brand, price) {
  this.brand = brand
  this.price = price
}

const a = new Phone("小米", 2999)

const b = myNew(Phone, "小米", 2999)
console.log(a instanceof Object)
console.log(b)

// 手写new操作符
function myNew(fn, ...args) {
  // 判断fn是否为函数
  if (typeof fn !== "function") {
    throw new TypeError("fn必须是一个函数！")
  }

  let obj = null
  // 将这个空对象的原型设置为构造函数的 prototype 属性
  obj = Object.create(fn.prototype)
  // 调用构造函数，将空对象作为 this 上下文，传递参数
  let result = fn.apply(obj, args)
  // 判断result是否为对象
  if (result && (typeof result === "object" || typeof result === "function")) {
    // 如果构造函数返回的是一个对象或函数，就返回这个对象或函数
    return result
  }
  // 如果构造函数没有返回值或返回的是一个原始值，就返回这个空对象
  return obj
}
