// دمج لوحة التحكم كـ Modal قابل للظهور من أي صفحة

// CSS للـ Modal
const adminModalStyles = `
<style>
    .admin-modal {
        display: none;
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        overflow-y: auto;
        direction: rtl;
    }

    .admin-modal.show {
        display: block;
    }

    .admin-modal-content {
        background: white;
        margin: 30px auto;
        padding: 0;
        border-radius: 10px;
        width: 95%;
        max-width: 1200px;
        box-shadow: 0 10px 50px rgba(0,0,0,0.3);
    }

    .admin-modal-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .admin-modal-header h2 {
        margin: 0;
    }

    .admin-modal-close {
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: white;
    }

    .admin-modal-close:hover {
        color: #ccc;
    }

    .admin-modal-body {
        padding: 30px;
        max-height: calc(100vh - 150px);
        overflow-y: auto;
    }

    .admin-form-section {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 30px;
    }

    .admin-form-section h3 {
        color: #667eea;
        margin-top: 0;
    }

    .admin-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 2px solid #ddd;
    }

    .admin-tab-btn {
        padding: 12px 20px;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: bold;
        color: #666;
        border-bottom: 3px solid transparent;
        transition: all 0.3s;
    }

    .admin-tab-btn.active {
        color: #667eea;
        border-bottom-color: #667eea;
    }

    .admin-tab-content {
        display: none;
    }

    .admin-tab-content.active {
        display: block;
    }

    @media (max-width: 768px) {
        .admin-modal-content {
            width: 100%;
            margin: 0;
            border-radius: 0;
        }

        .admin-modal-body {
            padding: 15px;
        }

        .admin-form-section {
            padding: 15px;
        }
    }
</style>
`;

// HTML للـ Modal
const adminModalHTML = `
<div class="admin-modal" id="admin-modal">
    <div class="admin-modal-content">
        <div class="admin-modal-header">
            <h2>⚙️ لوحة تحكم الآدمن</h2>
            <span class="admin-modal-close" onclick="closeAdminModal()">&times;</span>
        </div>
        <div class="admin-modal-body">
            <div class="admin-tabs">
                <button class="admin-tab-btn active" onclick="switchAdminTab('add-product')">➕ إضافة منتج</button>
                <button class="admin-tab-btn" onclick="switchAdminTab('products-list')">📋 قائمة المنتجات</button>
            </div>

            <!-- Tab 1: إضافة منتج -->
            <div class="admin-tab-content active" id="add-product-tab">
                <div class="admin-form-section">
                    <h3 id="form-title">➕ إضافة منتج جديد</h3>
                    <div class="success-message" id="success-msg"></div>
                    <form id="admin-product-form">
                        <div class="form-group">
                            <label>اسم المنتج:</label>
                            <input type="text" id="admin-product-name" placeholder="مثال: كنبة فاخرة" required>
                        </div>
                        <div class="form-group">
                            <label>التصنيف:</label>
                            <select id="admin-product-category" required>
                                <option>كنب</option>
                                <option>طاولات</option>
                                <option>كراسي</option>
                                <option>غرم النوم</option>
                                <option>خزائن</option>
                                <option>ديكور</option>
                                <option>إضاءة</option>
                                <option>سجاد</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>السعر (ج.م):</label>
                            <input type="number" id="admin-product-price" placeholder="مثال: 2500" min="0" step="50" required>
                        </div>
                        <div class="form-group">
                            <label>الوصف:</label>
                            <textarea id="admin-product-description" placeholder="وصف المنتج..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>رابط الصورة:</label>
                            <input type="text" id="admin-product-image" placeholder="مثال: https://..." required>
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="btn-save">💾 حفظ المنتج</button>
                            <button type="button" class="btn-cancel" onclick="resetAdminForm()">❌ إلغاء</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Tab 2: قائمة المنتجات -->
            <div class="admin-tab-content" id="products-list-tab">
                <div class="admin-products-list" id="admin-products-list-modal">
                    <!-- سيتم عرض المنتجات هنا -->
                </div>
            </div>
        </div>
    </div>
</div>
`;

