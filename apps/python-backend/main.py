from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import Model_Backend
import os
import uuid
import urllib.parse

# ───── CONFIG ────────────────────────────────────────────────────────
IMAGE_DIR = os.getenv("IMAGE_DIR", "./images")  # folder where your image files live
# ────────────────────────────────────────────────────────────────────

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure IMAGE_DIR exists at startup
os.makedirs(IMAGE_DIR, exist_ok=True)

# Mount static files to serve images directly
app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

@app.get("/health")
def health_check():
    """Health check endpoint for Docker"""
    return {"status": "healthy", "message": "FastAPI backend is running"}

@app.get("/")
def root():
    """Root endpoint with basic info"""
    return {"message": "Image Search API", "health": "/health"}

@app.get("/add_image/{image_path}")
def AddImage(image_path: str):
    result = Model_Backend.add_image(IMAGE_DIR + "/" + image_path)
    if result:
        return {"message": "Image added successfully", "status_code": 200}
    else:
        return {"message": "Failed to add image", "status_code": 400}

@app.get("/search_images/{query}")
def SearchImages(query: str, min_score: float = 90.0):
    # URL decode the query to handle spaces (%20) and other special characters
    decoded_query = urllib.parse.unquote(query)
    print(f"Search query: {decoded_query}")
    results = Model_Backend.search_images(decoded_query, min_score)
    print(f"Raw results from Model_Backend: {results}")
    print(f"Type of results: {type(results)}")
    
    # Convert tuples to dictionaries for JSON response
    formatted_results = []
    for item in results:
        print(f"Processing item: {item}, type: {type(item)}")
        if isinstance(item, (list, tuple)) and len(item) >= 2:
            filename, score = item[0], item[1]
            formatted_results.append({"filename": filename, "score": float(score)})
        else:
            print(f"Unexpected item format: {item}")
    
    print(f"Formatted results: {formatted_results}")
    
    return {"results": formatted_results, "status_code": 200}

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image file to the server and save it in the IMAGE_DIR folder.
    """
    # Check if the file is an image
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate a unique filename to avoid conflicts
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Convert IMAGE_DIR to absolute path to ensure it works on Windows
    absolute_image_dir = os.path.abspath(IMAGE_DIR)
    file_path = os.path.join(absolute_image_dir, unique_filename)
    
    # Ensure the images directory exists
    os.makedirs(absolute_image_dir, exist_ok=True)
    
    try:
        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Add the image to the Model_Backend database for search functionality
        try:
            Model_Backend.add_image(file_path)
            print(f"✅ Image added to search database: {unique_filename}")
        except Exception as e:
            print(f"⚠️ Failed to add image to search database: {str(e)}")
            # Don't fail the upload if database addition fails
        
        return {
            "message": "Image uploaded successfully",
            "filename": unique_filename,
            "file_path": file_path,
            "status_code": 200
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    
@app.get("/list_images")
def list_images():
    """
    Get all image filenames in the IMAGE_DIR folder sorted by date added (newest first).
    Returns a simple list of image filenames.
    """
    try:
        # Check if the images directory exists
        if not os.path.exists(IMAGE_DIR):
            return []
        
        # Get all files in the images directory
        image_files = []
        for filename in os.listdir(IMAGE_DIR):
            file_path = os.path.join(IMAGE_DIR, filename)
            
            # Check if it's a file and has an image extension
            if os.path.isfile(file_path):
                # Get common image extensions
                image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg'}
                file_extension = os.path.splitext(filename)[1].lower()
                
                if file_extension in image_extensions:
                    # Get file creation/modification time
                    file_stat = os.stat(file_path)
                    created_time = file_stat.st_ctime  # Creation time
                    modified_time = file_stat.st_mtime  # Modification time
                    
                    # Use the more recent time (creation or modification)
                    date_added = max(created_time, modified_time)
                    
                    image_files.append({
                        "filename": filename,
                        "date_added": date_added
                    })
        
        # Sort by date added (newest first)
        image_files.sort(key=lambda x: x["date_added"], reverse=True)
        
        # Return just the filenames as a list
        return [img["filename"] for img in image_files]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list images: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)