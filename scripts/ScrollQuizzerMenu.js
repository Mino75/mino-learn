<script>
    // Display Code: Hamburger Menu and Buttons
    document.addEventListener('DOMContentLoaded', () => {
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
        burger.style.width = "50px";
        burger.style.height = "50px";
        burger.style.display = "flex";
        burger.style.alignItems = "center";
        burger.style.justifyContent = "center";
        burger.style.border = "2px solid #007bff";
        burger.style.borderRadius = "50%";

        const menu = document.createElement('div');
        menu.style.position = "fixed";
        menu.style.bottom = "70px";
        menu.style.right = "20px";
        menu.style.backgroundColor = "transparent";
        menu.style.border = "none";
        menu.style.padding = "0";
        menu.style.display = "none";
        menu.style.zIndex = "1000";

        function createButton(text, clickHandler) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.display = "block";
            button.style.marginBottom = "10px";
            button.style.backgroundColor = "#007bff";
            button.style.color = "#fff";
            button.style.border = "2px solid #007bff";
            button.style.borderRadius = "5px";
            button.style.padding = "5px 10px";
            button.style.cursor = "pointer";
            button.style.transition = "background-color 0.3s ease, transform 0.1s ease";
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = "#0056b3"; // Darker blue
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = "#007bff"; // Original blue
            });
            button.addEventListener('mousedown', () => {
                button.style.transform = "scale(0.95)";
            });
            button.addEventListener('mouseup', () => {
                button.style.transform = "scale(1)";
            });
            button.addEventListener('click', clickHandler);
            return button;
        }

        const startScrollButton = createButton("Start Scroll", () => zoomAwareScroll(50));
        const stopScrollButton = createButton("Stop Scroll", () => window.stopScroll());
        const beginnerQuizButton = createButton("Beginner Quiz", () => startQuiz(false));
        const advancedQuizButton = createButton("Advanced Quiz", () => startQuiz(true));

        menu.appendChild(startScrollButton);
        menu.appendChild(stopScrollButton);
        menu.appendChild(beginnerQuizButton);
        menu.appendChild(advancedQuizButton);

        burger.addEventListener('click', () => {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        });

        document.body.appendChild(burger);
        document.body.appendChild(menu);
    });
</script>

