/**
 * 快速排序
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} - 排序后的新数组（不修改原数组）
 *
 * 实现原理：
 * 1. 选择一个基准元素（pivot），通常取数组中间位置
 * 2. 将数组分为两部分：小于基准的放左边，大于等于基准的放右边
 * 3. 对左右两部分递归执行快速排序
 * 4. 合并结果：[...left, ...pivot, ...right]
 *
 * 时间复杂度：
 * - 平均：O(n log n)
 * - 最坏：O(n²)（当数组已排序或逆序时）
 * - 最好：O(n log n)
 *
 * 空间复杂度：O(n)（递归调用栈 + 新数组）
 */
function quickSort(arr) {
  // 递归终止条件：数组长度 <= 1 时直接返回
  if (arr.length <= 1) {
    return arr
  }

  // 选择一个基准元素，这里取数组中间位置
  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr[pivotIndex]

  // 分别存储小于基准和大于等于基准的元素
  const left = [] // 小于 pivot 的元素
  const right = [] // 大于等于 pivot 的元素

  // 遍历数组，将元素分配到左右两个数组
  for (let i = 0; i < arr.length; i++) {
    // 跳过基准元素自身，避免重复
    if (i === pivotIndex) {
      continue
    }

    if (arr[i] < pivot) {
      left.push(arr[i]) // 小于基准的放左边
    } else {
      right.push(arr[i]) // 大于等于基准的放右边
    }
  }

  // 递归排序左右两部分，并合并结果
  return [...quickSort(left), pivot, ...quickSort(right)]
}

// 测试
const arr = [5, 3, 8, 1, 9, 2, 7, 4, 6]
console.log('原数组：', arr)
console.log('排序后：', quickSort(arr))
// 预期输出：[1, 2, 3, 4, 5, 6, 7, 8, 9]
