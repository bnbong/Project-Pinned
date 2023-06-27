# Pull base image
FROM python:3.10.10

# Set environment variables
# .pyc 파일 비활성화
ENV PYTHONDONTWRITEBYTECODE 1
# 로그 즉시 출력
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# Copy project
COPY . /app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]