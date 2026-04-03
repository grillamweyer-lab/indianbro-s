import sys
from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    # 1. find bounding box of non-white
    # We'll treat anything very close to white as white
    min_x, min_y, max_x, max_y = img.width, img.height, 0, 0
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = data[y * img.width + x]
            if a > 0 and (r < 240 or g < 240 or b < 240):
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y

    # Crop to bounding box
    margin = 5
    min_x = max(0, min_x - margin)
    min_y = max(0, min_y - margin)
    max_x = min(img.width, max_x + margin)
    max_y = min(img.height, max_y + margin)
    
    # Check if bounds are valid
    if min_x > max_x or min_y > max_y:
        print("Error: Could not detect badge, image might be fully white/blank.")
        return

    img = img.crop((min_x, min_y, max_x, max_y))
    
    # 2. Make white pixels transparent and apply slight anti-aliasing edge softening
    data = img.getdata()
    new_data = []
    for item in data:
        # replace white pixels with transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    
    img.save(output_path, "PNG")
    print(f"Cropped to {img.width}x{img.height} and made transparent.")

process_image("images/halal-badge.png", "images/halal-badge-clean.png")
