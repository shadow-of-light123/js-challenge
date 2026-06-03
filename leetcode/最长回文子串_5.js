/**
 * 5. 最长回文子串
 *
 * 解法：中心扩展法
 * 核心思想：
 * 1. 回文串一定是左右对称的。
 * 2. 可以枚举每一个可能的“中心”。
 * 3. 从中心开始，同时向左、向右扩展。
 * 4. 扩展过程中只要左右字符相等，就说明当前范围仍然是回文串。
 * 5. 每次找到更长的回文串，就更新答案的左右边界。
 *
 * 注意：
 * - 奇数长度回文串的中心是一个字符，例如 "aba" 的中心是 "b"。
 * - 偶数长度回文串的中心是两个字符之间，例如 "bb" 的中心是两个 "b"。
 *
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  // 字符串长度小于 2 时，本身就是最长回文串。
  if (s.length < 2) return s;

  // res 用来直接保存当前找到的最长回文子串。
  // 先默认第一个字符是答案，因为单个字符一定是回文串。
  let res = s[0];

  // start 和 end 用来记录当前这一次找到的回文子串的左右边界。
  // 例如 s = "babad"，如果当前回文是 "bab"，那么 start = 0，end = 2。
  let start = 0;
  let end = 0;

  /**
   * 从指定中心向两边扩展，返回以该中心能得到的最长回文长度。
   *
   * @param {number} left 左指针，负责向左移动
   * @param {number} right 右指针，负责向右移动
   * @return {number} 当前中心扩展出的最长回文长度
   */
  function expandAroundCenter(left, right) {
    // 只要没有越界，并且左右字符相等，就继续向两边扩展。
    // 例如 s = "babad"，left = 1，right = 1 时：
    // 第一次比较 s[1] 和 s[1]，也就是 "a" 和 "a"。
    // 第二次比较 s[0] 和 s[2]，也就是 "b" 和 "b"。
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }

    // 循环结束时，left 和 right 已经多走了一步：
    // left 指向回文串左边界的前一个位置，
    // right 指向回文串右边界的后一个位置。
    //
    // 所以真实长度是：
    // right - left - 1
    //
    // 例如 "bab"：
    // 最后 left = -1，right = 3
    // 长度 = 3 - (-1) - 1 = 3
    return right - left - 1;
  }

  // 枚举字符串中的每一个位置，把它当作回文中心。
  for (let i = 0; i < s.length; i++) {
    // 情况 1：奇数长度回文。
    // 例如 "aba"，中心是下标 i 这个字符本身。
    const len1 = expandAroundCenter(i, i);

    // 情况 2：偶数长度回文。
    // 例如 "bb"，中心在 i 和 i + 1 两个字符之间。
    const len2 = expandAroundCenter(i, i + 1);

    // 取两种情况中更长的那个长度。
    const len = Math.max(len1, len2);

    // 如果当前中心扩展出的回文串，比 res 里保存的答案更长，就更新答案。
    if (len > res.length) {
      // 根据中心 i 和回文长度 len，反推出回文子串的左边界。
      //
      // 奇数例子："bab"，i = 1，len = 3
      // start = 1 - Math.floor((3 - 1) / 2) = 0
      //
      // 偶数例子：s = "cbbd"，中间的回文是 "bb"
      // 下标是：c(0) b(1) b(2) d(3)
      // 此时 i = 1，中心在下标 1 和下标 2 之间，len = 2
      // start = 1 - Math.floor((2 - 1) / 2) = 1
      start = i - Math.floor((len - 1) / 2);

      // 根据中心 i 和回文长度 len，反推出回文子串的右边界。
      //
      // 奇数例子："bab"，i = 1，len = 3
      // end = 1 + Math.floor(3 / 2) = 2
      //
      // 偶数例子：s = "cbbd"，中间的回文是 "bb"
      // 下标是：c(0) b(1) b(2) d(3)
      // 此时 i = 1，中心在下标 1 和下标 2 之间，len = 2
      // end = 1 + Math.floor(2 / 2) = 2
      end = i + Math.floor(len / 2);

      // 根据刚刚算出来的 start 和 end，截取当前更长的回文子串。
      // 这样 res 始终保存的是目前为止最长的回文子串。
      res = s.slice(start, end + 1);
    }
  }

  return res;
};