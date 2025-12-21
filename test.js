// 深拷贝
function deepCopy(obj, map = new WeakMap()) {
  if (!obj || typeof obj !== "object") {
    return obj
  }

  if (map.has(obj)) return map.get(obj)

  const newObj = Array.isArray(obj) ? [] : {}

  map.set(obj, newObj)

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepCopy(obj[key], map) : obj[key]
    }
  }

  return newObj
}
