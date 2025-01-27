<script>
    // Function for zoom-aware smooth scrolling
    function zoomAwareScroll(speed = 50) {
        let scrollStep = Math.ceil(1 / window.devicePixelRatio); // Adjust step size based on zoom level
        let interval = speed; // Scroll interval

        let scroller = setInterval(() => {
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
                // Stop scrolling when reaching the bottom of the page
                clearInterval(scroller);
                console.log("Reached the bottom of the page.");
            } else {
                window.scrollBy(0, scrollStep); // Scroll step by step
            }
        }, interval);

        // Function to stop scrolling
        window.stopScroll = () => {
            clearInterval(scroller);
            console.log("Scrolling stopped.");
        };
    }

    // Add a hamburger menu with buttons for different functionalities
    document.addEventListener('DOMContentLoaded', () => {
        // Create the hamburger menu button
        const burger = document.createElement('div');
        burger.textContent = "☰"; // Hamburger icon
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

        // Create the menu container that will hold the buttons
        const menu = document.createElement('div');
        menu.style.position = "fixed";
        menu.style.bottom = "70px";
        menu.style.right = "20px";
        menu.style.backgroundColor = "transparent";
        menu.style.border = "none";
        menu.style.padding = "0";
        menu.style.display = "none"; // Initially hidden
        menu.style.zIndex = "1000";

        // Helper function to create buttons
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

            // Add hover and click animations
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = "#0056b3";
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = "#007bff";
            });

            button.addEventListener('mousedown', () => {
                button.style.transform = "scale(0.95)";
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = "scale(1)";
            });

            // Add click event listener
            button.addEventListener('click', clickHandler);

            return button;
        }

        // Create buttons for scrolling and quizzes
        const startScrollButton = createButton("Start Scroll", () => zoomAwareScroll(50));
        const stopScrollButton = createButton("Stop Scroll", () => window.stopScroll());
        const beginnerQuizButton = createButton("Beginner Quiz", () => startQuiz(false));
        const advancedQuizButton = createButton("Advanced Quiz", () => startQuiz(true));

        // Add buttons to the menu container
        menu.appendChild(startScrollButton);
        menu.appendChild(stopScrollButton);
        menu.appendChild(beginnerQuizButton);
        menu.appendChild(advancedQuizButton);

        // Show/hide the menu when the hamburger is clicked
        burger.addEventListener('click', () => {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        });

        // Add the burger and menu to the page
        document.body.appendChild(burger);
        document.body.appendChild(menu);
    });

    // Quiz functionality
    function startQuiz(isAdvanced) {
        const rows = Array.from(document.querySelectorAll("table tbody tr")); // Get all rows from the table

        if (rows.length < 10) {
            alert("Not enough rows in the table for a quiz!");
            return;
        }

        // Function to check if a cell contains valid content
        function isValidCell(text) {
            return text && !text.trim().startsWith("**"); // Ignore cells with "**" or empty content
        }

        // Filter valid rows by checking all cells
        const validRows = rows.filter(row => {
            const cells = Array.from(row.querySelectorAll("td"));
            return cells.every(cell => isValidCell(cell.textContent));
        });

        if (validRows.length < 10) {
            alert("Not enough valid rows for a quiz!");
            return;
        }

        // Select 10 random valid rows
        const randomRows = validRows.sort(() => 0.5 - Math.random()).slice(0, 10);
        let score = 0;

        // Create a container for the quiz
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

        // Function to display a question
        function askQuestion(index) {
            if (index >= randomRows.length) {
                // End of quiz
                quizContainer.innerHTML = `<h3>Your score: ${score}/10</h3>`;
                if (score >= 9) {
                    showCelebration();
                }
                setTimeout(() => quizContainer.remove(), 5000);
                return;
            }

            const row = randomRows[index];
            const cells = row.querySelectorAll("td");
            const colIndex = Math.floor(Math.random() * 3) + 1; // Pick a random column for the answer
            const question = cells[0].textContent.trim(); // Use the first column as the question
            const originalAnswer = cells[colIndex].textContent.trim(); // Save the original answer
            const correctAnswer = isAdvanced ? removeLatinCharacters(originalAnswer) : originalAnswer; // Clean answer for advanced mode

            // Generate incorrect answers
            const allAnswers = validRows.map(r => {
                const text = r.querySelectorAll("td")[colIndex].textContent.trim();
                return isValidCell(text) ? (isAdvanced ? removeLatinCharacters(text) : text) : null;
            }).filter(answer => answer !== null && answer !== correctAnswer);

            const incorrectAnswers = allAnswers.sort(() => 0.5 - Math.random()).slice(0, 3);
            const options = [correctAnswer, ...incorrectAnswers].sort(() => 0.5 - Math.random());

            // Display the question and answer options
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

                // Handle answer selection
                optionButton.addEventListener('click', () => {
                    if (option === correctAnswer) {
                        optionButton.style.backgroundColor = "green";
                        optionButton.style.color = "white";
                        score++;
                    } else {
                        optionButton.style.backgroundColor = "red";
                        optionButton.style.color = "white";
                        Array.from(quizContainer.querySelectorAll('button')).forEach(btn => {
                            if (btn.textContent === correctAnswer) {
                                btn.style.backgroundColor = "green";
                                btn.style.color = "white";
                            }
                        });
                    }

                    // Display the correction
                    const correction = document.createElement('div');
                    correction.innerHTML = `
                        <p style="margin-top: 20px; color: #333;">
                            <strong>Correct Answer:</strong> ${originalAnswer} <br>
                            ${option === correctAnswer ? "You got it right! 🎉" : "You got it wrong. 😔"}
                        </p>`;
                    quizContainer.appendChild(correction);

                    // Move to the next question after 2 seconds
                    setTimeout(() => askQuestion(index + 1), 2000);
                });

                quizContainer.appendChild(optionButton);
            });
        }

        askQuestion(0); // Start the quiz
    }

    // Function to remove Latin characters (for Advanced Quiz)
    function removeLatinCharacters(text) {
        return text
            .normalize("NFD") // Decompose characters (e.g., à -> a +  ̀)
            .replace(/[a-zA-Z0-9\s\(\)\.\,\~\u0300-\u036f]/g, "") // Remove Latin, spaces, punctuation, and diacritics
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
