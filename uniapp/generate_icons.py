from PIL import Image, ImageDraw

# 创建发现图标 (Discover icon) - 未选中状态 (灰色)
img1 = Image.new('RGBA', (48, 48), (255, 255, 255, 0))
draw1 = ImageDraw.Draw(img1)

# 绘制灰色圆圈
draw1.ellipse([6, 6, 42, 42], outline=(160, 160, 160, 255), width=3)

# 绘制中心圆点
draw1.ellipse([18, 18, 30, 30], fill=(160, 160, 160, 255))

# 绘制十字线
draw1.line([(24, 6), (24, 14)], fill=(160, 160, 160, 255), width=3)
draw1.line([(24, 34), (24, 42)], fill=(160, 160, 160, 255), width=3)
draw1.line([(6, 24), (14, 24)], fill=(160, 160, 160, 255), width=3)
draw1.line([(34, 24), (42, 24)], fill=(160, 160, 160, 255), width=3)

# 保存
img1.save('d:/phpstudy_pro/WWW/aa.ab/uniapp/static/tabbar/discover.png')

# 创建选中状态的图标 (蓝色)
img2 = Image.new('RGBA', (48, 48), (255, 255, 255, 0))
draw2 = ImageDraw.Draw(img2)

# 绘制蓝色圆圈
draw2.ellipse([6, 6, 42, 42], outline=(37, 185, 239, 255), width=3)

# 绘制蓝色中心圆点
draw2.ellipse([18, 18, 30, 30], fill=(37, 185, 239, 255))

# 绘制蓝色十字线
draw2.line([(24, 6), (24, 14)], fill=(37, 185, 239, 255), width=3)
draw2.line([(24, 34), (24, 42)], fill=(37, 185, 239, 255), width=3)
draw2.line([(6, 24), (14, 24)], fill=(37, 185, 239, 255), width=3)
draw2.line([(34, 24), (42, 24)], fill=(37, 185, 239, 255), width=3)

# 保存
img2.save('d:/phpstudy_pro/WWW/aa.ab/uniapp/static/tabbar/discover_select.png')

# 创建发布图标 (Publish icon) - 未选中状态 (灰色)
img3 = Image.new('RGBA', (48, 48), (255, 255, 255, 0))
draw3 = ImageDraw.Draw(img3)

# 绘制灰色方框
draw3.rectangle([10, 10, 38, 38], outline=(160, 160, 160, 255), width=3)

# 绘制加号
draw3.line([(24, 16), (24, 32)], fill=(160, 160, 160, 255), width=3)
draw3.line([(16, 24), (32, 24)], fill=(160, 160, 160, 255), width=3)

# 保存
img3.save('d:/phpstudy_pro/WWW/aa.ab/uniapp/static/tabbar/publish.png')

# 创建选中状态的发布图标 (蓝色)
img4 = Image.new('RGBA', (48, 48), (255, 255, 255, 0))
draw4 = ImageDraw.Draw(img4)

# 绘制蓝色方框
draw4.rectangle([10, 10, 38, 38], outline=(37, 185, 239, 255), width=3)

# 绘制蓝色加号
draw4.line([(24, 16), (24, 32)], fill=(37, 185, 239, 255), width=3)
draw4.line([(16, 24), (32, 24)], fill=(37, 185, 239, 255), width=3)

# 保存
img4.save('d:/phpstudy_pro/WWW/aa.ab/uniapp/static/tabbar/publish_select.png')

print("All icons created successfully!")
