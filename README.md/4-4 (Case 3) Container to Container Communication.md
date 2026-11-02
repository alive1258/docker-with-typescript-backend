## 4-4 (Case 3) Container to Container Communication

Docker Networking-এর এই লেসনে আমরা শিখব কীভাবে একটি Docker container অন্য একটি Docker container-এর সঙ্গে communication করতে পারে।

এটি Backend Development-এর জন্য অত্যন্ত গুরুত্বপূর্ণ। কারণ বাস্তব application-এ সাধারণত Backend, Database, Redis, Message Broker ইত্যাদি আলাদা আলাদা container-এ চালানো হয়।

তোমার TypeScript Backend project দিয়ে বিষয়টি বোঝার চেষ্টা করব।

1. Container to Container Communication কী?
   ধরো, তোমার একটি Backend application আছে এবং সেটি Docker container-এর মধ্যে চলছে।

তোমার application-এর Database PostgreSQL-ও আরেকটি Docker container-এর মধ্যে চলছে।

এখন Backend container থেকে PostgreSQL container-এর সঙ্গে যোগাযোগ করতে হবে।

এই communication-কে বলা হয় Container-to-Container Communication।
Backend Container

Node.js / TypeScript API

Port: 5000

Docker Network Communication

Database Container

PostgreSQL

Port: 5432

Shared Docker Network

এখানে Backend container PostgreSQL container-এর সঙ্গে একই Docker network ব্যবহার করে যোগাযোগ করছে। 2. Container থেকে Container-এ সরাসরি localhost ব্যবহার করা যায় না কেন?
ধরো, তোমার দুটি container আছে:

- backend-container
- postgres-container
  Backend container থেকে তুমি যদি এই address ব্যবহার করো:
  localhost:5432

তাহলে Docker PostgreSQL container-কে খুঁজবে না। কারণ localhost বলতে Backend container নিজেকেই বোঝায়।

তাহলে কী ব্যবহার করবে?

একই user-defined Docker network-এ থাকা container-গুলোর মধ্যে সাধারণত Container Name বা Network Alias ব্যবহার করে যোগাযোগ করা যায়।

উদাহরণ:
postgres-container:5432

এখানে:

- postgres-container হলো Database container-এর নাম।
- 5432 হলো PostgreSQL-এর container port।

3. Docker Network কী?
   Docker Network হলো এমন একটি virtual network, যার মাধ্যমে একাধিক container একে অপরের সঙ্গে যোগাযোগ করতে পারে।

Docker-এর default bridge network আছে। কিন্তু container-to-container communication-এর জন্য সাধারণত নিজস্ব User-defined Bridge Network ব্যবহার করা ভালো।

User-defined bridge network-এর সুবিধা:

- Container name দিয়ে অন্য container খুঁজে পাওয়া যায়।
- একাধিক container একই network ব্যবহার করতে পারে।
- Network আলাদা করে manage করা যায়।
- Application-এর বিভিন্ন service-এর মধ্যে যোগাযোগ সহজ হয়।
  Docker-এর official documentation অনুযায়ী, user-defined bridge network-এ automatic DNS resolution পাওয়া যায়।
  Docker Docs+1

4. Practical Example: দুটি Container-এর মধ্যে Communication
   এবার নিজের কম্পিউটারে একটি practical example তৈরি করি।

আমরা দুটি container ব্যবহার করব:

1. web-server — Nginx web server।
2. client — অন্য container থেকে Nginx-এ request পাঠাবে।
   Step 1: Docker Network তৈরি করো
   docker network create app-network

Network তৈরি হয়েছে কি না দেখো:
docker network ls

তুমি app-network দেখতে পাবে।
Step 2: প্রথম Container চালাও
এবার Nginx container তৈরি করো:
docker run -d \
 --name web-server \
 --network app-network \
 nginx:alpine

এখানে:
Command কাজ
-d Background-এ container চালায়
--name web-server Container-এর নাম নির্ধারণ করে
--network app-network নির্দিষ্ট Docker network-এ যুক্ত করে
nginx:alpine Nginx image ব্যবহার করে

Container চলছে কি না দেখো:
docker ps

Step 3: দ্বিতীয় Container চালাও
এবার অন্য একটি Alpine container থেকে Nginx-এ request পাঠাও:
docker run --rm \
 --network app-network \
 alpine wget -qO- http://web-server

