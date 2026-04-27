/**
 * 测试数据：部门结构的扁平数组
 * 每个对象包含：
 * - id: 部门ID
 * - name: 部门名称
 * - pid: 父部门ID（0表示根部门）
 */
const arrayData = [
  { id: 1, name: '部门A', pid: 0 },
  { id: 2, name: '部门B', pid: 1 },
  { id: 3, name: '部门C', pid: 1 },
  { id: 4, name: '部门D', pid: 2 },
  { id: 5, name: '部门E', pid: 2 },
  { id: 6, name: '部门F', pid: 3 },
]

/**
 * 递归版数组转树结构
 * @param {Array} arrayData - 扁平数组数据
 * @param {number} rootId - 根节点ID，默认为0
 * @returns {Array} - 转换后的树形结构数组
 *
 * 实现原理：
 * 1. 过滤出当前层级的节点（pid === rootId）
 * 2. 对每个节点递归查找其子节点
 * 3. 如果有子节点，添加children属性
 * 4. 时间复杂度：O(n²)，因为每个节点都需要遍历整个数组
 */
function arrToTree(arrayData, rootId = 0) {
  return (
    arrayData
      // 过滤出当前层级的节点
      .filter((i) => i.pid === rootId)
      // 对每个节点处理
      .map((i) => {
        // 递归查找子节点
        const children = arrToTree(arrayData, i.id)
        // 如果有子节点，添加children属性
        return children.length ? { ...i, children } : { ...i }
      })
  )
}

/**
 * Map版数组转树结构（优化版）
 * @param {Array} arrayData - 扁平数组数据
 * @param {number} rootId - 根节点ID，默认为0
 * @returns {Array} - 转换后的树形结构数组
 *
 * 实现原理：
 * 1. 使用Map存储所有节点，键为id，值为节点对象（包含children数组）
 * 2. 遍历数组，根据pid将节点添加到对应父节点的children数组中
 * 3. 时间复杂度：O(n)，只需要遍历数组两次
 */
function arrToTreeMap(arrayData, rootId = 0) {
  // 存储根节点
  const root = []
  // 使用Map存储节点，方便快速查找
  const nodeMap = new Map()

  // 第一遍遍历：构建节点Map
  arrayData.forEach((i) => {
    nodeMap.set(i.id, {
      ...i, // 复制节点数据
      children: [], // 初始化children数组
    })
  })

  // 第二遍遍历：构建树形结构
  for (const i of arrayData) {
    // 获取当前节点
    const node = nodeMap.get(i.id)

    if (i.pid === rootId) {
      // 如果是根节点，添加到结果数组
      root.push(node)
    } else {
      // 如果是子节点，添加到父节点的children数组
      nodeMap.get(i.pid).children.push(node)
    }
  }

  // 返回根节点数组
  return root
}

// 测试递归版
console.log('=== 递归版结果 ===')
console.log(JSON.stringify(arrToTree(arrayData), null, 2))

// 测试Map版
console.log('\n=== Map版结果 ===')
console.log(JSON.stringify(arrToTreeMap(arrayData), null, 2))
