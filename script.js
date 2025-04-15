document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const apiKeyInput = document.getElementById('api-key');
    const modelNameInput = document.getElementById('model-name');
    const apiVersionInput = document.getElementById('api-version');
    const textInput = document.getElementById('text-input');
    const countButton = document.getElementById('count-tokens');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    
    // Results elements
    const tokenCountSpan = document.getElementById('token-count');
    const detailedResultCard = document.querySelector('.result-card:nth-of-type(2)');
    
    // Hide detailed card initially
    if (detailedResultCard) {
        detailedResultCard.style.display = 'none';
    }
    
    // Check for saved API key
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    
    // Event listener for the count button
    countButton.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        const modelName = modelNameInput.value.trim();
        const apiVersion = apiVersionInput.value.trim();
        const text = textInput.value.trim();
        
        if (!apiKey) {
            showError('Please enter your Gemini API Key');
            return;
        }
        if (!modelName) {
            showError('Please enter the Model Name');
            return;
        }
        if (!apiVersion) {
            showError('Please enter the API Version');
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
        if (detailedResultCard) {
           detailedResultCard.style.display = 'none';
        }
        
        try {
            // Construct the API endpoint
            const apiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:countTokens?key=${apiKey}`;
            
            // Prepare the request body
            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: text
                            }
                        ]
                    }
                ]
            };
            
            // Make the API call using fetch
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown API error' }));
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || errorData.message}`);
            }
            
            const data = await response.json();
            
            // Update the simple token count
            tokenCountSpan.textContent = data.totalTokens || 0;
            
            // Show results (only the simple count card)
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