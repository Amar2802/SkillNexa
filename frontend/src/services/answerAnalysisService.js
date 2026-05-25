import api from "../api/client";

export const fetchAnswerAnalysis = (payload) => api.post("/analysis/answer", payload, { timeout: 30000 }).then((response) => response.data);
