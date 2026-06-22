import { useId, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COURSES } from '@/data/courses'
import { lessonKey, setLessonDone } from '@/lib/gamification/progress'
import { localRepositories } from '@/lib/storage/local-repositories'
import type { Course, ProgressStore } from '@/types'
import { cn } from '@/lib/utils'

const base = import.meta.env.BASE_URL

interface CourseListProps {
  store: ProgressStore
  onStoreChange: (store: ProgressStore) => void
  /** Две колонки карточек курсов */
  columns?: 1 | 2
}

function courseDoneCount(course: Course, store: ProgressStore): number {
  return course.lessons.filter((l) => store.lessons[lessonKey(course.id, l.n)]).length
}

/** Развёрнуты курсы «в процессе»; свёрнуты пустые и полностью пройденные. */
function defaultExpandedIds(store: ProgressStore): Set<string> {
  const ids = new Set<string>()
  for (const course of COURSES) {
    const done = courseDoneCount(course, store)
    const total = course.lessons.length
    if (done > 0 && done < total) ids.add(course.id)
  }
  return ids
}

export function CourseList({ store, onStoreChange, columns = 2 }: CourseListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => defaultExpandedIds(store))

  const toggleExpanded = (courseId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

  return (
    <div className={cn('rpg-course-list', columns === 2 && 'rpg-course-list-cols')}>
      {COURSES.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          store={store}
          open={expanded.has(course.id)}
          onOpenChange={() => toggleExpanded(course.id)}
          onToggle={(key, done) => {
            const next = setLessonDone(store, key, done)
            localRepositories.progress.save(next)
            onStoreChange(next)
            if (done) {
              setExpanded((prev) => new Set(prev).add(course.id))
            }
          }}
        />
      ))}
    </div>
  )
}

function CourseCard({
  course,
  store,
  open,
  onOpenChange,
  onToggle,
}: {
  course: Course
  store: ProgressStore
  open: boolean
  onOpenChange: () => void
  onToggle: (key: string, done: boolean) => void
}) {
  const headingId = useId()
  const panelId = useId()
  const done = useMemo(() => courseDoneCount(course, store), [course, store])
  const total = course.lessons.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const status =
    done === 0 ? 'не начат' : done === total && total > 0 ? 'пройден' : 'в процессе'

  return (
    <article className="rpg-course-card">
      <button
        type="button"
        id={headingId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onOpenChange}
        className={cn('rpg-course-head', open && 'rpg-course-head-open')}
      >
        <span className="rpg-course-emoji shrink-0" aria-hidden>
          {course.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="rpg-course-title font-semibold">{course.title}</span>
            <span className="rpg-course-badge">
              {done === total && total > 0 ? '✓' : `${done}/${total}`}
            </span>
            {!open && <span className="rpg-course-status capitalize">{status}</span>}
          </div>
          {!open && (
            <div className="mt-2 flex items-center gap-2">
              <div className="rpg-course-track min-w-0 flex-1">
                <div className="rpg-course-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="rpg-course-pct shrink-0">{pct}%</span>
            </div>
          )}
          {open && <p className="rpg-course-sub mt-1">{course.sub}</p>}
        </div>
        <ChevronDown
          className={cn('rpg-course-chevron size-5 shrink-0', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headingId} className="rpg-course-body">
          <div className="rpg-course-track rpg-course-track-lg">
            <div className="rpg-course-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="rpg-course-meta">
            {done}/{total} уроков · {pct}%
          </p>

          <ul className="rpg-course-lessons">
            {course.lessons.map((lesson) => {
              const key = lessonKey(course.id, lesson.n)
              const checked = !!store.lessons[key]
              const inputId = `${course.id}-${lesson.n}`
              return (
                <li key={key} className="rpg-course-lesson">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onToggle(key, e.target.checked)}
                    className="rpg-course-check"
                  />
                  <label htmlFor={inputId} className={cn('rpg-course-lesson-label', checked && 'done')}>
                    <a
                      href={`${base}${lesson.href}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lesson.n} · {lesson.t}
                    </a>
                  </label>
                </li>
              )
            })}
          </ul>

          {course.refs && course.refs.length > 0 && (
            <div className="rpg-course-refs">
              {course.refs.map((ref) => (
                <a
                  key={ref.href}
                  href={`${base}${ref.href}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rpg-course-ref"
                >
                  {ref.t}
                </a>
              ))}
            </div>
          )}

          <a
            href={`${base}${course.primary.href}`}
            target="_blank"
            rel="noreferrer"
            className="rpg-course-open"
          >
            ▶ {course.primary.label}
          </a>
        </div>
      )}
    </article>
  )
}
