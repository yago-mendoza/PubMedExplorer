document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const disease = e.target.disease.value;
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

        const title = document.createElement('h2');
        title.textContent = article.title;

        const summary = document.createElement('p');
        summary.textContent = article.summary || 'No summary available.';

        const link = document.createElement('a');
        link.href = article.link;
        link.target = '_blank';
        link.textContent = 'Read More';

        panel.appendChild(title);
        panel.appendChild(summary);
        panel.appendChild(link);

        resultsDiv.appendChild(panel);
    });
});