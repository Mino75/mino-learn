<script>
    // Zoom-Aware Slow Scrolling Script (unchanged)
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

    // Add the hamburger menu
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

    // Quiz functionality
    function startQuiz(isAdvanced) {
        const rows = Array.from(document.querySelectorAll("table tbody tr"));
        if (rows.length < 10) {
            alert("Not enough rows in the table for a quiz!");
            return;
        }

        // Select 10 random rows
        const randomRows = rows.sort(() => 0.5 - Math.random()).slice(0, 10);
        let score = 0;

        // Create the quiz container
        const quizContainer = document.createElement('div');
        quizContainer.style.position = "fixed";
        quizContainer.style.top = "10%";
        quizContainer.style.left = "50%";
        quizContainer.style.transform = "translateX(-50%)";
        quizContainer.style.backgroundColor = "white";
        quizContainer.style.padding = "20px";
        quizContainer.style.border = "2px solid #ddd";
        quizContainer.style.borderRadius = "10px";
        quizContainer.style.zIndex = "2000";
        quizContainer.style.maxWidth = "80%";
        quizContainer.style.textAlign = "center";

        document.body.appendChild(quizContainer);

        function askQuestion(index) {
            if (index >= randomRows.length) {
                quizContainer.innerHTML = `<h3>Your score: ${score}/10</h3>`;
                if (score >= 9) {
                    showCelebration();
                }
                setTimeout(() => quizContainer.remove(), 5000);
                return;
            }

            const row = randomRows[index];
            const cells = row.querySelectorAll("td");

            // Randomly pick a column (1: Russian, 2: Japanese, 3: Chinese)
            const colIndex = Math.floor(Math.random() * 3) + 1;
            const question = cells[0].textContent.trim();
            const correctAnswer = cells[colIndex].textContent.trim();

            // Clean the correct answer for advanced mode
            const cleanAnswer = isAdvanced ? removeLatinCharacters(correctAnswer) : correctAnswer;

            // Generate incorrect answers
            const allAnswers = rows.map(r => {
                const text = r.querySelectorAll("td")[colIndex].textContent.trim();
                return isAdvanced ? removeLatinCharacters(text) : text;
            });

            const incorrectAnswers = allAnswers.filter(answer => answer !== cleanAnswer).sort(() => 0.5 - Math.random()).slice(0, 3);

            // Randomize options
            const options = [cleanAnswer, ...incorrectAnswers].sort(() => 0.5 - Math.random());

            // Display question and options
            quizContainer.innerHTML = `<h3>What is the translation of "${question}"?</h3>`;
            options.forEach(option => {
                const optionButton = document.createElement('button');
                optionButton.textContent = option;
                optionButton.style.margin = "10px";
                optionButton.style.padding = "10px 20px";
                optionButton.style.border = "2px solid #007bff";
                optionButton.style.borderRadius = "5px";
                optionButton.style.cursor = "pointer";
                optionButton.style.backgroundColor = "#fff";
                optionButton.style.color = "#007bff";

                optionButton.addEventListener('click', () => {
                    if (option === cleanAnswer) {
                        optionButton.style.backgroundColor = "green";
                        optionButton.style.color = "white";
                        score++;
                    } else {
                        optionButton.style.backgroundColor = "red";
                        optionButton.style.color = "white";
                        Array.from(quizContainer.querySelectorAll('button')).forEach(btn => {
                            if (btn.textContent === cleanAnswer) {
                                btn.style.backgroundColor = "green";
                                btn.style.color = "white";
                            }
                        });
                    }
                    setTimeout(() => askQuestion(index + 1), 1000); // Move to the next question after 1 second
                });

                quizContainer.appendChild(optionButton);
            });
        }

        askQuestion(0);
    }

    // Function to remove Latin characters (for Advanced Quiz)
    function removeLatinCharacters(text) {
        return text
              .normalize("NFD") // Decompose characters (e.g., à -> a +  ̀)
              .replace(/[a-zA-Z\s\(\)\.\,\~\u0300-\u036f]/g, "") // Remove Latin, spaces, punctuation, and diacritics
              .trim();    
    }

    // Celebration animation
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
