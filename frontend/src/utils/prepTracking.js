export const DAILY_PREP_STORAGE_KEY = "skillnexa-daily-attempts";

export const DAILY_INTERVIEW_TRACKS = [
  {
    bucket: "aptitude",
    label: "Aptitude Round",
    category: "Aptitude",
    guidance: "Solve one aptitude question and focus on speed plus accuracy."
  },
  {
    bucket: "technical",
    label: "Technical Round",
    category: "DSA",
    guidance: "Attempt one coding or DSA question with a clean approach explanation."
  },
  {
    bucket: "core",
    label: "Core CS Round",
    category: "Core Subjects",
    guidance: "Revise one core subject question and answer it like an interview response."
  },
  {
    bucket: "hr",
    label: "HR Round",
    category: "HR",
    guidance: "Practice one behavioral or HR answer with clear structure and confidence."
  }
];

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const mapCategoryToBucket = (category = "", roundType = "") => {
  const safeCategory = String(category).toLowerCase();
  const safeRound = String(roundType).toLowerCase();

  if (safeCategory.includes("aptitude")) return "aptitude";
  if (safeCategory.includes("dsa") || safeRound.includes("technical")) return "technical";
  if (safeCategory.includes("core")) return "core";
  if (safeCategory.includes("hr") || safeRound.includes("hr") || safeRound.includes("managerial") || safeRound.includes("project")) return "hr";
  return "technical";
};

export const readDailyAttemptRecords = () => {
  try {
    return JSON.parse(localStorage.getItem(DAILY_PREP_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const writeDailyAttemptRecords = (records) => {
  localStorage.setItem(DAILY_PREP_STORAGE_KEY, JSON.stringify(records));
};

export const recordDailyAttempt = ({ bucket, questionId, title, topic, category, source }) => {
  if (!bucket) return;

  const records = readDailyAttemptRecords();
  const todayKey = getTodayKey();
  const todayRecord = records[todayKey] || {};

  records[todayKey] = {
    ...todayRecord,
    [bucket]: {
      bucket,
      questionId: questionId || `${bucket}-${source || "activity"}`,
      title: title || "Interview prep question",
      topic: topic || category || bucket,
      category: category || bucket,
      source: source || "activity",
      completed: true,
      attemptedAt: new Date().toISOString()
    }
  };

  writeDailyAttemptRecords(records);
};

export const getDailyAttemptSnapshot = () => {
  const records = readDailyAttemptRecords();
  const todayKey = getTodayKey();
  return records[todayKey] || {};
};

export const getDailyPrepKey = getTodayKey;
