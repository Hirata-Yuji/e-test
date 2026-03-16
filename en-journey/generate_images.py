#!/usr/bin/env python3
"""
EN Journey — Nano Banana 2 (Gemini) Image Generator
====================================================
Uses Google Gemini's Nano Banana 2 image generation to create
photorealistic travel images for the EN Journey website.

Setup:
    pip install google-genai Pillow

Usage:
    # Option A: environment variable
    export GEMINI_API_KEY="AIza..."
    python3 generate_images.py

    # Option B: pass key directly
    python3 generate_images.py --api-key "AIza..."

    # Option C: edit API_KEY below
"""

import argparse
import os
import sys
import time
from pathlib import Path

# ── Configuration ─────────────────────────────────────────────────────────────

# Set your API key here, or use --api-key argument or GEMINI_API_KEY env var
API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Output directory (relative to this script)
OUTPUT_DIR = Path(__file__).parent / "public" / "images"

# Image generation model priority (tries in order, uses first that works)
MODELS = [
    "gemini-2.0-flash-preview-image-generation",  # Nano Banana 2
    "gemini-2.0-flash-exp",                        # Nano Banana (experimental)
    "imagen-3.0-generate-002",                     # Imagen 3 (fallback)
    "imagen-3.0-fast-generate-001",                # Imagen 3 Fast (fallback)
]

# ── Image definitions ─────────────────────────────────────────────────────────

IMAGES = [
    {
        "filename": "hero.png",
        "size": (1200, 600),
        "aspect_ratio": "16:9",
        "prompt": (
            "Cinematic photography of a pristine white-sand beach in Shirahama Japan "
            "at golden hour, crystal-clear turquoise water gently lapping the shore, "
            "warm amber sunlight casting long shadows across wet reflective sand, "
            "wispy clouds painted in rose and gold on the horizon, a sense of serene "
            "paradise, ultra-wide cinematic composition, natural lens flare from low "
            "sun, shot on Sony A7R V with 24mm f/1.4 GM lens, golden hour lighting, "
            "ISO 100, teal-orange colour grade, 8k resolution, photorealistic, "
            "hyperdetailed travel photography"
        ),
    },
    {
        "filename": "about.png",
        "size": (900, 600),
        "aspect_ratio": "3:2",
        "prompt": (
            "Cinematic photography of a rugged Japanese coastal headland under brilliant "
            "blue sky, dramatic limestone cliffs covered in lush green vegetation plunging "
            "into vivid aquamarine sea, white surf breaking against rocks, pristine sandy "
            "cove in foreground, crisp midday sunlight with vivid shadows, panoramic vista "
            "conveying vastness and natural beauty, polarising filter, shot on Canon EOS R5 "
            "with 16-35mm f/2.8L lens, vibrant natural colours, tack-sharp foreground to "
            "horizon, 8k resolution, photorealistic landscape, cinematic panoramic "
            "composition"
        ),
    },
    {
        "filename": "domestic.png",
        "size": (700, 480),
        "aspect_ratio": "3:2",
        "prompt": (
            "Cinematic photography deep inside an ancient Japanese cedar forest in the "
            "Japanese Alps, shafts of golden morning light piercing through towering "
            "moss-covered trees, light mountain mist rolling through the valley, snow-dusted "
            "peaks visible in the far distance, rich greens and deep earth tones, enchanting "
            "fairy-tale atmosphere, shot on Nikon Z9 with 85mm f/1.4 S lens, shallow depth "
            "of field, creamy bokeh on foreground foliage, cinematic teal-orange colour "
            "grade, sunrise lighting, 8k resolution, photorealistic stunning nature "
            "photography"
        ),
    },
    {
        "filename": "overseas.png",
        "size": (700, 480),
        "aspect_ratio": "3:2",
        "prompt": (
            "Cinematic photography taken from a commercial aircraft window seat looking out "
            "over an endless sea of dramatic cumulonimbus clouds lit from above by brilliant "
            "sunlight, deep blue stratosphere at top of frame, cloud peaks casting soft "
            "shadows on cloud valleys, slight aircraft wing tip visible at lower right for "
            "scale and context, feeling of awe and adventure at altitude, shot on Leica Q3 "
            "35mm f/1.7, natural window light, cinematic blue-grey atmospheric colour grade, "
            "8k resolution, photorealistic aerial perspective, sharp cloud textures"
        ),
    },
    {
        "filename": "inbound.png",
        "size": (700, 480),
        "aspect_ratio": "3:2",
        "prompt": (
            "Cinematic photography of a historic Japanese shrine gate torii and temple "
            "pagoda partially obscured by full-bloom sakura cherry blossom trees, soft "
            "petals drifting in the breeze, warm spring afternoon light filtering through "
            "blossoms creating romantic bokeh of pink and white, ancient mossy stone "
            "lanterns lining a stone path, rich cultural atmosphere conveying timeless "
            "Japan, shot on Sony A1 with 50mm f/1.2 GM lens, cinematic shallow depth of "
            "field, warm nostalgic colour grading, cherry blossom season, 8k resolution, "
            "photorealistic"
        ),
    },
    {
        "filename": "landop.png",
        "size": (700, 480),
        "aspect_ratio": "3:2",
        "prompt": (
            "Cinematic photography of a luxury resort infinity pool perched on a clifftop "
            "overlooking the deep blue Pacific Ocean in Okinawa Japan, clean white "
            "minimalist architecture, turquoise pool water seamlessly merging with the ocean "
            "horizon, two stylish sun loungers casting late-afternoon shadows on teak deck, "
            "tropical palms framing the edges, golden hour warm long shadows, exclusive "
            "relaxation atmosphere, shot on Phase One XF IQ4 150MP with 45mm lens, "
            "cinematic teal-warm colour grade, 8k resolution, photorealistic luxury travel "
            "photography"
        ),
    },
    {
        "filename": "whyus.png",
        "size": (900, 600),
        "aspect_ratio": "3:2",
        "prompt": (
            "Cinematic aerial photography directly above a shallow tropical reef in the "
            "Okinawa archipelago Japan, water so clear that intricate coral formations and "
            "white sandy channels are visible from above, extraordinary spectrum of blues "
            "and teals from deep cobalt in channels to brilliant aquamarine over sand, "
            "light caustic patterns dancing on the reef, small breaking waves leaving white "
            "foam traces, shot on DJI Zenmuse X9 with 24mm lens, polarising filter, "
            "cinematic overhead bird's-eye composition, saturated but natural tropical "
            "colours, 8k resolution, photorealistic aerial nature photography"
        ),
    },
]

