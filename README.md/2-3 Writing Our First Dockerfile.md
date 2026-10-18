Docker শেখার এই ধাপে আমরা নিজের হাতে প্রথম `Dockerfile` তৈরি করব এবং সেটি ব্যবহার করে একটি application-এর Docker image বানাব।

তোমার Language Learning School Express API-কে উদাহরণ হিসেবে ব্যবহার করব, যাতে শেখার পাশাপাশি বাস্তব project-এও কাজে লাগাতে পারো।

## 1. What is a Dockerfile?

Dockerfile হলো একটি সাধারণ text file, যেখানে Docker image তৈরি করার জন্য ধারাবাহিক নির্দেশনা লেখা থাকে।

যেমন, আমরা Docker-কে নির্দেশ দিতে পারি:

- কোন base image ব্যবহার করতে হবে।
- Container-এর ভেতরে কোন directory-তে কাজ করতে হবে।
- কোন application files কপি করতে হবে।
- কীভাবে dependencies ইনস্টল করতে হবে।
- কোন command দিয়ে application চালাতে হবে।

Dockerfile

Image তৈরির নির্দেশনা

Docker Image

Application + runtime + dependencies

Docker Container

Image থেকে চলমান application

সহজভাবে:

- `Dockerfile` = কীভাবে তৈরি করতে হবে তার নির্দেশনা।
- `Image` = তৈরি করা application package।
- `Container` = image থেকে চালানো application instance।

## 2. Project structure তৈরি করো

প্রথমে তোমার Express API project directory-তে যাও:

```
cd E:\backend\language-learning-school-server
```

তোমার project-এর structure এমন হতে পারে:

```
language-learning-school-server/
├── index.js
├── package.json
├── package-lock.json
├── Dockerfile
└── .dockerignore
```

এখানে:

- `index.js` — Express server-এর code।
- `package.json` — project metadata এবং dependencies।
- `package-lock.json` — নির্দিষ্ট dependency versions-এর তথ্য।
- `Dockerfile` — image তৈরির instructions।
- `.dockerignore` — কোন ফাইলগুলো Docker build context-এ পাঠানো হবে না, তা নির্ধারণ করে।

তোমার `index.js`-এ অন্তত একটি Express route এবং server startup code থাকতে হবে।

## 3. প্রথম Dockerfile লিখি

Project root-এ ঠিক `Dockerfile` নামের একটি file তৈরি করো। কোনো `.txt` extension দেবে না।

এই code-টি লিখো:

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

এবার প্রতিটি instruction বুঝে নিই।

### `FROM node:20-alpine`

```
FROM node:20-alpine
```

এটি base image নির্ধারণ করে। এখানে Docker Hub-এর Node.js 20 Alpine image ব্যবহার করা হচ্ছে।

অর্থাৎ, Node.js runtime আলাদাভাবে হাতে install করার দরকার নেই।

### `WORKDIR /app`

```
WORKDIR /app
```

Container-এর ভেতরে `/app` directory-কে working directory হিসেবে নির্ধারণ করে। Directory না থাকলে Docker এটি তৈরি করে।

এরপরের relative path-গুলো সাধারণত এই directory-কে ভিত্তি করে কাজ করবে।

### `COPY package*.json ./`

```
COPY package*.json ./
```

Host project থেকে `package.json` এবং থাকলে `package-lock.json` container-এর `/app` directory-তে কপি করে।

প্রথমেই dependency files কপি করার সুবিধা হলো, application code পরিবর্তন হলেও dependency files অপরিবর্তিত থাকলে Docker অনেক সময় আগের build layer cache করতে পারে।

### `RUN npm install -omit=dev`

```
RUN npm install --omit=dev
```

Image build করার সময় npm dependencies install করে। `--omit=dev` development-only dependencies ইনস্টল করা থেকে বিরত রাখে।

Production-এর জন্য আরও উপযুক্ত বিকল্প: `package-lock.json` থাকলে সাধারণত `npm ci --omit=dev` ব্যবহার করা ভালো, কারণ এটি lockfile অনুযায়ী dependencies ইনস্টল করে।

### `COPY index.js ./`

```
COPY index.js ./
```

তোমার Express server-এর `index.js` file-টি container-এর `/app` directory-তে কপি করে।

এই উদাহরণে শুধু `index.js` কপি করা হচ্ছে। Application-এর অন্য source files বা local modules থাকলে সেগুলোও কপি করতে হবে।

### `ENV PORT=5000`

```
ENV PORT=5000
```

Container-এর environment-এ `PORT` variable-এর default value `5000` সেট করে।

### `EXPOSE 5000`

```
EXPOSE 5000
```

এটি জানায় যে application container-এর port `5000`-এ listen করার জন্য তৈরি।

মনে রেখো, `EXPOSE` নিজে থেকে host computer-এর port-এ সংযোগ তৈরি করে না। এর জন্য `docker run -p` ব্যবহার করতে হয়।

### `CMD ["node", "index.js"]`

```
CMD ["node", "index.js"]
```

Container শুরু হলে default command হিসেবে `node index.js` চালায়।

তাই তোমার Express server চালু হয়।

## 4. `.dockerignore` file তৈরি করো

