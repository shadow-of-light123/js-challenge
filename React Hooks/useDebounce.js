import { useRef, useCallback, useEffect } from 'react'

/**
 * React Hooks 版防抖函数
 *
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} [immediate=false] - 是否立即执行（第一次调用立即执行）
 * @returns {Object} - 包含 run 和 cancel 方法的对象
 *
 * @example
 * // 基础用法
 * const { run: debouncedFn } = useDebounce(() => {
 *   console.log('防抖执行')
 * }, 300)
 *
 * // 立即执行模式（第一次立即执行，后续调用延迟）
 * const { run: debouncedFn } = useDebounce(() => {
 *   console.log('立即执行')
 * }, 300, true)
 *
 * // 带参数的防抖函数
 * const { run: debouncedSearch } = useDebounce((keyword) => {
 *   console.log('搜索:', keyword)
 * }, 300)
 *
 * // 在组件中使用
 * useEffect(() => {
 *   debouncedFn()
 * }, [debouncedFn])
 *
 * // 取消防抖
 * const { run: debouncedFn, cancel } = useDebounce(() => {}, 300)
 * cancel() // 取消当前的防抖
 *
 * @description
 * 防抖原理：
 * 1. 每次调用防抖函数时，清除之前的定时器
 * 2. 设置新的定时器，延迟指定时间后执行目标函数
 * 3. 如果 immediate 为 true，则第一次调用时立即执行
 *
 * 使用场景：
 * - 搜索框输入搜索
 * - 窗口大小改变事件
 * - 滚动事件处理
 * - 按钮点击防重复提交
 *
 * 注意事项：
 * - 使用 useRef 保存定时器引用，确保组件重新渲染时不会丢失
 * - 使用 useCallback 缓存防抖函数，避免不必要的重新创建
 * - 组件卸载时会自动清除定时器，防止内存泄漏
 */
function useDebounce(fn, delay, immediate = false) {
  // 保存定时器引用，使用 useRef 确保组件重新渲染时不会丢失
  const timerRef = useRef(null)

  // 保存函数引用，用于立即执行模式
  const fnRef = useRef(fn)

  // 更新函数引用，确保始终使用最新的函数
  fnRef.current = fn

  /**
   * 清除定时器的辅助函数
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  /**
   * 防抖后的执行函数
   * @param {...any} args - 传递给原函数的参数
   */
  const run = useCallback(
    (...args) => {
      // 如果是立即执行模式，且之前没有定时器（说明是第一次调用）
      if (immediate && !timerRef.current) {
        // 立即执行函数
        fnRef.current.apply(this, args)
      }

      // 清除之前的定时器
      clearTimer()

      // 设置新的定时器
      timerRef.current = setTimeout(() => {
        // 非立即执行模式：延迟后执行函数
        if (!immediate) {
          fnRef.current.apply(this, args)
        }
        // 清除定时器引用
        clearTimer()
      }, delay)
    },
    [delay, immediate, clearTimer],
  )

  /**
   * 取消防抖（清除定时器）
   * @example
   * const { run, cancel } = useDebounce(() => {}, 300)
   * cancel() // 取消当前的防抖
   */
  const cancel = useCallback(() => {
    clearTimer()
  }, [clearTimer])

  // 组件卸载时清除定时器，防止内存泄漏和 setState-on-unmounted 警告
  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return { run, cancel }
}

export default useDebounce
