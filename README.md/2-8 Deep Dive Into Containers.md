## 2-8 Deep Dive Into Containers

এই লেসনে আমরা Docker Container কীভাবে কাজ করে, container-এর lifecycle, filesystem, port mapping, environment variables, logs, এবং container-এর ভেতরে প্রবেশ করে debugging করার পদ্ধতি শিখব।
তোমার docker-with-typescript-backend TypeScript project-কে উদাহরণ হিসেবে ব্যবহার করব।

1. Docker Container আসলে কী?
   Docker Container হলো একটি isolated process environment, যেখানে application চলে। এটি Docker Image থেকে তৈরি হয় এবং image-এর filesystem ও configuration ব্যবহার করে।
   Docker Image
   Node.js + Application + Dependencies

docker run
Docker Container
Isolated environment-এ application process
Filesystem
Network
Processes

সহজভাবে:

- Image হলো application চালানোর template।
- Container হলো সেই image থেকে তৈরি instance।
- একই image থেকে একাধিক container চালানো যায়।
- Container বন্ধ বা remove হলেও image সাধারণত থেকে যায়।

2. Container-এর Lifecycle
   একটি container সাধারণত এই ধাপগুলো অতিক্রম করে:
   Created
   Container তৈরি হয়েছে

Running
Main process চলছে

Exited
Main process শেষ হয়েছে বা error-এ বন্ধ হয়েছে

গুরুত্বপূর্ণ command:

# Container তৈরি ও চালানো

docker run -d --name my-api my-image

# বন্ধ container আবার চালানো

docker start my-api

# Running container বন্ধ করা

docker stop my-api

# সব container দেখা

docker ps -a

# Container remove করা

docker rm my-api

মনে রাখবে, docker run সাধারণত নতুন container তৈরি করে; docker start আগে থেকে তৈরি container চালু করে। 3. Container-এর ভিতরে কীভাবে প্রবেশ করবে?
কোনো running container-এর ভিতরে command চালিয়ে application debug করা যায়।
docker exec -it typescript-backend sh

এখানে:

- docker exec — running container-এর ভিতরে নতুন command চালায়।
- -i — interactive input চালু রাখে।
- -t — terminal interface দেয়।
- sh — container-এর shell চালু করে।
  Container-এর ভিতরে ঢোকার পর:
  pwd
  ls -la
  node --version

বের হতে:
exit

তোমার container অবশ্যই running থাকতে হবে। Container-এ sh না থাকলে অন্য shell বা debugging পদ্ধতি ব্যবহার করতে হবে। 4. Container-এর Filesystem
Container-এর filesystem বুঝতে তিনটি বিষয় গুরুত্বপূর্ণ।

Image layers
Image-এর filesystem-এর মূল অংশ read-only। Docker image তৈরির সময় বিভিন্ন layer যোগ হয়।

Writable container layer
Container চলার সময় filesystem-এ পরিবর্তন হলে সাধারণত সেগুলো container-এর writable layer-এ থাকে। Container remove করলে এই পরিবর্তনগুলো হারিয়ে যায়।

Volumes
গুরুত্বপূর্ণ data container-এর বাইরে persist করার জন্য volume ব্যবহার করা হয়। Container remove করলেও volume-এর data সাধারণত থেকে যায়।

উদাহরণ:
docker volume create backend-data
docker volume ls

কোনো application data persist করতে volume-টি container-এর উপযুক্ত directory-তে mount করতে হয়। 5. Port Mapping কীভাবে কাজ করে?
Container-এর ভিতরে backend server চালু থাকলেও host computer থেকে সেটি সরাসরি accessible নাও হতে পারে। Port mapping দিয়ে host-এর port-এর সঙ্গে container-এর port যুক্ত করা হয়।
docker run -d \
 --name my-api \
 -p 5000:3000 \
 my-image

এখানে:

- 5000 — host computer-এর port।
- 3000 — container-এর ভিতরে application-এর port।
  অর্থাৎ browser-এ http://localhost:5000 খুললে request container-এর port 3000-এ পৌঁছাবে।
  তোমার application যদি container-এর ভিতরে 5000 port-এ চলে, তাহলে mapping হবে -p 5000:5000। Application কোন port-এ চলছে, সেটি আগে নিশ্চিত করবে।

6. Environment Variables
   Environment variables দিয়ে application-এর configuration সরবরাহ করা যায়।
   docker run -d \
    --name my-api \
    -e NODE_ENV=production \
    -e PORT=3000 \
    -p 5000:3000 \
    my-image

Container-এর ভিতরে environment variables দেখতে:
docker exec my-api printenv

এতে environment-এ থাকা sensitive values-ও দেখা যেতে পারে। তাই output share করার আগে secrets মুছে ফেলবে।
Security best practice: Password, JWT secret বা database credentials Dockerfile-এ hardcode করবে না। Environment variables বা উপযুক্ত secrets management ব্যবহার করবে। 7. Container Logs ও Troubleshooting
Application ঠিকমতো চলছে কি না পরীক্ষা করার জন্য:
docker ps -a
docker logs my-api
docker logs -f my-api
docker inspect my-api

কোনো container Exited (1) হলে তার অর্থ সাধারণত application error code 1 দিয়ে শেষ হয়েছে। আসল কারণ জানার জন্য logs পরীক্ষা করতে হবে।
তোমার আগের TypeScript project-এ src/server.ts path-এর সমস্যা ছিল। তোমার actual file ছিল src/app/server.ts। তাই Docker container-এর startup command ও package.json-এর script সঠিক entry file নির্দেশ করছে কি না নিশ্চিত করা জরুরি। 8. Resource Usage দেখা
কোন container কত CPU ও memory ব্যবহার করছে:
docker stats

একটি নির্দিষ্ট container-এর resource usage দেখতে:
docker stats typescript-backend

এটি memory leak বা অতিরিক্ত resource usage খুঁজতে সাহায্য করতে পারে। 9. Practical Lab
নিচের checklist অনুসরণ করে অনুশীলন করো।
Container Lab
0/6

[ ] docker ps -a দিয়ে container-এর lifecycle দেখো
[ ] docker logs দিয়ে startup logs পরীক্ষা করো
[ ] docker inspect দিয়ে container configuration দেখো
[ ] Running container-এ docker exec -it ... sh ব্যবহার করো
[ ] docker stats দিয়ে resource usage দেখো
[ ] docker volume create backend-data দিয়ে volume তৈরি করো
নোট: docker exec ও docker stats-এর জন্য container running থাকতে হবে। তোমার আগের container যদি Exited (1) থাকে, প্রথমে startup error ঠিক করো।

এই লেসনের মূল বিষয়

- Container হলো isolated application process।
- run, start, stop, exec ও rm আলাদা কাজ করে।
- Container-এর writable layer স্থায়ী storage-এর বিকল্প নয়।
- Volume দিয়ে data persist করা যায়।
- Port mapping দিয়ে host থেকে application access করা যায়।
- Logs, inspect ও stats ব্যবহার করে debugging করা যায়।
  পরবর্তী লেসন: 2-9 — Using Bind Mounts and Volumes — এখানে container-এর সঙ্গে local project files ও persistent data যুক্ত করা শিখবে।