Project root-এ `.dockerignore` নামে আরেকটি file তৈরি করো:

```

node_modules
.git
.env
.env.*
!.env.example
```

এটি কেন দরকার?

- `node_modules` — host machine-এর dependencies অপ্রয়োজনীয়ভাবে build context-এ পাঠানো এড়ায়।
- `.git` — Git history ও metadata বাদ দেয়।
- `.env` এবং `.env.*` — secret-সম্বলিত environment files build context থেকে বাদ দেয়।
- `!.env.example` — সাধারণ উদাহরণ configuration file-টি বাদ না দেওয়ার নিয়ম।

তোমার বর্তমান basic Express API-তে `.env` না থাকলেও সমস্যা নেই। `PORT`-এর default value `5000` হওয়ায় এই উদাহরণে আলাদা `.env` প্রয়োজন নেই।

## 5. Docker image তৈরি করো

PowerShell-এ project root থেকে চালাও:

```
docker build -t language-school-api .
```

Command-এর অর্থ:

| অংশ                   | কাজ                                                   |
| --------------------- | ----------------------------------------------------- |
| `docker build`        | Dockerfile থেকে image তৈরি করে                        |
| `-t`                  | Image-কে একটি নাম বা tag দেয়                         |
| `language-school-api` | Image-এর নাম                                          |
| `.`                   | বর্তমান directory-কে build context হিসেবে ব্যবহার করে |

Build সফল হলে image যাচাই করো:

```
docker images
```

তালিকায় `language-school-api` দেখতে পাবে।

## 6. Image থেকে container চালাও

Container-এর নাম আগে থেকেই ব্যবহৃত হচ্ছে কি না, তা যাচাই করো:

```
docker ps -a
```

যদি `language-school-api` নামে পুরোনো container না থাকে, চালাও:

```
docker run -d --name language-school-api -p 5000:5000 language-school-api
```

যদি একই নামের container আগে থেকেই থাকে, সেটি যাচাই করে প্রয়োজন অনুযায়ী stop/remove করো, অথবা নতুন নাম ব্যবহার করো।

তারপর container চলছে কি না দেখো:

```
docker ps
```

Browser-এ পরীক্ষা করো:

- http://localhost:5000/
- http://localhost:5000/health

তোমার আগের `index.js` অনুযায়ী `/` route-এ API running message এবং `/health` route-এ healthy status পাওয়ার কথা।

কোনো সমস্যা হলে logs দেখো:

```
docker logs language-school-api
```

## 7. Dockerfile-এর গুরুত্বপূর্ণ instructions

| Instruction | কখন কাজ করে       | উদ্দেশ্য                         |
| ----------- | ----------------- | -------------------------------- |
| `FROM`      | Build             | Base image নির্বাচন              |
| `WORKDIR`   | Build             | Working directory নির্ধারণ       |
| `COPY`      | Build             | ফাইল কপি                         |
| `RUN`       | Build             | Image তৈরির সময় command চালানো  |
| `ENV`       | Build/runtime     | Environment variable নির্ধারণ    |
| `EXPOSE`    | Image metadata    | Container-এর intended port ঘোষণা |
| `CMD`       | Container startup | Default command নির্ধারণ         |

`RUN` বনাম `CMD`:

- `RUN` — image তৈরি করার সময় চলে।
- `CMD` — container চালু হলে চলে।

উদাহরণস্বরূপ, `RUN npm install --omit=dev` build-এর সময় dependencies ইনস্টল করে, আর `CMD ["node", "index.js"]` container শুরু হলে server চালায়।

## 8. Common mistakes এবং সমাধান

Error: `Dockerfile` not found

সমাধান:\*\* সঠিক project directory-তে আছ কি না এবং file-এর নাম ঠিক `Dockerfile` কি না যাচাই করো। Windows-এ file-টির নাম ভুল করে `Dockerfile.txt` হয়ে গেছে কি না দেখো।

Error: `package.json` not found

সমাধান:\*\* `package.json` এবং Dockerfile একই project root-এ আছে কি না যাচাই করো।

Error: Port already allocated

সমাধান:\*\* অন্য application বা container port `5000` ব্যবহার করছে কি না দেখো। প্রয়োজনে host port বদলে `-p 5001:5000` ব্যবহার করতে পারো; তখন browser-এ `http://localhost:5001` খুলবে।

Container চালু হয়, কিন্তু API কাজ করে না

সমাধান:\*\* `docker logs language-school-api` চালিয়ে দেখো। Express server যেন `0.0.0.0` address-এ listen করে, সেটিও নিশ্চিত করো।

## 9. Practice task

নিজে চেষ্টা করো:

তোমার Dockerfile checklist

0/4

- [ ] Project root-এ Dockerfile তৈরি করেছি
- [ ] FROM এবং WORKDIR বুঝেছি
- [ ] docker build -t language-school-api . চালিয়েছি
- [ ] Container চালিয়ে /health endpoint পরীক্ষা করেছি

এই lesson-এর মূল কথা: Dockerfile লেখো → image build করো → container চালাও → application পরীক্ষা করো।

পরবর্তী lesson: 2-4 — Docker Build Context and `.dockerignore`।
