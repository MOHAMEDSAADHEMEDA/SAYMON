// عرض المنتجات من قاعدة البيانات عبر API
const API_URL = 'api/products.php';

// دالة لتحميل وعرض المنتجات
function loadShopProducts() {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Error');
            return res.json();
        })
        .then(products => {
            const list = document.getElementById('product-list');
            if (!list) return;
            list.innerHTML = '';
            
            if (!products || products.length === 0) {
                list.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">لا توجد منتجات متاحة حالياً</p>';
                return;
            }
            
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p style="color: #999; font-size: 0.9em;">${product.category}</p>
                        <p>${product.description || ''}</p>
                        <div class="product-price">${product.price} ج.م</div>
                        <button onclick="addProductToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">🛒 أضف للسلة</button>
                    </div>
                `;
                list.appendChild(card);
            });
        })
        .catch(err => {
            console.error('خطأ في تحميل المنتجات:', err);
            const list = document.getElementById('product-list');
            if (list) {
                list.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">خطأ في تحميل المنتجات</p>';
            }
        });
}

// تحميل المنتجات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadShopProducts);

// تحديث المنتجات عند التعديل من لوحة التحكم
window.addEventListener('productsUpdated', loadShopProducts);