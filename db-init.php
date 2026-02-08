<?php
// ==================== إنشاء قاعدة البيانات والجداول ====================
// Database Initialization

require_once 'config.php';

// إنشاء جدول المنتجات
$createProductsTable = "
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

if ($conn->query($createProductsTable) === TRUE) {
    echo "✅ جدول المنتجات تم إنشاؤه أو موجود بالفعل<br>";
} else {
    echo "❌ خطأ في إنشاء جدول المنتجات: " . $conn->error . "<br>";
    exit();
}

// إنشاء جدول الطلبات
$createOrdersTable = "
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

if ($conn->query($createOrdersTable) === TRUE) {
    echo "✅ جدول الطلبات تم إنشاؤه أو موجود بالفعل<br>";
} else {
    echo "❌ خطأ في إنشاء جدول الطلبات: " . $conn->error . "<br>";
    exit();
}

// إنشاء جدول الإشعارات
$createNotificationsTable = "
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

if ($conn->query($createNotificationsTable) === TRUE) {
    echo "✅ جدول الإشعارات تم إنشاؤه أو موجود بالفعل<br>";
} else {
    echo "❌ خطأ في إنشاء جدول الإشعارات: " . $conn->error . "<br>";
    exit();
}

// التحقق من وجود منتجات وإضافة البيانات الابتدائية
$checkProducts = $conn->query("SELECT COUNT(*) as count FROM products");
$row = $checkProducts->fetch_assoc();

if ($row['count'] == 0) {
    // بيانات المنتجات الابتدائية
    $products = [
        ['كنبة فاخرة جلدية', 'كنب', 2500, 'كنبة فاخرة من الجلد الحقيقي بتصميم عصري وألوان محايدة', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
        ['كنبة زاوية جديدة', 'كنب', 3500, 'كنبة زاوية واسعة مريحة مع وسائد قابلة للفصل', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400'],
        ['طاولة قهوة خشب صلب', 'طاولات', 650, 'طاولة قهوة برّاقة من الخشب الصلب بتصميم مودرن', 'https://images.unsplash.com/photo-1532372576663-26caef0a20a7?w=400'],
        ['طاولة طعام بيضاء', 'طاولات', 1200, 'طاولة طعام بيضاء تسع 6 أشخاص مع سطح قوي', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400'],
        ['كرسي جلدي مودرن', 'كراسي', 850, 'كرسي جلدي برّاق مع دعم أسفل الظهر', 'https://images.unsplash.com/photo-1567538096051-b6643b5ad433?w=400'],
        ['كراسي طعام جلدية', 'كراسي', 450, 'كرسي طعام من الجلد المصنوع يدويّاً', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400'],
        ['سرير ملكي فاخر', 'غرف نوم', 3200, 'سرير ملكي مع إطار خشبي وتكييفات كهربائية', 'https://images.unsplash.com/photo-1540932239986-7f12a05cc9a1?w=400'],
        ['خزانة ملابس فاخرة', 'خزائن', 1800, 'خزانة ملابس خشبية برّاقة بثلاث أدراج', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'],
        ['ديكور جداري معدني', 'ديكور', 280, 'قطعة ديكور جدارية من المعدن بتصميم عصري', 'https://images.unsplash.com/photo-1550858151-4e5e0ad0b35d?w=400'],
        ['مصباح أرضي ذهبي', 'إضاءة', 320, 'مصباح أرضي بإطار ذهبي وإضاءة دافئة', 'https://images.unsplash.com/photo-1565636192335-14f6c8d2ca38?w=400'],
        ['سجادة صوف طبيعي', 'ديكور', 580, 'سجادة صوف 100% طبيعي بألوان ناعمة', 'https://images.unsplash.com/photo-1579566346154-e5f6f57957b5?w=400'],
        ['رفوف عائمة خشبية', 'ديكور', 200, 'رفوف عائمة مصنوعة من الخشب الصلب', 'https://images.unsplash.com/photo-1574909988-e0aecc5e0e88?w=400'],
        ['مرآة ديكور كبيرة', 'ديكور', 380, 'مرآة ديكور جدارية بإطار معدني عصري', 'https://images.unsplash.com/photo-1572300927903-f3a3d8b6ea8d?w=400'],
        ['وسائد ديكور ملونة', 'ديكور', 150, 'مجموعة وسائد ديكور بألوان متنوعة ومريحة', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400'],
        ['ستائر أنيقة شفافة', 'ديكور', 320, 'ستائر شفافة بتصميم أنيق وخفيف', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'],
        ['كرسي ديكور عصري', 'كراسي', 1500, 'كرسي ديكور عصري بتصميم حديث', 'https://images.unsplash.com/photo-1567538096051-b6643b5ad433?w=400'],
        ['مقعد بوف مريح', 'كراسي', 880, 'مقعد بوف بحشوة طبيعية وتغطية قماشية', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400'],
        ['كرسي دوار مكتبي', 'كراسي', 920, 'كرسي دوار مكتبي بارتفاع قابل للتعديل', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400'],
        ['طاولة جانبية النحاس', 'طاولات', 420, 'طاولة جانبية صغيرة بإطار نحاسي', 'https://images.unsplash.com/photo-1532372576663-26caef0a20a7?w=400'],
    ];

    $insertedCount = 0;
    foreach ($products as $product) {
        $stmt = $conn->prepare("
            INSERT INTO products (name, category, price, description, image) 
            VALUES (?, ?, ?, ?, ?)
        ");
        if ($stmt) {
            $stmt->bind_param('ssdss', $product[0], $product[1], $product[2], $product[3], $product[4]);
            if ($stmt->execute()) {
                $insertedCount++;
            }
            $stmt->close();
        }
    }

    echo "✅ تم إضافة " . $insertedCount . " منتج ابتدائي<br>";
} else {
    echo "ℹ️ المنتجات موجودة بالفعل في قاعدة البيانات<br>";
}

echo "<hr>";
echo "✅ <strong>قاعدة البيانات جاهزة وآمنة للاستخدام!</strong><br>";
echo "المنصة الآن متصلة تماماً بقاعدة البيانات بدون أخطاء.";

$conn->close();
?>
