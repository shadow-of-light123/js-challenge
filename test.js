/**
 * 字节高频手撕题：手写 Promise 组合方法
 *
 * 实现 myAll、myRace、myAllSettled 三个函数。
 *
 * 要求：
 * 1. myAll(promises)：
 *    - 全部成功 → 按传入顺序 resolve 结果数组
 *    - 任意一个失败 → 立即 reject 该错误（但其他任务继续执行，不要中断）
 *    - 入参可能是：数组、空数组、非 Promise 值（要能透传）
 * 2. myRace(promises)：第一个 settle（无论成功失败）的结果
 *    - 空数组 → 永远 pending
 * 3. myAllSettled(promises)：等全部结束，返回
 *    [{ status: 'fulfilled', value } | { status: 'rejected', reason }] 数组
 *
 * 注意：结果必须按传入顺序排列，与完成先后无关。
 * 返回的必须是真正的 Promise（new Promise 包裹）。
 */

function myAll(promises) {
  return new Promise((resolve, reject) => {
    let count = 0
    const res = []
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (val) => {
          res[index] = val
          count++
          if (res.length === count) {
            resolve(res)
          }
        },
        (err) => {
          reject(err)
        },
      )
    })
  })
}

function myRace(promises) {
  // TODO
}

function myAllSettled(promises) {
  // TODO
}

// ---- 测试用例（不要改）----
const delay = (ms, val) =>
  new Promise((resolve) => setTimeout(() => resolve(val), ms))
const delayReject = (ms, err) =>
  new Promise((_, reject) => setTimeout(() => reject(err), ms))

;(async () => {
  // 1. 基本功能 + 顺序保证（3 比 1 后完成，但结果在 0 号位）
  console.log(await myAll([delay(300, 'a'), delay(100, 'b'), delay(200, 'c')]))
  // ['a', 'b', 'c']

  // 2. 非 Promise 值透传
  console.log(await myAll([1, Promise.resolve(2), delay(50, 3)]))
  // [1, 2, 3]

  // 3. 空数组立即 resolve
  console.log(await myAll([])) // []

  // 4. 失败立即 reject
  try {
    await myAll([delay(100, 'ok'), delayReject(50, 'boom')])
  } catch (e) {
    console.log('caught:', e) // caught: boom
  }

  // 5. race：第一个 settle 的胜出（包括失败）
  console.log(await myRace([delay(100, 'slow'), delay(10, 'fast')])) // fast
  try {
    await myRace([delay(100, 'slow'), delayReject(10, 'race-boom')])
  } catch (e) {
    console.log('caught:', e) // caught: race-boom
  }

  // 6. allSettled：全部收集
  console.log(
    await myAllSettled([delay(50, 'ok'), delayReject(20, 'err1'), 42]),
  )
  // [
  //   { status: 'fulfilled', value: 'ok' },
  //   { status: 'rejected', reason: 'err1' },
  //   { status: 'fulfilled', value: 42 }
  // ]
})()
