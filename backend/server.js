import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

import { student } from "./data/student.js";
import { company } from "./data/company.js";
import { college } from "./data/college.js";
import { logs } from "./data/logs.js";
import { projects } from "./data/projects.js";
import { evaluation } from "./data/evaluation.js";
import { performanceAssessment } from "./data/performance.js";
import { buildReportHtml } from "./report/reportTemplate.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Internship report backend running" });
});

// API endpoints
app.get("/api/student", (req, res) => res.json(student));
app.get("/api/company", (req, res) => res.json(company));
app.get("/api/college", (req, res) => res.json(college));
app.get("/api/logs", (req, res) => res.json(logs));
app.get("/api/projects", (req, res) => res.json(projects));
app.get("/api/evaluation", (req, res) => res.json(evaluation));
app.get("/api/performance", (req, res) => res.json(performanceAssessment));

// HTML report endpoint
app.get("/api/report/html", (req, res) => {
  const html = buildReportHtml();
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

// PDF generation endpoint
app.get("/api/report/pdf", async (req, res) => {
  let browser = null;
  try {
    const html = buildReportHtml();

    // 1. Launch Puppeteer with safe arguments
    browser = await puppeteer.launch({
      headless: "new", // Explicitly use new headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Helps in Docker/low memory environments
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();

    // 2. Set content safely
    // 'domcontentloaded' is safer than 'networkidle0'. 
    // It triggers as soon as the HTML tags are read, not waiting for every image to load.
    await page.setContent(html, {
      waitUntil: "domcontentloaded", 
      timeout: 60000 // Increase timeout to 60 seconds
    });

    // Optional: Force screen media type to ensure CSS renders correctly
    await page.emulateMediaType("screen");

    // 3. Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm"
      }
    });

    await browser.close();
    browser = null; // Mark as closed

    // 4. Send Response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Internship_Report.pdf"'
    );
    res.send(pdfBuffer);

  } catch (err) {
    console.error("Error generating PDF:", err);

    // Close browser if it's still open and an error occurred
    if (browser) {
      await browser.close();
    }

    // Send a JSON error (The frontend I gave you earlier will now catch this)
    res.status(500).json({ 
      error: "Failed to generate PDF", 
      details: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});