# ── Image generation ──────────────────────────────────────────────────────────

def try_gemini_native(client, image_def, model):
    """Generate image using Gemini native image generation (Nano Banana 2)."""
    from google.genai import types

    response = client.models.generate_content(
        model=model,
        contents=image_def["prompt"],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            return part.inline_data.data, part.inline_data.mime_type
    return None, None


def try_imagen(client, image_def, model):
    """Generate image using Imagen 3."""
    from google.genai import types

    response = client.models.generate_images(
        model=model,
        prompt=image_def["prompt"],
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio=image_def["aspect_ratio"],
            safety_filter_level="BLOCK_ONLY_HIGH",
        ),
    )
    if response.generated_images:
        img = response.generated_images[0]
        return img.image.image_bytes, "image/png"
    return None, None


def generate_image(client, image_def):
    """Try each model in order until one succeeds."""
    last_error = None

    for model in MODELS:
        try:
            print(f"    Trying model: {model} ...", end=" ", flush=True)

            if "imagen" in model:
                data, mime = try_imagen(client, image_def, model)
            else:
                data, mime = try_gemini_native(client, image_def, model)

            if data:
                print(f"OK ({len(data):,} bytes)")
                return data, mime

            print("no image data returned")

        except Exception as e:
            err_str = str(e)[:120]
            print(f"failed: {err_str}")
            last_error = e
            time.sleep(1)

    raise RuntimeError(f"All models failed. Last error: {last_error}")


def save_image(data, mime_type, image_def):
    """Save raw image bytes, resizing to target dimensions if needed."""
    from PIL import Image
    import io

    raw = Image.open(io.BytesIO(data)).convert("RGB")

    target_w, target_h = image_def["size"]
    if raw.size != (target_w, target_h):
        # Crop to target aspect ratio, then resize
        src_w, src_h = raw.size
        target_ratio = target_w / target_h
        src_ratio = src_w / src_h

        if src_ratio > target_ratio:
            # Source is wider — crop sides
            new_w = int(src_h * target_ratio)
            offset = (src_w - new_w) // 2
            raw = raw.crop((offset, 0, offset + new_w, src_h))
        else:
            # Source is taller — crop top/bottom
            new_h = int(src_w / target_ratio)
            offset = (src_h - new_h) // 2
            raw = raw.crop((0, offset, src_w, offset + new_h))

        raw = raw.resize((target_w, target_h), Image.LANCZOS)

    out_path = OUTPUT_DIR / image_def["filename"]
    raw.save(str(out_path), "PNG", optimize=True)
    print(f"    Saved → {out_path}")
    return out_path


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate EN Journey images with Nano Banana 2")
    parser.add_argument("--api-key", default="", help="Gemini API key")
    parser.add_argument("--only", nargs="+", help="Generate only specific filenames (e.g. hero.png)")
    args = parser.parse_args()

    # Resolve API key
    api_key = args.api_key or API_KEY
    if not api_key:
        api_key = input("Enter your Gemini API key: ").strip()
    if not api_key:
        print("ERROR: No API key provided.", file=sys.stderr)
        sys.exit(1)

    # Import here so missing package gives a clear error
    try:
        from google import genai
    except ImportError:
        print("ERROR: google-genai not installed. Run: pip install google-genai Pillow", file=sys.stderr)
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    images_to_generate = IMAGES
    if args.only:
        images_to_generate = [img for img in IMAGES if img["filename"] in args.only]

    print(f"\nGenerating {len(images_to_generate)} image(s) → {OUTPUT_DIR}\n")
    print("=" * 60)

    success, failed = [], []

    for i, image_def in enumerate(images_to_generate, 1):
        print(f"\n[{i}/{len(images_to_generate)}] {image_def['filename']} ({image_def['size'][0]}×{image_def['size'][1]})")

        try:
            data, mime = generate_image(client, image_def)
            save_image(data, mime, image_def)
            success.append(image_def["filename"])
        except Exception as e:
            print(f"    FAILED: {e}")
            failed.append(image_def["filename"])

        # Polite delay between requests
        if i < len(images_to_generate):
            time.sleep(2)

    # Summary
    print("\n" + "=" * 60)
    print(f"Complete: {len(success)} succeeded, {len(failed)} failed")
    if success:
        print(f"  Generated: {', '.join(success)}")
    if failed:
        print(f"  Failed:    {', '.join(failed)}")

    if success:
        print("\nNext steps:")
        print("  git add en-journey/public/images/")
        print('  git commit -m "Add Nano Banana 2 generated images"')
        print("  git push -u origin claude/tourism-company-website-DGPJs")


if __name__ == "__main__":
    main()
