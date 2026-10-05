class Scheduler {
  constructor(limit) {
    this.limit = limit
    this.queue = []
    this.running = 0
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this.run()
    })
  }

  run() {
    while (this.running < this.limit && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift()
      this.running++
      task()
        .then(resolve, reject)
        .finally(() => {
          this.running--
          this.run()
        })
    }
  }
}

// ====================== 测试 ======================
// 测试1:正常异步任务 + 异步 reject
const s = new Scheduler(2)
const log = []
s.add(() => Promise.resolve('A')).then(v => log.push(v), e => log.push('E:' + e.message))
s.add(() => Promise.reject(new Error('B异步失败'))).then(v => log.push(v), e => log.push('E:' + e.message))
s.add(() => Promise.resolve('C')).then(v => log.push(v), e => log.push('E:' + e.message))

// 测试2:同步抛错
const s2 = new Scheduler(1)
const log2 = []
s2.add(() => { throw new Error('同步炸了') }).then(v => log2.push(v), e => log2.push('E:' + e.message))
s2.add(() => Promise.resolve('D')).then(v => log2.push(v), e => log2.push('E:' + e.message))

setTimeout(() => {
  console.log('===== 测试1:异步任务 =====')
  console.log('log =', JSON.stringify(log))
  console.log('running =', s.running, '| queue =', s.queue.length)
}, 100)

setTimeout(() => {
  console.log('\n===== 测试2:同步抛错 =====')
  console.log('log2 =', JSON.stringify(log2))
  console.log('running =', s2.running, '| queue =', s2.queue.length)
}, 150)
