# Verifact

Verifact is an advanced AI-powered misinformation analysis tool designed to help users verify the authenticity of content across the web. It provides comprehensive analysis of text, URLs, and images, offering detailed reports on source credibility, fact-checking results, and potential biases.

## Features

-   **Multi-Modal Analysis**: Analyze text content, URLs, and images for misinformation.
-   **Source Credibility Assessment**: Evaluate the reliability of information sources using a robust scoring system.
-   **Automated Fact-Checking**: Cross-reference claims against a database of verified fact-checks.
-   **Browser Extension**: Real-time analysis directly within your browser.
-   **Dashboard & Reports**: detailed history of analyses and downloadable PDF reports.
-   **Reverse Image Search**: Track the origin and spread of images online.

## Source Credibility Heuristics

Verifact employs a multi-faceted approach to evaluate source credibility, assigning a score from 0 to 100. This score is derived from a combination of automated analysis and historical data.

### Scoring System

The credibility score maps to four distinct categories:

-   **High Credibility (80-100)**: Sources with a strong track record of factual reporting and high journalistic standards.
-   **Medium-High Credibility (60-79)**: Generally reliable sources that may have minor issues with bias or transparency.
-   **Medium-Low Credibility (40-59)**: Sources with mixed reliability, often containing significant bias or unverified claims.
-   **Low Credibility (0-39)**: Sources known for spreading misinformation, propaganda, or lacking factual integrity.

### Evaluation Factors

Our heuristics consider the following key factors:

1.  **Domain Reputation**:
    *   Historical accuracy of the domain.
    *   Presence on known lists of reliable or unreliable sources.
    *   Longevity and stability of the web presence.

2.  **Factual Reporting**:
    *   Adherence to journalistic standards (e.g., sourcing, corrections policy).
    *   Frequency of failed fact-checks by independent organizations.
    *   Distinction between news and opinion content.

3.  **Bias & Objectivity**:
    *   Analysis of language for emotional manipulation or extreme partisan bias.
    *   Detection of logical fallacies or misleading framing.

4.  **Trust Indicators (Flags)**:
    *   **Transparency**: Clear ownership and funding information.
    *   **Satire**: Identification of satirical content that might be mistaken for news.
    *   **User Generated**: Distinction between editorial content and user-generated platforms.

## Tech Stack

-   **Frontend**: Next.js 14 (App Router), React, TypeScript
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Browser Extension**: Vanilla JavaScript, Chrome Extension Manifest V3
-   **PDF Generation**: jsPDF

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/KryptonMinions/Verifact.git
    cd Verifact
    ```

2.  Install dependencies for the web app:
    ```bash
    cd web-app
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Browser Extension Setup

1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable "Developer mode" in the top right corner.
3.  Click "Load unpacked" and select the `browser-extension` directory from the project.

## License

[MIT](LICENSE)
