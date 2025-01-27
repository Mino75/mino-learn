 // Inject in the footer of header

<script>
    // Zoom-Aware Slow Scrolling Script
    function zoomAwareScroll(speed = 50) {
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
    }

    // Add the hamburger menu
    document.addEventListener('DOMContentLoaded', () => {
        // Create the hamburger menu
        const burger = document.createElement('div');
        burger.textContent = "☰";
        burger.style.position = "fixed";
        burger.style.bottom = "20px";
        burger.style.right = "20px";
        burger.style.fontSize = "24px";
        burger.style.cursor = "pointer";
        burger.style.zIndex = "1000";
        burger.style.backgroundColor = "transparent";
        burger.style.color = "#007bff";
        burger.style.width = "50px"; // Ensure it's a square
        burger.style.height = "50px"; // Ensure it's a square
        burger.style.display = "flex";
        burger.style.alignItems = "center";
        burger.style.justifyContent = "center";
        burger.style.border = "2px solid #007bff";
        burger.style.borderRadius = "50%"; // Make it circular for better aesthetics

        // Create the menu container
        const menu = document.createElement('div');
        menu.style.position = "fixed";
        menu.style.bottom = "70px";
        menu.style.right = "20px";
        menu.style.backgroundColor = "transparent";
        menu.style.border = "none";
        menu.style.padding = "0";
        menu.style.display = "none";
        menu.style.zIndex = "1000";

        // Add buttons to the menu
        const startScrollButton = document.createElement('button');
        startScrollButton.textContent = "Start Scroll";
        startScrollButton.style.display = "block";
        startScrollButton.style.marginBottom = "10px";
        startScrollButton.style.backgroundColor = "transparent";
        startScrollButton.style.color = "#007bff";
        startScrollButton.style.border = "2px solid #007bff";
        startScrollButton.style.borderRadius = "5px";
        startScrollButton.style.padding = "5px 10px";
        startScrollButton.addEventListener('click', () => {
            zoomAwareScroll(50); // Start scrolling
        });

        const stopScrollButton = document.createElement('button');
        stopScrollButton.textContent = "Stop Scroll";
        stopScrollButton.style.display = "block";
        stopScrollButton.style.marginBottom = "10px";
        stopScrollButton.style.backgroundColor = "transparent";
        stopScrollButton.style.color = "#007bff";
        stopScrollButton.style.border = "2px solid #007bff";
        stopScrollButton.style.borderRadius = "5px";
        stopScrollButton.style.padding = "5px 10px";
        stopScrollButton.addEventListener('click', () => {
            window.stopScroll(); // Stop scrolling
        });

        const startQuizButton = document.createElement('button');
        startQuizButton.textContent = "Start Quiz";
        startQuizButton.style.display = "block";
        startQuizButton.style.backgroundColor = "transparent";
        startQuizButton.style.color = "#007bff";
        startQuizButton.style.border = "2px solid #007bff";
        startQuizButton.style.borderRadius = "5px";
        startQuizButton.style.padding = "5px 10px";
        startQuizButton.addEventListener('click', () => {
            startQuiz();
        });

        menu.appendChild(startScrollButton);
        menu.appendChild(stopScrollButton);
        menu.appendChild(startQuizButton);

        // Show/hide menu on burger click
        burger.addEventListener('click', () => {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        });

        document.body.appendChild(burger);
        document.body.appendChild(menu);
    });

    // Quiz functionality (same as before, not shown here for brevity)
    function startQuiz() {
        // Same as the previous implementation for generating the quiz
    }

    // Celebration animation (same as before)
    function showCelebration() {
        const confetti = document.createElement('div');
        confetti.textContent = "🎉🎊🎉";
        confetti.style.position = "fixed";
        confetti.style.top = "50%";
        confetti.style.left = "50%";
        confetti.style.transform = "translate(-50%, -50%)";
        confetti.style.fontSize = "48px";
        confetti.style.animation = "fadeout 2s ease-out forwards";

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
</script>
