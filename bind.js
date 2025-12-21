function bind(fn, context) {
  return function () {
    fn.apply(context, arguments)
  }
}
