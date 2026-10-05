/**
 * 判断括号字符串是否有效
 * 原题：必须成对匹配且顺序正确
 * 附加要求：嵌套时按 {} > [] > () 的优先级，外层优先级 ≥ 内层
 * @param {string} s
 * @return {boolean}
 */
const isValid = function (s) {
  const stack = [] // 栈：存期待出现的右括号
  // 优先级：} 最高（3），] 中等（2），) 最低（1）
  const priority = { ')': 1, ']': 2, '}': 3 }

  for (let i of s) {
    if (i === '(') {
      // ) 优先级最低，嵌套在任何括号内都不会违反「外层 ≥ 内层」，直接入栈
      stack.push(')')
    } else if (i === '[') {
      // ] 优先级为 2，若外层期待的是 )（优先级 1），说明低套了高，非法
      if (stack.length > 0 && priority[']'] > priority[stack.at(-1)])
        return false
      stack.push(']')
    } else if (i === '{') {
      // } 优先级最高，外层必须是 } 才能包住它
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

// 测试
console.log(isValid('{[()]}')) // true：优先级由外到内递减
console.log(isValid('({[]})')) // false：{ 嵌套在了低优先级的 () 里
console.log(isValid('([])')) // false：[] 嵌套在了低优先级的 () 里
console.log(isValid('([]')) // false：单边括号
console.log(isValid(')(')) // false：顺序错误
