import axios from "axios";

export const runCode = async (req, res) => {
  const { code, language = "python", stdin = "" } = req.body;
  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }

  if (!process.env.JUDGE0_API_KEY || !process.env.JUDGE0_API_URL) {
    return res.json({
      status: "mocked",
      output: "Live code execution is not configured yet. Add Judge0 credentials to enable this feature."
    });
  }

  const languageMap = { cpp: 54, python: 71, java: 62 };
  const response = await axios.post(
    process.env.JUDGE0_API_URL,
    {
      source_code: code,
      language_id: languageMap[language] || 71,
      stdin
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY
      }
    }
  );

  res.json({
    status: response.data.status?.description || "Completed",
    output:
      response.data.stdout ||
      response.data.stderr ||
      response.data.compile_output ||
      "No output"
  });
};
