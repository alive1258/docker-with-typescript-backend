## 4-8 A Basic Solution For Container To Container Communication

এই lesson-এ আমরা শিখব কীভাবে Docker-এর সাহায্যে একাধিক container-এর মধ্যে সহজে communication তৈরি করা যায়।

ধরো, তুমি একটি E-commerce application তৈরি করছ। তোমার application-এ রয়েছে:

- Go Backend API
- PostgreSQL Database
- Redis Cache
  এখন Go Backend-কে PostgreSQL ও Redis-এর সঙ্গে communicate করতে হবে। কিন্তু প্রতিটি container-এর IP address manually configure করা ভালো সমাধান নয়।

Docker-এর User-defined Bridge Network ব্যবহার করে আমরা খুব সহজেই এই সমস্যার সমাধান করতে পারি।

1. Understanding the Problem
   ধরো, তোমার দুটি container রয়েছে:

- backend-container
- database-container
  তুমি চাও Backend container থেকে Database container-এ connection তৈরি করতে।

একটি সাধারণ সমস্যা হলো, container-এর IP address পরিবর্তিত হতে পারে। ফলে IP address hardcode করলে পরবর্তীতে connection সমস্যা তৈরি হতে পারে।

qiita.com

আমাদের লক্ষ্য:
Backend Container
|
| Database Request
v
Docker Network
|
v
Database Container

2. Solution: Docker User-defined Bridge Network
   Docker-এ User-defined Bridge Network তৈরি করলে একই network-এর container-গুলো একে অপরের সঙ্গে container name ব্যবহার করে communicate করতে পারে।

এর সুবিধা:

1. Container name দিয়ে অন্য container-কে access করা যায়।
2. Docker automatic DNS resolution প্রদান করে।
3. IP address manually configure করতে হয় না।
4. Container-এর IP পরিবর্তিত হলেও name-based communication কাজ করে।
5. একাধিক application container একই network ব্যবহার করতে পারে।
6. Step 1: Create a Docker Network
   প্রথমে একটি custom network তৈরি করি।
   docker network create app-network

এখানে:

- docker network create — নতুন Docker network তৈরি করে।
- app-network — Network-এর নাম।
  তৈরি হয়েছে কি না যাচাই করো:
  docker network ls

Expected output-এর একটি অংশ:
NETWORK ID NAME DRIVER
xxxxxxxxxxxx bridge bridge
xxxxxxxxxxxx host host
xxxxxxxxxxxx app-network bridge

4. Step 2: Create a Database Container
   এবার PostgreSQL container তৈরি করব।
   docker run -d \
    --name postgres-db \
    --network app-network \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=change_me \
    -e POSTGRES_DB=ecommerce \
    postgres:17-alpine

Command explanation:
Command কাজ
-d Background-এ container চালায়
--name postgres-db Container-এর নাম
--network app-network Custom network-এ যুক্ত করে
POSTGRES_USER Database username
POSTGRES_PASSWORD Database password
POSTGRES_DB Database তৈরি করে

Learning example
change_me শুধু শেখার জন্য placeholder password। Production-এ secure secret ব্যবহার করবে।

এখন container চালু হয়েছে কি না দেখো:
docker ps

5. Step 3: Create a Backend Container
   এবার একটি Alpine container চালু করি, যেটি Backend container-এর মতো Database-এর সঙ্গে communication করবে।
   docker run -it --rm \
    --name backend-container \
    --network app-network \
    alpine:latest sh

এখন Alpine container-এর terminal-এ আছ।

PostgreSQL server-এর সঙ্গে connection পরীক্ষা করতে nc ব্যবহার করব।

প্রথমে install করো:
apk add --no-cache netcat-openbsd

এবার connection পরীক্ষা করো:
nc -zv postgres-db 5432

Expected result
postgres-db (172.x.x.x:5432) open

তোমার IP address আলাদা হতে পারে।

এখানে সবচেয়ে গুরুত্বপূর্ণ বিষয়:
postgres-db

আমরা Database container-এর নাম ব্যবহার করে connection তৈরি করেছি। IP address ব্যবহার করিনি। 6. How Does Docker DNS Work?
Docker-এর User-defined Bridge Network-এর নিজস্ব DNS resolution ব্যবস্থা রয়েছে।

ধরো:
app-network
|
|---- backend-container
|
|---- postgres-db
|
|---- redis-cache

Backend container যখন request পাঠায়:
postgres-db:5432

Docker-এর embedded DNS postgres-db নামটি সংশ্লিষ্ট container-এর IP address-এ resolve করে।

hjk.life

এভাবে container-এর IP address পরিবর্তিত হলেও container name ব্যবহার করে communication করা যায়। 7. Important: Container Port vs Host Port
এটি খুব গুরুত্বপূর্ণ বিষয়।

