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

            // Create the page count circle
            const pageCircle = document.createElement('div');
            pageCircle.classList.add('page-circle');

            // Create the document icon
            const docIcon = document.createElement('img');
            docIcon.src = "{{ url_for('static', filename='svgs/file-solid.svg') }}"; // Ensure this path is correct
            docIcon.alt = 'Document Icon';
            docIcon.classList.add('doc-icon');

            // Create the page number element
            const pageNumber = document.createElement('span');
            pageNumber.classList.add('page-number');

            
            function getPageText(pages) {
                // Function to adapt the page number from the pages string
                let pageText = 'N/A';
                if (typeof pages === 'string') {
                    const pageParts = pages.split('-').map(part => part.trim());
            
                    if (pageParts.length === 2 && pageParts.every(part => !isNaN(parseInt(part)))) {
                        pageText = pageParts[1]; // Take the second number
                    } else if (!isNaN(parseInt(pages))) {
                        pageText = pages; // Take the number directly
                    }
                }
                return pageText;
            } 

            pageNumber.textContent = getPageText(article.pages);
            
            // Append icon and page number to the circle
            pageCircle.appendChild(docIcon);
            pageCircle.appendChild(pageNumber);

            const title = document.createElement('h2');

            // Create a container for the circle and title
            const titleContainer = document.createElement('div');
            titleContainer.classList.add('title-container');

            title.textContent = article.title;

            // Append circle and title to the container
            titleContainer.appendChild(pageCircle);
            titleContainer.appendChild(title);

            const metadata = document.createElement('p');
            metadata.classList.add('article-metadata');
            metadata.textContent = `Journal: ${article.journal || 'N/A'} || Authors: ${article.authors || 'N/A'}`;

            const link = document.createElement('a');
            link.href = article.link;
            link.target = '_blank';
            link.textContent = 'Read More';

            panel.appendChild(date);
            panel.appendChild(titleContainer);
            panel.appendChild(metadata);
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