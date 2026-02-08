<?php
// ==================== API المنتجات - الاحترافي ====================
// Products API - Professional Edition

require_once '../config.php';

// معالجة طلبات مختلفة
$method = $_SERVER['REQUEST_METHOD'];
$request = isset($_GET['action']) ? $_GET['action'] : '';

// GET: جلب المنتجات
if ($method === 'GET') {
    handleGet($conn);
}
// POST: إضافة منتج جديد
elseif ($method === 'POST') {
    handlePost($conn);
}
// DELETE: حذف منتج
elseif ($method === 'DELETE') {
    handleDelete($conn);
}
// PUT: تحديث منتج
elseif ($method === 'PUT') {
    handlePut($conn);
}
else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();

// ================== دوال المعالجة ==================

function handleGet($conn) {
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 999;
    
    // استعلام مخصص حسب الفئة أو جميع المنتجات
    $sql = "SELECT id, name, category, price, description, image, created_at FROM products";
    
    if ($category) {
        $sql .= " WHERE category = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $category);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $sql .= " LIMIT ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $limit);
        $stmt->execute();
        $result = $stmt->get_result();
    }
    
    if (!$result) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $conn->error]);
        return;
    }
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'id' => (string)$row['id'],
            'name' => $row['name'],
            'category' => $row['category'],
            'price' => floatval($row['price']),
            'description' => $row['description'],
            'image' => $row['image']
        ];
    }
    
    http_response_code(200);
    echo json_encode($products);
    $stmt->close();
}

function handlePost($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // التحقق من البيانات المطلوبة
    if (!isset($input['name']) || !isset($input['price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields: name, price']);
        return;
    }
    
    $name = $input['name'];
    $category = $input['category'] ?? 'عام';
    $price = floatval($input['price']);
    $description = $input['description'] ?? '';
    $image = $input['image'] ?? 'https://via.placeholder.com/250x200?text=Product';
    
    // التحقق من صحة البيانات
    if (strlen($name) < 3 || strlen($name) > 255) {
        http_response_code(400);
        echo json_encode(['error' => 'Product name must be between 3 and 255 characters']);
        return;
    }
    
    if ($price <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Price must be greater than 0']);
        return;
    }
    
    // إدراج المنتج في قاعدة البيانات
    $stmt = $conn->prepare("
        INSERT INTO products (name, category, price, description, image) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $conn->error]);
        return;
    }
    
    $stmt->bind_param('ssdss', $name, $category, $price, $description, $image);
    
    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Product added successfully',
            'product' => [
                'id' => (string)$newId,
                'name' => $name,
                'category' => $category,
                'price' => $price,
                'description' => $description,
                'image' => $image
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to add product: ' . $stmt->error]);
    }
    
    $stmt->close();
}

function handleDelete($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing product id']);
        return;
    }
    
    $id = intval($input['id']);
    
    // التحقق من وجود المنتج
    $checkStmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $checkStmt->bind_param('i', $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        $checkStmt->close();
        return;
    }
    
    $checkStmt->close();
    
    // حذف المنتج
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product: ' . $stmt->error]);
    }
    
    $stmt->close();
}

function handlePut($conn) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing product id']);
        return;
    }
    
    $id = intval($input['id']);
    
    // التحقق من وجود المنتج
    $checkStmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $checkStmt->bind_param('i', $id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        $checkStmt->close();
        return;
    }
    
    $checkStmt->close();
    
    // تحديث البيانات المتوفرة فقط
    $updates = [];
    $params = [];
    $types = '';
    
    if (isset($input['name'])) {
        $updates[] = 'name = ?';
        $params[] = $input['name'];
        $types .= 's';
    }
    
    if (isset($input['price'])) {
        $updates[] = 'price = ?';
        $params[] = floatval($input['price']);
        $types .= 'd';
    }
    
    if (isset($input['category'])) {
        $updates[] = 'category = ?';
        $params[] = $input['category'];
        $types .= 's';
    }
    
    if (isset($input['description'])) {
        $updates[] = 'description = ?';
        $params[] = $input['description'];
        $types .= 's';
    }
    
    if (isset($input['image'])) {
        $updates[] = 'image = ?';
        $params[] = $input['image'];
        $types .= 's';
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        return;
    }
    
    $params[] = $id;
    $types .= 'i';
    
    $sql = "UPDATE products SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $conn->error]);
        return;
    }
    
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update product: ' . $stmt->error]);
    }
    
    $stmt->close();
}
?>

