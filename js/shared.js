// ملف موحد لجميع الدوال المشتركة في المنصة

// ========================================
// إدارة السلة (Shared Cart Management)
// ========================================

const CartManager = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    addToCart(product) {
        const cart = this.getCart();
        cart.push(product);
        this.saveCart(cart);
    },

    removeFromCart(index) {
        const cart = this.getCart();
        cart.splice(index, 1);
        this.saveCart(cart);
    },

    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartCount();
    },

    getCartCount() {
        return this.getCart().length;
    },

    updateCartCount() {
        const count = this.getCartCount();
        const cartBadges = document.querySelectorAll('.cart-count');
        cartBadges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'inline';
            } else {
                badge.style.display = 'none';
            }
        });
    }
};

// ========================================
// إضافة المنتج للسلة مع الحذف
// ========================================

function addToCart(id, name) {
    if (confirm(`هل تريد إضافة "${name}" للسلة؟\n(سيتم حذف المنتج من المتجر بعد الإضافة)`)) {
        // إضافة للسلة
        CartManager.addToCart({ 
            id, 
            name, 
            addedAt: new Date().toISOString() 
        });
        
        alert(`✅ تمت إضافة "${name}" إلى السلة بنجاح!`);
        
        // حذف من السيرفر
        fetch('api/products.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // تحديث جميع الصفحات
                    window.dispatchEvent(new CustomEvent('productsUpdated'));
                } else {
                    alert('⚠️ خطأ في حذف المنتج');
                }
            })
            .catch(err => {
                console.error('خطأ:', err);
                alert('❌ خطأ في الاتصال بالسيرفر');
            });
    }
}

// ========================================
// إدارة الملاحة والأيقونات
// ========================================

const NavigationManager = {
    init() {
        document.querySelectorAll('.icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const alt = icon.alt;
                
                if (alt === 'بحث') {
                    const query = prompt('🔍 ابحث عن منتج:');
                    if (query) alert(`🔍 البحث عن: "${query}" (قيد التطوير)`);
                } else if (alt === 'سلة المشتريات') {
                    window.location.href = 'cart.html';
                } else if (alt === 'البروفايل') {
                    alert('👤 ميزة البروفايل (قيد التطوير)');
                }
            });
        });
    }
};

// ========================================
// إدارة المنتجات
// ========================================

const ProductManager = {
    API_URL: 'api/products.php',

    fetch() {
        return fetch(this.API_URL)
            .then(res => {
                if (!res.ok) throw new Error('فشل تحميل المنتجات');
                return res.json();
            })
            .catch(err => {
                console.error('خطأ:', err);
                throw err;
            });
    },

    delete(id) {
        return fetch(this.API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .catch(err => {
                console.error('خطأ:', err);
                throw err;
            });
    }
};

// ========================================
// تهيئة شاملة عند تحميل الصفحة
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الملاحة
    NavigationManager.init();
    
    // تحديث عداد السلة
    CartManager.updateCartCount();
    
    // إضافة حدث لتحديث العداد عند تغيير السلة
    window.addEventListener('cartUpdated', () => {
        CartManager.updateCartCount();
    });
    
    // استمع إلى تحديثات المنتجات
    window.addEventListener('productsUpdated', () => {
        CartManager.updateCartCount();
    });
});

// ========================================
// دعم البيئات المختلفة
// ========================================

function showMessage(message, type = 'success') {
    const msgElement = document.getElementById('success-msg');
    if (!msgElement) {
        console.log(message);
        return;
    }
    msgElement.textContent = message;
    msgElement.style.background = type === 'success' ? '#4caf50' : '#f44336';
    msgElement.classList.add('show');
    setTimeout(() => msgElement.classList.remove('show'), 3000);
}
