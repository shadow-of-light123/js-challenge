/**
 * @param {number} n
 * @return {number}
 */

var climbStairs = function (n) {
  if (n <= 2) return n
  let pre = 1
  let res = 2

  for (let i = 3; i < n; i++) {
    const cur = pre + res
    pre = res
    res = cur
  }

  return res + pre
};