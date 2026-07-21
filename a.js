Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([])
    }

    const values = []
    let count = 0
    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        (res) => {
          values[index] = res
          count++
          if (count === promises.length) {
            resolve(values)
          }
        },
        (err) => {
          reject(err)
        },
      )
    })
  })
}

// ========== 测试用例 ==========

// 辅助：延迟 resolve 的 promise
const delayResolve = (val, ms) =>
  new Promise((r) => setTimeout(() => r(val), ms))

// 辅助：延迟 reject 的 promise
const delayReject = (val, ms) =>
  new Promise((_, r) => setTimeout(() => r(val), ms))

// ---------- 用例1：都正常 resolve ----------
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3 = Promise.resolve(3)

Promise.myAll([p1, p2, p3]).then((res) => {
  console.log('用例1 都正常resolve:', JSON.stringify(res))
  // 期望：用例1 都正常resolve: [1,2,3]
})

// ---------- 用例2：顺序错乱（splice bug 演示） ----------
const disordered = [
  delayResolve('我是第三个', 100),
  delayResolve('我是第二个', 50),
  delayResolve('我是第一个', 10),
]

Promise.myAll(disordered).then((res) => {
  console.log('用例2 乱序resolve:', JSON.stringify(res))
  // 期望：[我是第三个, 我是第二个, 我是第一个]
  // 但由于 splice bug，大概率永远 pending 或者顺序错乱
})

// ---------- 用例3：有一个 reject ----------
const errP1 = Promise.resolve(1)
const errP2 = Promise.reject('出错了')
const errP3 = Promise.resolve(3)

Promise.myAll([errP1, errP2, errP3]).catch((err) => {
  console.log('用例3 捕获reject:', err)
  // 期望：用例3 捕获reject: 出错了
})

// ---------- 用例4：空数组 ----------
Promise.myAll([]).then((res) => {
  console.log('用例4 空数组:', JSON.stringify(res))
  // 期望：用例4 空数组: []
})

// ---------- 用例5：只有一个 promise ----------
Promise.myAll([Promise.resolve('only')]).then((res) => {
  console.log('用例5 单个promise:', JSON.stringify(res))
  // 期望：用例5 单个promise: ["only"]
})

// ---------- 用例6：全部延迟完成 ----------
const allDelay = [
  delayResolve('a', 200),
  delayResolve('b', 100),
  delayResolve('c', 300),
]

Promise.myAll(allDelay).then((res) => {
  console.log('用例6 全部延迟:', JSON.stringify(res))
  // 期望：用例6 全部延迟: ["a","b","c"]
})

// ---------- 用例7：多个 reject 只捕获第一个 ----------
const multiErr1 = delayReject('第一个错误', 50)
const multiErr2 = delayReject('第二个错误', 100)

Promise.myAll([Promise.resolve(1), multiErr1, multiErr2]).catch((err) => {
  console.log('用例7 多个reject捕获第一个:', err)
  // 期望：用例7 多个reject捕获第一个: 第一个错误
})
