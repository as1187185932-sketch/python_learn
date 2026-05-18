import { lessons, sectionOrder } from "./curriculum";
import type { AppState, Confidence, Lesson, ReviewItem, SectionId } from "./types";

export const STORAGE_KEY = "pythonLearningCoach:v1";
const STATE_VERSION = 1;
const reviewIntervals = [1, 3, 7, 14];

const todayIso = () => new Date().toISOString().slice(0, 10);

const addDays = (dateIso: string, days: number) => {
  const date = new Date(`${dateIso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const daysBetween = (startIso: string, endIso: string) => {
  const start = new Date(`${startIso}T00:00:00`).getTime();
  const end = new Date(`${endIso}T00:00:00`).getTime();
  return Math.round((end - start) / 86_400_000);
};

export const createInitialState = (): AppState => ({
  version: STATE_VERSION,
  currentDay: 1,
  completedLessonIds: [],
  streak: 0,
  lastSessionDate: null,
  reviewItems: [],
  sessionHistory: [],
  activeSection: "warmup",
  completedSections: [],
  confidence: 3,
  selfCheckCorrect: null,
  reflection: "",
});

export const loadState = (): AppState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }

    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (parsed.version !== STATE_VERSION) {
      return createInitialState();
    }

    return { ...createInitialState(), ...parsed } as AppState;
  } catch {
    return createInitialState();
  }
};

export const saveState = (state: AppState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getCurrentLesson = (state: AppState): Lesson => {
  return lessons.find((lesson) => lesson.day === state.currentDay) ?? lessons[lessons.length - 1];
};

export const getDueReviews = (state: AppState): ReviewItem[] => {
  const today = todayIso();
  return state.reviewItems
    .filter((item) => item.dueDate <= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.confidence - b.confidence);
};

export const completeSection = (state: AppState, section: SectionId): AppState => {
  const completedSections = state.completedSections.includes(section)
    ? state.completedSections
    : [...state.completedSections, section];
  const currentIndex = sectionOrder.indexOf(section);
  const nextSection = sectionOrder[currentIndex + 1] ?? section;

  return {
    ...state,
    completedSections,
    activeSection: nextSection,
  };
};

export const updateReviewResult = (
  state: AppState,
  conceptId: string,
  confidence: Confidence,
  correct: boolean,
): AppState => {
  const today = todayIso();
  const reviewItems = state.reviewItems.map((item) => {
    if (item.conceptId !== conceptId) {
      return item;
    }

    const shouldAdvance = correct && confidence >= 4;
    const lastResult: ReviewItem["lastResult"] = shouldAdvance ? "correct" : "needs-review";
    const intervalIndex = shouldAdvance
      ? Math.min(item.intervalIndex + 1, reviewIntervals.length - 1)
      : 0;

    return {
      ...item,
      confidence,
      attempts: item.attempts + 1,
      lastResult,
      intervalIndex,
      dueDate: addDays(today, shouldAdvance ? reviewIntervals[intervalIndex] : 1),
    };
  });

  return { ...state, reviewItems };
};

export const completeLesson = (state: AppState): AppState => {
  const lesson = getCurrentLesson(state);
  const today = todayIso();
  const previousGap = state.lastSessionDate ? daysBetween(state.lastSessionDate, today) : null;
  const streak =
    previousGap === null ? 1 : previousGap === 0 ? state.streak : previousGap <= 2 ? state.streak + 1 : 1;
  const alreadyCompleted = state.completedLessonIds.includes(lesson.id);
  const nextDay = alreadyCompleted ? state.currentDay : Math.min(state.currentDay + 1, lessons.length);
  const confidence = state.confidence;
  const correct = state.selfCheckCorrect ?? false;
  const firstInterval = correct && confidence >= 4 ? 3 : 1;
  const existingReview = state.reviewItems.some((item) => item.conceptId === lesson.conceptId);
  const reviewItem: ReviewItem = {
    conceptId: lesson.conceptId,
    title: lesson.title,
    dueDate: addDays(today, firstInterval),
    confidence,
    attempts: 1,
    lastResult: correct && confidence >= 4 ? "correct" : "needs-review",
    intervalIndex: correct && confidence >= 4 ? 1 : 0,
  };

  const reviewItems = existingReview
    ? state.reviewItems.map((item) => (item.conceptId === lesson.conceptId ? reviewItem : item))
    : [...state.reviewItems, reviewItem];

  return {
    ...state,
    currentDay: nextDay,
    completedLessonIds: alreadyCompleted
      ? state.completedLessonIds
      : [...state.completedLessonIds, lesson.id],
    streak,
    lastSessionDate: today,
    reviewItems,
    sessionHistory: [
      ...state.sessionHistory,
      {
        date: today,
        lessonId: lesson.id,
        completedSections: sectionOrder.filter((section) =>
          state.completedSections.includes(section),
        ),
        reflection: state.reflection.trim(),
        minutesSpent: lesson.minutes,
      },
    ],
    activeSection: "warmup",
    completedSections: [],
    confidence: 3,
    selfCheckCorrect: null,
    reflection: "",
  };
};

export const resetProgress = (): AppState => {
  const state = createInitialState();
  saveState(state);
  return state;
};

export const formatDate = (dateIso: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(
    new Date(`${dateIso}T00:00:00`),
  );
