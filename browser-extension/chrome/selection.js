// Avoid re-injecting the script
if (!document.getElementById('selection-overlay')) {
  const overlay = document.createElement('div');
  overlay.id = 'selection-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.5)';
  overlay.style.cursor = 'crosshair';
  overlay.style.zIndex = '9999';
  document.body.appendChild(overlay);

  let startX, startY;
  let selectionBox = document.createElement('div');
  selectionBox.style.position = 'absolute';
  selectionBox.style.border = '2px dashed #fff';
  selectionBox.style.background = 'rgba(255, 255, 255, 0.2)';

  overlay.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    overlay.appendChild(selectionBox);

    overlay.addEventListener('mousemove', mouseMoveHandler);
  });

  const mouseMoveHandler = (e) => {
    let width = e.clientX - startX;
    let height = e.clientY - startY;
    selectionBox.style.width = `${Math.abs(width)}px`;
    selectionBox.style.height = `${Math.abs(height)}px`;
    selectionBox.style.left = `${width > 0 ? startX : e.clientX}px`;
    selectionBox.style.top = `${height > 0 ? startY : e.clientY}px`;
  };

  overlay.addEventListener('mouseup', (e) => {
    overlay.remove();
    const rect = {
      x: parseInt(selectionBox.style.left),
      y: parseInt(selectionBox.style.top),
      width: parseInt(selectionBox.style.width),
      height: parseInt(selectionBox.style.height),
    };

    // Send the coordinates to the background script for capture
    chrome.runtime.sendMessage({ type: 'capture', area: rect });
  });
}