import { useId, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { COURSES } from '@/data/courses'
import { lessonKey, setLessonDone } from '@/lib/gamification/progress'
import { localRepositories } from '@/lib/storage/local-repositories'
import type { Course, ProgressStore } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const base = import.meta.env.BASE_URL

interface CourseListProps {
  store: ProgressStore
  onStoreChange: (store: ProgressStore) => void
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

export function CourseList({ store, onStoreChange }: CourseListProps) {
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
    <div className="space-y-3">
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
    <article className="rounded-xl border bg-card shadow-sm">
      <button
        type="button"
        id={headingId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onOpenChange}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40',
          open ? 'rounded-t-xl' : 'rounded-xl',
        )}
      >
        <span className="text-2xl shrink-0" aria-hidden>
          {course.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{course.title}</span>
            <span className="rounded-md border px-2 py-0.5 text-xs text-primary">
              {done === total && total > 0 ? '✓' : `${done}/${total}`}
            </span>
            {!open && (
              <span className="text-xs text-muted-foreground capitalize">{status}</span>
            )}
          </div>
          {!open && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary/80 transition-[width]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{pct}%</span>
            </div>
          )}
          {open && <p className="mt-0.5 text-sm text-muted-foreground">{course.sub}</p>}
        </div>
        <ChevronDown
          className={cn('size-5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headingId} className="border-t px-4 pb-4 pt-3">
          <div className="h-2 overflow-hidden rounded-full border bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-[width]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {done}/{total} уроков · {pct}%
          </p>

          <ul className="mt-3 space-y-1">
            {course.lessons.map((lesson) => {
              const key = lessonKey(course.id, lesson.n)
              const checked = !!store.lessons[key]
              const inputId = `${course.id}-${lesson.n}`
              return (
                <li key={key} className="flex items-center gap-2 py-1 text-sm">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onToggle(key, e.target.checked)}
                    className="size-4 shrink-0 cursor-pointer accent-primary"
                  />
                  <label
                    htmlFor={inputId}
                    className={cn('cursor-pointer', checked && 'text-muted-foreground line-through')}
                  >
                    <a
                      href={`${base}${lesson.href}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
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
            <div className="mt-3 flex flex-wrap gap-2">
              {course.refs.map((ref) => (
                <a
                  key={ref.href}
                  href={`${base}${ref.href}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border px-2 py-1 text-xs hover:bg-muted"
                >
                  {ref.t}
                </a>
              ))}
            </div>
          )}

          <Button variant="outline" size="sm" className="mt-4" asChild>
            <a href={`${base}${course.primary.href}`} target="_blank" rel="noreferrer">
              ▶ {course.primary.label}
            </a>
          </Button>
        </div>
      )}
    </article>
  )
}
