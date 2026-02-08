// عرض المنتجات من البيانات الثابتة
const API_URL = 'data/products.json';

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
                        <button onclick="addToCart('${product.id}', '${product.name}')">🛒 أضف للسلة</button>
                    </div>
                `;
                list.appendChild(card);
            });
        })
        .catch(err => {
            console.error('خطأ في تحميل المنتجات:', err);
        });
}

// تحميل المنتجات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadShopProducts);

// تحديث المنتجات عند التعديل من لوحة التحكم
window.addEventListener('productsUpdated', loadShopProducts);

function addToCart(id, name) {
    // تأكيد من المستخدم قبل الحذف
    if (confirm(`هل تريد إضافة "${name}" للسلة؟\n(سيتم حذف المنتج من المتجر بعد الإضافة)`)) {
        // حفظ في السلة (localStorage)
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ id, name, addedAt: new Date().toISOString() });
        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert(`✅ تمت إضافة "${name}" إلى السلة بنجاح!`);
        
        // حذف المنتج من السيرفر
        fetch('api/products.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // تحديث المنتجات بعد الحذف
                    loadShopProducts();
                    // إخطار الصفحات الأخرى بالتحديث
                    window.dispatchEvent(new CustomEvent('productsUpdated'));
                } else {
                    alert('⚠️ حدث خطأ أثناء حذف المنتج');
                }
            })
            .catch(err => {
                console.error('خطأ:', err);
                alert('❌ خطأ في الاتصال بالسيرفر');
            });
    }
}