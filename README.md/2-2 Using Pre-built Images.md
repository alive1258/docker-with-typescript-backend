# 2-2 Using Pre-built Images — বাংলায় ব্যাখ্যা

Docker শেখার সময় Pre-built Image বোঝা খুব গুরুত্বপূর্ণ। কারণ প্রতিবার কোনো অ্যাপ চালানোর জন্য শুরু থেকে সবকিছু তৈরি করতে হয় না। Docker Hub থেকে আগে থেকেই তৈরি করা image ব্যবহার করে দ্রুত application চালানো যায়।

## 1. What is a Pre-built Image?

Pre-built Image হলো এমন একটি Docker image, যা অন্য কেউ আগে থেকেই তৈরি করে রেখেছে এবং আমরা সরাসরি ব্যবহার করতে পারি।

উদাহরণ:

- `node:20-alpine` — Node.js application চালানোর জন্য
- `nginx:alpine` — Web server চালানোর জন্য
- `postgres:16` — PostgreSQL database চালানোর জন্য
- `mongo:8` — MongoDB database চালানোর জন্য

এই image-গুলো সাধারণত Docker Hub-এর মতো registry-তে পাওয়া যায়।

Dockerizing Node.js Apps: A Complete Guide | Better Stack Community

Docker - Setting NGINX

How to Use Postgres Docker Official Image — CommandPrompt Inc.

## 2. Pre-built Image কোথায় পাব?

Docker Logo, Icon, and Brand Guidelines

Docker Hub

Docker image খোঁজা, ডাউনলোড করা এবং প্রকাশ করার জনপ্রিয় registry।

Docker Hub খুলুন

উদাহরণস্বরূপ, Node.js image-এর পেজ:

Node official image on Docker Hub

এখানে image-এর available version, ব্যবহারবিধি এবং Docker command দেখতে পারবে।

## 3. Step-by-step: Pre-built Image ব্যবহার করা

আমরা প্রথমে Node.js image ব্যবহার করব, তারপর Nginx দিয়ে একটি web server চালাব।

### Step 1: Docker image ডাউনলোড করা

টার্মিনাল বা PowerShell খুলে লিখো:

```
docker pull node:20-alpine
```

এখানে:

- `docker pull` — registry থেকে image ডাউনলোড করে।
- `node` — image-এর নাম।
- `20-alpine` — Node.js 20 এবং Alpine Linux-ভিত্তিক image variant।

Image ডাউনলোড হয়েছে কি না দেখতে:

```
docker images
```

উদাহরণস্বরূপ, output-এ `node` repository এবং `20-alpine` tag দেখতে পাবে।

### Step 2: Pre-built image থেকে container চালানো

```
docker run -it --rm node:20-alpine node --version
```

এখানে:

| Command          | কাজ                                       |
| ---------------- | ----------------------------------------- |
| `docker run`     | Image থেকে container তৈরি করে চালায়      |
| `-it`            | Interactive terminal ব্যবহারের সুযোগ দেয় |
| `--rm`           | Command শেষ হলে container মুছে দেয়       |
| `node:20-alpine` | যে image ব্যবহার হবে                      |
| `node --version` | Node.js version দেখায়                    |

সম্ভাব্য output:

```
v20.x.x
```

এখানে `x`-এর জায়গায় নির্দিষ্ট patch version দেখাবে।

মনে রাখবে: `docker pull` শুধু image ডাউনলোড করে। `docker run` image থেকে container তৈরি করে চালায়।

## 4. Nginx দিয়ে একটি Web Server চালানো

এবার Node.js-এর পরিবর্তে Nginx image ব্যবহার করি।

Terminal commands

```
docker pull nginx:alpine
```

```
docker run -d --name my-nginx -p 8080:80 nginx:alpine
```

```
docker ps
```

Command-এর ব্যাখ্যা:

