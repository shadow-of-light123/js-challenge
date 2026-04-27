/**
 * 测试数据：部门结构的树形结构
 * 每个节点包含：
 * - id: 部门ID
 * - name: 部门名称
 * - children: 子部门数组（可选）
 */
const tree = [
  {
    id: 1,
    name: '部门A',
    children: [
      {
        id: 2,
        name: '部门B',
        children: [
          { id: 4, name: '部门D' },
          { id: 5, name: '部门E' },
        ],
      },
      { id: 3, name: '部门C', children: [{ id: 6, name: '部门F' }] },
    ],
  },
]

/**
 * 树形结构转扁平数组
 * @param {Array|Object} tree - 树形结构数据（数组或单个对象）
 * @param {number} pid - 根节点的父ID，默认为0
 * @returns {Array} - 转换后的扁平数组
 *
 * 实现原理：
 * 1. 使用深度优先搜索（DFS）遍历树形结构
 * 2. 遍历每个节点，将其转换为扁平结构并添加pid字段
 * 3. 递归处理子节点，传递当前节点的id作为子节点的pid
 * 4. 时间复杂度：O(n)，其中n是节点总数
 */
function treeToArr(tree, pid = 0) {
  // 存储结果的数组
  const res = []
  // 确保处理的是数组格式
  const nodes = Array.isArray(tree) ? tree : [tree]

  /**
   * 深度优先搜索辅助函数
   * @param {Array} nodes - 当前处理的节点数组
   * @param {number} parentId - 当前节点的父ID
   */
  function dfs(nodes, parentId) {
    // 遍历当前节点数组
    for (const node of nodes) {
      // 解构出children和其他属性
      const { children, ...rest } = node
      // 将当前节点转换为扁平结构并添加pid字段
      res.push({ ...rest, pid: parentId })
      // 如果存在子节点，递归处理
      if (children?.length) {
        dfs(children, node.id)
      }
    }
  }

  // 开始深度优先搜索
  dfs(nodes, pid)
  // 返回转换后的扁平数组
  return res
}

// 测试树形结构转扁平数组
console.log('树形结构转扁平数组结果：')
console.log(treeToArr(tree))
// 预期输出：
// [
//   { id: 1, name: '部门A', pid: 0 },
//   { id: 2, name: '部门B', pid: 1 },
//   { id: 4, name: '部门D', pid: 2 },
//   { id: 5, name: '部门E', pid: 2 },
//   { id: 3, name: '部门C', pid: 1 },
//   { id: 6, name: '部门F', pid: 3 }
// ]
