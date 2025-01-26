
/**
 * Zoom-Aware Slow Scrolling Script
 *
 * This script enables slow automatic scrolling on any webpage.
 * It dynamically adjusts the scrolling step based on the current zoom level.
 *
 * Features:
 * - Automatically adapts to the zoom level (using `window.devicePixelRatio`).
 * - Allows the user to stop scrolling with a simple command.
 * - Logs useful information like scroll step and zoom level in the console.
 *
 * How to Use:
 * 1. Open the webpage where you want to enable slow scrolling.
 * 2. Press `F12` or right-click and select "Inspect" to open developer tools.
 * 3. Go to the "Console" tab.
 * 4. Paste this script into the console and press Enter.
 * 5. The page will start scrolling slowly.
 * 6. To stop scrolling, type `stopScroll()` in the console and press Enter.
 *
 * Parameters:
 * - speed (optional): Time in milliseconds between each scroll step (default: 50ms).
 *
 * Example Usage:
 * - Paste and run in console: `zoomAwareScroll(30);` (faster scrolling).
 * - To stop: Type `stopScroll();` in the console.
 */

(function zoomAwareScroll(speed = 50) {
    let scrollStep = Math.ceil(1 / window.devicePixelRatio); // Adjust step based on zoom level
    let interval = speed;

    console.log(`Scroll step: ${scrollStep}px per ${interval}ms (Zoom level: ${Math.round(window.devicePixelRatio * 100)}%)`);

    let scroller = setInterval(() => {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
            clearInterval(scroller);
            console.log("Reached the bottom of the page.");
        } else {
            window.scrollBy(0, scrollStep);
        }
    }, interval);

    window.stopScroll = () => {
        clearInterval(scroller);
        console.log("Scrolling stopped.");
    };
})();
