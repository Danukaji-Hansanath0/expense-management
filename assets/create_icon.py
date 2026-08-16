from PIL import Image, ImageDraw

# Create a 1024x1024 icon with a gradient background
size = 1024
img = Image.new('RGB', (size, size), color='#4F46E5')
draw = ImageDraw.Draw(img)

# Draw a simple circle in the center
center = size // 2
radius = size // 3
draw.ellipse([center - radius, center - radius, center + radius, center + radius], fill='#FFFFFF')

# Add text
font_size = 200
try:
    from PIL import ImageFont
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
except:
    font = ImageFont.load_default()

text = "FF"
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
text_x = center - text_width // 2
text_y = center - text_height // 2
draw.text((text_x, text_y), text, fill='#4F46E5', font=font)

img.save('/workspace/assets/icon.png')
print("Created icon.png")

# Create adaptive icon (same as icon for simplicity)
img.save('/workspace/assets/adaptive-icon.png')
print("Created adaptive-icon.png")

# Create favicon (smaller version)
favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
favicon.save('/workspace/assets/favicon.png')
print("Created favicon.png")
