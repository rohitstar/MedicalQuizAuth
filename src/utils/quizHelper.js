import {EXAM_DETAILS, QUIZ_DURATION_SECONDS} from '../constants/appConstants';

export function getRemainingSeconds(startTime) {
  if (!startTime) {
    return QUIZ_DURATION_SECONDS;
  }
  const elapsedSeconds = Math.floor((Date.now() - Number(startTime)) / 1000);
  return Math.max(QUIZ_DURATION_SECONDS - elapsedSeconds, 0);
}

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(Number(totalSeconds) || 0, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function createQuizResult({questions, answers, profile, startTime}) {
  const correctAnswers = questions.reduce((count, question) => {
    return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);
  const attempted = Object.keys(answers).filter(
    key => answers[key] !== undefined && answers[key] !== null,
  ).length;
  const unanswered = questions.length - attempted;
  const incorrectAnswers = attempted - correctAnswers;
  const totalMarks = questions.length;
  const marksObtained = correctAnswers;
  const percentage = totalMarks
    ? Number(((marksObtained / totalMarks) * 100).toFixed(2))
    : 0;
  const timeTakenSeconds = Math.min(
    Math.max(Math.floor((Date.now() - Number(startTime)) / 1000), 0),
    QUIZ_DURATION_SECONDS,
  );

  return {
    candidateName: profile.name,
    candidateEmail: profile.email,
    courseName: EXAM_DETAILS.courseName,
    examinationName: EXAM_DETAILS.examinationName,
    totalQuestions: questions.length,
    questionsAttempted: attempted,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions: unanswered,
    totalMarks,
    marksObtained,
    percentage,
    status: percentage >= EXAM_DETAILS.passingPercentage ? 'PASS' : 'FAIL',
    timeTakenSeconds,
    submittedAt: new Date().toISOString(),
    selectedAnswers: answers,
    review: questions.map(question => ({
      id: question.id,
      question: question.question,
      options: question.options,
      selectedAnswer: answers[question.id] ?? null,
      correctAnswer: question.correctAnswer,
      isCorrect: answers[question.id] === question.correctAnswer,
    })),
  };
}
