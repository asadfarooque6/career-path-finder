const API_BASE_URL = 'http://localhost:5000/api';

// Handle Enter key press
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getRecommendations();
    }
});

async function getRecommendations() {
    const input = document.getElementById('userInput').value.trim();
    
    if (!input) {
        showError('Please enter your skills or a target job role.');
        return;
    }

    // Clear previous results
    clearResults();
    
    // Show loading
    showLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/recommend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const recommendations = await response.json();
        
        showLoading(false);
        
        if (recommendations.length === 0) {
            showError('No recommendations found. Try different keywords.');
            return;
        }

        displayResults(recommendations);
    } catch (error) {
        showLoading(false);
        showError(`Error: ${error.message}. Make sure the server is running.`);
        console.error('Error:', error);
    }
}

function displayResults(recommendations) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    recommendations.forEach((rec, index) => {
        const card = createResultCard(rec, index);
        resultsContainer.appendChild(card);
    });
}

function createResultCard(recommendation, index) {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const role = recommendation.role || 'Unknown Role';
    const requiredSkills = recommendation.required_skills || [];
    const nextSkills = recommendation.next_skills || [];
    const resources = recommendation.resources || [];
    const source = recommendation.source || 'unknown';

    card.innerHTML = `
        <h2>${role}</h2>
        
        ${requiredSkills.length > 0 ? `
            <div class="section">
                <div class="section-title">Required Skills</div>
                <div class="skills-list">
                    ${requiredSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        ` : ''}
        
        ${nextSkills.length > 0 ? `
            <div class="section">
                <div class="section-title">Next Skills to Learn</div>
                <div class="skills-list">
                    ${nextSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        ` : ''}
        
        ${resources.length > 0 ? `
            <div class="section">
                <div class="section-title">Study Resources</div>
                <ul class="resources-list">
                    ${resources.map(resource => `
                        <li class="resource-item">
                            <a href="${resource.link}" target="_blank" rel="noopener noreferrer" class="resource-link">
                                ${resource.title}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
        
        <span class="source-badge">Source: ${source.toUpperCase()}</span>
    `;

    return card;
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    const errorDiv = document.getElementById('error');
    errorDiv.classList.add('hidden');
}

function clearResults() {
    document.getElementById('results').innerHTML = '';
    hideError();
}


