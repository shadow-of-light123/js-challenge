/**
 * 5. 最长回文子串
 *
 * 解法：动态规划
 *
 * dp[i][j] 表示：
 * 字符串 s 从下标 i 到下标 j 的这一段，是否是回文串。
 *
 * 例如：
 * s = "babad"
 * dp[0][2] 表示 s[0...2]，也就是 "bab"，是否是回文串。
 *
 * 判断规则：
 * 如果 s[i] !== s[j]，那么 s[i...j] 一定不是回文串。
 * 如果 s[i] === s[j]，还要继续看中间部分 s[i + 1...j - 1] 是否是回文串。
 *
 * 特殊情况：
 * 1. 长度为 1 的字符串，一定是回文串。
 * 2. 长度为 2 的字符串，只要两个字符相等，就是回文串。
 * 3. 长度大于 2 的字符串，需要看中间部分是否是回文串。
 *
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  if (s.length < 2) return s;

  const n = s.length;

  // res 直接保存当前找到的最长回文子串。
  // 默认第一个字符是答案，因为单个字符一定是回文串。
  let res = s[0];

  // 创建 n 行 n 列的二维数组，默认都不是回文串。
  // dp[i][j] 为 true，表示 s[i...j] 是回文串。
  const dp = Array.from({ length: n }, () => Array(n).fill(false));

  // 所有长度为 1 的子串都是回文串。
  // 例如 "a"、"b"、"c"。
  for (let i = 0; i < n; i++) {
    dp[i][i] = true;
  }

  // 枚举子串长度。
  // len = 2 表示检查所有长度为 2 的子串。
  // len = 3 表示检查所有长度为 3 的子串。
  // 一直检查到 len = n。
  for (let len = 2; len <= n; len++) {
    // 枚举当前子串的左边界 i。
    for (let i = 0; i <= n - len; i++) {
      // 根据左边界 i 和长度 len，算出右边界 j。
      // 例如 i = 1，len = 3，那么 j = 3，子串是 s[1...3]。
      const j = i + len - 1;

      // 首尾字符不相等，肯定不是回文串。
      if (s[i] !== s[j]) {
        dp[i][j] = false;
      } else if (len === 2) {
        // 长度为 2 时，只要首尾字符相等，就是回文串。
        // 例如 "bb"。
        dp[i][j] = true;
      } else {
        // 长度大于 2 时：
        // s[i] 和 s[j] 已经相等了，
        // 还需要看中间的 s[i + 1...j - 1] 是否是回文串。
        dp[i][j] = dp[i + 1][j - 1];
      }

      // 如果 s[i...j] 是回文串，并且比当前答案更长，就更新 res。
      if (dp[i][j] && len > res.length) {
        // slice 的第二个参数不包含 j，所以要写 j + 1。
        res = s.slice(i, j + 1);
      }
    }
  }

  return res;
};
