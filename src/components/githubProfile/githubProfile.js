// Load GitHub Profile HTML and CSS
fetch('./src/components/githubProfile/githubProfile.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('github-app').innerHTML = html;
        
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './src/components/githubProfile/githubProfile.css';
        document.head.appendChild(link);
        
        // Initialize GitHub profile functionality
        initializeGitHubApp();
    });

function initializeGitHubApp() {
    const githubUsername = document.getElementById('githubUsername');
    const searchBtn = document.getElementById('searchBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const profile = document.getElementById('profile');

    // Event Listeners
    searchBtn.addEventListener('click', searchGitHubProfile);
    githubUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchGitHubProfile();
    });

    async function searchGitHubProfile() {
        const username = githubUsername.value.trim();
        
        if (!username) {
            showError('Please enter a GitHub username');
            return;
        }

        showLoading();
        hideError();
        hideProfile();

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found');
                } else {
                    throw new Error('Something went wrong');
                }
            }

            const userData = await response.json();
            displayProfile(userData);

        } catch (err) {
            showError(err.message);
        } finally {
            hideLoading();
        }
    }

    function displayProfile(user) {
        profile.innerHTML = `
            <div class="profile-header">
                <img src="${user.avatar_url}" alt="${user.name || user.login}" class="profile-avatar">
                <h2 class="profile-name">${user.name || 'No name'}</h2>
                <p class="profile-username">@${user.login}</p>
                <p class="profile-bio">${user.bio || 'No bio available'}</p>
            </div>
            
            <div class="profile-stats">
                <div class="stat">
                    <span class="stat-number">${user.public_repos}</span>
                    <span class="stat-label">Repositories</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${user.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${user.following}</span>
                    <span class="stat-label">Following</span>
                </div>
            </div>
            
            <div class="profile-details">
                <div class="detail">
                    <i>🏢</i>
                    <span>${user.company || 'Not specified'}</span>
                </div>
                <div class="detail">
                    <i>📍</i>
                    <span>${user.location || 'Not specified'}</span>
                </div>
                <div class="detail">
                    <i>📧</i>
                    <span>${user.email || 'Not specified'}</span>
                </div>
                <div class="detail">
                    <i>🔗</i>
                    <span>${user.blog || 'No website'}</span>
                </div>
                <div class="detail">
                    <i>🐦</i>
                    <span>Twitter: ${user.twitter_username || 'Not specified'}</span>
                </div>
            </div>
            
            <a href="${user.html_url}" target="_blank" class="profile-link">
                View Full Profile on GitHub
            </a>
        `;

        showProfile();
    }

    function showLoading() {
        loading.classList.remove('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }

    function showError(message) {
        error.innerHTML = `
            <h3>Error</h3>
            <p>${message}</p>
        `;
        error.classList.remove('hidden');
    }

    function hideError() {
        error.classList.add('hidden');
    }

    function showProfile() {
        profile.classList.remove('hidden');
    }

    function hideProfile() {
        profile.classList.add('hidden');
    }
}