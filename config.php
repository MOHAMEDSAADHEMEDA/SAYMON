<?php
// ==================== إعدادات قاعدة البيانات ====================
// Database Configuration

header('Content-Type: application/json; charset=utf-8');

// معايير الاتصال
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'saymon_db');
define('DB_PORT', 3306);

// إنشاء اتصال بدون قاعدة بيانات (لإنشاء DB إن لم تكن موجودة)
$connNoDb = new mysqli(DB_HOST, DB_USER, DB_PASS, '', DB_PORT);

// التحقق من الاتصال
if ($connNoDb->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection error: ' . $connNoDb->connect_error]);
    exit();
}

// إنشاء قاعدة البيانات إذا لم تكن موجودة
$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if (!$connNoDb->query($sql)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create database: ' . $connNoDb->error]);
    exit();
}

$connNoDb->close();

// الاتصال بقاعدة البيانات الفعلية
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// التحقق من الاتصال
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// تعيين الترميز
$conn->set_charset("utf8mb4");

// دالة لتنفيذ الاستعلامات بأمان
function executeQuery($conn, $sql, $types = '', $params = []) {
    if ($types && $params) {
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            return ['error' => 'Prepare failed: ' . $conn->error];
        }
        $stmt->bind_param($types, ...$params);
        if (!$stmt->execute()) {
            return ['error' => 'Execute failed: ' . $stmt->error];
        }
        return $stmt;
    } else {
        $result = $conn->query($sql);
        if (!$result) {
            return ['error' => 'Query failed: ' . $conn->error];
        }
        return $result;
    }
}

// تجاهل مشاكل SSL (للبيئات المحلية)
if (function_exists('mysqli_report')) {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

// سماح بـ CORS (للطلبات من الجهاز المحلي)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
