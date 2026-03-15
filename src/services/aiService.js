const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ServerConfig } = require("../config");

const GenAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY || ServerConfig.GOOGLE_API_KEY
);

/**
 * Generate lifestyle & health advice based on ECG reports.
 * Handles both single and daily (multiple) reports.
 */
async function getLifestyleAdvice(report) {
  try {
    const model = GenAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    let prompt = "";

    // Detect daily vs single
    if (Array.isArray(report)) {
      const total = report.length;
      const abnormal = report.filter((r) => r.status === "abnormal").length;
      const normal = total - abnormal;

      const classes = report
        .map((r) => r.classLabel || "Not specified")
        .filter((c) => c && c !== "undefined");

      const commonClass =
        classes.length > 0
          ? classes.reduce((a, b, _, arr) =>
              arr.filter((v) => v === a).length >=
              arr.filter((v) => v === b).length
                ? a
                : b
            )
          : "Not available";

      const isAfib =
        commonClass.toLowerCase().includes("supraventricular") ||
        commonClass.toLowerCase().includes("afib");

      prompt = `
You are an AI cardiology wellness assistant.
Summarize the patient's full-day ECG analysis clearly and concisely.

Data Summary:
- Total reports: ${total}
- Normal readings: ${normal}
- Abnormal readings: ${abnormal}
- Most frequent ECG class: ${commonClass}

Write a clear, non-diagnostic summary with the following structure:

1. **Summary of Findings:** 
   - Briefly describe the overall ECG results.
   - If the common class is "Supraventricular Ectopic Beat (S)", interpret it as possible Atrial Fibrillation (AFIB) and emphasize the need to consult a cardiologist urgently.
   - If the class is "Ventricular Ectopic Beat (V)", mention it indicates irregular ventricular activity requiring evaluation.
   - If "Fusion Beat (F)" or "Unknown Beat (Q)", note it as unclassified rhythm needing further monitoring.
   - If "Normal (N)", state that the ECG appears stable.

2. **Lifestyle Recommendations:**
   - Provide 3–5 short actionable lines about diet, exercise, stress management, and sleep.
   - Keep sentences brief and readable.

3. **Important Note:** 
   - If AFIB or other irregularities are found, remind the patient to follow up with a qualified healthcare provider.

The tone should be warm, clear, and professional.
Output plain text only — use line breaks and numbered or bulleted points for clarity.
Keep the total length under 220 words.
`;
    } else {
      const { status, patientInfo, classLabel } = report;

      const isAfib =
        classLabel &&
        (classLabel.toLowerCase().includes("supraventricular") ||
          classLabel.toLowerCase().includes("afib"));

      prompt = `
You are an AI assistant providing ECG interpretation.

Patient details:
- Age: ${patientInfo?.age || "unknown"}
- Gender: ${patientInfo?.gender || "unspecified"}
- ECG Status: ${status}
- Detected Class: ${classLabel || "Not specified"}

Write a short structured response:

1. **Interpretation:** 
   - Explain what this ECG result likely means.
   - If "Supraventricular Ectopic Beat (S)", treat it as possible Atrial Fibrillation (AFIB) and recommend seeing a cardiologist.
   - If "Ventricular Ectopic Beat (V)", note that it may indicate abnormal lower-chamber rhythm and needs further check.
   - If "Fusion Beat (F)" or "Unknown Beat (Q)", say it’s an unclear rhythm needing follow-up.
   - If "Normal (N)", reassure the patient.

2. **Lifestyle Tips:** 
   - Give 2–3 simple practical suggestions about healthy diet, regular activity, stress control, and quality sleep.

Keep it human-readable and under 150 words.
Use plain text, numbered or bulleted structure, no markdown symbols.
`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text;
  } catch (error) {
    console.error("Error generating lifestyle advice:", error);
    return "Unable to generate advice at the moment. Please try again later.";
  }
}

module.exports = { getLifestyleAdvice };
