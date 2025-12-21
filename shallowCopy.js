// 浅拷贝函数：创建一个新对象/数组，复制原对象/数组的第一层属性
// 注意：嵌套的对象/数组只会复制引用，不会递归复制
// @param {Object|Array} obj - 要拷贝的对象或数组
// @returns {Object|Array|*} - 拷贝后的新对象/数组，或原基本类型值
function shallowCopy(obj) {
  // 边界条件处理：如果不是对象或为null/undefined，直接返回原值
  // 基本类型（number/string/boolean/null/undefined/symbol/bigint）会直接返回
  if (!obj || typeof obj !== "object") {
    return obj
  }

  // 根据原对象类型创建新的空结构
  // 如果是数组，创建新数组；否则创建新对象
  const newObj = Array.isArray(obj) ? [] : {}

  // 遍历原对象的所有可枚举属性
  for (const key in obj) {
    // 只复制对象自身的属性（排除原型链上的属性）
    if (Object.hasOwn(obj, key)) {
      // 直接复制属性值（嵌套对象/数组会复制引用，即浅拷贝）
      newObj[key] = obj[key]
    }
  }

  // 返回拷贝后的新对象/数组
  return newObj
}

obj1 = {
  name: "小明",
  age: 18,
  class: {
    grade: 2,
    No: 1,
  },
}

console.log(obj1)
obj2 = shallowCopy(obj1)
obj2.class.grade = 3
console.log(obj1)
console.log(obj2)
