export const DAILY_PREP_STORAGE_KEY = "skillnexa-daily-attempts";

export const DAILY_INTERVIEW_TRACKS_BY_FIELD = {
  Software: [
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
  ],
  UPSC: [
    {
      bucket: "general-studies",
      label: "General Studies",
      category: "General Studies",
      guidance: "Attempt one concept-heavy GS question with clear structure and examples."
    },
    {
      bucket: "current-affairs",
      label: "Current Affairs",
      category: "Current Affairs",
      guidance: "Revise one current affairs issue and connect it to the syllabus."
    },
    {
      bucket: "ethics-essay",
      label: "Essay & Ethics",
      category: "Essay & Ethics",
      guidance: "Practice one ethics or essay-style response with balanced reasoning."
    },
    {
      bucket: "personality-test",
      label: "Personality Test",
      category: "Interview Personality",
      guidance: "Answer one interview-style UPSC personality question with maturity and public-service focus."
    }
  ],
  NDA: [
    {
      bucket: "mathematics",
      label: "Mathematics",
      category: "Mathematics",
      guidance: "Solve one mathematics question with a neat step-by-step approach."
    },
    {
      bucket: "general-ability",
      label: "General Ability",
      category: "General Ability",
      guidance: "Attempt one general ability question and focus on speed plus accuracy."
    },
    {
      bucket: "current-affairs",
      label: "Current Affairs",
      category: "Current Affairs",
      guidance: "Revise one current affairs topic with defence awareness context."
    },
    {
      bucket: "ssb-interview",
      label: "SSB Interview",
      category: "SSB Interview",
      guidance: "Practice one SSB-style answer that shows officer-like qualities."
    }
  ],
  Banking: [
    {
      bucket: "quant",
      label: "Quantitative Aptitude",
      category: "Quantitative Aptitude",
      guidance: "Solve one quant question and optimize your method for exam speed."
    },
    {
      bucket: "reasoning",
      label: "Reasoning",
      category: "Reasoning",
      guidance: "Practice one reasoning set with diagram-first clarity."
    },
    {
      bucket: "english",
      label: "English",
      category: "English",
      guidance: "Attempt one English question and focus on precision in comprehension or grammar."
    },
    {
      bucket: "banking-awareness",
      label: "Banking Awareness",
      category: "Banking Awareness",
      guidance: "Revise one banking awareness topic and explain it crisply."
    }
  ],
  SSC: [
    {
      bucket: "quant",
      label: "Quantitative Aptitude",
      category: "Quantitative Aptitude",
      guidance: "Solve one quant problem with a fast and dependable approach."
    },
    {
      bucket: "general-intelligence",
      label: "General Intelligence",
      category: "General Intelligence",
      guidance: "Practice one reasoning pattern and verify every clue carefully."
    },
    {
      bucket: "english",
      label: "English",
      category: "English",
      guidance: "Attempt one English question with attention to grammar and vocabulary."
    },
    {
      bucket: "general-awareness",
      label: "General Awareness",
      category: "General Awareness",
      guidance: "Revise one static or current GK topic and summarize the key fact."
    }
  ],
  Railways: [
    {
      bucket: "technical-aptitude",
      label: "Technical Aptitude",
      category: "Technical Aptitude",
      guidance: "Practice one technical railway question and focus on safe problem solving."
    },
    {
      bucket: "general-awareness",
      label: "General Awareness",
      category: "General Awareness",
      guidance: "Revise one awareness topic relevant to public systems and transport."
    },
    {
      bucket: "mathematics",
      label: "Mathematics",
      category: "Mathematics",
      guidance: "Solve one mathematics question accurately and show the full method."
    },
    {
      bucket: "railway-operations",
      label: "Railway Operations",
      category: "Railway Operations",
      guidance: "Practice one operations or safety response with practical clarity."
    }
  ],
  Teaching: [
    {
      bucket: "teaching-aptitude",
      label: "Teaching Aptitude",
      category: "Teaching Aptitude",
      guidance: "Answer one teaching aptitude question with learner-focused reasoning."
    },
    {
      bucket: "pedagogy",
      label: "Pedagogy",
      category: "Pedagogy",
      guidance: "Practice one pedagogy question and explain the teaching principle clearly."
    },
    {
      bucket: "subject-mastery",
      label: "Subject Mastery",
      category: "Subject Mastery",
      guidance: "Attempt one subject knowledge question as if you are teaching it."
    },
    {
      bucket: "classroom-communication",
      label: "Classroom Communication",
      category: "Classroom Communication",
      guidance: "Practice one communication scenario and answer it with empathy and clarity."
    }
  ],
  "State PSC": [
    {
      bucket: "general-studies",
      label: "General Studies",
      category: "General Studies",
      guidance: "Revise one foundational state-PSC concept with a concise structured answer."
    },
    {
      bucket: "current-affairs",
      label: "Current Affairs",
      category: "Current Affairs",
      guidance: "Practice one issue-based current affairs question connected to governance."
    },
    {
      bucket: "state-administration",
      label: "State Administration",
      category: "State Administration",
      guidance: "Answer one administration question with policy and implementation balance."
    },
    {
      bucket: "interview-personality",
      label: "Interview Personality",
      category: "Interview Personality",
      guidance: "Practice one state-PSC interview answer with maturity and public-service orientation."
    }
  ]
};

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDailyInterviewTracks = (field = "Software") => {
  return DAILY_INTERVIEW_TRACKS_BY_FIELD[field] || DAILY_INTERVIEW_TRACKS_BY_FIELD.Software;
};

export const mapCategoryToBucket = (category = "", roundType = "", field = "Software") => {
  const safeCategory = String(category).toLowerCase();
  const safeRound = String(roundType).toLowerCase();
  const tracks = getDailyInterviewTracks(field);
  const directTrack = tracks.find((track) => track.category.toLowerCase() === safeCategory);

  if (directTrack) return directTrack.bucket;
  if (safeCategory.includes("aptitude")) return "aptitude";
  if (safeCategory.includes("dsa") || safeRound.includes("technical")) return "technical";
  if (safeCategory.includes("core")) return "core";
  if (safeCategory.includes("hr") || safeRound.includes("hr") || safeRound.includes("managerial") || safeRound.includes("project")) return "hr";
  return tracks[0]?.bucket || "activity";
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

export const recordDailyAttempt = ({ bucket, questionId, title, topic, category, source, field = "Software" }) => {
  if (!bucket) return;

  const records = readDailyAttemptRecords();
  const todayKey = getTodayKey();
  const todayRecord = records[todayKey] || {};

  records[todayKey] = {
    ...todayRecord,
    [bucket]: {
      bucket,
      field,
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
