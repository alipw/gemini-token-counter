const textInput = document.getElementById('text-input');
const countButton = document.getElementById('count-button');
const tokenCountSpan = document.getElementById('token-count');
const resultArea = document.getElementById('result-area');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessageDiv = document.getElementById('error-message');
const errorTextSpan = document.getElementById('error-text');

countButton.addEventListener('click', async () => {
    const text = textInput.value.trim();

    if (!text) {
        alert('Please enter some text.');
        return;
    }

    // --- UI Updates: Start Loading ---
    loadingIndicator.style.display = 'block';
    errorMessageDiv.style.display = 'none'; // Hide previous errors
    resultArea.style.display = 'none'; // Hide previous results
    countButton.disabled = true;
    // --- End UI Updates ---

    try {
        // The path '/count-tokens' automatically routes to the
        // Cloudflare Function in the 'functions' directory.
        const response = await fetch('/count-tokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle errors returned from the function
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        // --- UI Updates: Show Result ---
        tokenCountSpan.textContent = data.tokenCount;
        resultArea.style.display = 'block';
        // --- End UI Updates ---

    } catch (error) {
        console.error('Error counting tokens:', error);
        // --- UI Updates: Show Error ---
        errorTextSpan.textContent = error.message;
        errorMessageDiv.style.display = 'block';
        // --- End UI Updates ---
    } finally {
        // --- UI Updates: End Loading ---
        loadingIndicator.style.display = 'none';
        countButton.disabled = false;
        // --- End UI Updates ---
    }
}); 