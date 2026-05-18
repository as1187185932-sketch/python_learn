export type SectionId =
  | "warmup"
  | "lesson"
  | "example"
  | "guided"
  | "challenge"
  | "reflection";

export type Confidence = 1 | 2 | 3 | 4 | 5;

export type Lesson = {
  id: string;
  day: number;
  module: string;
  conceptId: string;
  title: string;
  focus: string;
  minutes: number;
  warmup: string[];
  lesson: string[];
  workedExample: {
    prompt: string;
    code: string;
    explanation: string;
  };
  guidedPractice: Exercise;
  challenge: Exercise;
  reflectionPrompts: string[];
};

export type Exercise = {
  prompt: string;
  expected: string;
  hints: string[];
  commonMistakes: string[];
  solution: string;
};

export type ReviewItem = {
  conceptId: string;
  title: string;
  dueDate: string;
  confidence: Confidence;
  attempts: number;
  lastResult: "correct" | "needs-review";
  intervalIndex: number;
};

export type SessionHistory = {
  date: string;
  lessonId: string;
  completedSections: SectionId[];
  reflection: string;
  minutesSpent: number;
};

export type AppState = {
  version: 1;
  currentDay: number;
  completedLessonIds: string[];
  streak: number;
  lastSessionDate: string | null;
  reviewItems: ReviewItem[];
  sessionHistory: SessionHistory[];
  activeSection: SectionId;
  completedSections: SectionId[];
  confidence: Confidence;
  selfCheckCorrect: boolean | null;
  reflection: string;
};
