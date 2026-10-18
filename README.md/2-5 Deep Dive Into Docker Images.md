## 2-5 Deep Dive Into Docker Images

এই লেসনে আমরা Docker Image কীভাবে কাজ করে, image layers, caching, tagging, image size এবং production-এ image ব্যবহারের ভালো পদ্ধতিগুলো শিখব।
তোমার আগের docker-with-typescript-backend project-টিকেই উদাহরণ হিসেবে ব্যবহার করব, যাতে শেখার সঙ্গে সঙ্গে বাস্তবে প্রয়োগ করতে পারো।

1. Docker Image আসলে কী?
   Docker Image হলো একটি application চালানোর জন্য প্রয়োজনীয় ফাইল, runtime, dependencies এবং configuration-এর সমন্বয়ে তৈরি একটি read-only template।
   Docker Image
   Node.js + Application Code + Dependencies

Docker Container
Image থেকে তৈরি চলমান application instance

সহজ উদাহরণ:

- Image: একটি বাড়ির নকশা।
- Container: সেই নকশা অনুসারে তৈরি একটি বাড়ি।
- একই image থেকে একাধিক container তৈরি করা যায়।

2. Docker Image Layers কী?
   Docker image সাধারণত একাধিক layer দিয়ে তৈরি হয়। Dockerfile-এর বিভিন্ন instruction image তৈরির সময় layer তৈরি করতে পারে; CMD ও ENV-এর মতো instruction-এর আচরণ কিছুটা আলাদা।
   উদাহরণস্বরূপ:
   FROM node:20
   WORKDIR /app
   COPY package\*.json ./
   RUN npm install
   COPY . .
   CMD ["npm", "run", "dev"]

এই Dockerfile-এর ধারণাগত layer structure:
Application code
COPY . .

Dependencies
RUN npm install

Package configuration
COPY package\*.json ./

Base image
FROM node:20

প্রতিটি layer আগের layer-এর ওপর নির্ভর করে। একই base image বা অপরিবর্তিত build step পুনরায় ব্যবহার করা গেলে Docker cache কাজে লাগাতে পারে। 3. Docker Layer Caching কীভাবে কাজ করে?
Docker build করার সময় আগের build-এর অপরিবর্তিত layers cache থেকে reuse করতে পারে। এতে build দ্রুত হয়।
ধরো, তোমার project-এ শুধু src/app/server.ts পরিবর্তন হয়েছে।
কম কার্যকর পদ্ধতি:
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]

এখানে source code পরিবর্তনের কারণে COPY . . বদলে যায়। এর পরের RUN npm install layer-টিও সাধারণত cache থেকে reuse করা যায় না।
উন্নত পদ্ধতি:
FROM node:20

WORKDIR /app

COPY package\*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

এখানে package.json ও package-lock.json অপরিবর্তিত থাকলে dependencies ইনস্টল করার layer cache থেকে reuse হতে পারে।
মনে রাখবে, dependencies পরিবর্তিত হলে Docker-কে আবার npm install চালাতে হবে। 4. Image Tagging কী?
Tag হলো image-এর একটি নির্দিষ্ট version বা পরিচয়।
docker build -t my-backend:v1 .
docker build -t my-backend:v2 .
docker images

এখানে:

- my-backend — image-এর নাম।
- v1, v2 — image tag।
- . — বর্তমান directory-কে build context হিসেবে ব্যবহার করা।
  তোমার project-এর ক্ষেত্রেও:
  docker build -t docker-with-typescript-backend:v1 .

তারপর image চালাতে পারো:
docker run --name backend-v1 -p 5000:5000 docker-with-typescript-backend:v1

এখানে port 5000 কেবল উদাহরণ; তোমার application-এর প্রকৃত port ব্যবহার করবে।
Tag না দিলে Docker সাধারণত latest tag ব্যবহার করে। তবে latest মানেই স্বয়ংক্রিয়ভাবে সর্বশেষ তৈরি বা সর্বাধিক নতুন version নয়—এটি একটি প্রচলিত tag মাত্র। 5. Docker Image Inspect করা
Docker image সম্পর্কে বিস্তারিত তথ্য পেতে নিচের command-গুলো ব্যবহার করো।
সব local images দেখো
docker images

Image name, tag, ID ও size দেখাবে।

Image-এর বিস্তারিত configuration
docker image inspect docker-with-typescript-backend:latest

OS, architecture, entrypoint, environment ও অন্যান্য configuration দেখাবে।

Image-এর layer history
docker history docker-with-typescript-backend:latest

Image তৈরির বিভিন্ন layer ও তাদের size সম্পর্কে ধারণা দেবে।

Dangling images দেখো
docker images -f dangling=true

Tag ছাড়া থাকা কিছু intermediate বা unreferenced image দেখাবে।

6. Docker Image-এর Size কমানো
   তোমার আগের output-এ দেখা গিয়েছিল:

- Content size: 405MB
- Disk usage: 1.62GB
  এগুলো ভিন্ন ধরনের পরিমাপ। Shared layers, image storage এবং Docker Desktop-এর হিসাবের কারণে পার্থক্য হতে পারে।
  Size কমানোর জন্য:

1. .dockerignore ব্যবহার করো।
2. node_modules, .git ও অপ্রয়োজনীয় local files build context থেকে বাদ দাও।
3. package-lock.json থাকলে dependency installation-এ সেটি ব্যবহার করো।
4. Production image-এ development dependencies না রাখার পরিকল্পনা করো।
5. Multi-stage build বিবেচনা করো।
   উদাহরণ .dockerignore:
   node_modules
   .git
   .env
   dist
   coverage
   npm-debug.log

সতর্কতা: dist বাদ দেবে কেবল যদি Docker build-এর সময় সেটি তৈরি হয়। আর .env বাদ দিলে প্রয়োজনীয় environment variables নিরাপদভাবে অন্য পদ্ধতিতে সরবরাহ করতে হবে। 7. Multi-stage Build কী?
TypeScript application-এর ক্ষেত্রে প্রথম stage-এ code compile করা যায়, আর দ্বিতীয় stage-এ শুধু production-এর জন্য প্রয়োজনীয় files রাখা যায়।
FROM node:20 AS builder

WORKDIR /app

COPY package\*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-slim AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package\*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/app/server.js"]

এই উদাহরণটি তখনই ব্যবহারযোগ্য, যদি তোমার project-এর build command dist তৈরি করে এবং compiled entry point সত্যিই dist/app/server.js হয়। তোমার বর্তমান project-এর structure ও package.json যাচাই না করে এটি সরাসরি ব্যবহার কোরো না। 8. Practical Exercise
তোমার Git Bash terminal-এ নিচের command-গুলো চালাও:
Learning checklist
0 / 4

[ ] Image-এর layer history দেখেছি
docker history docker-with-typescript-backend:latest
[ ] Image configuration inspect করেছি
docker image inspect docker-with-typescript-backend:latest
[ ] Dockerfile-এর layer order বুঝেছি
cat Dockerfile
[ ] Build context-এর জন্য .dockerignore পরীক্ষা করেছি
cat .dockerignore
Copy all commands
এই লেসন থেকে যা শিখবে

- Image ও container-এর পার্থক্য
- Image layers ও caching
- Image tags ও versioning
- docker inspect এবং docker history
- Image size optimization
- Multi-stage build-এর উদ্দেশ্য
  পরবর্তী লেসন: 2-6 — Sharing Docker Images Using a Registry। সেখানে Docker Hub-এ image push এবং অন্য computer থেকে pull করা শিখতে পারবে।
