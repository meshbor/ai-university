package chat

import (
	"encoding/json"
	"strings"
)

type Context struct {
	Route     string          `json:"route"`
	ThemeID   string          `json:"themeId"`
	ActiveTab string          `json:"activeTab"`
	Profile   json.RawMessage `json:"profile"`
	Stats     struct {
		Level       int `json:"level"`
		DoneLessons int `json:"doneLessons"`
		XP          int `json:"xp"`
		Streak      int `json:"streak"`
	} `json:"stats"`
}

func AnswerLocal(message string, ctx *Context) string {
	norm := strings.ToLower(strings.TrimSpace(message))

	if ctx != nil && containsAny(norm, "мой", "сколько", "текущ") &&
		containsAny(norm, "xp", "уров", "прогресс", "streak") {
		return personalStats(ctx)
	}

	if containsAny(norm, "xp", "опыт", "уровень") {
		return GamificationRules
	}
	if containsAny(norm, "дуэль", "duel", "вызов") {
		return DuelRules
	}
	if containsAny(norm, "курс", "урок") {
		return CoursesSummary + "\n\nОткрой вкладку «Курсы» на dashboard."
	}
	if containsAny(norm, "прогресс", "сброс", "localstorage") {
		return "Прогресс в localStorage. «Сбросить прогресс» очищает уроки, профиль героя остаётся."
	}
	if containsAny(norm, "баг", "правк", "сообщ") {
		return "Для багов и правок в коде — «Сообщить» в панели. Помощник код не меняет."
	}
	if containsAny(norm, "привет", "здравств") {
		return "Привет! Спрашивай про XP, курсы, дуэли. Для правок в коде — «Сообщить разработчику»."
	}

	return "Могу помочь с XP, курсами, дуэлями и прогрессом.\n\n" + GamificationRules + "\n\n" + DuelRules
}

func personalStats(ctx *Context) string {
	name := "герой"
	if len(ctx.Profile) > 0 && string(ctx.Profile) != "null" {
		var p struct {
			Name string `json:"name"`
		}
		if json.Unmarshal(ctx.Profile, &p) == nil && p.Name != "" {
			name = p.Name
		}
	}
	return strings.Join([]string{
		"Твой прогресс, " + name + ":",
		"- Уровень: " + itoa(ctx.Stats.Level),
		"- XP: " + itoa(ctx.Stats.XP),
		"- Уроков: " + itoa(ctx.Stats.DoneLessons),
		"- Streak: " + itoa(ctx.Stats.Streak) + " дн.",
		"",
		GamificationRules,
	}, "\n")
}

func containsAny(s string, parts ...string) bool {
	for _, p := range parts {
		if strings.Contains(s, p) {
			return true
		}
	}
	return false
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	neg := n < 0
	if neg {
		n = -n
	}
	var digits []byte
	for n > 0 {
		digits = append([]byte{byte('0' + n%10)}, digits...)
		n /= 10
	}
	if neg {
		digits = append([]byte{'-'}, digits...)
	}
	return string(digits)
}
