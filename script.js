const gallery = document.getElementById('gallery');
const filterNav = document.getElementById('category-filter');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const detailLink = document.getElementById('detail-link');
const closeBtn = document.querySelector('.close');

const toggleMemoBtn = document.getElementById('toggle-memo');
const memoBox = document.getElementById('memo-box');
const memoInput = document.getElementById('memo-input');
const saveMemoBtn = document.getElementById('save-memo');

let allData = [];
let currentProductId = null;

// Load data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        allData = data;
        renderFilterButtons();
        renderGallery('all');
    });

function renderFilterButtons() {
    const categories = ['all', ...new Set(allData.map(item => item.category))];
    filterNav.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.classList.add('filter-btn');
        if(cat === 'all') btn.classList.add('active');
        btn.dataset.category = cat;
        btn.textContent = cat === 'all' ? '全部' : cat;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(cat);
        });
        filterNav.appendChild(btn);
    });
}

function renderGallery(category) {
    gallery.innerHTML = '';
    const filtered = category === 'all' ? allData : allData.filter(item => item.category === category);

    filtered.forEach((product, index) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}" loading="lazy">
            <div class="info">
                <h3>${product.title}</h3>
                <p>${product.category}</p>
            </div>
        `;
        item.addEventListener('click', () => openModal(product, `${category}-${index}`));
        gallery.appendChild(item);
    });
}

function openModal(product, id) {
    currentProductId = id;
    modal.style.display = "block";
    modalImg.src = product.imageUrl;
    captionText.innerHTML = product.title;
    detailLink.href = product.detailUrl;
    
    // Load memo from localStorage
    const savedMemo = localStorage.getItem(`memo-${id}`) || '';
    memoInput.value = savedMemo;
    memoBox.classList.remove('active');
}

toggleMemoBtn.addEventListener('click', () => {
    memoBox.classList.toggle('active');
});

saveMemoBtn.addEventListener('click', () => {
    localStorage.setItem(`memo-${currentProductId}`, memoInput.value);
    memoBox.classList.remove('active');
});

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }
