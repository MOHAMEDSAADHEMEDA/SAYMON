// نظام التحقُّق والحماية للمنصة
const ADMIN_PASSWORD = 'admin2024'; // كلمة المرور الإدارية

// دالة للتحقق من وجود كلمة مرور مخزنة في الجلسة
function checkAdminAccess() {
    const adminToken = sessionStorage.getItem('adminToken');
    return adminToken === ADMIN_PASSWORD;
}

// دالة لطلب كلمة المرور
function requestAdminPassword() {
    const password = prompt('🔐 هذه منطقة محمية!\n\nأدخل كلمة المرور للوصول:');
    
    if (password === null) {
        return false;
    }
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminToken', password);
        return true;
    } else {
        alert('❌ كلمة المرور غير صحيحة!');
        return false;
    }
}

// دالة للتحقق من الوصول وإعادة التوجيه إذا لم تكن مصرحة
function protectPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['admin.html', 'cart.html', 'orders.html'];
    
    if (protectedPages.includes(currentPage)) {
        if (!checkAdminAccess()) {
            if (requestAdminPassword()) {
                location.reload();
            } else {
                window.location.href = 'index.html';
            }
        }
    }
}

// التحقق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', protectPage);

// دالة لتسجيل الخروج
function logoutAdmin() {
    sessionStorage.removeItem('adminToken');
    alert('✅ تم تسجيل الخروج بنجاح');
    window.location.href = 'index.html';
}