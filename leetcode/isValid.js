/**
 * 判断括号字符串是否有效
 * 原题：必须成对匹配且顺序正确
 * 附加要求：嵌套时按 {} > [] > () 的优先级，外层优先级 ≥ 内层
 * 例：{[()]}✅  ({[]})❌  ([])❌
 * @param {string} s
 * @return {boolean}
 */
const isValid = function (s) {
  const stack = [] // 栈：存期待出现的右括号
  // 优先级：} 最高（3），] 中等（2），) 最低（1）
  const priority = { ')': 1, ']': 2, '}': 3 }

  for (let i of s) {
    if (i === '(') {
      // （) 包含在已有括号中时，) 的优先级不能比栈顶高
      // 否则说明高优先级括号被包在低优先级括号里
      if (stack.length > 0 && stack.at(-1) === (']' || '}')) return false
      stack.push(')')
    } else if (i === '[') {
      if (stack.length > 0 && priority[']'] > priority[stack.at(-1)])
        return false
      stack.push(']')
    } else if (i === '{') {
      if (stack.length > 0 && priority['}'] > priority[stack.at(-1)])
        return false
      stack.push('}')
    } else {
      // 遇到右括号，检查是否与栈顶匹配
      if (i !== stack.pop()) return false
    }
  }

  // 所有左括号都匹配完才有效
  return stack.length === 0
}
