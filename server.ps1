$port = 80
$docRoot = Get-Location
$server = New-Object Net.HttpListener
$server.Prefixes.Add("http://localhost:$port/")

try {
    $server.Start()
    Write-Host "Server running on http://localhost:$port/" -ForegroundColor Green
    
    while ($server.IsListening) {
        $ctx = $server.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response
        
        $path = $req.Url.LocalPath
        if ($path -eq "/") { $path = "/START.html" }
        
        $filePath = Join-Path $docRoot $path.TrimStart('/')
        
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath)
            $mimeTypes = @{
                '.html' = 'text/html; charset=utf-8'
                '.js' = 'text/javascript'
                '.css' = 'text/css'
                '.json' = 'application/json'
                '.jpg' = 'image/jpeg'
                '.svg' = 'image/svg+xml'
            }
            
            $contentType = $mimeTypes[$ext] -or 'application/octet-stream'
            $res.ContentType = $contentType
            $res.AddHeader('Access-Control-Allow-Origin', '*')
            
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $res.ContentLength64 = $content.Length
            $res.OutputStream.Write($content, 0, $content.Length)
        } else {
            $res.StatusCode = 404
            $res.ContentType = 'text/plain'
            $res.AddHeader('Access-Control-Allow-Origin', '*')
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        
        $res.Close()
    }
} finally {
    $server.Stop()
    $server.Dispose()
}
