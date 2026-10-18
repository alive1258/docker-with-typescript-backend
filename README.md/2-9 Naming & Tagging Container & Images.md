## 2-9 Naming & Tagging Container & Images

Docker-এ Naming এবং Tagging ব্যবহার করে Images ও Containers সহজে শনাক্ত, পরিচালনা এবং version control করা যায়।
এই লেসনে তোমার docker-with-typescript-backend project দিয়ে বাস্তব উদাহরণ দেখব।

1. Image Name ও Tag কী?
   Docker image-এর নাম এবং tag দিয়ে image-টি শনাক্ত করা হয়।
   উদাহরণ
   docker-with-typescript-backend:v1.0.0

Image name
docker-with-typescript-backend
কোন application-এর image, তা বোঝায়।

Tag
v1.0.0
কোন version বা release, তা বোঝায়।

Image-এর tag না দিলে Docker সাধারণত latest ব্যবহার করে। তবে latest নিজে থেকে সর্বশেষ version নির্ধারণ করে না; এটি কেবল একটি প্রচলিত tag। 2. Docker Image-কে Name ও Tag দেওয়া
Image build করার সময় -t ব্যবহার করো:
docker build -t docker-with-typescript-backend:v1.0.0 .

এখানে:

- docker build — image তৈরি করে।
- -t — image-এর নাম ও tag নির্ধারণ করে।
- . — বর্তমান directory-কে build context হিসেবে ব্যবহার করে।
  Images দেখো:
  docker images

একই application-এর একাধিক version রাখতে পারো:
docker build -t docker-with-typescript-backend:v1.0.0 .
docker build -t docker-with-typescript-backend:v1.1.0 .

তবে দ্বিতীয় command চালানোর আগে source code বা build configuration-এ প্রয়োজনীয় পরিবর্তন থাকা উচিত, নইলে একই code-এর আরেকটি tag তৈরি হতে পারে। 3. Existing Image-কে নতুন Tag দেওয়া
আগে তৈরি করা image-এর জন্য নতুন tag তৈরি করতে docker tag ব্যবহার করা হয়।
docker tag docker-with-typescript-backend:latest docker-with-typescript-backend:v1.0.0

এতে সাধারণত নতুন image copy তৈরি হয় না। একই image ID-কে আরেকটি name/tag দিয়ে reference করা হয়।
যাচাই করো:
docker images

তুমি একই IMAGE ID-এর পাশে latest এবং v1.0.0—দুটি tag দেখতে পারো। 4. Container-এর নাম নির্ধারণ
Image-এর মতো container-ও নাম দিয়ে পরিচালনা করা যায়।
docker run -d \
 --name typescript-backend-dev \
 -p 5000:5000 \
 docker-with-typescript-backend:v1.0.0

এখানে --name typescript-backend-dev হলো container-এর নাম।
Container-এর নাম ব্যবহার করে সহজে command চালাতে পারো:
docker ps -a
docker logs typescript-backend-dev
docker stop typescript-backend-dev
docker start typescript-backend-dev

মনে রাখবে: একই সময়ে দুটি container-এর একই নাম হতে পারে না।
তোমার application-এর প্রকৃত port 5000 না হলে port mapping পরিবর্তন করবে। 5. Container Rename করা
আগে তৈরি করা container-এর নাম পরিবর্তন করতে:
docker rename typescript-backend-dev typescript-backend-prod

এখন নতুন নাম ব্যবহার করবে:
docker logs typescript-backend-prod

Rename করলে container-এর image বা application code পরিবর্তিত হয় না। 6. Naming Convention: Development বনাম Production
একটি project-এর জন্য পরিষ্কার naming convention ব্যবহার করলে কাজ সহজ হয়।
ব্যবহার Image tag Container name
Development :dev backend-dev
Testing :test backend-test
Release 1.0.0 :v1.0.0 backend-v1
Release 1.1.0 :v1.1.0 backend-v1-1
উদাহরণ:
docker build -t my-backend:dev .
docker run -d --name backend-dev my-backend:dev

Production deployment-এ শুধু নামের মধ্যে prod লিখলেই application production-ready হয়ে যায় না। সেখানে security, configuration, logging, resource limits এবং deployment process-ও গুরুত্বপূর্ণ। 7. Registry-এর জন্য Image Tag করা
Docker Hub-এ নিজের repository-তে image push করতে সাধারণত registry username-সহ image tag দিতে হয়।
উদাহরণস্বরূপ, YOUR_DOCKERHUB_USERNAME-এর জায়গায় নিজের Docker Hub username বসাবে:
docker tag docker-with-typescript-backend:v1.0.0 YOUR_DOCKERHUB_USERNAME/docker-with-typescript-backend:v1.0.0

তারপর:
docker login
docker push YOUR_DOCKERHUB_USERNAME/docker-with-typescript-backend:v1.0.0

এভাবে অন্য computer থেকেও image pull করা যাবে:
docker pull YOUR_DOCKERHUB_USERNAME/docker-with-typescript-backend:v1.0.0

8. Practical Lab
   Learning checklist
   0/5

[ ] docker images দিয়ে existing image দেখেছি
[ ] docker tag দিয়ে নতুন image tag তৈরি করেছি
[ ] docker build -t দিয়ে versioned image তৈরি করেছি
[ ] docker ps -a দিয়ে container names পরীক্ষা করেছি
[ ] docker logs দিয়ে নির্দিষ্ট container-এর logs দেখেছি
Copy practice commands
সতর্কতা: docker build -t ... চালানোর আগে নিশ্চিত হও তোমার Dockerfile এবং application-এর startup command সঠিক। তোমার আগের project-এ entry file ছিল src/app/server.ts; তাই package.json-এর script যেন সঠিক file path ব্যবহার করে।
Quick revision

- Image name: কোন application-এর image।
- Image tag: image-এর version বা label।
- Container name: নির্দিষ্ট container-কে শনাক্ত করার নাম।
- docker tag — existing image-কে নতুন tag দেয়।
- docker rename — existing container-এর নাম পরিবর্তন করে।
  পরবর্তী লেসন: 2-10 — Copying Files Between Host & Container।
