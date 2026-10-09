export const STORAGE_KEYS = Object.freeze({
  USER_SESSION: 'USER_SESSION',
  USER_PROFILE: 'USER_PROFILE',
  QUIZ_START_TIME: 'QUIZ_START_TIME',
  QUIZ_ANSWERS: 'QUIZ_ANSWERS',
  QUIZ_SUBMITTED: 'QUIZ_SUBMITTED',
  QUIZ_RESULT: 'QUIZ_RESULT',
});

export const COLORS = Object.freeze({
  primary: '#123A63',
  primaryDark: '#0A2744',
  secondary: '#0F8B8D',
  secondaryLight: '#DFF4F2',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#182230',
  muted: '#667085',
  border: '#E4E7EC',
  success: '#16885B',
  successLight: '#E8F7F0',
  warning: '#D47A08',
  warningLight: '#FFF4E5',
  danger: '#C4322B',
  dangerLight: '#FDECEA',
  infoLight: '#EAF2FB',
  disabled: '#AAB2BD',
  shadow: '#101828',
});

export const TYPOGRAPHY = Object.freeze({
  title: 28,
  heading: 21,
  subheading: 17,
  body: 15,
  caption: 13,
});

export const DEMO_CREDENTIALS = Object.freeze({
  email: 'rahul.sharma@gmail.com',
  password: 'Quiz@123',
});

export const CANDIDATE_PROFILE = Object.freeze({
  name: 'Dr. Rahul Sharma',
  email: DEMO_CREDENTIALS.email,
  mobile: '+91 98765 43210',
});

export const EXAM_DETAILS = Object.freeze({
  societyName: 'Indian Society of Clinical Education',
  courseName: 'Certificate Course in Diabetes',
  examinationName: 'Final Assessment Quiz',
  durationMinutes: 60,
  totalMarks: 10,
  passingPercentage: 50,
  status: 'Available',
  date: 'Demo Examination',
});

export const QUIZ_DURATION_SECONDS = EXAM_DETAILS.durationMinutes * 60;
export const ALLOW_RETAKE = false;
