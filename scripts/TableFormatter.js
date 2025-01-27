// Table arranger
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const table = document.querySelector('table'); // Select the table
        if (table) {
            // Apply responsive styles to the table
            table.style.width = "100%"; // Ensure the table stretches fully
            table.style.wordWrap = "break-word"; // Allow breaking long words
            table.style.tableLayout = "fixed"; // Fix column width
            table.style.borderCollapse = "collapse"; // Merge borders neatly

            // Apply styles to all table cells (td and th)
            const cells = table.querySelectorAll('td, th');
            cells.forEach(cell => {
                cell.style.wordWrap = "break-word"; // Enable line breaks
                cell.style.whiteSpace = "normal"; // Allow wrapping
                cell.style.padding = "10px"; // Add spacing for readability
                cell.style.textAlign = "left"; // Align text to the left
            });

            // Ensure the parent container doesn't cut the table
            const container = document.querySelector('.gh-content');
            if (container) {
                container.style.overflowX = "auto"; // Allow horizontal scrolling if needed
                container.style.whiteSpace = "nowrap"; // Prevent unnecessary wrapping of container
            }
        }
    });
</script>
