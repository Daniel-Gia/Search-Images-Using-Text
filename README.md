# Image Search Project

An intelligent image search application that uses AI-powered embeddings to find similar images. Upload images and search through your collection using natural language descriptions or by uploading reference images.

## About This Project

This project combines a modern Next.js frontend with a FastAPI backend powered by OpenAI's CLIP model for semantic image search. The application allows users to:

- Upload images to build a searchable collection
- Search for images using text descriptions
- View results in a clean, responsive grid layout

### 🎥 Demo

*Place your demo images/videos here*

![Demo Screenshot Placeholder](./demo-screenshot.png)

### 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19, TailwindCSS, and TypeScript
- **Backend**: FastAPI with CLIP (Contrastive Language-Image Pre-Training) model
- **AI Model**: OpenAI CLIP for generating image embeddings and semantic search
- **Storage**: Local file system for images and pickle files for embeddings

## How to Run/Install

### 🐳 Using Docker (Recommended)

This is the easiest way to get the project running. Docker will handle all dependencies and setup for you.

1. **Build and run with Docker Compose**
   ```bash
   docker-compose build
   docker-compose up
   ```
   
   **OR** use the convenient npm script:
   ```bash
   npm run docker:up
   ```

   > ⚠️ **Note**: The initial build can take a while (10-15 minutes) as it needs to download PyTorch, CLIP model, and install all dependencies. Subsequent runs will be much faster thanks to Docker layer caching.

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

3. **Stop the application**
   ```bash
   docker-compose down
   ```
   
   **OR** use the npm script:
   ```bash
   npm run docker:down
   ```

### 💻 Using Local Development

If you prefer to run the project locally without Docker:

#### Prerequisites
- Python 3.8+ with pip
- Node.js 18+ with npm
- Git


### 🚀 Quick Start with npm scripts

From the root of the project, you can use:
1. **Install all dependencies**
```bash
npm install
```

2. **Run with one of the methods**
```bash
npm run build   # Build everything (backend and frontend)
npm run start   # Start production servers

# For development mode (hot reload, etc.)
npm run dev     # Start both backend and frontend in development mode
```

#### Manual Setup (Alternative)

#### Backend Setup

1. **Install Python dependencies**
   ```bash
   pip install -r .\apps\python-backend\requirements.txt
   ```

2. **Run the Python backend**
   ```bash
   py .\apps\python-backend\main.py
   ```

   The backend will be available at http://localhost:8000

#### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

2. **Run the frontend in development mode**
   ```bash
   cd .\apps\web\
   npm install
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

#### Alternative: Build and Run Production Frontend

If you want to run the optimized production build:

1. **Build the frontend**
   ```bash
   cd .\apps\web\
   npm run build
   ```
   
   **OR** build everything from the root:
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

## 📁 Project Structure

```
Image-Search/
├── apps/
│   ├── python-backend/          # FastAPI backend
│   │   ├── main.py             # API server
│   │   ├── Model_Backend.py    # CLIP model integration
│   │   ├── requirements.txt    # Python dependencies
│   │   ├── embeddings/         # Stored image embeddings
│   │   └── images/             # Uploaded images
│   └── web/                    # Next.js frontend
│       ├── src/app/            # App router pages
│       ├── src/components/     # React components
│       └── package.json        # Frontend dependencies
├── docker-compose.yml          # Docker configuration
├── package.json               # Root package.json with scripts
└── README.md                  # This file
```

## 🔧 API Endpoints (python backend)

- `POST /upload_image` — Upload a new image file
- `GET /add_image/{image_path}` — Add an image from the server's image directory to the search index
- `GET /search_images/{query}` — Search images by text description (with optional `min_score`)
- `GET /list_images` — List all uploaded image filenames (sorted by date added)
- `GET /images/{filename}` — Serve an uploaded image file
- `GET /health` — Health check endpoint (returns backend status)

## 🚀 How to Host in Production

For a scalable, robust production deployment, consider the following improvements:

1. **Use a Vector Database or Azure AI Search for Embeddings**
   - Instead of storing image embeddings locally (e.g., in pickle files), use a dedicated vector database such as Pinecone, Weaviate, Qdrant, or Milvus. These databases are optimized for fast, large-scale similarity search and can handle millions of vectors efficiently.
   - Alternatively, you can use Azure AI Search service, which supports vector search and integrates well with other Azure services.
   - This approach enables much faster and more scalable search for large image collections.

2. **Serve Images from a Dedicated Storage Service**
   - Instead of serving images from the local file system, upload and store images in a cloud storage service such as Azure Blob Storage, AWS S3, or Google Cloud Storage.
   - Serve images directly from the storage service using secure URLs or CDN endpoints for better performance, reliability, and scalability.
   - This also simplifies backup, access control, and integration with other cloud services.

By following these recommendations, you can scale your image search application to handle production workloads and large datasets efficiently.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Docker build takes too long**: This is normal for the first build. The CLIP model and PyTorch are large downloads.

2. **Port conflicts**: If ports 3000 or 8000 are already in use, modify the ports in `docker-compose.yml`

3. **Python dependencies issues**: Make sure you're using Python 3.8+ and have pip updated to the latest version.

4. **CORS errors**: The backend is configured to allow all origins. If you're still getting CORS errors, check that both servers are running.

### Getting Help

If you encounter any issues:
1. Check the Docker/application logs
2. Ensure all prerequisites are installed
3. Try the Docker approach if local development isn't working

