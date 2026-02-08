# Download furniture images from Unsplash
$imageUrls = @(
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',  # sofa
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80', # armchair
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', # furniture set
    'https://images.unsplash.com/photo-1537696362174-e5a1c5d4d0fe?w=800&q=80', # luxury
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80', # modern
    'https://images.unsplash.com/photo-1567538096051-b6643b5ad433?w=800&q=80', # chair
    'https://images.unsplash.com/photo-1576910343657-8f23e4c1b345?w=800&q=80', # desk
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80', # table
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', # shelves
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', # lamp
    'https://images.unsplash.com/photo-1599048993-b63adad41fb9?w=800&q=80', # carpet
    'https://images.unsplash.com/photo-1515214344390-5e4fc2c1eac0?w=800&q=80', # mirror
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', # cabinet
    'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800&q=80', # ottoman
    'https://images.unsplash.com/photo-1564078369132-72957b841b45?w=800&q=80', # dining table
    'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&q=80', # office chair
    'https://images.unsplash.com/photo-1578727154519-a90bfebb15e4?w=800&q=80', # accessories
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'   # living room
)

# Create assets/images directory if it doesn't exist
if (-not (Test-Path "assets\images")) {
    New-Item -ItemType Directory -Path "assets\images" | Out-Null
}

# Download images
for ($i = 0; $i -lt $imageUrls.Count; $i++) {
    $num = $i + 1
    $filename = "assets\images\product$num.jpg"
    
    # Skip if already exists
    if (Test-Path $filename) {
        Write-Host "Skipped product$num.jpg (already exists)"
        continue
    }
    
    try {
        Write-Host "Downloading product$num.jpg..."
        Invoke-WebRequest -Uri $imageUrls[$i] -OutFile $filename -UseBasicParsing
        $size = (Get-Item $filename).Length / 1KB
        Write-Host "Downloaded product$num.jpg ($([Math]::Round($size, 1)) KB)"
    }
    catch {
        Write-Host "Failed: product$num.jpg - $_"
    }
    
    Start-Sleep -Milliseconds 300
}

Write-Host "Download complete!"