// كائن عام لإدارة لوحة التحكم
const AdminPanel = {
    allProducts: [],
    editingId: null,
    apiUrl: 'data/products.json',

    init() {
        // إضافة HTML و CSS للصفحة
        document.head.insertAdjacentHTML('beforeend', adminModalStyles);
        document.body.insertAdjacentHTML('beforeend', adminModalHTML);

        // تحديث رابط الإدارة في القائمة الرئيسية
        const adminLinks = document.querySelectorAll('a[href="admin.html"]');
        adminLinks.forEach(link => {
            link.href = '#';
            link.onclick = (e) => {
                e.preventDefault();
                this.openModal();
            };
        });

        // تحميل المنتجات والإستماع للـ Form
        this.loadProducts();
        document.getElementById('admin-product-form')?.addEventListener('submit', (e) => this.saveProduct(e));

        // إغلاق الـ Modal عند الضغط على الخلفية
        document.getElementById('admin-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'admin-modal') {
                this.closeModal();
            }
        });
    },

    openModal() {
        document.getElementById('admin-modal').classList.add('show');
        this.loadProducts();
    },

    closeModal() {
        document.getElementById('admin-modal').classList.remove('show');
        // تحديث جميع الصفحات بعد إغلاق لوحة التحكم
        this.refreshAllPages();
    },

    refreshAllPages() {
        // إرسال حدث لتحديث البيانات في جميع الصفحات
        const event = new CustomEvent('productsUpdated');
        window.dispatchEvent(event);
    },

    loadProducts() {
        fetch(this.apiUrl)
            .then(res => res.json())
            .then(products => {
                this.allProducts = products;
                this.displayProducts();
            })
            .catch(err => {
                console.error(err);
            });
    },

    displayProducts() {
        const list = document.getElementById('admin-products-list-modal');
        if (!list) return;

        list.innerHTML = '';

        this.allProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-edit-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <div class="product-edit-info">
                    <h3>${product.name}</h3>
                    <p style="font-size: 0.9em; color: #666;">${product.category}</p>
                    <p style="font-weight: bold; color: #667eea;">${product.price} ج.م</p>
                    <div class="product-edit-buttons">
                        <button class="btn-edit" onclick="AdminPanel.editProduct('${product.id}')">✏️ تعديل</button>
                        <button class="btn-delete" onclick="AdminPanel.deleteProduct('${product.id}')">🗑️ حذف</button>
                    </div>
                </div>
            `;
            list.appendChild(card);
        });
    },

    editProduct(id) {
        const product = this.allProducts.find(p => p.id === id);
        if (!product) return;

        this.editingId = id;
        document.getElementById('form-title').textContent = '✏️ تعديل منتج';
        document.getElementById('admin-product-name').value = product.name;
        document.getElementById('admin-product-category').value = product.category;
        document.getElementById('admin-product-price').value = product.price;
        document.getElementById('admin-product-description').value = product.description || '';
        document.getElementById('admin-product-image').value = product.image;

        // الذهاب إلى tab الإضافة/التعديل
        this.switchTab('add-product');
    },

    switchTab(tabName) {
        document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));

        document.getElementById(tabName + '-tab')?.classList.add('active');
        document.querySelector(`[onclick="switchAdminTab('${tabName}')"]`)?.classList.add('active');
    },

    saveProduct(e) {
        e.preventDefault();

        const name = document.getElementById('admin-product-name').value.trim();
        const category = document.getElementById('admin-product-category').value;
        const price = parseFloat(document.getElementById('admin-product-price').value);
        const description = document.getElementById('admin-product-description').value.trim();
        const image = document.getElementById('admin-product-image').value.trim();

        if (!name || !category || !price || !image) {
            this.showMessage('❌ الرجاء ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        const productData = { name, category, price, description, image };

        if (this.editingId) {
            productData.id = this.editingId;
            fetch(this.apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.showMessage('✅ تم تحديث المنتج بنجاح', 'success');
                        this.editingId = null;
                        this.loadProducts();
                        this.resetForm();
                        this.refreshAllPages();
                    } else {
                        this.showMessage('❌ ' + (data.error || 'فشل التحديث'), 'error');
                    }
                })
                .catch(err => {
                    console.error('خطأ:', err);
                    this.showMessage('❌ خطأ في الاتصال بالسيرفر', 'error');
                });
        } else {
            fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.showMessage('✅ تم إضافة منتج جديد بنجاح', 'success');
                        this.loadProducts();
                        this.resetForm();
                        this.refreshAllPages();
                    } else {
                        this.showMessage('❌ ' + (data.error || 'فشلت الإضافة'), 'error');
                    }
                })
                .catch(err => {
                    console.error('خطأ:', err);
                    this.showMessage('❌ خطأ في الاتصال بالسيرفر', 'error');
                });
        }
    },

    deleteProduct(id) {
        const product = this.allProducts.find(p => p.id === id);
        if (!product) return;

        if (confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
            fetch(this.apiUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.showMessage(`✅ تم حذف المنتج "${product.name}"`, 'success');
                        this.loadProducts();
                        this.refreshAllPages();
                    } else {
                        this.showMessage('❌ ' + (data.error || 'فشل الحذف'), 'error');
                    }
                })
                .catch(err => {
                    console.error('خطأ:', err);
                    this.showMessage('❌ خطأ في الاتصال بالسيرفر', 'error');
                });
        }
    },

    resetForm() {
        document.getElementById('admin-product-form')?.reset();
        document.getElementById('form-title').textContent = '➕ إضافة منتج جديد';
        this.editingId = null;
    },

    showMessage(message, type = 'success') {
        const msgElement = document.getElementById('success-msg');
        if (!msgElement) return;
        msgElement.textContent = message;
        msgElement.style.background = type === 'success' ? '#4caf50' : '#f44336';
        msgElement.classList.add('show');

        setTimeout(() => {
            msgElement.classList.remove('show');
        }, 3000);
    }
};

// دوال عامة للـ Global Scope
function openAdminModal() {
    AdminPanel.openModal();
}

function closeAdminModal() {
    AdminPanel.closeModal();
}

function switchAdminTab(tabName) {
    AdminPanel.switchTab(tabName);
}

function resetAdminForm() {
    AdminPanel.resetForm();
}

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});
