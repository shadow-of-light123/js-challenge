// 创建迭代器对象来访问数组

// const namesIterator = {
//   next: function () {
//     if (index < names.length) {
//       return { done: false, value: names[index++] }
//     } else {
//       return { done: true, value: undefined }
//     }
//   },
// }

// 可迭代协议：
// 可迭代的对象需要有[Symbol.iterator]方法，方法返回一个迭代器对象

// 迭代器协议:
// 迭代器对象需要有next方法，方法返回的对象需要有done与value两个属性

const iterableObj = {
  names: ['abc', 'cba', 'nba'],
  [Symbol.iterator]: function () {
    let index = 0

    // 以下为迭代器对象
    return {
      next: () => {
        if (index < this.names.length) {
          return { done: false, value: this.names[index++] }
        } else {
          return { done: true, value: undefined }
        }
      },
    }
  },
}

// const iterator = iterableObj[Symbol.iterator]()
// console.log(iterator.next())
// console.log(iterator.next())
// console.log(iterator.next())
// console.log(iterator.next())

// for (let i of iterableObj) {
//   i += 1
//   console.log(i)
// }

const set = new Set()
set.add(1)
set.add(10)

// console.log(set[Symbol.iterator]())

// 创建一个教室类，创建出来的对象都是可迭代对象
class Classroom {
  constructor(address, name, students) {
    this.address = address
    this.name = name
    this.students = students
  }

  entry(newStudent) {
    this.students.push(newStudent)
  }

  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => {
        if (index < this.students.length) {
          return { done: false, value: this.students[index++] }
        } else {
          return { done: true, value: undefined }
        }
      },
      return: () => {
        console.log('迭代器提前终止了~')
        return { done: true, value: undefined }
      },
    }
  }
}

const classroom = new Classroom('3幢5楼205,', '计算机教室', [
  'james',
  'kobe',
  'curry',
  'why',
])
classroom.entry('lilei')

for (const stu of classroom) {
  console.log(stu)
  if (stu === 'why') break
}
