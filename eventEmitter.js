/**
 * 发布订阅模式（EventEmitter）
 * 用于实现组件间的解耦通信
 *
 * 核心概念：
 * - on（订阅）：注册事件监听器
 * - emit（发布）：触发事件，通知所有订阅者
 * - off（取消订阅）：移除事件监听器
 * - once（一次性订阅）：触发一次后自动移除
 *
 * 使用场景：
 * - 跨组件通信
 * - 事件驱动的业务逻辑
 * - 自定义事件处理
 */

class EventEmitter {
  constructor() {
    // 存储所有事件和对应的回调函数
    // 结构：{ eventName: [callback1, callback2, ...] }
    this.events = {}
  }

  /**
   * 订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件触发时执行的回调函数
   */
  on(eventName, callback) {
    // 如果该事件还没有注册过，先初始化为空数组
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    // 将回调函数添加到事件队列中
    this.events[eventName].push(callback)
  }

  /**
   * 发布事件（触发事件）
   * @param {string} eventName - 事件名称
   * @param {...any} args - 传递给回调函数的参数
   */
  emit(eventName, ...args) {
    // 获取该事件对应的所有回调函数
    const callbacks = this.events[eventName]
    // 如果没有注册过该事件，直接返回
    if (!callbacks) {
      return
    }
    // 依次执行所有回调函数，并传入参数
    callbacks.forEach((callback) => {
      callback(...args)
    })
  }

  /**
   * 取消订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} [callback] - 要移除的回调函数（可选）
   *   - 传了 callback：只移除指定的回调
   *   - 没传 callback：移除该事件的所有回调
   */
  off(eventName, callback) {
    // 如果没有传 callback，清空该事件的所有回调
    if (!callback) {
      delete this.events[eventName]
      return
    }
    // 如果传了 callback，只移除匹配的回调函数
    const callbacks = this.events[eventName]
    if (callbacks) {
      this.events[eventName] = callbacks.filter((cb) => cb !== callback)
    }
  }

  /**
   * 一次性订阅事件（触发一次后自动取消订阅）
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 事件触发时执行的回调函数
   */
  once(eventName, callback) {
    // 包装一层函数，执行后自动取消订阅
    const wrapper = (...args) => {
      callback(...args) // 执行原始回调
      this.off(eventName, wrapper) // 执行后立即移除自身
    }
    // 订阅包装后的函数
    this.on(eventName, wrapper)
  }
}

// ==================== 测试 ====================

const emitter = new EventEmitter()

// 测试 on + emit：订阅 news 事件
const newsCallback = (data) => {
  console.log('收到新闻：', data)
}
emitter.on('news', newsCallback)

// 订阅多个回调
emitter.on('news', (data) => {
  console.log('第二条新闻监听：', data)
})

// 发布事件
emitter.emit('news', '今天天气晴朗')
// 输出：
// 收到新闻： 今天天气晴朗
// 第二条新闻监听： 今天天气晴朗

// 测试 off：取消订阅
console.log('--- 取消 newsCallback 后 ---')
emitter.off('news', newsCallback)
emitter.emit('news', '第二次发布')
// 只输出：第二条新闻监听： 第二次发布

// 测试 once：一次性订阅
console.log('--- once 一次性订阅 ---')
emitter.once('oneTime', () => {
  console.log('这个回调只会执行一次')
})

emitter.emit('oneTime') // 输出：这个回调只会执行一次
emitter.emit('oneTime') // 没输出（已自动取消订阅）
