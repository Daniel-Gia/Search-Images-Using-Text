FROM python:3.12-slim AS base

RUN apt-get clean && \
    apt-get update -y && \
    apt-get install -y --no-install-recommends \
        libjpeg62-turbo \
        ca-certificates \
        git && \
    rm -rf /var/lib/apt/lists/*

# Build stage with pre-compiled dependencies
FROM base AS builder

# Install build dependencies
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        python3-dev \
        build-essential \
        libssl-dev \
        libffi-dev \
        libjpeg-dev \
        zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

# Set up PATH for local pip installs
ENV PATH=/root/.local/bin:$PATH

# Set cache directories for consistent caching
ENV CLIP_CACHE_DIR=/root/.cache/clip
ENV PIP_CACHE_DIR=/root/.cache/pip

# Create cache directories
RUN mkdir -p /root/.cache/pip /root/.cache/clip

# Upgrade pip and install wheel for faster builds
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user --upgrade pip wheel

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user packaging>=21.0 setuptools>=65.0

# Install dependencies in optimal order (use cached wheels when possible)
# FastAPI and related (fast installs)
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user \
        fastapi==0.104.1 \
        uvicorn[standard]==0.24.0 \
        python-multipart==0.0.20

# NumPy (exact version for Python 3.12 compatibility)
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user "numpy==1.26.4"

# Pillow (exact version for Python 3.12 compatibility)
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user "Pillow==10.4.0"

# PyTorch CPU-only (exact versions for Python 3.12 compatibility)
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user \
        --index-url https://download.pytorch.org/whl/cpu \
        "torch==2.4.1+cpu" "torchvision==0.19.1+cpu"

# CLIP package dependencies (exact versions)
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user ftfy==6.2.3 regex==2024.7.24 tqdm==4.66.5
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install --user openai-clip==1.0.1

# Production stage
FROM base

# Set up working directory and environment
WORKDIR /app
ENV PATH="/root/.local/bin:${PATH}"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV IMAGE_DIR=/app/images
ENV CLIP_CACHE_DIR=/root/.cache/clip

# Copy installed packages from builder stage
COPY --from=builder /root/.local /root/.local

# Copy CLIP model cache from builder stage
COPY --from=builder /root/.cache /root/.cache

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/images /app/embeddings

# Expose port
EXPOSE 8000

# Use uvicorn with optimized settings
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
