FROM python:3.6-alpine
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN apk update && apk add gcc python3-dev
RUN pip install -r requirements.txt
COPY . /app
CMD ["/bin/sh"]
