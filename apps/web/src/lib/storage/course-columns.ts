import { STORAGE_KEYS } from './keys'

export type CourseColumnCount = 1 | 2 | 3 | 4

const VALID: CourseColumnCount[] = [1, 2, 3, 4]

export function loadCourseColumns(): CourseColumnCount {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.courseColumns)
    const n = Number(raw)
    if (VALID.includes(n as CourseColumnCount)) return n as CourseColumnCount
  } catch {
    /* ignore */
  }
  return 2
}

export function saveCourseColumns(columns: CourseColumnCount): void {
  localStorage.setItem(STORAGE_KEYS.courseColumns, String(columns))
}

export const COURSE_COLUMN_OPTIONS: { value: CourseColumnCount; label: string }[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
]
