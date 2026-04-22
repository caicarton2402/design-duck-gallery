const gallery = document.getElementById('gallery');
const filterDrawer = document.getElementById('category-filter');
const filterButtonsContainer = document.getElementById('filter-buttons-container');
const menuToggle = document.getElementById('menu-toggle');
const closeDrawer = document.getElementById('close-drawer');

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
let filteredProducts = [];
let currentCategory = 'all';
let currentIndex = 0;

// Load data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        allData = data;
        renderFilterButtons();
        renderGallery('all');
    });

// Drawer Toggle Logic
menuToggle.addEventListener('click', () => filterDrawer.classList.add('active'));
closeDrawer.addEventListener('click', () => filterDrawer.classList.remove('active'));

function renderFilterButtons() {
    const categories = ['all', ...new Set(allData.map(item => item.category))];
    filterButtonsContainer.innerHTML = '';
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
            filterDrawer.classList.remove('active');
        });
        filterButtonsContainer.appendChild(btn);
    });
}

function renderGallery(category) {
    currentCategory = category;
    gallery.innerHTML = '';
    filteredProducts = category === 'all' ? allData : allData.filter(item => item.category === category);

    filteredProducts.forEach((product, index) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}" loading="lazy">
            <div class="info">
                <h3>${product.title}</h3>
                <p>${product.category}</p>
            </div>
        `;
        item.addEventListener('click', () => openModal(index));
        gallery.appendChild(item);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(index) {
    currentIndex = index;
    const product = filteredProducts[index];
    modal.style.display = "block";
    modalImg.src = product.imageUrl;
    captionText.innerHTML = product.title;
    detailLink.href = product.detailUrl;
    
    const id = `${currentCategory}-${index}`;
    memoInput.value = localStorage.getItem(`memo-${id}`) || '';
    memoBox.classList.remove('active');
    document.body.style.overflow = 'hidden'; // Stop background scroll
}

// Swipe Detection for Mobile (TikTok Style)
let touchStartY = 0;
let touchEndY = 0;

modal.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
}, false);

modal.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeDistance = touchEndY - touchStartY;
    if (Math.abs(swipeDistance) > 50) { // Threshold
        if (swipeDistance < 0) {
            // Swipe Up -> Next
            if (currentIndex < filteredProducts.length - 1) {
                openModal(currentIndex + 1);
            }
        } else {
            // Swipe Down -> Prev
            if (currentIndex > 0) {
                openModal(currentIndex - 1);
            }
        }
    }
}

toggleMemoBtn.addEventListener('click', () => memoBox.classList.toggle('active'));
saveMemoBtn.addEventListener('click', () => {
    localStorage.setItem(`memo-${currentCategory}-${currentIndex}`, memoInput.value);
    memoBox.classList.remove('active');
});

closeBtn.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
}
window.onclick = (e) => { 
    if (e.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
    if (e.target == filterDrawer) filterDrawer.classList.remove('active');
}
