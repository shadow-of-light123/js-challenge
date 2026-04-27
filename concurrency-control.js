/**
 * 并发控制函数 - 限制同时执行的任务数量
 * @param {Function[]} tasks - 异步任务数组，每个任务都是返回 Promise 的函数
 * @param {number} limit - 并发限制数，同时最多执行的任务数
 * @returns {Promise<Array>} - 返回所有任务的执行结果数组
 *
 * 实现原理：
 * 1. 使用 executing 数组跟踪当前正在执行的任务
 * 2. 遍历所有任务，逐个启动
 * 3. 当执行中的任务数达到限制时，等待任一任务完成
 * 4. 所有任务启动后，等待剩余的任务完成
 * 5. 返回所有任务的执行结果，包含成功和失败的状态
 */
async function concurrent(tasks, limit) {
  // 存储所有任务的执行结果
  const res = []
  // 存储当前正在执行的任务（Promise）
  const executing = []

  // 遍历所有任务
  for (let i = 0; i < tasks.length; i++) {
    // 启动当前任务并包装为 Promise
    const p = Promise.resolve(tasks[i]())
      // 任务成功时，保存成功结果
      .then((r) => (res[i] = { status: 'fulfilled', value: r }))
      // 任务失败时，保存失败原因
      .catch((e) => {
        res[i] = { status: 'rejected', reason: e }
      })
      // 任务完成后（无论成功失败），从执行队列中移除
      .finally(() => {
        executing.splice(executing.indexOf(p), 1)
      })

    // 将当前任务添加到执行队列
    executing.push(p)

    // 当执行中的任务数达到限制时，等待任一任务完成
    if (executing.length >= limit) {
      await Promise.race(executing)
    }
  }

  // 等待所有剩余任务完成
  await Promise.all(executing)

  // 返回所有任务的执行结果
  return res
}

/**
 * 创建测试任务数组
 * @returns {Function[]} - 返回包含5个异步任务的数组
 * 每个任务：模拟100ms的异步操作，打印开始和结束时间
 */
const createTasks = () =>
  [1, 2, 3, 4, 5].map(
    (n) => () =>
      new Promise((resolve) => {
        // 打印任务开始时间（取时间戳后4位）
        console.log(`任务${n}开始 - ${Date.now() % 10000}ms`)
        // 模拟100ms的异步操作
        setTimeout(() => {
          // 打印任务完成时间
          console.log(`任务${n}完成 - ${Date.now() % 10000}ms`)
          // 解析结果为 n * 10
          resolve(n * 10)
        }, 100)
      }),
  )

// 测试：使用并发限制为2的方式执行任务
console.log('--- 测试 concurrent ---')
concurrent(createTasks(), 2).then((res) => {
  // 输出所有任务的执行结果
  console.log('结果:', res) // 预期输出: [10, 20, 30, 40, 50]
})
