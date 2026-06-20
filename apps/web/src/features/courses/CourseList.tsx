import { useId } from 'react'
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

export function CourseList({ store, onStoreChange }: CourseListProps) {
  return (
    <div className="space-y-4">
      {COURSES.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          store={store}
          onToggle={(key, done) => {
            const next = setLessonDone(store, key, done)
            localRepositories.progress.save(next)
            onStoreChange(next)
          }}
        />
      ))}
    </div>
  )
}

function CourseCard({
  course,
  store,
  onToggle,
}: {
  course: Course
  store: ProgressStore
  onToggle: (key: string, done: boolean) => void
}) {
  const headingId = useId()
  const done = course.lessons.filter((l) => store.lessons[lessonKey(course.id, l.n)]).length
  const total = course.lessons.length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <article className="rounded-xl border bg-card p-4 shadow-sm" aria-labelledby={headingId}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {course.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id={headingId} className="text-lg font-semibold">
              {course.title}
            </h3>
            <span className="rounded-md border px-2 py-0.5 text-xs text-primary">
              {done === total && total > 0 ? '✓' : `${done}/${total}`}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{course.sub}</p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full border bg-muted">
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
    </article>
  )
}
