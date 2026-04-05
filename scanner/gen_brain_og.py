"""
gen_brain_og.py — One-time script to generate brain-og.png (1200x630) for OG meta tags.
Requires: pip install cairosvg pillow
"""
import sys, os
from pathlib import Path

ROOT = Path(__file__).parent.parent
SVG_IN  = ROOT / 'react-app' / 'public' / 'brain.svg'
PNG_OUT = ROOT / 'react-app' / 'public' / 'brain-og.png'

def draw_brain(draw, cx, cy, r):
    """Draw a neural network brain illustration using Pillow drawing primitives."""
    import math
    node_color   = (99, 102, 241)    # #6366F1
    center_color = (165, 180, 252)   # #A5B4FC
    line_color   = (99, 102, 241, 120)

    # Outer nodes (7 around perimeter)
    angles = [270, 321, 13, 65, 130, 194, 245]  # degrees
    outer = [(cx + int(r * 0.85 * math.cos(math.radians(a))),
              cy + int(r * 0.85 * math.sin(math.radians(a)))) for a in angles]

    # Mid-layer (4 inner nodes)
    mid_angles = [315, 45, 135, 225]
    mid = [(cx + int(r * 0.45 * math.cos(math.radians(a))),
            cy + int(r * 0.45 * math.sin(math.radians(a)))) for a in mid_angles]

    # Draw connections outer ring
    for i in range(len(outer)):
        draw.line([outer[i], outer[(i+1) % len(outer)]], fill=line_color, width=2)
    # Center to outer
    for o in outer:
        draw.line([(cx, cy), o], fill=line_color, width=2)
    # Mid connections
    for i in range(len(mid)):
        draw.line([mid[i], mid[(i+1) % len(mid)]], fill=line_color, width=2)
    for m in mid:
        draw.line([(cx, cy), m], fill=line_color, width=2)
    # Outer to mid
    for i, o in enumerate(outer):
        draw.line([o, mid[i % len(mid)]], fill=line_color, width=2)

    # Draw mid nodes
    nr = max(4, r // 14)
    for m in mid:
        draw.ellipse([m[0]-nr, m[1]-nr, m[0]+nr, m[1]+nr], fill=(129, 140, 248))

    # Draw outer nodes
    nr2 = max(5, r // 11)
    for o in outer:
        draw.ellipse([o[0]-nr2, o[1]-nr2, o[0]+nr2, o[1]+nr2], fill=node_color)

    # Center node
    cr = max(7, r // 7)
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=center_color)
    ci = max(4, r // 12)
    draw.ellipse([cx-ci, cy-ci, cx+ci, cy+ci], fill=(238, 242, 255))


def generate():
    try:
        from PIL import Image, ImageDraw, ImageFont

        W, H = 1200, 630
        bg = Image.new('RGB', (W, H), (15, 15, 35))
        draw = ImageDraw.Draw(bg, 'RGBA')

        # Draw brain centered
        draw_brain(draw, W // 2, H // 2, 230)

        # Title text (top area)
        try:
            font_title = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 52)
            font_sub   = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 30)
        except:
            font_title = ImageFont.load_default(size=52)
            font_sub   = ImageFont.load_default(size=30)

        title    = 'Evolution Schematic SG'
        subtitle = 'Claude System Interactive Map'

        # Shadow + text for title
        draw.text((W//2 + 2, 52), title, fill=(30, 30, 60), font=font_title, anchor='mm')
        draw.text((W//2,     50), title, fill=(165, 180, 252), font=font_title, anchor='mm')
        draw.text((W//2,    100), subtitle, fill=(99, 102, 241), font=font_sub, anchor='mm')

        bg.save(str(PNG_OUT), 'PNG')
        print(f'✓ Saved: {PNG_OUT}')

    except ImportError as e:
        print(f'Missing dependency: {e}')
        print('Run: pip install pillow')
        sys.exit(1)

if __name__ == '__main__':
    generate()
