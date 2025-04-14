document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const apiKeyInput = document.getElementById('api-key');
    const textInput = document.getElementById('text-input');
    const countButton = document.getElementById('count-tokens');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    
    // Results elements
    const tokenCountSpan = document.getElementById('token-count');
    const promptTokensSpan = document.getElementById('prompt-tokens');
    const responseTokensSpan = document.getElementById('response-tokens');
    const totalTokensSpan = document.getElementById('total-tokens');
    
    // Check for saved API key
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    
    // Event listener for the count button
    countButton.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        const text = textInput.value.trim();
        
        if (!apiKey) {
            showError('Please enter your Gemini API Key');
            return;
        }
        
        if (!text) {
            showError('Please enter some text to analyze');
            return;
        }
        
        // Save API key to local storage
        localStorage.setItem('gemini-api-key', apiKey);
        
        // Show loading state
        loadingDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        
        try {
            // Initialize the Gemini API
            const genAI = new window.GoogleGenerativeAI(apiKey);
            
            // First, count tokens only
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const tokenCount = await model.countTokens(text);
            
            // Update the simple token count
            tokenCountSpan.textContent = tokenCount.totalTokens;
            
            // Now generate content to get detailed usage metadata
            const response = await model.generateContent(text);
            const result = response.response;
            
            // Get usage metadata
            if (result.promptFeedback && result.usageMetadata) {
                promptTokensSpan.textContent = result.usageMetadata.promptTokenCount;
                responseTokensSpan.textContent = result.usageMetadata.candidatesTokenCount;
                totalTokensSpan.textContent = result.usageMetadata.totalTokenCount;
            }
            
            // Show results
            loadingDiv.classList.add('hidden');
            resultsDiv.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'An error occurred while counting tokens');
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorDiv.classList.remove('hidden');
        loadingDiv.classList.add('hidden');
        resultsDiv.classList.add('hidden');
    }
}); 