const gallery = document.getElementById('gallery');
const filterNav = document.getElementById('category-filter');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const detailLink = document.getElementById('detail-link');
const closeBtn = document.querySelector('.close');

let allData = [];

// Load data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        allData = data;
        renderFilterButtons();
        renderGallery('all');
    });

// Generate filter buttons
function renderFilterButtons() {
    allData.forEach(item => {
        const btn = document.createElement('button');
        btn.classList.add('filter-btn');
        btn.dataset.category = item.category;
        btn.textContent = item.category;
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(e.target.dataset.category);
        });
        filterNav.appendChild(btn);
    });

    const allBtn = document.querySelector('[data-category="all"]');
    allBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        renderGallery('all');
    });
}

// Render gallery
function renderGallery(category) {
    gallery.innerHTML = '';
    let filteredProducts = [];
    
    if (category === 'all') {
        allData.forEach(cat => {
            cat.products.forEach(p => filteredProducts.push({...p, category: cat.category}));
        });
    } else {
        const catData = allData.find(c => c.category === category);
        if (catData) {
            catData.products.forEach(p => filteredProducts.push({...p, category: catData.category}));
        }
    }

    filteredProducts.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `
            <img src="${product.image_url}" alt="${product.title}" loading="lazy">
            <div class="info">
                <h3>${product.title}</h3>
                <p style="font-size: 12px; color: #777;">${product.category}</p>
            </div>
        `;
        item.addEventListener('click', () => openModal(product));
        gallery.appendChild(item);
    });
}

// Modal logic
function openModal(product) {
    modal.style.display = "block";
    modalImg.src = product.image_url;
    captionText.innerHTML = product.title;
    detailLink.href = product.detail_url;
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