<script>
    // Scroll Down and Up Scripts
    function zoomAwareScroll(speed = 50) {
        let scrollStep = Math.ceil(1 / window.devicePixelRatio); // Adjust step based on zoom level
        let interval = speed;
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
</script>


<script>
    // CSS Styles for Quiz Elements
    const quizStyles = {
        quizContainer: {
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "2px solid #007bff",
            borderRadius: "10px",
            zIndex: "2000",
            maxWidth: "80%",
            textAlign: "center",
        },
        button: {
            margin: "10px",
            padding: "10px 20px",
            border: "2px solid #007bff",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#fff",
            color: "#007bff",
        },
        timerDisplay: {
            marginTop: "10px",
            fontSize: "18px",
            color: "red",
        },
    };

    // Helper function to apply styles
    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

</script>

<script>

    // Quiz Scripts (Updated)
    function startQuiz(isAdvanced) {
        const rows = Array.from(document.querySelectorAll("table tbody tr"));

        // Filter rows: Ensure at least one valid CN, JP, or RU value exists.
        const validRows = rows.filter(row => {
            const cells = row.querySelectorAll("td");
            const hasValidQuestion = cells[0].textContent.trim() && !/^[a-zA-Z0-9\s\-\.,]*$/.test(cells[0].textContent.trim());
            const hasValidTranslation = [1, 2, 3].some(index => {
                const content = cells[index].textContent.trim();
                return content && !/^[a-zA-Z0-9\s\-\.,]*$/.test(content);
            });
            return hasValidQuestion && hasValidTranslation;
        });

        if (validRows.length < 10) {
            alert("Not enough valid rows in the table for a quiz!");
            return;
        }

        const randomRows = validRows.sort(() => 0.5 - Math.random()).slice(0, 10);
        let score = 0;
        let timer;
        let results = [];

        const quizContainer = document.createElement('div');
        applyStyles(quizContainer, quizStyles.quizContainer);
        document.body.appendChild(quizContainer);

        function askQuestion(index) {
            if (index >= randomRows.length) {
                showRecap();
                return;
            }

            const row = randomRows[index];
            const cells = row.querySelectorAll("td");

            // Always use the French line (column 0) as the question
            const question = cells[0].textContent.trim();
            const colIndex = [1, 2, 3].find(col => {
                const content = cells[col]?.textContent.trim();
                return content && !/^[a-zA-Z0-9\s\-\.,]*$/.test(content);
            });

            if (colIndex === undefined) {
                askQuestion(index + 1); // Skip invalid row
                return;
            }

            const correctAnswer = cells[colIndex].textContent.trim();

            const cleanAnswer = isAdvanced ? correctAnswer
                .normalize("NFD")
                .replace(/[a-zA-Z0-9()\.\,~\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ") // Collapses multiple spaces into one
                .trim() : correctAnswer;

            const allAnswers = validRows.map(r => {
                const text = r.querySelectorAll("td")[colIndex].textContent.trim();
                return isAdvanced ? text.normalize("NFD").replace(/[a-zA-Z0-9\s()\.\,~\u0300-\u036f]/g, "").trim() : text;
            });

            const incorrectAnswers = allAnswers.filter(answer => 
                answer && answer !== cleanAnswer && !answer.match(/^\s*-+\s*$/) && !/^[a-zA-Z0-9\s]+$/.test(answer))
                .sort(() => 0.5 - Math.random()).slice(0, 3);

            const options = [cleanAnswer, ...incorrectAnswers].sort(() => 0.5 - Math.random());

            quizContainer.innerHTML = `<h3>What is the translation of "${question}"?</h3>`;

            if (isAdvanced) {
                const timerDisplay = document.createElement('div');
                applyStyles(timerDisplay, quizStyles.timerDisplay);
                quizContainer.appendChild(timerDisplay);

                let timeLeft = 14; // Display starts at 14 to give a 1s margin
                timerDisplay.textContent = `Time remaining: ${timeLeft + 1}s`;
                timer = setInterval(() => {
                    timerDisplay.textContent = `Time remaining: ${timeLeft--}s`;
                    if (timeLeft < 0) {
                        clearInterval(timer);
                        results.push({ question, correctAnswer, result: "❌ Wrong (Time Out)" });
                        askQuestion(index + 1);
                    }
                }, 1000);
            }

            options.forEach(option => {
                const optionButton = document.createElement('button');
                optionButton.textContent = option;
                applyStyles(optionButton, quizStyles.button);
                optionButton.addEventListener('click', () => {
                    clearTimeout(timer);
                    clearInterval(timer);
                    let isCorrect = option === cleanAnswer;
                    optionButton.style.backgroundColor = isCorrect ? "green" : "red";
                    optionButton.style.color = "white";

                    if (isCorrect) score++;

                    quizContainer.innerHTML += `<p>Correct answer: <strong>${correctAnswer}</strong></p>`;

                    results.push({ question, correctAnswer, result: isCorrect ? "✔️ Right" : "❌ Wrong" });
                    setTimeout(() => askQuestion(index + 1), 2000);
                });
                quizContainer.appendChild(optionButton);
            });
        }

        function showRecap() {
            quizContainer.innerHTML = "<h3>Quiz Recap</h3>";
            results.forEach(r => {
                quizContainer.innerHTML += `<p>${r.question} - <strong>${r.correctAnswer}</strong> - ${r.result}</p>`;
            });

            if (score >= 10) {
                quizContainer.innerHTML += "<div style='font-size: 48px; margin: 20px;'>🎉🎊 Excellent! 🎊🎉</div>";
            } else if (score >= 8) {
                quizContainer.innerHTML += "<div style='font-size: 36px; margin: 20px;'>🌟 Great Job! 🌟</div>";
            } else if (score >= 6) {
                quizContainer.innerHTML += "<div style='font-size: 24px; margin: 20px;'>👍 Good Effort! 👍</div>";
            }

            const closeButton = document.createElement('button');
            closeButton.textContent = "Close";
            applyStyles(closeButton, quizStyles.button);
            closeButton.style.marginTop = "10px";
            closeButton.style.backgroundColor = "#007bff";
            closeButton.style.color = "white";
            closeButton.addEventListener('click', () => quizContainer.remove());
            quizContainer.appendChild(closeButton);
        }

        askQuestion(0);
    }
</script>
