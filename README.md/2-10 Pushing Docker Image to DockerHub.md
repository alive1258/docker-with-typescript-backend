## 2-10 Pushing Docker Image to DockerHub

Docker শেখার এই লেসনে আমরা শিখব কীভাবে নিজের তৈরি Docker image-কে Docker Hub-এ upload (push) করতে হয় এবং পরে অন্য কম্পিউটার থেকে সেই image download (pull) করে container চালাতে হয়।

1. Docker Hub কী?

medium.com

Docker Hub হলো Docker image সংরক্ষণ ও শেয়ার করার একটি online registry। GitHub-এ যেমন source code রাখা যায়, তেমনি Docker Hub-এ Docker image রাখা ও শেয়ার করা যায়।
উদাহরণ:

- Dockerfile: Image তৈরি করার নির্দেশনা।
- Docker Image: Application এবং তার প্রয়োজনীয় environment-এর packaged version।
- Docker Hub: Image online-এ সংরক্ষণ ও শেয়ার করার জায়গা।
- Docker Container: Image থেকে চালু হওয়া application instance।

2. Docker Hub account তৈরি করো
   Docker Hub — Create an account or sign inDocker Hub-এ login করে তোমার repository তৈরি বা যাচাই করো।
   তোমার বর্তমান image tag:
   docker-with-typescript-backend:latest

Docker Hub-এর জন্য তৈরি করা tag:
zamirulkabir/typescript-backend-docker:v1

এখানে:
অংশ অর্থ
zamirulkabir Docker Hub username
typescript-backend-docker Repository name
v1 Image version tag 3. Docker Hub-এ login
Git Bash বা terminal-এ চালাও:
docker login

Login সফল হলে Docker Hub-এ image push করার অনুমতি পাবে। 4. Image tag করা
তুমি এই ধাপটি ইতিমধ্যে সফলভাবে সম্পন্ন করেছ। শেখার জন্য পুরো command-টি আবার দেখো:
docker image tag docker-with-typescript-backend:latest zamirulkabir/typescript-backend-docker:v1

তারপর image যাচাই করো:
docker images

তোমার output-এ দুটি tag একই image ID 81ab432c3b65 ব্যবহার করছে। এটি স্বাভাবিক—দুটি আলাদা image তৈরি হয়নি। 5. Docker Hub-এ image push করা
এখন সবচেয়ে গুরুত্বপূর্ণ command:
docker push zamirulkabir/typescript-backend-docker:v1

Docker তোমার local image-এর layers Docker Hub-এ upload করবে। আগে থেকেই কোনো layer সেখানে থাকলে সেটি আবার upload করার প্রয়োজন নাও হতে পারে।
সফল হলে Docker Hub repository-তে v1 tag দেখতে পাবে।
তোমার পরবর্তী কাজ

docker login
docker push zamirulkabir/typescript-backend-docker:v1

তুমি image tag ইতিমধ্যে তৈরি করেছ। এখন login এবং push করলেই পরবর্তী ধাপে যেতে পারবে।

6. Docker Hub-এ image যাচাই করা
   Open your Docker Hub repositoriesRepository-তে গিয়ে Tags section দেখো। সেখানে v1 থাকলে image push হয়েছে।
7. অন্য কম্পিউটারে image pull করা
   Docker Hub-এ image push করার সুবিধা হলো, অন্য কম্পিউটারেও image ব্যবহার করা যায়।
   docker pull zamirulkabir/typescript-backend-docker:v1

এরপর image যাচাই করো:
docker images

যদি repository public হয়, সাধারণত অন্য কম্পিউটার থেকে pull করতে login প্রয়োজন হয় না। Private repository হলে access লাগবে। 8. Image থেকে container চালানো
docker run -d \
 --name typescript-backend \
 -p 5000:5000 \
 zamirulkabir/typescript-backend-docker:v1

এখানে:

- -d — background-এ container চালায়।
- --name — container-এর নাম নির্ধারণ করে।
- -p 5000:5000 — host-এর port 5000-কে container-এর port 5000-এর সঙ্গে যুক্ত করে।
  সতর্কতা: তোমার Node.js application যদি container-এর ভেতরে port 5000-এ listen না করে, তাহলে port mapping পরিবর্তন করতে হবে।
  Container যাচাই করতে:
  docker ps
  docker logs typescript-backend

docker ps-এ container না দেখালে সেটি বন্ধ হয়ে গেছে কি না জানতে চালাও:
docker ps -a

9. দরকারি Docker commands
   Command কাজ
   docker login Docker Hub-এ login
   docker images Local images দেখা
   docker image tag SOURCE TARGET Image-এ নতুন tag তৈরি
   docker push IMAGE Registry-তে image upload
   docker pull IMAGE Registry থেকে image download
   docker ps Running containers দেখা
   docker logs CONTAINER Container-এর logs দেখা
10. গুরুত্বপূর্ণ best practices

- .env ফাইল, password, API key বা secret Docker image-এ অন্তর্ভুক্ত করবে না।
- Production-এ v1-এর মতো version tag ব্যবহার করো; শুধু latest-এর ওপর নির্ভর কোরো না।
- Push করার আগে নিশ্চিত হও যে application সঠিকভাবে build হচ্ছে এবং container চালু হচ্ছে।
- Public repository-তে image push করলে অন্যরাও সেটি দেখতে ও pull করতে পারবে।
  Lesson summary
  এই লেসন শেষে তুমি শিখলে কীভাবে Docker image tag, push, pull এবং run করতে হয়। তোমার ক্ষেত্রে image tag তৈরি হয়ে গেছে; এখন docker login এবং docker push চালিয়ে Docker Hub-এ প্রকাশ করো।
  পরবর্তী লেসনে Docker-এর পরের বিষয়টি নিয়ে এগোনোর আগে নিশ্চিত হও যে image সফলভাবে push হয়েছে।
