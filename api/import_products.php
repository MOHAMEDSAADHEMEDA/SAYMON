<?php
// api/import_products.php
// Accepts POST JSON array of products and inserts into DB (or appends to data/products.json)
header('Content-Type: application/json; charset=utf-8');
// Try to use config.php if available
$useDb = false;
if (file_exists(__DIR__ . '/../config.php')) {
    require_once __DIR__ . '/../config.php';
    if (isset($conn) && $conn instanceof mysqli) {
        $useDb = true;
    }
}

$input = file_get_contents('php://input');
if (!$input) {
    echo json_encode(['success' => false, 'error' => 'no_input']);
    exit;
}

$data = json_decode($input, true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'invalid_json']);
    exit;
}

$items = is_array($data) ? $data : [$data];
$results = [];

if ($useDb) {
    $stmt = $conn->prepare("INSERT INTO products (name, category, price, description, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
    if (!$stmt) {
        echo json_encode(['success' => false, 'error' => 'db_prepare_failed', 'details' => $conn->error]);
        exit;
    }

    foreach ($items as $it) {
        $name = isset($it['name']) ? $it['name'] : '';
        $category = isset($it['category']) ? $it['category'] : '';
        $price = isset($it['price']) ? floatval($it['price']) : 0;
        $description = isset($it['description']) ? $it['description'] : '';
        $image = isset($it['image']) ? $it['image'] : '';

        $stmt->bind_param('ssdss', $name, $category, $price, $description, $image);
        $ok = $stmt->execute();
        $results[] = ['item' => $it, 'inserted' => $ok, 'id' => $conn->insert_id];
    }

    $stmt->close();
    echo json_encode(['success' => true, 'imported' => count($results), 'results' => $results]);
    exit;
} else {
    // Append to data/products.json if writable
    $file = __DIR__ . '/../data/products.json';
    if (!is_writable(dirname($file)) && !is_writable($file)) {
        // try to set permissive error
        echo json_encode(['success' => false, 'error' => 'no_write_permission']);
        exit;
    }

    $existing = [];
    if (file_exists($file)) {
        $txt = file_get_contents($file);
        $existing = json_decode($txt, true) ?: [];
    }

    foreach ($items as $it) {
        // assign a new id (max id + 1) if numeric ids used
        $maxId = 0;
        foreach ($existing as $e) { if (isset($e['id']) && is_numeric($e['id'])) $maxId = max($maxId, intval($e['id'])); }
        $newId = $maxId + 1;
        $it['id'] = $newId;
        $existing[] = $it;
        $results[] = ['item' => $it, 'inserted' => true, 'id' => $newId];
    }

    $w = file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    if ($w === false) {
        echo json_encode(['success' => false, 'error' => 'write_failed']);
    } else {
        echo json_encode(['success' => true, 'imported' => count($results), 'results' => $results]);
    }
    exit;
}

?>
