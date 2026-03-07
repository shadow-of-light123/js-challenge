// function后带*就是生成器函数
// 生成器函数直接调用的时候不会执行
// 生成器函数会返回一个生成器对象，它也是一个特殊的迭代器对象

// 当遇到yield时候暂停函数的执行
// 当遇到return时候生成器就停止执行
function* foo() {
  console.log('函数开始执行~')

  const value1 = 100
  console.log(value1)
  // yield后跟的就是返回值
  yield value1 * 100

  const value2 = 200
  console.log(value2)
  yield value2

  const value3 = 300
  console.log(value3)
  yield value3

  console.log('函数执行结束~')
}

const generator = foo()

// console.log(generator.next())
// console.log(generator.next())

for (const i of generator) {
  console.log(i)
}
