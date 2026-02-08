// لوحة تحكم الآدمن - إدارة كاملة للمنتجات (CRUD) مع PHP Backend

let allProducts = [];
let editingId = null;
const API_URL = 'data/products.json';

// تحميل المنتجات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    document.getElementById('product-form').addEventListener('submit', saveProduct);
});

// تحميل المنتجات من السيرفر
function loadProducts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(products => {
            allProducts = products;
            displayProducts();
        })
        .catch(err => {
            console.error(err);
        });
}

// عرض جميع المنتجات
function displayProducts() {
    const list = document.getElementById('admin-products-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    allProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-edit-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
            <div class="product-edit-info">
                <h3>${product.name}</h3>
                <p style="font-size: 0.9em; color: #666;">${product.category}</p>
                <p style="font-weight: bold; color: #667eea;">${product.price} ج.م</p>
                <div class="product-edit-buttons">
                    <button class="btn-edit" onclick="editProduct('${product.id}')">✏️ تعديل</button>
                    <button class="btn-delete" onclick="deleteProduct('${product.id}')">🗑️ حذف</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

// فتح نموذج التعديل
function editProduct(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    
    editingId = id;
    document.getElementById('form-title').textContent = '✏️ تعديل منتج';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.image;
    
    // تمرير الصفحة إلى الأعلى
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// حفظ أو تحديث منتج على السيرفر
function saveProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value.trim();
    const image = document.getElementById('product-image').value.trim();
    
    if (!name || !category || !price || !image) {
        showMessage('❌ الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const productData = {
        name,
        category,
        price,
        description,
        image
    };
    
    if (editingId) {
        // تحديث منتج موجود
        productData.id = editingId;
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showMessage('✅ تم تحديث المنتج بنجاح', 'success');
                    editingId = null;
                    loadProducts();
                    resetForm();
                } else {
                    showMessage('❌ ' + (data.error || 'فشل التحديث'), 'error');
                }
            })
            .catch(err => {
                console.error('خطأ:', err);
                showMessage('❌ خطأ في الاتصال بالسيرفر', 'error');
            });
    } else {
        // إضافة منتج جديد
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showMessage('✅ تم إضافة منتج جديد بنجاح', 'success');
                    loadProducts();
                    resetForm();
                } else {
                    showMessage('❌ ' + (data.error || 'فشلت الإضافة'), 'error');
                }
            })
            .catch(err => {
                console.error('خطأ:', err);
                showMessage('❌ خطأ في الاتصال بالسيرفر', 'error');
            });
    }
}

// حذف منتج من السيرفر
function deleteProduct(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    
    if (confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showMessage(`✅ تم حذف المنتج "${product.name}"`, 'success');
                    loadProducts();
                } else {
                    showMessage('❌ ' + (data.error || 'فشل الحذف'), 'error');
                }
            })
            .catch(err => {
                console.error('خطأ:', err);
                showMessage('❌ خطأ في الاتصال بالسيرفر', 'error');
            });
    }
}

// إعادة تعيين النموذج
function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('form-title').textContent = '➕ إضافة منتج جديد';
    editingId = null;
}

// عرض رسالة النجاح/الخطأ
function showMessage(message, type = 'success') {
    const msgElement = document.getElementById('success-msg');
    msgElement.textContent = message;
    msgElement.style.background = type === 'success' ? '#4caf50' : '#f44336';
    msgElement.classList.add('show');
    
    setTimeout(() => {
        msgElement.classList.remove('show');
    }, 3000);
}