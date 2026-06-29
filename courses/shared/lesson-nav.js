(function () {
  const COURSES = {
    'senior-2026': {
      title: 'Senior 2026',
      lessons: [
        { file: '0001-put-zaprosa.html', label: '0001 · Путь запроса' },
        { file: '0002-sessii-i-tokeny.html', label: '0002 · Сессии и токены' },
        { file: '0003-kontrakt-api.html', label: '0003 · Контракт API' },
        { file: '0004-cors.html', label: '0004 · CORS' },
        { file: '0005-chekpoin-faza-0.html', label: '0005 · Чекпоинт Фазы 0' },
        { file: '0006-sloi-bekenda.html', label: '0006 · Слои бэкенда' },
        { file: '0007-middleware-i-oshibki.html', label: '0007 · Middleware и ошибки' },
        { file: '0008-login-postrochno.html', label: '0008 · Login построчно' },
      ],
    },
    english: {
      title: 'Английский',
      lessons: [
        { file: '0001-diagnostika-tochka-starta.html', label: '0001 · Диагностика' },
        { file: '0002-artikli-a-an-the.html', label: '0002 · Артикли' },
        { file: '0003-present-perfect-vs-past-simple.html', label: '0003 · Present Perfect' },
      ],
    },
    'css-grid': {
      title: 'CSS Grid',
      lessons: [
        { file: '0001-osnovy-css-grid.html', label: '0001 · Основы Grid' },
        { file: '0002-razmeshchenie-elementov.html', label: '0002 · Размещение' },
        { file: '0003-adaptivnye-setki.html', label: '0003 · Адаптивные сетки' },
      ],
    },
    chtenie: {
      title: 'Чтение (сын)',
      lessons: [
        { file: '0001-zvuk-ne-imya.html', label: '0001 · Звук, а не имя' },
        { file: '0002-begushchiy-palchik.html', label: '0002 · Бегущий пальчик' },
        { file: '0003-iz-slogov-slovo.html', label: '0003 · Из слогов — слово' },
        { file: '0004-zakrytye-slogi.html', label: '0004 · Закрытые слоги' },
        { file: '0005-bukvy-bez-tyani-i-prevrashcheniya.html', label: '0005 · Буквы без тяни' },
      ],
    },
    rubik: {
      title: 'Кубик Рубика',
      lessons: [
        { file: '0001-znakomstvo-i-notaciya.html', label: '0001 · Знакомство' },
        { file: '0002-belyy-krest.html', label: '0002 · Белый крест' },
        { file: '0003-pervyy-sloy.html', label: '0003 · Первый слой' },
      ],
    },
  }

  const match = window.location.pathname.match(/\/courses\/([^/]+)\/lessons\/([^/]+\.html)$/)
  if (!match) return

  const courseId = match[1]
  const currentFile = match[2]
  const course = COURSES[courseId]
  if (!course) return

  const idx = course.lessons.findIndex((l) => l.file === currentFile)
  if (idx < 0) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = new URL('../../shared/lesson-nav.css', window.location.href).href
  document.head.appendChild(link)

  const dashboardHref = new URL('../../../', window.location.href).href

  function navLink(lesson, kind) {
    const href = new URL(lesson.file, window.location.href).href
    const arrow = kind === 'prev' ? '← ' : '→ '
    const text = kind === 'prev' ? 'Предыдущий урок' : 'Следующий урок'
    return (
      '<a class="nav-' +
      kind +
      '" href="' +
      href +
      '"><span class="nav-label">' +
      arrow +
      text +
      '</span>' +
      lesson.label +
      '</a>'
    )
  }

  function disabled(kind) {
    const text = kind === 'prev' ? '← Предыдущий урок' : 'Следующий урок →'
    return '<span class="nav-disabled nav-' + kind + '">' + text + '</span>'
  }

  function buildNav() {
    const prev = idx > 0 ? navLink(course.lessons[idx - 1], 'prev') : disabled('prev')
    const next =
      idx < course.lessons.length - 1 ? navLink(course.lessons[idx + 1], 'next') : disabled('next')
    return (
      prev +
      '<a class="nav-dashboard" href="' +
      dashboardHref +
      '">↑ ' +
      course.title +
      ' · Dashboard</a>' +
      next
    )
  }

  const top = document.createElement('nav')
  top.className = 'lesson-nav'
  top.setAttribute('aria-label', 'Навигация по урокам')
  top.innerHTML = buildNav()

  const bottom = top.cloneNode(true)
  bottom.className = 'lesson-nav lesson-nav--bottom'
  bottom.innerHTML = buildNav()

  const body = document.body
  if (body.firstChild) body.insertBefore(top, body.firstChild)
  else body.appendChild(top)
  body.appendChild(bottom)
})()
