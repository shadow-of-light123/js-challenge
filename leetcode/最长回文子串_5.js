/**
 * 5. 最长回文子串
 *
 * 解法：中心扩散法
 *
 * 核心思想：
 * 1. 回文串左右对称，因此可以从「中心」出发向两边扩散。
 * 2. 枚举每一个可能的中心，把相等字符往外一层层吃掉，扩散得最远的那次就是答案。
 * 3. 中心有两种形态：
 *    - 奇数长度，中心是单个字符，如 "aba" 以 'b' 为中心；
 *    - 偶数长度，中心在两个字符之间，如 "bb"。
 *    这里用「先吃掉中心同字符的整段，再向两侧配对扩散」统一处理了两种情况：
 *    "abba" 从 i=1('b') 出发，先把右侧相邻的 'b' 也吞进来（长度 2），
 *    再对 s[0]/s[3] 配对得到 "abba"（长度 4）。
 *
 * 复杂度：中心共 n 个，每次扩散最坏 O(n)，时间 O(n²)，空间 O(1)。
 *
 * @param {string} s
 * @return {string}
 */
// 中心扩散法
var longestPalindrome = function (s) {
  const n = s.length;

  // 当前中心向左右两侧扩张的指针
  let left = 0;
  let right = 0;

  // 历史最优：最长长度 maxLen，以及它在原串中的起始下标 maxStart
  let maxLen = 0;
  let maxStart = 0;

  // 当前中心扩散出的回文长度，最小为 1（中心字符自己）
  let len = 1;

  for (let i = 0; i < n; i++) {
    // 以 i 为中心，左右指针从相邻位置出发
    left = i - 1;
    right = i + 1;

    // 1. 向左吃掉与中心字符相同的连续字符。
    //    注：相等的判断要当做循环条件。
    //    例："aaab"，i=2 时向左遇到 s[1]、s[0] 都是 'a'，len 一路加到 3。
    while (left >= 0 && s[left] === s[i]) {
      left--;
      len++;
    }

    // 2. 向右吃掉与中心字符相同的连续字符。
    //    例："baaa"，i=1 时向右遇到 s[2]、s[3] 都是 'a'，len 一路加到 3。
    while (right < n && s[right] === s[i]) {
      right++;
      len++;
    }

    // 3. 中心同字符的整段已吞完，现在左右两侧各自站在不同字符上，
    //    开始「成对」扩散：每匹配成功一对，长度加 2。
    //    此时 left 指向回文左边界的前一个位置，right 指向右边界的后一个位置。
    while (left >= 0 && right < n && s[left] === s[right]) {
      len += 2;
      left--;
      right++;
    }

    // 4. 更新最优解。循环结束时 left 停在了「回文左边界 - 1」处，
    //    所以真正的起点是 left + 1，长度是 len。
    if (len > maxLen) {
      maxLen = len;
      maxStart = left + 1;
    }

    // 5. 重置长度为 1，为下一个中心做准备
    len = 1;
  }

  // 只记录起点和长度，最后统一截取，避免每次拼接字符串
  return s.slice(maxStart, maxStart + maxLen);
};
