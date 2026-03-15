FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    PADDLE_PDX_MODEL_SOURCE=BOS

WORKDIR /srv/ocr

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    curl \
    libgomp1 \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
  && rm -rf /var/lib/apt/lists/*

COPY docker/paddle-ocr/requirements.txt ./requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
  && python -m pip install --no-cache-dir -r requirements.txt

COPY docker/paddle-ocr /srv/ocr

EXPOSE 8000

CMD ["uvicorn", "ocr_service:app", "--host", "0.0.0.0", "--port", "8000"]
