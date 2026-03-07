async function fetchAIStream(url) {
  const apiKey = import.meta.env.VITE_API_KEY
  const abortController = new AbortController()
  let reader = null
  try {
    // 1.发起fetch请求
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: 'Hello AI',
        stream: true,
      }),
      signal: abortController.signal, // 关联取消信号
    })

    if (!response.ok) throw new Error('请求失败')
    if (!response.body) throw new Error('无流式响应')

    // 流式读取逻辑
    // 流式返回的response.body就是一个ReadableStream对象
    reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // 解码二进制数据（流式解码）
      const chunk = decoder.decode(value, { stream: true })

      // 解析 AI 流式数据（处理 SSE 格式：data: xxx\n\n）
      // 从换行处拆分，并过滤掉空行
      const lines = chunk.split('\n').filter((line) => line.trim() !== '')
      for (const line of lines) {
        // 去掉'data: '前缀
        const dataStr = line.replace(/^data:/, '')

        // 跳过结束标记
        if (dataStr === '[DONE]') continue

        try {
          // 解析JSON数据
          const data = JSON.parse(dataStr)

          if (data.error) {
          }

          // 提取有效文本
          const content = data.content || ''
          if (content) {
            fullText += content
            // 实时向外传递流式文本
            onChunk(content)
          }
        } catch (parseError) {
          // 为解析到非JSON行的数据做兜底
        }
      }
    }
  } catch (e) {
    console.error('Error fetching AI stream:', e)
  } finally {
    // 释放资源：无论成功/失败，都释放读取器锁
    if (reader) {
      reader.releaseLock()
    }
    // 可选：取消控制器（避免残留）
    abortController.abort()
  }

  // 返回取消控制器，让外部可以主动取消请求
  return abortController
}
