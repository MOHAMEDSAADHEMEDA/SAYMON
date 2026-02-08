// الصفحة الرئيسية - تحميل المنتجات المميزة
function loadFeaturedProducts() {
    const featuredSection = document.getElementById('featured-products');
    if (!featuredSection) return;

    ProductManager.fetch()
        .then(products => {
            const featured = products ? products.slice(0, 6) : [];
            const list = document.createElement('div');
            list.style.display = 'grid';
            list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
            list.style.gap = '25px';

            if (!featured || featured.length === 0) {
                list.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">لا توجد منتجات متاحة</p>';
                featuredSection.appendChild(list);
                return;
            }

            featured.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                const btn = `<button onclick="addProductToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')" style="width: 100%;">🛒 أضف للسلة</button>`;
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p style="color: #999; font-size: 0.9em;">${product.category}</p>
                        <div class="product-price">${product.price} ج.م</div>
                        ${btn}
                    </div>
                `;
                list.appendChild(card);
            });
            featuredSection.innerHTML = '';
            featuredSection.appendChild(list);
        })
        .catch(err => {
            console.error('خطأ:', err);
            const featuredSection = document.getElementById('featured-products');
            if (featuredSection) {
                featuredSection.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">خطأ في تحميل المنتجات</p>';
            }
        });
}

// تحميل المنتجات عند فتح المتجر
function loadShopProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    ProductManager.fetch()
        .then(products => {
            // ProductManager already merges base JSON and custom local products when API unavailable
            const allProducts = Array.isArray(products) ? products : [];
            productList.innerHTML = '';
            if (!allProducts || allProducts.length === 0) {
                productList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">لا توجد منتجات متاحة</p>';
                return;
            }

            allProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p style="color: #999; font-size: 0.9em;">${product.category}</p>
                        <div class="product-price">${product.price} ج.م</div>
                        <button onclick="addProductToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')" style="width: 100%;">🛒 أضف للسلة</button>
                    </div>
                `;
                productList.appendChild(card);
            });
        })
        .catch(err => {
            // في حالة الخطأ في الـ API، استخدم المنتجات المحلية فقط
            const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
            productList.innerHTML = '';
            if (customProducts.length === 0) {
                productList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">لا توجد منتجات متاحة</p>';
                return;
            }

            customProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p style="color: #999; font-size: 0.9em;">${product.category}</p>
                        <div class="product-price">${product.price} ج.م</div>
                        <button onclick="addProductToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')" style="width: 100%;">🛒 أضف للسلة</button>
                    </div>
                `;
                productList.appendChild(card);
            });
        });
}

function addProductToCart(id, name, price, image) {
    const item = { id, name, price, image, addedAt: new Date() };
    CartManager.addToCart(item);
    alert(`✅ تم إضافة "${name}" إلى السلة`);
    updateCartDisplay();
}

function updateCartDisplay() {
    const count = CartManager.getCartCount();
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

// تحميل عند الانتهاء
setTimeout(() => {
    loadFeaturedProducts();
    updateCartDisplay();
}, 100);

window.addEventListener('cartUpdated', updateCartDisplay);