import os
from PIL import Image, ImageDraw, ImageFont

def generate_icons():
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "icons"))
    os.makedirs(output_dir, exist_ok=True)
    
    sizes = [(192, 192, "icon-192x192.png"), (512, 512, "icon-512x512.png"), (512, 512, "icon-512x512-maskable.png")]
    
    for w, h, filename in sizes:
        # Create image with brand background
        img = Image.new("RGBA", (w, h), (139, 30, 30, 255))
        draw = ImageDraw.Draw(img)
        
        # Outer golden ring
        padding = int(w * 0.05)
        draw.ellipse([padding, padding, w - padding, h - padding], outline=(229, 184, 38, 255), width=int(w * 0.03))
        
        # Inner decorative ring
        pad2 = int(w * 0.08)
        draw.ellipse([pad2, pad2, w - pad2, h - pad2], outline=(250, 240, 195, 200), width=int(w * 0.01))
        
        # Central Kadai / Bowl shape
        cx, cy = w // 2, h // 2
        bowl_w = int(w * 0.55)
        bowl_h = int(h * 0.28)
        draw.chord([cx - bowl_w//2, cy - bowl_h//4, cx + bowl_w//2, cy + bowl_h], 0, 180, fill=(229, 184, 38, 255), outline=(255, 253, 249, 255), width=max(2, int(w*0.015)))
        
        # Base
        draw.rectangle([cx - int(w*0.12), cy + int(h*0.2), cx + int(w*0.12), cy + int(h*0.25)], fill=(201, 152, 24, 255))
        
        # Golden crunchy dots above bowl
        for offset_x, offset_y in [(-int(w*0.12), -int(h*0.08)), (0, -int(h*0.14)), (int(w*0.12), -int(h*0.08))]:
            r = int(w * 0.04)
            draw.ellipse([cx + offset_x - r, cy + offset_y - r, cx + offset_x + r, cy + offset_y + r], fill=(250, 240, 195, 255))
        
        filepath = os.path.join(output_dir, filename)
        img.save(filepath, "PNG")
        print(f"Generated {filepath}")

if __name__ == "__main__":
    generate_icons()

