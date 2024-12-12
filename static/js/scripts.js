document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const disease = e.target.disease.value;
    
    // Show loading overlay
    showLoading();

    try {
        const response = await fetch(`/search?disease=${encodeURIComponent(disease)}`);
        const data = await response.json();
        
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (data.error) {
            resultsDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
            return;
        }

        if (data.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron publicaciones.</p>';
            return;
        }

        data.forEach(article => {
            const panel = document.createElement('div');
            panel.classList.add('result-panel');

            const date = document.createElement('div');
            date.classList.add('article-date');
            date.textContent = article.date || 'Date not available';

            const title = document.createElement('h2');
            title.textContent = article.title;

            const metadata = document.createElement('p');
            metadata.classList.add('article-metadata');
            metadata.textContent = `Pages: ${article.pages || 'N/A'} | Journal: ${article.journal || 'N/A'} | Authors: ${article.authors || 'N/A'}`;

            const summary = document.createElement('p');
            summary.classList.add('article-abstract');
            summary.textContent = article.summary || 'No abstract available.';

            const link = document.createElement('a');
            link.href = article.link;
            link.target = '_blank';
            link.textContent = 'Read More';

            panel.appendChild(date);
            panel.appendChild(title);
            panel.appendChild(metadata);
            panel.appendChild(summary);
            panel.appendChild(link);

            resultsDiv.appendChild(panel);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('results').innerHTML = `<p style="color: red;">An error occurred while fetching data.</p>`;
    } finally {
        // Hide loading overlay
        hideLoading();
    }
});

// Functions to show and hide the loading overlay
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'none';
}

// Optional: Allow clicking the search icon to submit the form
document.querySelector('.search-icon').addEventListener('click', () => {
    document.getElementById('search-form').dispatchEvent(new Event('submit'));
});