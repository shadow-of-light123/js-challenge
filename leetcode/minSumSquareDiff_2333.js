/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k1
 * @param {number} k2
 * @return {number}
 */
var minSumSquareDiff = function (nums1, nums2, k1, k2) {
  const n = nums1.length;
  let k = k1 + k2;
  let max = -Infinity;
  let sum = 0;
  const diff = Array(n);

  for (let i = 0; i < n; i++) {
    diff[i] = Math.abs(nums1[i] - nums2[i]);
    if (diff[i] > max) {
      max = diff[i];
    }
  }

  let left = -1;
  let right = max + 1;
  let cost = 0;
  // 二分答案
  while (left + 1 !== right) {
    let mid = Math.floor((left + right) / 2);
    cost = binary(mid);
    if (cost > k) {
      // 削的多了，k不够，说明mid取小了
      left = mid; // 让mid增大
    } else {
      right = mid;
    }
  }

  cost = 0;
  for (let i = 0; i < n; i++) {
    if (diff[i] > right) {
      cost += diff[i] - right;
    }
  }

  // 剩的多余的
  let more = k - cost;
  // 统一拍平
  for (let i = 0; i < n; i++) {
    if (diff[i] > right) {
      diff[i] = right;
    }
  }

  for (let i = 0; i < n; i++) {
    if (more > 0 && diff[i] === right) {
      diff[i]--;
    }
    sum += diff[i] * diff[i];
  }

  return sum;

  function binary(mid) {
    let cost = 0;
    for (let i = 0; i < n; i++) {
      if (diff[i] > mid) {
        cost += diff[i] - mid;
      }
    }
    return cost;
  }
};