- `d` — container-কে background-এ চালায়।
- `-name my-nginx` — container-এর নাম নির্ধারণ করে।
- `p 8080:80` — তোমার কম্পিউটারের port `8080`কে container-এর port `80`এর সঙ্গে যুক্ত করে।
- `nginx:alpine` — Nginx-এর pre-built image।

এখন browser-এ যাও:

http://localhost:8080

Nginx-এর welcome page দেখতে পাবে, যদি container সফলভাবে চালু থাকে।

বন্ধ করতে:

```
docker stop my-nginx
```

Container মুছে ফেলতে:

```
docker rm my-nginx
```

এখানে container মুছে ফেলা হলেও ডাউনলোড করা `nginx:alpine` image থেকে যায়।

## 5. নিজের Express API-তে Pre-built Image ব্যবহার

তোমার Language Learning School API-তে Dockerfile-এর এই লাইনটি দেখো:

```
FROM node:20-alpine
```

এর অর্থ হলো তোমার application-এর ভিত্তি হিসেবে Node.js-এর pre-built image ব্যবহার করা হচ্ছে।

এরপর Dockerfile-এর বাকি নির্দেশনাগুলো application-এর জন্য প্রয়োজনীয় ফাইল কপি করে এবং dependencies ইনস্টল করে।

```
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY index.js ./

ENV PORT=5000

EXPOSE 5000

CMD ["node", "index.js"]
```

এই Dockerfile ব্যবহার করে নিজের application image তৈরি করো:

```
docker build -t language-school-api .
```

তারপর container চালাও:

```
docker run -d --name language-school-api -p 5000:5000 language-school-api
```

যদি একই নামে container আগে থেকেই থাকে, নতুন করে চালানোর আগে সেটির অবস্থা যাচাই করো:

```
docker ps -a
```

API পরীক্ষা করো:

- `http://localhost:5000/`
- `http://localhost:5000/health`

## 6. Image version বা tag কেন গুরুত্বপূর্ণ?

একই image-এর একাধিক version থাকতে পারে।

```
docker pull node:20-alpine
docker pull node:22-alpine
```

এগুলো Node.js-এর আলাদা major version ব্যবহার করে। তাই project-এর প্রয়োজন অনুযায়ী version নির্বাচন করতে হবে। `latest` tag সবসময় তোমার project-এর জন্য সঠিক বা স্থিতিশীল version হবে, এমন নয়।

Production project-এ নির্দিষ্ট version ব্যবহার করা ভালো এবং গুরুত্বপূর্ণ ক্ষেত্রে image digest দিয়ে version আরও নির্ভুলভাবে নির্ধারণ করা যায়।

## 7. গুরুত্বপূর্ণ Docker Commands

| Command                    | কাজ                                    |
| -------------------------- | -------------------------------------- |
| `docker pull nginx:alpine` | Image ডাউনলোড                          |
| `docker images`            | Local images দেখা                      |
| `docker run nginx:alpine`  | Image থেকে container চালানো            |
| `docker ps`                | Running containers দেখা                |
| `docker ps -a`             | সব containers দেখা                     |
| `docker stop my-nginx`     | Container বন্ধ করা                     |
| `docker rm my-nginx`       | Container মুছে ফেলা                    |
| `docker rmi nginx:alpine`  | Image মুছে ফেলা, যদি আর ব্যবহৃত না হয় |

## 8. আজকের মূল ধারণা

`docker pull`

Registry থেকে আগে তৈরি image ডাউনলোড করে।

`docker run`

Image ব্যবহার করে একটি নতুন container তৈরি করে চালায়।

`FROM node:20-alpine`

নিজের Docker image তৈরির জন্য একটি pre-built base image নির্ধারণ করে।

### নিজেকে যাচাই করো

প্রশ্ন: `docker pull nginx:alpine` চালালে কী হবে?

Nginx container চালু হবে এবং browser খুলবে।

Nginx image ডাউনলোড হবে, কিন্তু container চালু হবে না।

নিজের Express application-এর image তৈরি হবে।
