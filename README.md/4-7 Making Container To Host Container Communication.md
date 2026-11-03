## 4-7 Making Container To Host Container Communication

ই lesson-এ আমরা শিখব কীভাবে একটি Docker container থেকে Host Machine-এর অন্য একটি Docker container-এর সঙ্গে communication করা যায়।

আগের lesson-এ আমরা শিখেছি:

- 4-2: Container to WWW Communication
- 4-3: Container to Local Host Machine Communication
- 4-4: Container to Container Communication
  আজকের বিষয়টি একটু আলাদা। এবার আমরা এমন একটি scenario দেখব, যেখানে একটি container সরাসরি অন্য container-এর সঙ্গে নয়, বরং Host Machine-এর মাধ্যমে অন্য একটি container-এর সঙ্গে যোগাযোগ করবে।

1. Understanding the Concept
   প্রথমে একটি বিষয় পরিষ্কার করি।

ধরো, তোমার কম্পিউটারে Docker Desktop চলছে। সেখানে দুটি container আছে:

- Container A: Go Backend API
- Container B: PostgreSQL Database
  দুটি container একই Docker network-এ নেই। তুমি চাও Container A যেন Host Machine-এর মাধ্যমে Container B-এর সঙ্গে communicate করতে পারে।

jwillmer.de

Communication flow:
Container A
|
| HTTP / TCP Request
v
Host Machine
|
| Published Port
v
Container B

এখানে Host Machine মধ্যস্থতাকারী হিসেবে কাজ করছে। 2. Why Do We Need This?
সাধারণত একই Docker network ব্যবহার করে container-to-container communication করা সবচেয়ে সহজ।

তবে কিছু পরিস্থিতিতে Host Machine-এর মাধ্যমে যোগাযোগের প্রয়োজন হতে পারে:

1. দুটি container আলাদা Docker network-এ রয়েছে।
2. একটি application Host Machine-এর published port ব্যবহার করে অন্য container-এ পৌঁছাতে চায়।
3. Existing infrastructure-এ network architecture পরিবর্তন করা সম্ভব নয়।
4. Development বা testing-এর সময় Host Machine-এর মাধ্যমে service access করতে হয়।
5. Practical Example
   আমরা দুটি container তৈরি করব:
   Container Image Port
   Container A Alpine Linux Client
   Container B Nginx 8080

আমাদের লক্ষ্য:

Container A → Host Machine → Container B
Step 1: Create Container B
প্রথমে একটি Nginx container চালু করি।
docker run -d \
 --name web-server \
 -p 8080:80 \
 nginx:alpine

Command explanation:
Command কাজ
docker run নতুন container তৈরি ও চালু করে
-d Background-এ চালায়
--name web-server Container-এর নাম নির্ধারণ করে
-p 8080:80 Host-এর 8080 port থেকে container-এর 80 port-এ traffic পাঠায়
nginx:alpine Nginx image ব্যবহার করে

এখন Host Machine-এর browser থেকে দেখতে পারবে:
http://localhost:8080

Nginx welcome page দেখা গেলে Container B ঠিকভাবে চলছে।
Step 2: Create Container A
এবার একটি Alpine container তৈরি করব।
docker run -it --rm alpine:latest sh

এটি একটি interactive terminal চালু করবে।

Container A-এর ভেতর থেকে Host Machine-এর published port-এ request পাঠাব।
wget -qO- http://host.docker.internal:8080

Expected result
Nginx-এর HTML response দেখতে পাবে।

এখানে host.docker.internal কী?

Docker Desktop-এ এটি একটি বিশেষ hostname, যা container থেকে Host Machine-কে access করতে সাহায্য করে।

তাই:
localhost

এর পরিবর্তে:
host.docker.internal

ব্যবহার করছি। 4. Understanding Port Mapping
আমাদের command-এ ছিল:
-p 8080:80

এখানে:
-p HOST_PORT:CONTAINER_PORT

Host Machine
8080
Published Port

Port Mapping

Nginx Container
80
Container Port

অর্থাৎ Host Machine-এর 8080 port-এ request এলে Docker সেটি Nginx container-এর 80 port-এ পাঠায়। 5. Important Difference: Container-to-Container vs Container-to-Host-to-Container
বিষয় Direct communication Host-mediated communication
Connection Container → Container Container → Host → Container
Network Shared Docker network Published port ব্যবহার
Address Container name host.docker.internal
Port Container port Host-এর published port
Example http://web-server:80 http://host.docker.internal:8080

মনে রাখবে: একই user-defined Docker network ব্যবহার করতে পারলে direct container-to-container communication সাধারণত বেশি সহজ ও ভালো। Host-mediated approach-এর জন্য অপ্রয়োজনীয়ভাবে port expose করার প্রয়োজন নেই। 6. Common Errors and Solutions
Error 1: Connection refused
সম্ভাব্য কারণ:

- Nginx container চালু নেই।
- ভুল Host port ব্যবহার করেছ।
- Port mapping সঠিক নয়।
  Check করো:
  docker ps

Error 2: Could not resolve host
সম্ভাব্য কারণ:

- host.docker.internal hostname resolve হচ্ছে না।
- Docker environment বা DNS configuration-এ সমস্যা রয়েছে।
  Docker Desktop-এ সাধারণত এই hostname built-in থাকে।

Linux Docker Engine-এ প্রয়োজন হলে container চালানোর সময় ব্যবহার করতে পারো:
--add-host=host.docker.internal:host-gateway

Error 3: Port is already allocated
যদি Host-এর 8080 port আগে থেকেই অন্য কোনো service ব্যবহার করে, তাহলে অন্য port ব্যবহার করো:
docker run -d \
 --name web-server \
 -p 8081:80 \
 nginx:alpine

এক্ষেত্রে request হবে:
wget -qO- http://host.docker.internal:8081

7. Useful Docker Commands

# Running containers

docker ps

# All containers

docker ps -a

# Container logs

docker logs web-server

# Inspect port mapping

docker port web-server

# Stop container

docker stop web-server

# Remove container

docker rm web-server

Cleanup করার সময়:
docker rm -f web-server

সতর্কতা: এই command চলমান web-server container-টি stop করে remove করবে। 8. Practical Exercise
নিজে নিচের কাজগুলো করার চেষ্টা করো:

- [ ] Nginx container তৈরি করো এবং Host port 8080-এ publish করো।
- [ ] Alpine container চালু করো।
- [ ] Alpine থেকে host.docker.internal:8080-এ request পাঠাও।
- [ ] Nginx-এর HTML response দেখতে পারছ কি না যাচাই করো।
- [ ] Port 8081 ব্যবহার করে আবার পরীক্ষা করো।

9. Lesson Summary
   আজকের lesson থেকে গুরুত্বপূর্ণ বিষয়গুলো:
1. Container থেকে Host Machine-কে access করতে Docker Desktop-এ host.docker.internal ব্যবহার করা যায়।
1. Host Machine-এর মাধ্যমে অন্য container-এ পৌঁছাতে target container-এর port publish করতে হয়।
1. -p HOST_PORT:CONTAINER_PORT দিয়ে port mapping করা হয়।
1. Linux Docker Engine-এ host-gateway mapping প্রয়োজন হতে পারে।
1. Production architecture-এ একই Docker network ব্যবহার করে direct communication সাধারণত ভালো।
   Next Lesson: 4-8 | Container Networking with Docker Compose

Official documentation:

- Docker Desktop Networking
- Docker Engine Networking
