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

    const list = document.createElement('ul');
    data.forEach(article => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${article.link}" target="_blank">${article.title}</a> (${article.date})`;
        list.appendChild(listItem);
    });

    resultsDiv.appendChild(list);
});
