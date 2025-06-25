# clip_db.py

import os
import pickle
import numpy as np
import clip
import torch
from PIL import Image

# ───── CONFIG ────────────────────────────────────────────────────────
MODEL_NAME   = "ViT-B/32"
DEVICE       = "cuda" if torch.cuda.is_available() else "cpu"
EMBED_FILE   = os.getenv("EMBED_FILE", "embeddings/embeddings.pkl")
# ────────────────────────────────────────────────────────────────────

print(f"🤖 Using CLIP model: {MODEL_NAME} on device: {DEVICE}")

# Load (or initialize) the in‐memory DB: { filename → preprocessed image tensor }
embed_file_abs = os.path.abspath(EMBED_FILE)
if os.path.exists(embed_file_abs):
    with open(embed_file_abs, "rb") as f:
        img_db = pickle.load(f)
    print(f"✅ Loaded {len(img_db)} image tensors from {embed_file_abs}")
else:
    img_db = {}
    print("⚠️ No image tensor file found; starting fresh.")

# Load CLIP model + preprocess pipeline
print("⚠️ **Note** the first time you run this, it will download the model weights (about 400MB) - it can take a while.")
model, preprocess = clip.load(MODEL_NAME, device=DEVICE)
model.eval()


def save_db():
    """Atomically write img_db to disk."""
    # Convert to absolute path to avoid path resolution issues
    embed_file_abs = os.path.abspath(EMBED_FILE)
    
    # Ensure directory exists
    embed_dir = os.path.dirname(embed_file_abs)
    os.makedirs(embed_dir, exist_ok=True)
    
    tmp = embed_file_abs + ".tmp"
    with open(tmp, "wb") as f:
        pickle.dump(img_db, f)
    os.replace(tmp, embed_file_abs)


def add_image(image_path: str):
    """
    Store the preprocessed image tensor for later similarity computation.
    """
    if not os.path.isfile(image_path):
        raise FileNotFoundError(f"No such file: {image_path}")

    # Preprocess and store the image tensor (not the embedding)
    image = preprocess(Image.open(image_path)).unsqueeze(0)
    
    fn = os.path.basename(image_path)
    img_db[fn] = image

    save_db()
    print(f"✅ Added/updated image tensor for '{fn}'")
    return True


def search_images(query: str, min_score: float = 20.0):
    """
    Use CLIP model's built-in similarity computation.
    Returns all (filename, score) with score ≥ min_score, sorted desc.
    """
    if not img_db:
        print("⚠️  No images in database—nothing to search.")
        return []

    # Collect all images for batch processing
    filenames = list(img_db.keys())
    image_batch = torch.cat([img_db[fn] for fn in filenames], dim=0).to(DEVICE)
    
    # Tokenize the query - we need at least 2 texts for meaningful probabilities
    # Use the query and a generic "other" text
    texts = [query, "other content"]
    text_tokens = clip.tokenize(texts).to(DEVICE)
    
    results = []
    with torch.no_grad():
        # Compute similarity for all images at once
        logits_per_image, logits_per_text = model(image_batch, text_tokens)
        
        # Get probabilities for the query (first text)
        probs = logits_per_image.softmax(dim=-1)
        query_probs = probs[:, 0].cpu().numpy()  # Probability for the query
        
        # Convert probabilities to scores (multiply by 100 to match demo scale)
        for i, (fn, prob) in enumerate(zip(filenames, query_probs)):
            score = prob * 100  # Scale to match demo output
            if score >= min_score:
                results.append((fn, score))

    # Sort descending
    results.sort(key=lambda x: x[1], reverse=True)
    return results
