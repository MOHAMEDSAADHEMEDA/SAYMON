#!/bin/bash
# اختبار شامل للموقع

echo "🧪 اختبار منصة الأثاث والديكور"
echo "=================================="
echo ""

# فحص الملفات الأساسية
echo "✓ فحص ملفات HTML:"
test -f index.html && echo "  ✅ index.html" || echo "  ❌ index.html"
test -f about.html && echo "  ✅ about.html" || echo "  ❌ about.html"
test -f shop.html && echo "  ✅ shop.html" || echo "  ❌ shop.html"
test -f orders.html && echo "  ✅ orders.html" || echo "  ❌ orders.html"
test -f contact.html && echo "  ✅ contact.html" || echo "  ❌ contact.html"
test -f admin.html && echo "  ✅ admin.html" || echo "  ❌ admin.html"
test -f START.html && echo "  ✅ START.html" || echo "  ❌ START.html"

echo ""
echo "✓ فحص ملفات CSS:"
test -f css/style.css && echo "  ✅ css/style.css" || echo "  ❌ css/style.css"

echo ""
echo "✓ فحص ملفات JavaScript:"
test -f js/main.js && echo "  ✅ js/main.js" || echo "  ❌ js/main.js"
test -f js/shop.js && echo "  ✅ js/shop.js" || echo "  ❌ js/shop.js"
test -f js/admin.js && echo "  ✅ js/admin.js" || echo "  ❌ js/admin.js"
test -f js/auth.js && echo "  ✅ js/auth.js" || echo "  ❌ js/auth.js"

echo ""
echo "✓ فحص البيانات:"
test -f data/products.json && echo "  ✅ data/products.json" || echo "  ❌ data/products.json"

echo ""
echo "✓ فحص الأيقونات:"
test -f assets/icons/search.svg && echo "  ✅ assets/icons/search.svg" || echo "  ❌ assets/icons/search.svg"
test -f assets/icons/cart.svg && echo "  ✅ assets/icons/cart.svg" || echo "  ❌ assets/icons/cart.svg"
test -f assets/icons/user.svg && echo "  ✅ assets/icons/user.svg" || echo "  ❌ assets/icons/user.svg"

echo ""
echo "✓ فحص التوثيق:"
test -f README.md && echo "  ✅ README.md" || echo "  ❌ README.md"
test -f INSTRUCTIONS.md && echo "  ✅ INSTRUCTIONS.md" || echo "  ❌ INSTRUCTIONS.md"
test -f PROJECT_SUMMARY.md && echo "  ✅ PROJECT_SUMMARY.md" || echo "  ❌ PROJECT_SUMMARY.md"

echo ""
echo "✓ فحص المجلدات:"
test -d css && echo "  ✅ مجلد css/" || echo "  ❌ مجلد css/"
test -d js && echo "  ✅ مجلد js/" || echo "  ❌ مجلد js/"
test -d assets && echo "  ✅ مجلد assets/" || echo "  ❌ مجلد assets/"
test -d data && echo "  ✅ مجلد data/" || echo "  ❌ مجلد data/"

echo ""
echo "=================================="
echo "🎉 الاختبار مكتمل!"
echo ""
echo "💡 نصيحة: افتح START.html في المتصفح للبدء"