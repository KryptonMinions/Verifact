# VeriFact: Misinformation Analysis App

**Last Updated:** September 21, 2025  

[![Cloud Run](https://img.shields.io/badge/Deployed%20on-Google%20Cloud%20Run-blue?logo=googlecloud)](https://cloud.google.com/run)  
---

## 1. Overview  

VeriFact is an advanced **AI-powered misinformation detection pipeline** that deconstructs, analyzes, and verifies claims from text, URLs, and images. It empowers journalists, researchers, and the public by delivering **structured, evidence-based reports** on the truthfulness of digital content.  

At its core, VeriFact leverages a **multi-agent workflow**, where specialized AI agents collaborate to extract claims, research evidence, check against trusted fact-check databases, and generate a comprehensive verdict.

---

## 2. Key Features  

- **Multi-Modal Input:** Analyze **raw text**, **URLs**, or **images** (e.g., social media screenshots).  
- **Automated Claim Deconstruction:** Identifies verifiable claims from messy, unstructured content.  
- **Concurrent Research:** Performs **parallel web search** and **fact-check database lookups**.  
- **Structured Reporting:** Provides verdict tags (`True`, `False`, `Misleading`, `Unverified`) with transparent evidence trails.  
- **Serverless & Scalable:** Runs on **Google Cloud Run** for auto-scaling, cost-efficiency, and reliability.  

---

## 3. System Architecture: The Agentic Pipeline  

The pipeline is built around **specialized AI agents**, each handling a specific task in the misinformation analysis workflow.  

### Architecture Diagram  

![Architecture Diagram](https://github.com/Tanav-Kolar/RAG_Baiters_Misinformation_GenAI_Exchange_Hack/blob/main/Architecture_Diagram.png?raw=true)
---

### Agent Breakdown  

#### 1. `claims_extractor_agent`  
- **Purpose:** Extracts verifiable claims from text, URLs, or images.  
- **Tools:**  
  - `ScraperAPI` for webpage parsing.  
  - **OCR engine** for extracting text from images (Base64).  
- **Output:** Structured list of claims.  

#### 2. `web_scraper_agent`  
- **Purpose:** Finds real-time **supporting** and **opposing** evidence for claims.  
- **Tool:** Google Search API.  
- **Output:** Evidence snippets grouped by polarity.  

#### 3. `fact_checking_agent`  
- **Purpose:** Validates claims against trusted fact-check repositories.  
- **Tool:** Google Fact Check API.  
- **Output:** Matching fact-checks with verdicts and sources.  

#### 4. `report_generator_agent`  
- **Purpose:** Synthesizes results from research agents into a **cohesive JSON report**.  
- **Output:** Final structured verdict + evidence.  

---

## 4. Output: Analysis Report  

The pipeline produces a structured JSON object for easy integration with a frontend or dashboard.  

**Example Output:**  

```json
{
  "overall_summary": "The claim that all petrol bunks in Vellore will stop accepting cash from Sept 22nd is False. No official sources corroborate this, and it appears to be a recycled hoax.",
  "claims": [
    {
      "claim_text": "All petrol bunks in Vellore will stop accepting cash payments.",
      "verdict_tag": "False",
      "web_evidence": {
        "supporting": [],
        "opposing": [
          {
            "source": "thehindu.com",
            "snippet": "The All India Petroleum Dealers Association clarified that cash remains valid at all member bunks nationwide."
          }
        ]
      },
      "fact_check_info": {
        "source": "Reuters Fact Check",
        "summary": "A similar claim about forced UPI adoption in 2024 was rated 'False'."
      }
    }
  ]
}
````

---

## 5. Deployment

VeriFact is deployed on **Google Cloud Run** for maximum scalability and zero-infrastructure overhead.

### Why Cloud Run?

✅ Auto-scaling to zero (no idle cost).
✅ Fully managed infrastructure.
✅ Pay-per-use billing.

### Deployment Workflow

1. **Containerize the app:**

   ```bash
   docker build -t REGION-docker.pkg.dev/PROJECT-ID/verifact/verifact-service:latest .
   ```

2. **Push to Artifact Registry:**

   ```bash
   gcloud auth configure-docker REGION-docker.pkg.dev
   docker push REGION-docker.pkg.dev/PROJECT-ID/verifact/verifact-service:latest
   ```

3. **Deploy to Cloud Run:**

   ```bash
   gcloud run deploy verifact-service \
     --image REGION-docker.pkg.dev/PROJECT-ID/verifact/verifact-service:latest \
     --platform managed \
     --region YOUR_REGION \
     --allow-unauthenticated \
     --set-env-vars="GOOGLE_API_KEY=your_key,SCRAPER_API_KEY=your_key"
   ```

---

## 7. Roadmap

* [ ] Add **dashboard with analytics** on misinformation trends.
* [ ] Integrate **source credibility scoring** for evidence.
* [ ] Support **multilingual fact-checking**.
* [ ] Provide **bias/fallacy detection module** for claims.

---

## 8. Contributors

👤 **Shreyansh Kumar Nayak** 
👤 **Tanav Kolar** 


