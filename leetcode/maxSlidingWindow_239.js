/**
 * 239. 滑动窗口最大值
 *
 * 单调队列（单调递减双端队列）模板：
 * - 队列存「下标」而非值，对应值从队头到队尾严格递减
 * - 队头始终是当前窗口的最大值下标
 * - 用 head 指针代替 shift()，避免 O(n) 的数组头部删除
 *
 * 三个动作：
 * 1. 过期：队头下标 <= i - k 时，说明它已滑出窗口，head++
 * 2. 入队：队尾对应值 <= nums[i] 的都弹出（<= 是对的：过期靠下标判断，
 *    弹掉相等元素不会留下空缺；若存值则必须用 <，否则相等元素被弹后无人顶替）
 * 3. 收集：i >= k - 1（窗口形成）后，队头即窗口最大值
 *
 * 复杂度：每个下标最多入队/出队各一次，O(n) 时间，O(k) 空间
 *
 * 同类题：1438（绝对差不超过限制的最长子数组，单调队列+滑动窗口）、
 * 480（滑动窗口中位数）、剑指 Offer 59
 *
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  const res = [];
  const deque = []; // 存下标，对应值单调递减
  let head = 0; // 队头指针，代替 shift，永不清空数组

  for (let i = 0; i < nums.length; i++) {
    // 1. 队头滑出窗口
    if (deque[head] <= i - k) head++;

    // 2. 队尾弹出所有 <= nums[i] 的下标
    while (deque.length > head && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }

    // 3. 入队当前下标
    deque.push(i);

    // 窗口形成后收集答案
    if (i >= k - 1) res.push(nums[deque[head]]);
  }

  return res;
};

// ===== 测试 =====
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3,3,5,5,6,7]
console.log(maxSlidingWindow([1], 1)); // [1]
console.log(maxSlidingWindow([9, 8, 7, 6], 2)); // [9,8,7] 递减数组，最坏情况
console.log(maxSlidingWindow([5, 5, 1], 2)); // [5,5] 重复元素
console.log(maxSlidingWindow([2, 2, 2], 2)); // [2,2] 全相等
