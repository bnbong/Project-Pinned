# Pull base image
FROM python:3.10.10

# Set environment variables
# .pyc 파일 비활성화
ENV PYTHONDONTWRITEBYTECODE 1
# 로그 즉시 출력
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install -r requirements.txt

# Copy project
COPY . /code/
