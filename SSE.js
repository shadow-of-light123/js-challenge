class SSEClient {
  constructor(url) {
    this.url = url
    this.abortController = null
  }

  async connect(onMessage, onError) {
    this.abortController = new AbortController()
    try {
      const response = await fetch(this.url, {
        signal: this.abortController.signal,
        headers: { Accept: 'text/event-stream' },
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // 保留不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') return
            try {
              onMessage(JSON.parse(data))
            } catch {
              onMessage(data)
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') onError(err)
    }
  }

  disconnect() {
    this.abortController?.abort()
  }
}
