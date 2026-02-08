# Download product images into assets/images
# Run this script from PowerShell inside e:\SAYMON

$images = @(
    @{url = 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'; name = 'product1.jpg'},
    @{url = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'; name = 'product2.jpg'},
    @{url = 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80'; name = 'product3.jpg'},
    @{url = 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80'; name = 'product4.jpg'},
    @{url = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80'; name = 'product5.jpg'},
    @{url = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'; name = 'product6.jpg'},
    @{url = 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80'; name = 'product7.jpg'},
    @{url = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'; name = 'product8.jpg'},
    @{url = 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'; name = 'product9.jpg'},
    @{url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'; name = 'product10.jpg'},
    @{url = 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'; name = 'product11.jpg'},
    @{url = 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'; name = 'product12.jpg'},
    @{url = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'; name = 'product13.jpg'},
    @{url = 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=800&q=80'; name = 'product14.jpg'},
    @{url = 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'; name = 'product15.jpg'}
)

$destDir = Join-Path -Path $PSScriptRoot -ChildPath '..\assets\images'
$destDir = (Resolve-Path $destDir).ProviderPath
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

foreach ($img in $images) {
    $out = Join-Path $destDir $img.name
    Write-Host "Downloading $($img.url) -> $out"
    try {
        Invoke-WebRequest -Uri $img.url -OutFile $out -UseBasicParsing -ErrorAction Stop
        Write-Host "  Saved $out"
    } catch {
        Write-Host "  Failed to download $($img.url): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host 'Finished downloading images. Open START.html or shop.html to verify.' -ForegroundColor Green
