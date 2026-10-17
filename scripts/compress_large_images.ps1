Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Recurse public\home-cards, public\showcases, public\articles, public\insights | Where-Object { $_.Length -gt 500000 -and ($_.Extension -eq ".jpg" -or $_.Extension -eq ".png") }

foreach ($f in $files) {
    try {
        $srcPath = $f.FullName
        $tmpPath = $srcPath + ".tmp"
        
        $fileBytes = [System.IO.File]::ReadAllBytes($srcPath)
        $ms = New-Object System.IO.MemoryStream($fileBytes, 0, $fileBytes.Length)
        $img = [System.Drawing.Image]::FromStream($ms)
        
        $maxW = 850
        if ($img.Width -gt $maxW) {
            $newW = $maxW
            $newH = [int]($img.Height * ($maxW / $img.Width))
        } else {
            $newW = $img.Width
            $newH = $img.Height
        }
        
        $bmp = New-Object System.Drawing.Bitmap $newW, $newH
        $graph = [System.Drawing.Graphics]::FromImage($bmp)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.DrawImage($img, 0, 0, $newW, $newH)
        $img.Dispose()
        $ms.Dispose()
        
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]80)
        
        $bmp.Save($tmpPath, $codec, $encParams)
        $bmp.Dispose()
        $graph.Dispose()
        
        Move-Item -Path $tmpPath -Destination $srcPath -Force
        $newSize = (Get-Item $srcPath).Length
        Write-Host "Compressed $($f.Name): from $([math]::Round($f.Length/1024)) KB to $([math]::Round($newSize/1024)) KB"
    } catch {
        Write-Host "Error compressing $($f.Name): $_"
    }
}
