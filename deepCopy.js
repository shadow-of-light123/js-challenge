/**
 * 深拷贝函数 - 创建原对象/数组的完全独立副本
 *
 * 功能描述：
 * - 递归复制原对象的所有层级属性，创建完全独立的新对象
 * - 支持基本类型、普通对象、数组和循环引用
 * - 使用Map数据结构存储已拷贝对象，避免循环引用导致的无限递归
 *
 * @param {Object|Array|*} obj - 要拷贝的对象、数组或基本类型值
 * @param {Map} [map=new Map()] - 内部使用的Map，用于处理循环引用
 * @returns {Object|Array|*} - 拷贝后的新对象/数组，或原基本类型值
 *
 * 实现原理：
 * 1. 边界检查：非对象类型直接返回原值
 * 2. 循环引用处理：使用Map存储已拷贝对象的映射关系
 * 3. 结构创建：根据原对象类型创建新的空结构（对象或数组）
 * 4. 递归复制：遍历原对象属性，递归拷贝每个属性值
 */
function deepCopy(obj, map = new Map()) {
  // 1. 边界条件处理
  // 如果不是对象或为null/undefined，直接返回原值
  // 基本类型（number/string/boolean/null/undefined/symbol/bigint）会直接返回
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // 2. 循环引用处理
  // 如果当前对象已被拷贝过，直接返回之前拷贝的结果
  if (map.has(obj)) {
    return map.get(obj)
  }

  // 3. 创建新的目标结构
  // 根据原对象类型创建对应的空结构
  // Array.isArray()检测是否为数组
  const newObj = Array.isArray(obj) ? [] : {}

  // 4. 记录拷贝关系
  // 将原对象和新对象的映射关系存入Map
  // 必须在递归之前执行，否则无法处理循环引用
  map.set(obj, newObj)

  // 5. 遍历并递归拷贝属性
  // for...in遍历原对象的可枚举属性
  for (const key in obj) {
    // 只复制对象自身的属性，排除原型链上的属性
    // Object.hasOwn()是ES2022新方法，比obj.hasOwnProperty更安全
    if (Object.hasOwn(obj, key)) {
      // 递归拷贝：如果属性值是对象，继续深拷贝并传递map
      // 如果是基本类型，直接赋值
      newObj[key] =
        typeof obj[key] === 'object'
          ? deepCopy(obj[key], map) // 递归深拷贝，传递map处理循环引用
          : obj[key] // 基本类型直接复制值
    }
  }

  // 6. 返回拷贝结果
  return newObj
}

/**
 * 实现局限性
 *
 * 当前深拷贝实现存在以下限制：
 * 1. 特殊类型支持有限：Date、RegExp、Map、Set等会被作为普通对象拷贝
 * 2. Symbol键会被忽略（for...in不遍历Symbol类型的键）
 * 3. 仅支持可枚举属性的拷贝
 * 4. 不可枚举属性和原型链上的属性不会被拷贝
 * 5. 不支持函数的深拷贝（函数会直接引用）
 */

// 测试用例
const obj1 = {
  name: '小明',
  age: 18,
  class: {
    grade: 2,
    No: 1,
  },
}

console.log('原对象:', obj1)
const obj2 = deepCopy(obj1)
obj2.class.grade = 3
console.log('修改后的原对象:', obj1)
console.log('深拷贝对象:', obj2)

// 循环引用测试
console.log('\n循环引用测试：')
const obj3 = { name: '循环引用测试' }
obj3.self = obj3 // 创建循环引用

try {
  const obj4 = deepCopy(obj3)
  console.log('循环引用拷贝成功！')
  console.log('原对象.self === 原对象:', obj3.self === obj3)
  console.log('拷贝对象.self === 拷贝对象:', obj4.self === obj4)
} catch (error) {
  console.error('循环引用拷贝失败:', error.message)
}
