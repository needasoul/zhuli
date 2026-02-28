# 生成发现图标 (Discover icon)
$bmp = New-Object System.Drawing.Bitmap(48, 48)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)

# 绘制灰色圆圈 (未选中状态)
$penGray = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160,160,160), 3)
$g.DrawEllipse($penGray, 6, 6, 36, 36)

# 绘制中心点
$brushGray = [System.Drawing.Brushes]::Gray
$g.FillEllipse($brushGray, 18, 18, 12, 12)

# 绘制十字线
$g.DrawLine($penGray, 24, 6, 24, 14)
$g.DrawLine($penGray, 24, 34, 24, 42)
$g.DrawLine($penGray, 6, 24, 14, 24)
$g.DrawLine($penGray, 34, 24, 42, 24)

# 保存
$bmp.Save("d:\phpstudy_pro\WWW\aa.ab\uniapp\static\tabbar\discover.png")
$g.Dispose()
$bmp.Dispose()

# 生成选中状态的图标 (蓝色)
$bmp2 = New-Object System.Drawing.Bitmap(48, 48)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.Clear([System.Drawing.Color]::Transparent)

# 绘制蓝色圆圈
$penBlue = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(37,185,239), 3)
$g2.DrawEllipse($penBlue, 6, 6, 36, 36)

# 绘制蓝色中心点
$brushBlue = [System.Drawing.Brushes]::DeepSkyBlue
$g2.FillEllipse($brushBlue, 18, 18, 12, 12)

# 绘制蓝色十字线
$g2.DrawLine($penBlue, 24, 6, 24, 14)
$g2.DrawLine($penBlue, 24, 34, 24, 42)
$g2.DrawLine($penBlue, 6, 24, 14, 24)
$g2.DrawLine($penBlue, 34, 24, 42, 24)

# 保存
$bmp2.Save("d:\phpstudy_pro\WWW\aa.ab\uniapp\static\tabbar\discover_select.png")
$g2.Dispose()
$bmp2.Dispose()

Write-Host "Discover icons created successfully!"
