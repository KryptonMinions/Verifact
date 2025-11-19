import { BASE_URL, APP_NAME, USER_ID } from './config.js';

/**
 * This function runs when the extension is first installed or updated.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeSelection",
    title: "Analyze selection for misinformation",
    contexts: ["page", "selection", "image", "video"]
  });
});

/**
 * This listener waits for a user to click on our context menu item.
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeSelection") {
    chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ["display.css"] });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["display.js"] });
    chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["selection.js"] });
  }
});

/**
 * This listener waits for a message from the selection.js script.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'capture') {
    startAnalysisProcess(request.area, sender.tab);
  }
  return true; // Indicate async response
});


/**
 * **MODIFIED FUNCTION**
 * Handles the single-step analysis process.
 * Sends data as FormData with keys 'text' and 'file' to match your Python script.
 * @param {object} area - The {x, y, width, height} of the selected area.
 * @param {object} tab - The tab object where the capture was initiated.
 */
async function startAnalysisProcess(area, tab) {
  try {
    // Immediately show the loading state on the page
    chrome.tabs.sendMessage(tab.id, { type: 'showLoading' });

    // --- STEP 0: Capture and crop the screenshot (returns a Blob) ---
    const imageBlob = await cropImage(
      await chrome.tabs.captureVisibleTab(null, { format: 'png' }),
      area
    );
    
    // --- STEP 1: Prepare Form Data (Matching Python Script) ---
    const formData = new FormData();
    
    // 1. Append the text field
    formData.append('text', tab.url);
    
    // 2. Append the file field with the key 'file'
    formData.append('file', imageBlob, 'screenshot.png'); 

    // --- STEP 2: Send POST Request ---
    const analysisUrl = `${BASE_URL}/`; 
    console.log("▶️  Sending POST request to:", analysisUrl);

    const response = await fetch(analysisUrl, {
      method: 'POST',
      body: formData,
      // No 'Content-Type' header needed; the browser sets it for FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}. Details: ${errorText}`);
    }

    // --- STEP 3: Get direct JSON response ---
    const finalReportObject = await response.json();
    console.log("✅ Success! Agent returned a response:");
    
    // --- STEP 4: Display the result ---
    chrome.tabs.sendMessage(tab.id, { type: 'displayResult', data: finalReportObject });

  } catch (error) {
    console.error('Error during analysis process:', error);
    chrome.tabs.sendMessage(tab.id, { 
        type: 'displayResult', 
        data: { tag: "Error", overall_summary: `Could not complete the analysis. Details: ${error.message}` }
    });
  }
}

/**
 * Crops an image from a data URL and returns a Blob directly.
 */
async function cropImage(dataUrl, area) {
    const response = await fetch(dataUrl);
    const imageBlob = await response.blob();
    const imageBitmap = await createImageBitmap(imageBlob);
    const canvas = new OffscreenCanvas(area.width, area.height);
    const context = canvas.getContext('2d');
    context.drawImage(
        imageBitmap,
        area.x, area.y, area.width, area.height,
        0, 0, area.width, area.height
    );
    // Return the cropped image as a Blob
    return await canvas.convertToBlob({ type: 'image/png' });
}