/**
 * Promise 并发调度器类
 * 用于限制同时执行的异步任务数量，避免并发过高导致资源耗尽
 *
 * @example
 * const scheduler = new Scheduler(2) // 最多同时执行2个任务
 * scheduler.add(task1())
 * scheduler.add(task2())
 * scheduler.add(task3())
 * // 任务1和2同时开始，完成后再执行任务3
 */
class Scheduler {
  /**
   * 构造函数
   * @param {number} limit - 并发限制数，同时最多执行的任务数
   */
  constructor(limit) {
    this.limit = limit // 并发限制数
    this.running = 0 // 当前正在执行的任务数
    this.queue = [] // 待执行任务队列
  }

  /**
   * 添加任务到调度器
   * @param {Function} task - 返回 Promise 的任务函数
   * @returns {Promise} - 返回任务执行结果的 Promise
   */
  add(task) {
    return new Promise((resolve, reject) => {
      // 将任务和对应的 resolve/reject 函数加入队列
      // 保存 resolve/reject 是为了在任务完成时手动控制 Promise 的状态
      this.queue.push({ task, resolve, reject })

      // 尝试立即执行任务（如果当前并发数未达到限制）
      this.run()
    })
  }

  /**
   * 执行任务的核心方法
   * 使用 while 循环尽可能多地启动任务，直到达到并发限制
   */
  run() {
    // 条件：当前运行任务数 < 并发限制 且 队列中还有任务
    while (this.running < this.limit && this.queue.length) {
      // 从队列头部取出一个任务（先进先出）
      const { task, resolve, reject } = this.queue.shift()

      // 增加运行中任务计数
      this.running++

      // 执行任务
      task()
        // 任务成功：调用保存的 resolve 函数，将结果传递给 add 返回的 Promise
        .then(resolve, reject)
        // 任务完成后（无论成功或失败）：
        .finally(() => {
          // 减少运行中任务计数
          this.running--
          // 递归调用 run，尝试启动队列中的下一个任务
          this.run()
        })
    }
  }
}

// 测试代码
// 创建并发限制为2的调度器
const scheduler = new Scheduler(2)

// 创建测试任务工厂函数：返回一个函数，该函数执行后返回 Promise
const task = (id, delay) => () =>
  new Promise((resolve) => {
    console.log(`任务${id}开始`)
    setTimeout(() => {
      console.log(`任务${id}完成`)
      resolve(id)
    }, delay)
  })

// 添加4个任务到调度器
scheduler.add(task(1, 1000))
scheduler.add(task(2, 500))
scheduler.add(task(3, 300))
scheduler.add(task(4, 800))

// 预期输出顺序：
// 任务1开始 任务2开始（同时执行，达到并发限制）
// 任务2完成 → 任务3开始（释放一个并发槽，启动下一个任务）
// 任务3完成 → 任务4开始（再次释放并发槽）
// 任务1完成（第一个任务完成）
// 任务4完成（最后一个任务完成）
