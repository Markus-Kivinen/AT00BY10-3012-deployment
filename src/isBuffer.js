const BufferRef = typeof globalThis !== 'undefined' ? globalThis.Buffer : undefined
/**
 * Checks if `value` is a buffer.
 *
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * isBuffer(new Buffer(2))
 * // => true
 *
 * isBuffer(new Uint8Array(2))
 * // => false
 */
const isBuffer = BufferRef && typeof BufferRef.isBuffer === 'function' ? BufferRef.isBuffer : () => false

export default isBuffer
