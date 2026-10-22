const arr = [3, 3, 6, 8, 16, 16, 16, 18, 20];

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
  let sum = 0;
  for (const num of nums) sum += num;
  if (sum % 2 !== 0) return false; // 和为奇数不可能平分

  const target = sum / 2;
  // dp[j] = 能否从已遍历的元素中选出和为 j 的子集
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    // 必须倒序,保证每个元素只用一次(0/1 背包)
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }

  return dp[target];
};

console.log(canPartition(arr));
