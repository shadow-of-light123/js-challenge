import { myPromise } from './promise.js'

const p1 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(111)
  }, 1000)
})

const p2 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(222)
  }, 2000)
})

const p3 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(333)
  }, 500)
})

myPromise.any([p1, p2, p3]).then(
  (res) => {
    console.log('res:', res)
  },
  (err) => {
    console.log('err:', err)
  },
)
