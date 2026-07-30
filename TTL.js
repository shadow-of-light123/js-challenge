class ttl_LRU {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map()
  }

  get(key) {
    if (!this.map.has(key)) return -1
    const { value, expiry } = this.map.get(key)
    this.map.delete(key)
    if (expiry < Date.now()) {
      return -1
    }
    this.map.set(key, { value, expiry })
    return value
  }

  put(key, value, ttl = 60000) {
    if (this.map.size === this.capacity) this.removeExpired()
    let expiry = Date.now() + ttl

    if (!this.map.has(key) && this.map.size === this.capacity) {
      const leastKey = this.map.keys().next().value
      this.map.delete(leastKey)
      this.map.set(key, { value, expiry })
    } else if (this.map.has(key)) {
      this.map.delete(key)
      this.map.set(key, { value, expiry })
    } else {
      this.map.set(key, { value, expiry })
    }
  }

  removeExpired() {
    for (const [key] of this.map) {
      const { value, expiry } = this.map.get(key)
      if (Date.now() > expiry) this.map.delete(key)
    }
  }
}
