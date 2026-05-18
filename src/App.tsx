import { useEffect, useMemo, useState } from "react";
import { lessons, sectionLabels, sectionOrder } from "./curriculum";
import {
  completeLesson,
  completeSection,
  formatDate,
  getCurrentLesson,
  getDueReviews,
  loadState,
  resetProgress,
  saveState,
  updateReviewResult,
} from "./storage";
import type { AppState, Confidence, Exercise, ReviewItem, SectionId } from "./types";

const confidenceOptions: Confidence[] = [1, 2, 3, 4, 5];

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const lesson = getCurrentLesson(state);
  const dueReviews = useMemo(() => getDueReviews(state), [state]);
  const completionPercent = Math.round((state.completedSections.length / sectionOrder.length) * 100);
  const isLessonReady = sectionOrder.every((section) => state.completedSections.includes(section));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setAndSave = (next: AppState) => setState(next);

  const markSection = (section: SectionId) => {
    setAndSave(completeSection(state, section));
  };

  const handleReview = (item: ReviewItem, correct: boolean, confidence: Confidence) => {
    setAndSave(updateReviewResult(state, item.conceptId, confidence, correct));
  };

  return (
    <main className="app-shell">
      <section className="dashboard">
        <aside className="sidebar" aria-label="Learning progress">
          <div className="brand">
            <div className="mark">Py</div>
            <div>
              <h1>Python Coach</h1>
              <p>45-minute daily fluency</p>
            </div>
          </div>

          <div className="metric-grid">
            <Metric label="Streak" value={`${state.streak} day${state.streak === 1 ? "" : "s"}`} />
            <Metric label="Current day" value={`${state.currentDay}/${lessons.length}`} />
            <Metric label="Lesson progress" value={`${completionPercent}%`} />
            <Metric label="Reviews due" value={String(dueReviews.length)} />
          </div>

          <div className="panel compact">
            <div className="panel-heading">
              <h2>Review Queue</h2>
              <span>{dueReviews.length ? "Due now" : "Clear"}</span>
            </div>
            {dueReviews.length ? (
              <div className="review-list">
                {dueReviews.slice(0, 3).map((item) => (
                  <ReviewCard key={item.conceptId} item={item} onReview={handleReview} />
                ))}
              </div>
            ) : (
              <p className="muted">
                Complete today&apos;s lesson to seed spaced repetition for tomorrow and beyond.
              </p>
            )}
          </div>

          <div className="panel compact">
            <div className="panel-heading">
              <h2>Learning Science</h2>
              <span>Active</span>
            </div>
            <ul className="science-list">
              <li>Retrieval before instruction</li>
              <li>Worked example, then practice</li>
              <li>Adaptive spaced review</li>
              <li>Reflection for metacognition</li>
            </ul>
          </div>
        </aside>

        <section className="lesson-area">
          <div className="lesson-header">
            <div>
              <p className="eyebrow">{lesson.module} / Day {lesson.day}</p>
              <h2>{lesson.title}</h2>
              <p>{lesson.focus}</p>
            </div>
            <div className="timer-pill">
              <span>Estimated</span>
              <strong>{lesson.minutes} min</strong>
            </div>
          </div>

          <nav className="section-tabs" aria-label="Session sections">
            {sectionOrder.map((section) => (
              <button
                key={section}
                className={state.activeSection === section ? "active" : ""}
                onClick={() => setState({ ...state, activeSection: section })}
                type="button"
              >
                <span>{state.completedSections.includes(section) ? "✓" : sectionOrder.indexOf(section) + 1}</span>
                {sectionLabels[section]}
              </button>
            ))}
          </nav>

          <LessonSection
            section={state.activeSection}
            lesson={lesson}
            state={state}
            setState={setState}
            onComplete={() => markSection(state.activeSection)}
          />

          <div className="finish-row">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setState(resetProgress())}
            >
              Reset progress
            </button>
            <button
              className="primary-button"
              disabled={!isLessonReady}
              type="button"
              onClick={() => setState(completeLesson(state))}
            >
              Complete day and schedule review
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ReviewCard({
  item,
  onReview,
}: {
  item: ReviewItem;
  onReview: (item: ReviewItem, correct: boolean, confidence: Confidence) => void;
}) {
  const [confidence, setConfidence] = useState<Confidence>(item.confidence);

  return (
    <article className="review-card">
      <div>
        <strong>{item.title}</strong>
        <p>Due {formatDate(item.dueDate)} / attempts {item.attempts}</p>
      </div>
      <div className="confidence-row" aria-label="Review confidence">
        {confidenceOptions.map((value) => (
          <button
            key={value}
            className={confidence === value ? "selected" : ""}
            type="button"
            onClick={() => setConfidence(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="review-actions">
        <button type="button" onClick={() => onReview(item, false, confidence)}>
          Needs review
        </button>
        <button type="button" onClick={() => onReview(item, true, confidence)}>
          Recalled it
        </button>
      </div>
    </article>
  );
}

function LessonSection({
  section,
  lesson,
  state,
  setState,
  onComplete,
}: {
  section: SectionId;
  lesson: ReturnType<typeof getCurrentLesson>;
  state: AppState;
  setState: (state: AppState) => void;
  onComplete: () => void;
}) {
  const completeLabel = state.completedSections.includes(section) ? "Section complete" : "Mark section complete";

  if (section === "warmup") {
    return (
      <ContentPanel title="Warm-up Recall" subtitle="Try answering before reading the lesson. Retrieval makes the next concept stickier.">
        <ol className="prompt-list">
          {lesson.warmup.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <CompleteButton label={completeLabel} onClick={onComplete} />
      </ContentPanel>
    );
  }

  if (section === "lesson") {
    return (
      <ContentPanel title="Concept Lesson" subtitle="Short, focused instruction before practice.">
        <div className="lesson-points">
          {lesson.lesson.map((point) => (
            <p key={point}>{point}</p>
          ))}
        </div>
        <CompleteButton label={completeLabel} onClick={onComplete} />
      </ContentPanel>
    );
  }

  if (section === "example") {
    return (
      <ContentPanel title="Worked Example" subtitle={lesson.workedExample.prompt}>
        <pre><code>{lesson.workedExample.code}</code></pre>
        <p className="callout">{lesson.workedExample.explanation}</p>
        <CompleteButton label={completeLabel} onClick={onComplete} />
      </ContentPanel>
    );
  }

  if (section === "guided") {
    return (
      <ExercisePanel title="Guided Practice" exercise={lesson.guidedPractice} onComplete={onComplete} label={completeLabel} />
    );
  }

  if (section === "challenge") {
    return (
      <ContentPanel title="Independent Challenge" subtitle="Compare your answer, then rate confidence and correctness.">
        <ExerciseBody exercise={lesson.challenge} />
        <div className="self-check">
          <div>
            <span>Confidence</span>
            <div className="confidence-row">
              {confidenceOptions.map((value) => (
                <button
                  key={value}
                  className={state.confidence === value ? "selected" : ""}
                  type="button"
                  onClick={() => setState({ ...state, confidence: value })}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span>Result</span>
            <div className="result-toggle">
              <button
                className={state.selfCheckCorrect === false ? "selected" : ""}
                type="button"
                onClick={() => setState({ ...state, selfCheckCorrect: false })}
              >
                Needs review
              </button>
              <button
                className={state.selfCheckCorrect === true ? "selected" : ""}
                type="button"
                onClick={() => setState({ ...state, selfCheckCorrect: true })}
              >
                Correct
              </button>
            </div>
          </div>
        </div>
        <CompleteButton label={completeLabel} onClick={onComplete} />
      </ContentPanel>
    );
  }

  return (
    <ContentPanel title="Reflection" subtitle="A short reflection helps your brain notice what changed.">
      <div className="reflection-prompts">
        {lesson.reflectionPrompts.map((prompt) => (
          <p key={prompt}>{prompt}</p>
        ))}
      </div>
      <textarea
        value={state.reflection}
        onChange={(event) => setState({ ...state, reflection: event.target.value })}
        placeholder="Write two or three sentences about today's learning."
        rows={6}
      />
      <CompleteButton label={completeLabel} onClick={onComplete} />
    </ContentPanel>
  );
}

function ExercisePanel({
  title,
  exercise,
  onComplete,
  label,
}: {
  title: string;
  exercise: Exercise;
  onComplete: () => void;
  label: string;
}) {
  return (
    <ContentPanel title={title} subtitle="Use the hints only after a real attempt.">
      <ExerciseBody exercise={exercise} />
      <CompleteButton label={label} onClick={onComplete} />
    </ContentPanel>
  );
}

function ExerciseBody({ exercise }: { exercise: Exercise }) {
  return (
    <div className="exercise-body">
      <p className="task">{exercise.prompt}</p>
      <details>
        <summary>Expected behavior</summary>
        <p>{exercise.expected}</p>
      </details>
      <details>
        <summary>Graduated hints</summary>
        <ol>
          {exercise.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ol>
      </details>
      <details>
        <summary>Common mistakes</summary>
        <ul>
          {exercise.commonMistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </details>
      <details>
        <summary>Solution reveal</summary>
        <pre><code>{exercise.solution}</code></pre>
      </details>
    </div>
  );
}

function ContentPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <article className="content-panel">
      <div className="content-heading">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {children}
    </article>
  );
}

function CompleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="complete-button" type="button" onClick={onClick}>
      {label}
    </button>
  );
}

export default App;
