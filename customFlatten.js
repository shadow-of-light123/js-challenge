// 数组扁平化
const arr = [
  1,
  2,
  3,
  [4, 5, 6, [7, 8, 9], 10, 11, [12, 13, 14], 15, 16],
  [17, 18, 19, 20],
]

Array.prototype.customFlatten = function () {
  let flat = []
  for (const item of this) {
    if (Array.isArray(item)) {
      flat = [...flat, ...item.customFlatten()]
    } else {
      flat.push(item)
    }
  }
  return flat
}

// console.log(arr.customFlatten())

console.log(arr.flat(Infinity))
