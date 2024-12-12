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

        data.forEach((article, index) => {
            const panel = document.createElement('div');
            panel.classList.add('result-panel');
            
            // Añadir retraso escalonado
            panel.style.animationDelay = `${index * 0.2}s`;

            const date = document.createElement('div');
            date.classList.add('article-date');
            date.textContent = article.date || 'Date not available';

            // Create the page count circle
            const pageCircle = document.createElement('div');
            pageCircle.classList.add('page-circle');

            // Create the document icon
            const docIcon = document.createElement('img');

            docIcon.src = "/static/svgs/file-solid.svg";
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
            metadata.textContent = `Journal: ${article.journal || 'N/A'} // Authors: ${article.authors || 'N/A'}`;

            const link = document.createElement('a');
            link.href = article.link;
            link.target = '_blank';
            link.textContent = article.doi || 'doi: N/A (click to learn more)';

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

// Suggestions Carousel

// Función para mezclar un arreglo usando el algoritmo de Fisher-Yates
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para cargar e inicializar el carrusel
async function initSuggestionsCarousel() {
    const response = await fetch('/static/js/search-suggestions.json');
    let data = await response.json();
    
    // Aleatorizar el orden de las sugerencias
    data.suggestions = shuffleArray(data.suggestions);
    
    const track = document.querySelector('.carousel-track');
    
    // Función para crear un botón de sugerencia
    function createSuggestionButton(suggestion) {
        const button = document.createElement('button');
        button.className = 'suggestion-btn';
        button.textContent = suggestion.display;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelector('input[name="disease"]').value = suggestion.query;
            document.getElementById('search-form').dispatchEvent(new Event('submit'));
        });
        return button;
    }

    // Crear 2 conjuntos de sugerencias para un efecto infinito suave
    const numberOfSets = 2;
    for (let i = 0; i < numberOfSets; i++) {
        data.suggestions.forEach(suggestion => {
            const button = createSuggestionButton(suggestion);
            track.appendChild(button);
        });
    }
    
    // Calcular el ancho total de una sola set de sugerencias
    const singleSetWidth = Array.from(track.children).slice(0, data.suggestions.length).reduce((total, button) => {
        return total + button.offsetWidth + 15; // 15 es el gap
    }, 0);
    
    let position = 0;
    const speed = 0.5; // Ajusta la velocidad según sea necesario

    function animate() {
        position -= speed;
        
        // Si hemos desplazado más allá del primer conjunto, reiniciar la posición
        if (-position >= singleSetWidth) {
            position += singleSetWidth;
        }
        
        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Inicializar el carrusel cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initSuggestionsCarousel);