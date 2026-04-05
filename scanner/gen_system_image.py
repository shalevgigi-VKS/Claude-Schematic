"""
gen_system_image.py — Generates a system overview image using Google Imagen 3.
Run manually: python scanner/gen_system_image.py
Requires: GEMINI_API_KEY as Windows environment variable.
Output: react-app/public/system-image.jpg (committed to git + deployed to Vercel)
"""
import os, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

from google import genai
from google.genai import types

PROMPT = """
A futuristic neural network brain visualization representing an AI orchestration system called "Claude SG".
Dark deep-space background, nearly black (#0f0f23).
Central large glowing brain sphere labeled "Claude SG" in bright purple (#6366F1) with pulsing aura.
Six satellite cluster nodes orbiting the center, each connected by glowing energy particle streams:
- Top-left: "סוכנים" (35 AI agents) — red/crimson glow (#EF4444), robot icon
- Top-right: "סקילים" (18 skills) — electric blue glow (#3B82F6), lightning bolt icon
- Right: "MCP" (15 servers) — emerald green glow (#10B981), server rack icon
- Bottom-right: "פרויקטים" (8 projects) — amber glow (#F59E0B), folder icon
- Bottom-left: "Hooks" (4 hooks) — hot pink glow (#EC4899), chain link icon
- Left: "מצבי עבודה" (14 modes) — violet glow (#8B5CF6), gear icon
Subtle hexagonal grid pattern across the background. Stars and nebula dust.
Each cluster node is a glowing sphere with Hebrew text label below it.
Energy lines are animated-looking particle streams flowing between nodes and center.
Cinematic quality, ultra-HD, data visualization aesthetic, beautiful and professional.
Wide format 16:9 aspect ratio.
"""

OUT = Path(__file__).parent.parent / 'react-app' / 'public' / 'system-image.jpg'

api_key = os.environ.get('GEMINI_API_KEY')
if not api_key:
    print('ERROR: GEMINI_API_KEY not set')
    sys.exit(1)

print('Generating system image with Imagen 3...')
client = genai.Client(api_key=api_key)
result = client.models.generate_images(
    model='imagen-4.0-fast-generate-001',
    prompt=PROMPT.strip(),
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio='16:9',
    )
)

if not result.generated_images:
    print('ERROR: No images returned')
    sys.exit(1)

img_bytes = result.generated_images[0].image.image_bytes
OUT.write_bytes(img_bytes)
print(f'Saved: {OUT} ({len(img_bytes)//1024} KB)')
print('Done. Commit react-app/public/system-image.jpg and deploy.')
