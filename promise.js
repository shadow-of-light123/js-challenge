const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function execFnWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (err) {
    reject(err)
  }
}

export class myPromise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      // 添加微任务
      // 让then先跑，这样异步函数就可以在回调中执行
      queueMicrotask(() => {
        if (this.status !== PENDING) return
        this.status = FULFILLED
        this.value = value
        this.onFulfilledFns.forEach((fn) => {
          fn(this.value)
        })
      })
    }

    const reject = (reason) => {
      queueMicrotask(() => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.reason = reason
        this.onRejectedFns.forEach((fn) => {
          fn(this.reason)
        })
      })
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  // 实现Promise.then()
  then(onFulfilled, onRejected) {
    // 处理catch的情况
    const defaultOnRejected = (err) => {
      throw err
    }

    onRejected = onRejected || defaultOnRejected

    const defaultOnFulfilled = (value) => {
      return value
    }

    onFulfilled = onFulfilled || defaultOnFulfilled

    return new myPromise((resolve, reject) => {
      // 1.如果在then调用的时候，状态已经确定下来
      if (this.status === FULFILLED) {
        // try {
        //   const value = onFulfilled(this.value)
        //   resolve(value)
        // } catch (err) {
        //   reject(err)
        // }
        execFnWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === REJECTED) {
        // try {
        //   const reason = onRejected(this.reason)
        //   resolve(reason)
        // } catch (err) {
        //   reject(err)
        // }
        execFnWithCatchError(onRejected, this.reason, resolve, reject)
      }
      // 2.将成功的回调和失败的回调加进数组当中
      if (this.status === PENDING) {
        if (onFulfilled) {
          this.onFulfilledFns.push(() => {
            // try {
            //   const value = onFulfilled(this.value)
            //   resolve(value)
            // } catch (err) {
            //   reject(err)
            // }
            execFnWithCatchError(onFulfilled, this.value, resolve, reject)
          })
        }
        if (onRejected) {
          this.onRejectedFns.push(() => {
            // try {
            //   const reason = onRejected(this.reason)
            //   resolve(reason)
            // } catch (err) {
            //   reject(err)
            // }
            execFnWithCatchError(onRejected, this.reason, resolve, reject)
          })
        }
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    this.then(
      () => {
        onFinally()
      },
      () => {
        onFinally()
      },
    )
  }

  // 实现Promsie.resolve()
  static resolve(value) {
    return value instanceof myPromise
      ? value
      : new myPromise((resolve) => {
          resolve(value)
        })
  }

  // 实现Promise.reject()
  static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason)
    })
  }

  // 实现Promise.all()
  static all(promises) {
    return new myPromise((resolve, reject) => {
      if (promises.length === 0) {
        return resolve([])
      }

      const values = []
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            // 使用索引，确保传入promise的顺序不会受pending的时间而打乱
            values.splice(index, 0, res)
            if (values.length === promises.length) {
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

  // 实现Promise.allSettled
  static allSettled(promises) {
    return new myPromise((resolve) => {
      if (promises.length === 0) {
        return resolve([])
      }

      const values = []
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            values.splice(index, 0, { status: 'fulfilled', res })
            if (values.length === promises.length) resolve(values)
          },
          (err) => {
            values.splice(index, 0, { status: 'rejected', err })
            if (values.length === promises.length) resolve(values)
          },
        )
      })
    })
  }

  static race(promises) {
    return new myPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            resolve(res)
          },
          (err) => {
            reject(err)
          },
        )
      })
    })
  }

  static any(promises) {
    return new Promise((resolve, reject) => {
      if (promises.length === 0) {
        return reject(new AggregateError([], 'All promises were rejected'))
      }

      const reasons = []
      promises.forEach((promise, index) => {
        promise.then(
          (res) => {
            resolve(res)
          },
          (err) => {
            reasons.splice(index, 0, err)
            if (reasons.length === promises.length) {
              reject(new AggregateError(reasons, 'All promises were rejected'))
            }
          },
        )
      })
    })
  }
}

// const p = new myPromise((resolve, reject) => {
//   console.log('状态pending')
//   resolve(111)
//   // reject(222)
// })

// p.then((res) => {
//   console.log('res1:', res)
//   return 222
// })
//   .catch((res) => {
//     console.log('res2', res)
//   })
//   .finally(() => {
//     console.log('finally')
//   })
