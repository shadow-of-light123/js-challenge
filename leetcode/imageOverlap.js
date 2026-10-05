/**
 * 835. 图像重叠
 *
 * 给你两个 n x n 的二进制矩阵 img1 和 img2，
 * 你可以把 img1 向上下左右任意方向平移（平移量是整数，也可以是 0），
 * 平移后两图「同一位置都是 1」的格子数就是重叠数，求最大重叠数。
 *
 * 思路（最易懂版：暴力枚举所有平移）：
 * 1. 平移量 dx、dy = img1 相对 img2 的偏移，范围都是 -(n-1) ~ (n-1)，
 *    再大就完全错开了，没有意义；
 * 2. 对每一个平移量，逐个遍历 img1 的每个格子 (i, j)：
 *    它平移后会落在 img2 的 (i + dx, j + dy) 上，
 *    只要两处都是 1，重叠数 +1（越界的格子直接忽略）；
 * 3. 所有平移方案里取最大值。
 *
 * 复杂度：n ≤ 30，平移方案 (2n-1)² ≈ 3600 种，每种扫 n² = 900 个格子，
 * 总共约 300 万次操作，完全够快，也不用费脑子做优化。
 *
 * @param {number[][]} img1
 * @param {number[][]} img2
 * @return {number}
 */
const largestOverlap = function (img1, img2) {
  const n = img1.length
  let maxOverlap = 0

  // 枚举 img1 相对 img2 的所有平移量
  for (let dx = -(n - 1); dx <= n - 1; dx++) {
    for (let dy = -(n - 1); dy <= n - 1; dy++) {
      let overlap = 0

      // 遍历 img1 的每一个格子，看它平移后能否和 img2 对上
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (img1[i][j] !== 1) continue // img1 这里不是 1，跳过

          const x = i + dx // 平移后落在 img2 的行
          const y = j + dy // 平移后落在 img2 的列
          if (x < 0 || x >= n || y < 0 || y >= n) continue // 越界，忽略

          if (img2[x][y] === 1) overlap++
        }
      }

      maxOverlap = Math.max(maxOverlap, overlap)
    }
  }

  return maxOverlap
}

// ======================== 测试 ========================

// 官方示例 1：img1 右移 1 格、下移 1 格，重叠 3 个
console.log(
  largestOverlap(
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  ),
) // 3

// 两个 4x4 图像，各只有一个 1，且分处对角
console.log(
  largestOverlap(
    [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 1],
    ],
  ),
) // 1（img1 右下各移 3 格，正好压到 img2 的那个 1 上）

// 完全重合
console.log(
  largestOverlap(
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ),
) // 4

// 全 0：没有任何重叠
console.log(
  largestOverlap(
    [
      [0, 0],
      [0, 0],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ),
) // 0

// 需要移动才最优：两个 1 的位置错开半格，平移后能对上
console.log(
  largestOverlap(
    [
      [1, 1],
      [0, 0],
    ],
    [
      [0, 0],
      [1, 1],
    ],
  ),
) // 2（img1 下移 1 格即可完全重合）
