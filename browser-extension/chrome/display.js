// Listen for different types of messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'showLoading') {
        displayLoadingState();
    } else if (request.type === 'displayResult') {
        displayResultModal(request.data);
    }
});

/**
 * Creates and injects a loading state modal into the page.
 */
function displayLoadingState() {
    removeExistingModals();
    const modal = document.createElement('div');
    modal.id = 'verifact-loading-modal';
    modal.className = 'verifact-modal';
    modal.innerHTML = `
        <div class="loader"></div>
        <span class="loading-text">Analyzing content...</span>
    `;
    document.body.appendChild(modal);
}

/**
 * Creates and displays the detailed analysis report modal.
 * @param {object} data - The full analysis report object from the API.
 */
function displayResultModal(data) {
    // Remove loading or any other existing modal before showing the result
    removeExistingModals();

    const modal = document.createElement('div');
    modal.id = 'verifact-result-modal';
    modal.className = 'verifact-modal';

    /**
     * Helper to create the HTML for a list of evidence.
     * @param {Array} evidenceList - The array of evidence objects.
     * @param {string} type - 'supporting' or 'opposing'.
     */
    const createEvidenceHtml = (evidenceList, type) => {
        if (!evidenceList || evidenceList.length === 0) {
            return `<p class="no-evidence">No ${type} evidence found.</p>`;
        }
        
        return evidenceList.map((evidence, index) => `
            <div class="evidence-item">
                <p class="evidence-summary">${evidence.summary}</p>
                <a href="${evidence.source}" target="_blank" class="evidence-source">
                    Source [${index + 1}]
                </a>
            </div>
        `).join('');
    };

    /**
     * Helper to create the HTML for all analyzed claims.
     */
    const createClaimsHtml = (claims) => {
        if (!claims || claims.length === 0) {
            return '<p class="no-claims">No specific claims were analyzed.</p>';
        }
        
        return claims.map(claim => `
            <div class="claim-card">
                <p class="claim-text">"${claim.claim_text}"</p>
                
                <div class="evidence-section">
                    <h4 class="evidence-title supporting">Supporting Evidence</h4>
                    <div class="evidence-list">
                        ${createEvidenceHtml(claim.supporting_evidence, 'supporting')}
                    </div>
                </div>
                
                <div class="evidence-section">
                    <h4 class="evidence-title opposing">Opposing Evidence</h4>
                    <div class="evidence-list">
                        ${createEvidenceHtml(claim.opposing_evidence, 'opposing')}
                    </div>
                </div>
                
                <div class="claim-conclusion-section">
                    <h4 class="evidence-title conclusion">Conclusion</h4>
                    <p class="claim-conclusion-text">${claim.conclusion}</p>
                </div>
            </div>
        `).join('');
    };

    const overallTag = data.tag || "Unverified";
    const tagColorClass = overallTag.toLowerCase().replace(' ', '-'); // e.g., "needs context" -> "needs-context"

    modal.innerHTML = `
        <div class="header">
            <span class="title">✨ Analysis Report</span>
            <button class="close-btn" id="verifact-close-btn">&times;</button>
        </div>
        <div class="content">
            <div class="summary-section">
                <div class="summary-header">
                    <h3 class="summary-title">Overall Assessment</h3>
                    <span class="overall-tag tag-${tagColorClass}">${overallTag}</span>
                </div>
                <p class="summary-text">${data.overall_summary || 'No summary provided.'}</p>
            </div>
            <div class="claims-section">
                <h3 class="claims-title">Analyzed Claims</h3>
                <div class="claims-container">${createClaimsHtml(data.analyzed_claims)}</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('verifact-close-btn').addEventListener('click', () => modal.remove());
}

/**
 * Helper function to clean up any modals from the screen.
 */
function removeExistingModals() {
    document.getElementById('verifact-loading-modal')?.remove();
    document.getElementById('verifact-result-modal')?.remove();
}

