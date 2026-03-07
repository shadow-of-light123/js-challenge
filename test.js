const arr1 = [1, 2, 3, 4, 5]
const arr2 = [4, 5, 6, 7, 8]

const union = Array.from(new Set([...arr1, ...arr2]))

const arr3 = Array.from(
  new Set(
    arr2.filter((i) => {
      return arr1.includes(i)
    }),
  ),
)

console.log(arr3)
