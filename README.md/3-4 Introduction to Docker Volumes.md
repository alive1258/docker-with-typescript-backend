## 3-4 Introduction to Docker Volumes — বিস্তারিত বাংলা আলোচনা

Docker শেখার এই অধ্যায়ে আমরা এমন একটি গুরুত্বপূর্ণ বিষয় শিখব, যেটি বাস্তব Backend Development-এ প্রায় প্রতিটি Dockerized application-এর জন্য প্রয়োজন হয়: Docker Volumes।

তুমি যেহেতু TypeScript ও Node.js দিয়ে Backend তৈরি করছ, তাই আমরা উদাহরণগুলো Node.js application এবং database-এর সঙ্গে মিলিয়ে বুঝব।

1. Docker Volume কী?
   Docker Volume হলো Docker-এর একটি storage mechanism, যার সাহায্যে container-এর বাইরেও application-এর প্রয়োজনীয় data সংরক্ষণ করা যায়।

সহজভাবে ধরো, তোমার একটি Node.js backend Docker container-এর মধ্যে চলছে। সেই application ব্যবহারকারীর তথ্য বা অন্য কোনো data একটি ফাইলে সংরক্ষণ করছে। পরে তুমি container delete করে দিলে, container-এর নিজস্ব filesystem-এ থাকা data হারিয়ে যেতে পারে।

এই সমস্যা সমাধানের জন্য Docker Volume ব্যবহার করা হয়।
Docker Container

Node.js Backend / Database

Application data লিখছে ও পড়ছে

Data read / write

Docker Volume

Container-এর জীবনচক্র থেকে আলাদা persistent storage

মূল ধারণা: Container তৈরি, বন্ধ বা মুছে ফেলা হলেও Volume-এর data সাধারণত থেকে যায়—যতক্ষণ না Volume নিজে মুছে ফেলা হয় বা underlying storage হারিয়ে যায়। 2. Volume কেন প্রয়োজন?
Docker container সাধারণত একটি নির্দিষ্ট image থেকে তৈরি হয়। Container-এর writable layer-এ লেখা data container মুছে ফেলার সময় হারিয়ে যেতে পারে।

উদাহরণ হিসেবে, তুমি একটি backend container চালালে:
docker run -d --name my-backend node:20

এখন container-এর ভেতরে application কোনো file তৈরি করল। পরে container মুছে ফেললে সেই file container-এর সঙ্গে হারিয়ে যেতে পারে।
docker rm -f my-backend

তাই গুরুত্বপূর্ণ data container-এর writable layer-এ রেখে দেওয়ার পরিবর্তে Volume বা উপযুক্ত persistent storage-এ রাখা ভালো।

Docker Volume-এর প্রধান সুবিধাগুলো হলো:

- Persistence: Container recreate করলেও data রাখা যায়।
- Data sharing: একাধিক container একই Volume ব্যবহার করতে পারে।
- Lifecycle separation: Container ও data আলাদাভাবে পরিচালনা করা যায়।
- Database storage: PostgreSQL, MySQL, MongoDB ইত্যাদির data সংরক্ষণে কাজে লাগে।
- Backup ও migration: সঠিক পদ্ধতিতে Volume-এর data backup ও অন্য environment-এ স্থানান্তর করা যায়।

3. Container-এর filesystem ও Volume-এর পার্থক্য
   Docker image-এর ভেতরে থাকা files সাধারণত read-only image layers-এ থাকে। Container চালু হলে তার ওপর একটি writable layer যুক্ত হয়। Container-এর writable layer-এ তৈরি data container মুছে দিলে সাধারণত হারিয়ে যায়। Volume এই data-কে container-এর lifecycle থেকে আলাদা রাখে।

Docker Docs
+1

Container writable layer

Container-এর নিজস্ব data; container মুছে দিলে এই layer-ও মুছে যায়।

Docker Volume

Container থেকে আলাদা storage; container মুছে ফেললেও Volume-এর data সাধারণত থেকে যায়।

4. Docker Volume-এর ধরন
   A. Named Volume
   Named Volume-এর একটি নির্দিষ্ট নাম থাকে। Docker নিজে এর storage location পরিচালনা করে।

উদাহরণ:
docker volume create backend-data

এখানে backend-data হলো Volume-এর নাম।

ব্যবহার:
docker run -d --name volume-demo \
 --mount source=backend-data,target=/data \
 alpine sleep 3600

এই command-এ:

- --mount — storage mount করার জন্য।
- source=backend-data — যে Volume ব্যবহার হবে।
- target=/data — container-এর যে directory-তে Volume যুক্ত হবে।
- alpine — ছোট Linux-based Docker image।
- sleep 3600 — container-কে প্রায় এক ঘণ্টা চালু রাখবে।
  Named Volume সাধারণত database-এর মতো গুরুত্বপূর্ণ persistent data রাখার জন্য ভালো পছন্দ।

Docker Docs

B. Anonymous Volume
Anonymous Volume তৈরি করার সময় আলাদা নাম দেওয়া হয় না।
docker run -d --name anonymous-demo \
 -v /data \
 alpine sleep 3600

Docker নিজে Volume তৈরি করবে। তবে Volume-টি শনাক্ত ও পরে পুনরায় ব্যবহার করা named volume-এর তুলনায় কঠিন হতে পারে।
C. Bind Mount
Bind Mount হলো host computer-এর নির্দিষ্ট file বা directory-কে container-এর directory-এর সঙ্গে যুক্ত করা।

