import { myPromise } from './promise.js'

const p1 = new myPromise((resolve) => {
  setTimeout(() => {
    resolve(111)
  }, 1000)
})

const p2 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(222)
  }, 2000)
})

const p3 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(333)
  }, 500)
})

myPromise
  .allSettled([p1, p2, p3])
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
