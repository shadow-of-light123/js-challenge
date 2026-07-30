class ttl_LRU {
  constructor(capacity, defaultTTL = 0) {        // 【新增】defaultTTL 参数，0 表示不过期
    this.capacity = capacity
    this.defaultTTL = defaultTTL                  // 【新增】保存默认过期时间(ms)
    this.map = new Map()
  }

  // 【新增】判断某个 key 是否已过期
  _isExpired(key) {
    if (!this.map.has(key)) return true
    const { expiry } = this.map.get(key)
    // expiry 为 0 表示永不过期
    return expiry !== 0 && Date.now() > expiry
  }

  // 【新增】清除所有过期的条目
  _removeExpired() {
    for (const [key] of this.map) {
      if (this._isExpired(key)) {
        this.map.delete(key)
      }
    }
  }

  get(key) {
    if (!this.map.has(key)) return -1

    // 【新增】如果过期了就删掉，返回 -1
    if (this._isExpired(key)) {
      this.map.delete(key)
      return -1
    }

    // 以下是原有逻辑：移到末尾表示最近使用
    const { value, expiry } = this.map.get(key)   // 【修改】解构取出 value 和 expiry
    this.map.delete(key)
    this.map.set(key, { value, expiry })           // 【修改】重新存入时保留 expiry
    return value
  }

  put(key, value, ttl) {                           // 【修改】新增 ttl 参数
    // 【新增】先清理过期条目，腾出空间
    this._removeExpired()

    // 如果 key 已存在，删掉旧的再设新的
    if (this.map.has(key)) {
      this.map.delete(key)
    } else if (this.map.size >= this.capacity) {   // 【修改】> = 号防止边界情况
      // 容量满了，淘汰最久未使用的（队首）
      const leastKey = this.map.keys().next().value
      this.map.delete(leastKey)
    }

    // 【新增】计算过期时间：传了 ttl 用 ttl，否则用 defaultTTL，0 表示永不过期
    const ttlMs = ttl !== undefined ? ttl : this.defaultTTL
    const expiry = ttlMs > 0 ? Date.now() + ttlMs : 0

    this.map.set(key, { value, expiry })            // 【修改】存入 { value, expiry } 对象
  }

  // 【新增】获取当前有效条目数
  get size() {
    this._removeExpired()
    return this.map.size
  }
}