ধরো, তোমার project আছে:
E:\backend-docker\docker-with-typescript-backend

Git Bash থেকে project directory-তে থাকা অবস্থায় চালাতে পারো:
docker run --rm \
 --mount type=bind,source="$(pwd)",target=/app \
 alpine ls /app

এখানে $(pwd) বর্তমান directory-এর path দেয়। ফলে container-এর /app directory-তে তোমার project files দেখা যাবে।

কখন কোনটি ব্যবহার করবে?
বিষয় Named Volume Bind Mount
Storage location Docker পরিচালনা করে তুমি host path নির্ধারণ করো
প্রধান ব্যবহার Database ও persistent application data Development-এর source code
Host থেকে সরাসরি file access তুলনামূলকভাবে অসুবিধাজনক সহজ
Container মুছলে data Volume আলাদা থাকলে থাকে Host-এর original files থাকে

Docker-এর storage guide অনুযায়ী, host ও container-এর মধ্যে file share করতে Bind Mount উপযোগী; আর Docker-managed persistent storage-এর জন্য Volume সাধারণত ভালো পছন্দ।

Docker Docs
+1

5. Practical: Volume তৈরি ও ব্যবহার
   এবার নিজে পরীক্ষা করো কীভাবে একটি Volume-এ data সংরক্ষণ করে container মুছে ফেলার পরেও data পাওয়া যায়।
   Step 1 — Volume তৈরি করো
   docker volume create lesson-data

Step 2 — Volume-এ একটি file লেখো
docker run --rm \
 --mount source=lesson-data,target=/data \
 alpine sh -c "echo 'Hello Docker Volume' > /data/message.txt"

এই command একটি অস্থায়ী container চালাবে, /data/message.txt ফাইলে লেখা সংরক্ষণ করবে, তারপর container মুছে দেবে। Volume কিন্তু থাকবে।
Step 3 — নতুন container থেকে file পড়ো
docker run --rm \
 --mount source=lesson-data,target=/data \
 alpine cat /data/message.txt

Output হবে:
Hello Docker Volume

কী প্রমাণ হলো?

প্রথম container মুছে ফেলা হলেও lesson-data Volume-এ লেখা data দ্বিতীয় container থেকে পড়া যাচ্ছে। এটাই Docker Volume-এর persistence।

6. Volume পরিচালনার গুরুত্বপূর্ণ commands
   সব Volume দেখো
   docker volume ls

একটি Volume সম্পর্কে বিস্তারিত দেখো
docker volume inspect lesson-data

Volume কোন container ব্যবহার করছে, তা দেখো
docker ps -a --filter volume=lesson-data

ব্যবহার না হওয়া Volume পরিষ্কার করার command
docker volume prune

সতর্কতা: এই command অব্যবহৃত Volume মুছে দিতে পারে। গুরুত্বপূর্ণ data থাকতে পারে এমন Volume পরিষ্কার করার আগে যাচাই ও backup করো।

Named Volume সরাতে সাধারণত:
docker volume rm lesson-data

এটি চালানোর আগে নিশ্চিত হও যে Volume-এর data আর প্রয়োজন নেই এবং কোনো container এটি ব্যবহার করছে না। Volume মুছে ফেললে তার data হারাতে পারো। শুধু container সরানো আর Volume সরানো এক বিষয় নয়।

Docker Docs

7. TypeScript Backend-এ Docker Volume কোথায় কাজে লাগবে?
   তোমার docker-with-typescript-backend project-এর জন্য কয়েকটি বাস্তব উদাহরণ:

- PostgreSQL / MySQL: Database-এর data container recreate হলেও সংরক্ষণ করা।
- File uploads: Application-এর upload করা ফাইল persistent storage-এ রাখা।
- Development: Bind Mount দিয়ে local source code container-এ দেখা।
- Logs: প্রয়োজন অনুযায়ী application logs আলাদা storage-এ রাখা।
  একটি গুরুত্বপূর্ণ বিষয়: Docker Volume নিজে database নয়। এটি শুধু data সংরক্ষণের ব্যবস্থা। Database container-এর সঠিক data directory-তে Volume mount করতে হয়; ভুল directory mount করলে প্রত্যাশিত persistence নাও পাওয়া যেতে পারে।

8. নিজের শেখা যাচাই করো
1. Container মুছে ফেলার পর Named Volume-এর data সাধারণত কী হয়?

স্বয়ংক্রিয়ভাবে সবসময় মুছে যায়

Volume আলাদা থাকলে থেকে যায়

Docker image-এ রূপান্তরিত হয়

2. Local project files container-এর মধ্যে share করার জন্য কোনটি বেশি উপযোগী?

Bind Mount

docker push

Container writable layer

3. নিচের কোন command নতুন Named Volume তৈরি করে?

docker image create lesson-data

docker volume create lesson-data

docker container create lesson-data

আবার চেষ্টা করো
Lesson summary

- Docker Volume container-এর বাইরে data persistent রাখতে সাহায্য করে।
- Named Volume Docker পরিচালনা করে; Bind Mount host-এর নির্দিষ্ট path ব্যবহার করে।
- Container delete করলেই Named Volume সাধারণত delete হয় না।
- docker volume create, docker volume ls, docker volume inspect হলো গুরুত্বপূর্ণ commands।
- Volume persistence দেয়, কিন্তু backup-এর বিকল্প নয়।
