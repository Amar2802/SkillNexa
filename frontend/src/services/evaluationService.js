import api from "../api/client";

export const submitAnswerEvaluation = async (payload, { signal } = {}) => {
  const { data } = await api.post("/evaluations", payload, { timeout: 45000, signal });
  return data;
};

export const fetchEvaluations = async (params = {}) => {
  const { data } = await api.get("/evaluations", { params, timeout: 25000 });
  return data;
};

export const fetchEvaluationAnalytics = async () => {
  const { data } = await api.get("/evaluations/analytics", { timeout: 25000 });
  return data;
};

export const fetchEvaluationById = async (id) => {
  const { data } = await api.get(`/evaluations/${id}`, { timeout: 25000 });
  return data;
};
