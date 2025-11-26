import jsPDF from 'jspdf';
import type { AnalysisResult } from '@/types';

export function generatePDFFromAnalysisResult(result: AnalysisResult, reportId?: string) {
    const doc = new jsPDF();

    // Color Palette
    const colors = {
        black: [17, 17, 17],
        darkMaroon: [84, 0, 0],
        darkTeal: [0, 71, 73],
        tan: [176, 155, 114],
        lightGray: [237, 237, 237],
        mediumGray: [204, 204, 204],
    };

    const { analyzed_claims, tag, overall_summary } = result;

    // Helper function to add colored rectangle background
    const addBackground = (y: number, height: number, color: number[]) => {
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(0, y, 210, height, 'F');
    };

    // Page 1: Cover/Header
    addBackground(0, 297, colors.darkTeal);

    // White logo/brand area at top
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 15, 180, 40, 'F');

    doc.setFontSize(28);
    doc.setTextColor(colors.darkTeal[0], colors.darkTeal[1], colors.darkTeal[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFACT', 105, 30, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.tan[0], colors.tan[1], colors.tan[2]);
    doc.text('Misinformation Analysis Report', 105, 40, { align: 'center' });

    // Main title on dark background
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ANALYSIS REPORT', 105, 85, { align: 'center' });

    // Verdict box
    const verdictColor = tag.toLowerCase().includes('false') || tag.toLowerCase().includes('misleading')
        ? colors.darkMaroon
        : tag.toLowerCase().includes('true') || tag.toLowerCase().includes('accurate')
            ? colors.darkTeal
            : colors.tan;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(40, 100, 130, 20, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(verdictColor[0], verdictColor[1], verdictColor[2]);
    doc.text(`VERDICT: ${tag.toUpperCase()}`, 105, 112, { align: 'center' });

    // Metadata section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);

    const metadataY = 140;
    if (reportId) {
        doc.text(`Report ID: ${reportId}`, 105, metadataY, { align: 'center' });
    }
    doc.text(`Claims Analyzed: ${analyzed_claims.length}`, 105, metadataY + 7, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, 105, metadataY + 14, { align: 'center' });

    // Decorative line
    doc.setDrawColor(colors.tan[0], colors.tan[1], colors.tan[2]);
    doc.setLineWidth(0.5);
    doc.line(40, 180, 170, 180);

    // Add new page for content
    doc.addPage();

    let yPosition = 25;

    // Overall Summary Section
    doc.setFillColor(colors.darkTeal[0], colors.darkTeal[1], colors.darkTeal[2]);
    doc.rect(0, yPosition - 5, 210, 12, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('OVERALL SUMMARY', 20, yPosition + 3);

    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
    const summaryLines = doc.splitTextToSize(overall_summary, 170);
    doc.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 5 + 15;

    // Claims Analysis
    if (analyzed_claims && analyzed_claims.length > 0) {
        analyzed_claims.forEach((claim: any, index: number) => {
            // Check if we need a new page
            if (yPosition > 240) {
                doc.addPage();
                yPosition = 25;
            }

            // Claim header
            doc.setFillColor(colors.darkMaroon[0], colors.darkMaroon[1], colors.darkMaroon[2]);
            doc.rect(0, yPosition - 5, 210, 12, 'F');

            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(`CLAIM ${index + 1}`, 20, yPosition + 3);

            yPosition += 15;

            // Claim text
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
            const claimTextLines = doc.splitTextToSize(claim.claim_text, 170);
            doc.text(claimTextLines, 20, yPosition);
            yPosition += claimTextLines.length * 5 + 10;

            // Conclusion
            if (claim.conclusion) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(verdictColor[0], verdictColor[1], verdictColor[2]);
                doc.text('Conclusion:', 20, yPosition);
                yPosition += 5;

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                const conclusionLines = doc.splitTextToSize(claim.conclusion, 170);
                doc.text(conclusionLines, 20, yPosition);
                yPosition += conclusionLines.length * 5 + 10;
            }

            // Supporting Evidence
            if (claim.supporting_evidence && claim.supporting_evidence.length > 0) {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(colors.darkTeal[0], colors.darkTeal[1], colors.darkTeal[2]);
                doc.text('✓ Supporting Evidence', 20, yPosition);
                yPosition += 7;

                claim.supporting_evidence.forEach((evidence: any) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 25;
                    }

                    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    const boxHeight = 25;
                    doc.roundedRect(25, yPosition - 3, 160, boxHeight, 2, 2, 'F');

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    const evidenceLines = doc.splitTextToSize(evidence.summary, 150);
                    doc.text(evidenceLines, 30, yPosition + 2);

                    const textHeight = evidenceLines.length * 3.5;

                    if (evidence.source) {
                        doc.setTextColor(colors.darkTeal[0], colors.darkTeal[1], colors.darkTeal[2]);
                        doc.setFont('helvetica', 'italic');
                        doc.setFontSize(8);
                        const sourceText = evidence.source.length > 60 ? evidence.source.substring(0, 60) + '...' : evidence.source;
                        doc.text(`🔗 ${sourceText}`, 30, yPosition + textHeight + 5);
                    }

                    yPosition += boxHeight + 5;
                });
                yPosition += 5;
            }

            // Opposing Evidence
            if (claim.opposing_evidence && claim.opposing_evidence.length > 0) {
                if (yPosition > 240) {
                    doc.addPage();
                    yPosition = 25;
                }

                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(colors.darkMaroon[0], colors.darkMaroon[1], colors.darkMaroon[2]);
                doc.text('✗ Opposing Evidence', 20, yPosition);
                yPosition += 7;

                claim.opposing_evidence.forEach((evidence: any) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 25;
                    }

                    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    const boxHeight = 25;
                    doc.roundedRect(25, yPosition - 3, 160, boxHeight, 2, 2, 'F');

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    const evidenceLines = doc.splitTextToSize(evidence.summary, 150);
                    doc.text(evidenceLines, 30, yPosition + 2);

                    const textHeight = evidenceLines.length * 3.5;

                    if (evidence.source) {
                        doc.setTextColor(colors.darkMaroon[0], colors.darkMaroon[1], colors.darkMaroon[2]);
                        doc.setFont('helvetica', 'italic');
                        doc.setFontSize(8);
                        const sourceText = evidence.source.length > 60 ? evidence.source.substring(0, 60) + '...' : evidence.source;
                        doc.text(`🔗 ${sourceText}`, 30, yPosition + textHeight + 5);
                    }

                    yPosition += boxHeight + 5;
                });
                yPosition += 5;
            }

            // Fact-Check Results
            if (claim.fact_checking_results && claim.fact_checking_results.length > 0) {
                if (yPosition > 240) {
                    doc.addPage();
                    yPosition = 25;
                }

                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(colors.tan[0], colors.tan[1], colors.tan[2]);
                doc.text('⚠ Fact-Check Results', 20, yPosition);
                yPosition += 7;

                claim.fact_checking_results.forEach((result: any) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 25;
                    }

                    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    const boxHeight = 25;
                    doc.roundedRect(25, yPosition - 3, 160, boxHeight, 2, 2, 'F');

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]);
                    const resultText = result.summary || 'No summary available';
                    const resultLines = doc.splitTextToSize(resultText, 150);
                    doc.text(resultLines, 30, yPosition + 2);

                    const textHeight = resultLines.length * 3.5;

                    if (result.url) {
                        doc.setTextColor(colors.tan[0], colors.tan[1], colors.tan[2]);
                        doc.setFont('helvetica', 'italic');
                        doc.setFontSize(8);
                        const urlText = result.url.length > 60 ? result.url.substring(0, 60) + '...' : result.url;
                        doc.text(`🔗 ${urlText}`, 30, yPosition + textHeight + 5);
                    }

                    yPosition += boxHeight + 5;
                });
                yPosition += 5;
            }

            yPosition += 10; // Space between claims
        });
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setFillColor(colors.darkTeal[0], colors.darkTeal[1], colors.darkTeal[2]);
        doc.rect(0, 287, 210, 10, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(255, 255, 255);
        doc.text('Powered by Verifact AI', 20, 292);
        doc.text(`Page ${i} of ${pageCount}`, 190, 292, { align: 'right' });
    }

    // Save the PDF
    const timestamp = new Date().getTime();
    const filename = reportId
        ? `verifact-report-${reportId.substring(0, 8)}.pdf`
        : `verifact-report-${timestamp}.pdf`;
    doc.save(filename);
}
