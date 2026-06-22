import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadCourseColumns, saveCourseColumns } from './course-columns'
import { STORAGE_KEYS } from './keys'

function mockStorage() {
  const map = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => map.set(k, v),
    removeItem: (k: string) => map.delete(k),
  })
}

describe('course-columns', () => {
  beforeEach(() => {
    mockStorage()
  })

  it('defaults to 2 columns', () => {
    expect(loadCourseColumns()).toBe(2)
  })

  it('persists valid column count', () => {
    saveCourseColumns(4)
    expect(loadCourseColumns()).toBe(4)
  })

  it('ignores invalid stored value', () => {
    localStorage.setItem(STORAGE_KEYS.courseColumns, '9')
    expect(loadCourseColumns()).toBe(2)
  })
})
