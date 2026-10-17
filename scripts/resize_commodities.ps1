Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\ASUS\Desktop\spike\public\market-cards\commodities-real.jpg"
$tmpPath = "C:\Users\ASUS\Desktop\spike\public\market-cards\commodities-real-temp.jpg"

$fileBytes = [System.IO.File]::ReadAllBytes($srcPath)
$ms = New-Object System.IO.MemoryStream($fileBytes, 0, $fileBytes.Length)
$img = [System.Drawing.Image]::FromStream($ms)

$newW = 1000
$newH = [int]($img.Height * ($newW / $img.Width))
$bmp = New-Object System.Drawing.Bitmap $newW, $newH
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.DrawImage($img, 0, 0, $newW, $newH)
$img.Dispose()
$ms.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

$bmp.Save($tmpPath, $codec, $encParams)
$bmp.Dispose()
$graph.Dispose()

Move-Item -Path $tmpPath -Destination $srcPath -Force
$finalSize = (Get-Item $srcPath).Length
Write-Host "Resized successfully to: $finalSize bytes"
