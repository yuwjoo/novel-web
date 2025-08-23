/**
 * @description: 生成随机id
 * @return {string} id
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
