// ===== 原始文本（客户端实际收到的字节流，\n 表示换行符）=====
// 每条消息 = "data: xxx\n\n"（两行：内容行 + 空行）
const raw =
  'data: {"content":"你好"}\n\ndata: {"content":"我是"}\n\ndata: {"content":"模拟"}\n\ndata: {"content":"AI"}\n\ndata: [DONE]\n\n'

// ===== 处理后应该变为的文本 =====
const processed = '你好我是模拟AI'

// ===== 实现答案：SSE 解析 =====
function parseSSE(raw) {
  let result = ''
  const lines = raw.split('\n\n')
  for (const line of lines) {
    if (!line) continue
    const str = line.replace(/^data: /, '')
    if (str === '[DONE]') break
    try {
      result += JSON.parse(str).content
    } catch (e) {}
  }
  return result
}

console.log(parseSSE(raw)) // 你好我是模拟AI
console.log(parseSSE(raw) === processed) // true

// ===== 循环读取（流式）版本 =====
// 数据分块到达，\n\n 可能被截断，用 buffer 暂存半截消息
function parseSSEStream() {
  let buffer = ''

  return function feed(chunk) {
    let result = ''
    buffer += chunk

    const lines = buffer.split('\n\n')
    buffer = lines.pop() // 尾巴是可能残缺的半截，放回 buffer 等下次拼接

    for (const line of lines) {
      if (!line) continue
      const str = line.replace(/^data: /, '')
      if (str === '[DONE]') break
      try {
        result += JSON.parse(str).content
      } catch (e) {}
    }

    return result
  }
}

// 模拟不规则分块读取：每条消息从中间截断，一次喂一块
const chunks = [
  'data: {"content":"你',
  '好"}\n\ndata: {"content',
  '":"我是"}\n\n',
  'data: {"content":"模拟"}\n\nd',
  'ata: {"content":"AI"}\n',
  '\ndata: [DONE]\n\n',
]

const feed = parseSSEStream()
let output = ''
for (const chunk of chunks) {
  output += feed(chunk)
}

console.log(output) // 你好我是模拟AI
console.log(output === processed) // true