Expected output:

<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
</head>
<body>
<h1>Welcome to nginx!</h1>
...
</body>
</html>

Success
দ্বিতীয় container সফলভাবে প্রথম container-এর Nginx server থেকে response পেয়েছে।

এখানে সবচেয়ে গুরুত্বপূর্ণ বিষয়:
http://web-server

আমরা localhost ব্যবহার করিনি। web-server হলো প্রথম container-এর নাম। Docker network-এর DNS এই নামটি resolve করে সঠিক container-এ request পাঠিয়েছে। 5. কেন এখানে -p ব্যবহার করিনি?
তুমি হয়তো লক্ষ্য করেছ, Nginx container চালানোর সময় আমরা এই command ব্যবহার করিনি:
-p 8080:80

কারণ আমাদের উদ্দেশ্য ছিল অন্য container থেকে Nginx access করা, Host Machine থেকে নয়।

একই Docker network-এর মধ্যে থাকা container-গুলো তাদের container port ব্যবহার করে পরস্পরের সঙ্গে যোগাযোগ করতে পারে।

উদাহরণ:
web-server:80

এখানে 80 হলো Nginx-এর container port।

Host Machine-এর browser থেকে access করতে চাইলে port publish করতে হবে:
docker run -d \
 --name web-server \
 --network app-network \
 -p 8080:80 \
 nginx:alpine

এবার browser থেকে:
http://localhost:8080

এখানে 8080 হলো Host Machine-এর port এবং 80 হলো container-এর port। 6. Real-world Example: Node.js Backend + PostgreSQL
এবার তোমার TypeScript Backend-এর সঙ্গে মিলিয়ে দেখি।

ধরো, তোমার application-এ দুটি service রয়েছে:
Backend Container

Node.js / TypeScript

Application Port: 5000

PostgreSQL connection

PostgreSQL Container

Database Server

Container Port: 5432

backend-network

Step 1: Network তৈরি করো
docker network create backend-network

Step 2: PostgreSQL Container চালাও
docker run -d \
 --name postgres-db \
 --network backend-network \
 -e POSTGRES_USER=admin \
 -e POSTGRES_PASSWORD=change_this_password \
 -e POSTGRES_DB=mydatabase \
 -v postgres-data:/var/lib/postgresql/data \
 postgres:17

এখানে:

- postgres-db — Database container-এর নাম।
- backend-network — Shared Docker network।
- POSTGRES_USER — Database username।
- POSTGRES_PASSWORD — Database password।
- POSTGRES_DB — Database name।
- postgres-data — Persistent Named Volume।
  এটি একটি শেখার উদাহরণ। বাস্তবে password নিরাপদ secrets management দিয়ে পরিচালনা করবে।
  Step 3: Backend Container চালানো
  তোমার Backend application-কে একই network-এ চালাতে হবে:
  docker run -d \
   --name backend-api \
   --network backend-network \
   -p 5000:5000 \
   ts-docker:v2

এখন Backend থেকে PostgreSQL-এর সঙ্গে যোগাযোগের জন্য connection string হবে:
DATABASE_URL=postgresql://admin:YOUR_PASSWORD@postgres-db:5432/mydatabase

এখানে:
অংশ অর্থ
postgresql:// Database protocol
admin Database username
YOUR_PASSWORD Database password
postgres-db PostgreSQL container-এর নাম
5432 PostgreSQL-এর container port
mydatabase Database name

সবচেয়ে গুরুত্বপূর্ণ: এখানে localhost:5432 নয়, postgres-db:5432 ব্যবহার করা হয়েছে।

আরেকটি বিষয়, PostgreSQL-এর জন্য এখানে -p 5432:5432 দেওয়া বাধ্যতামূলক নয়। কারণ Backend এবং PostgreSQL একই Docker network-এ রয়েছে। 7. Docker Compose-এ Container-to-Container Communication
বাস্তবে Backend ও Database পরিচালনা করার জন্য Docker Compose ব্যবহার করলে কাজ আরও সহজ হয়।

উদাহরণ compose.yaml:
services:
backend:
build: .
container_name: backend-api
ports: - "5000:5000"
environment:
DATABASE_URL: postgresql://admin:change_this_password@postgres:5432/mydatabase
depends_on: - postgres