ধরো, PostgreSQL container চালানোর সময় তুমি কোনো Host port publish করোনি।
docker run -d \
 --name postgres-db \
 --network app-network \
 postgres:17-alpine

তবুও একই Docker network-এর Backend container PostgreSQL-এর port 5432 ব্যবহার করতে পারবে।

কারণ একই Docker network-এর container-গুলোর মধ্যে communication-এর জন্য সাধারণত -p প্রয়োজন হয় না।
Connection Address
Backend → PostgreSQL postgres-db:5432
Host Machine → PostgreSQL localhost:5432 (যদি port publish করা থাকে)

মনে রাখবে:

- EXPOSE হলো image-এর port সম্পর্কে metadata।
- -p Host Machine-এর সঙ্গে port publish করে।
- একই Docker network-এ container-to-container communication-এর জন্য container-এর listening port ব্যবহার করতে হয়।

8. Real-world Go E-commerce Backend Example
   ধরো, তোমার Go application-এর PostgreSQL configuration এমন:
   APP_PORT=5000

DB_HOST=postgres-db
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=change_me
DB_NAME=ecommerce

Go application-এর database connection string:
dsn := "host=postgres-db user=admin password=change_me dbname=ecommerce port=5432 sslmode=disable"

এখানে:
postgres-db

হলো PostgreSQL container-এর নাম।

তাই Go Backend container এবং PostgreSQL container একই Docker network-এ থাকলে database connection তৈরি করতে পারবে।
E-commerce Docker Architecture
Go Backend API

Gin / Echo · Port 5000

app-network

PostgreSQL

postgres-db:5432

Redis

redis-cache:6379

সব container একই user-defined Docker network-এ যুক্ত। 9. Useful Docker Network Commands
Command কাজ
docker network ls সব network দেখায়
docker network create app-network Network তৈরি করে
docker network inspect app-network Network details দেখায়
docker network connect app-network CONTAINER Container-কে network-এ যুক্ত করে
docker network disconnect app-network CONTAINER Container-কে network থেকে বিচ্ছিন্ন করে
docker network rm app-network Network remove করে

Network-এর বিস্তারিত দেখতে:
docker network inspect app-network

10. Common Mistakes
    Mistake 1: Different networks

Backend এবং Database আলাদা network-এ থাকলে সরাসরি container-name DNS communication কাজ করবে না।

Solution: উভয়কে একই user-defined network-এ যুক্ত করো।

Mistake 2: Using localhost
DB_HOST=localhost

Backend container-এর ভিতরে localhost মানে Backend container নিজেই।

সঠিক:
DB_HOST=postgres-db

Mistake 3: Using the wrong port

PostgreSQL-এর default port 5432, Redis-এর 6379।

Host-এর published port নয়, target container-এর internal listening port ব্যবহার করো।

Mistake 4: Database not ready

Container চালু হলেই Database connection গ্রহণের জন্য প্রস্তুত হয়ে যায় না। Backend-এ connection retry এবং health check ব্যবহার করা ভালো। 11. Practical Exercise
নিজে চেষ্টা করো:

- [ ] app-network নামে একটি network তৈরি করো।
- [ ] postgres-db নামে PostgreSQL container চালু করো।
- [ ] backend-container নামে Alpine container চালু করো।
- [ ] Alpine থেকে postgres-db hostname resolve হচ্ছে কি না পরীক্ষা করো।
- [ ] nc -zv postgres-db 5432 দিয়ে connection পরীক্ষা করো।
- [ ] docker network inspect app-network দিয়ে দুই container-ই network-এ আছে কি না দেখো।
      Cleanup:
      docker rm -f backend-container postgres-db
      docker network rm app-network

সতর্কতা: Cleanup command দুটি container ও তাদের সঙ্গে যুক্ত container filesystem মুছে দেবে। Named volume আলাদাভাবে তৈরি করা থাকলে সেটি স্বয়ংক্রিয়ভাবে মুছে যাবে না। 12. Lesson Summary
আজকের lesson-এর সবচেয়ে গুরুত্বপূর্ণ বিষয়:

1. User-defined Bridge Network container communication সহজ করে।
2. একই network-এর container-গুলো container name ব্যবহার করে communicate করতে পারে।
3. Docker DNS container name resolve করে IP address খুঁজে দেয়।
4. Container-to-container communication-এর জন্য সাধারণত Host port publish করতে হয় না।
5. localhost অন্য container-কে নির্দেশ করে না।
6. Production application-এ Backend, Database এবং Redis-কে একই private Docker network-এ রাখা একটি সাধারণ architecture।
   Next Lesson: 4-9 | Docker Compose Networking

Official documentation:

- Docker Bridge Network
- Docker Networking Overview
- Docker Networking and DNS