postgres:
image: postgres:17
container_name: postgres-db
environment:
POSTGRES_USER: admin
POSTGRES_PASSWORD: change_this_password
POSTGRES_DB: mydatabase
volumes: - postgres-data:/var/lib/postgresql/data

volumes:
postgres-data:

এখানে Docker Compose নিজে একটি default network তৈরি করে এবং একই Compose project-এর service-গুলোকে সেখানে যুক্ত করে।

তাই Backend থেকে Database access করতে:
DATABASE_URL=postgresql://admin:YOUR_PASSWORD@postgres:5432/mydatabase

খেয়াল করো, এখানে postgres-db নয়, postgres ব্যবহার করেছি।

কারণ Compose-এর service name হলো postgres, এবং সেটি DNS hostname হিসেবে ব্যবহার করা যায়।

একটি গুরুত্বপূর্ণ বিষয়: depends_on শুধু service startup order নিয়ন্ত্রণ করে; PostgreSQL পুরোপুরি connection গ্রহণের জন্য প্রস্তুত হয়েছে, সেটি নিশ্চিত করে না। Production-এ healthcheck ও pg_isready দিয়ে readiness যাচাই করা ভালো। 8. Common Errors এবং Solutions
Error সম্ভাব্য কারণ সমাধান
Connection refused Target service চালু নেই বা port ভুল Container status ও service port যাচাই করো
ENOTFOUND Container hostname resolve হচ্ছে না একই user-defined network-এ আছে কি না দেখো
ECONNREFUSED localhost ভুল hostname ব্যবহার অন্য container-এর নাম ব্যবহার করো
Network not found Network তৈরি করা হয়নি docker network create চালাও
Container not found ভুল container name docker ps -a দিয়ে নাম যাচাই করো

9. গুরুত্বপূর্ণ Docker Network Commands
   Command কাজ
   docker network ls সব network দেখায়
   docker network create NAME Network তৈরি করে
   docker network inspect NAME Network-এর বিস্তারিত দেখায়
   docker network connect NAME CONTAINER Container-কে network-এ যুক্ত করে
   docker network disconnect NAME CONTAINER Container-কে network থেকে বিচ্ছিন্ন করে
   docker network rm NAME Network মুছে ফেলে

একটি চলমান container-কে existing network-এ যুক্ত করার উদাহরণ:
docker network connect app-network my-container

Network-এর বিস্তারিত দেখতে:
docker network inspect app-network

এখানে কোন কোন container network-এ যুক্ত রয়েছে, তা দেখতে পাবে। 10. Practical Exercise
এবার নিজের হাতে পরীক্ষা করো:
[ ] app-network নামে Docker network তৈরি করেছি
[ ] web-server নামে Nginx container চালিয়েছি
[ ] অন্য Alpine container থেকে http://web-server access করেছি
[ ] Nginx-এর response পেয়েছি
[ ] docker network inspect দিয়ে দুই container-এর network যাচাই করেছি
0 / 5 completed

পরীক্ষা শেষে container পরিষ্কার করতে:
docker rm -f web-server

যদি app-network আর প্রয়োজন না হয়:
docker network rm app-network

11. Case 1, Case 2 ও Case 3-এর পার্থক্য
    Case Communication উদাহরণ
    4-2 Container → WWW External API
    4-3 Container → Host Machine host.docker.internal:4000
    4-4 Container → Container postgres-db:5432

Lesson Summary
আজকের লেসনের সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলো:

1. একাধিক container নিজেদের মধ্যে communication করতে পারে।
2. এজন্য একই Docker network ব্যবহার করা ভালো।
3. User-defined bridge network-এ container name দিয়ে অন্য container access করা যায়।
4. Container-to-container communication-এর জন্য সাধারণত Host port publish করার প্রয়োজন নেই।
5. Docker Compose একই project-এর service-গুলোর জন্য default network তৈরি করে।
6. Database connection-এর ক্ষেত্রে localhost নয়, database service name ব্যবহার করতে হয়।
   মনে রাখার সূত্র
   Container → Container

http://container-name:PORT

PostgreSQL-এর উদাহরণ:
postgres-db:5432

Docker Compose-এর উদাহরণ:
postgres:5432
