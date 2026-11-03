## 4-9 | Introduction to Docker Networks

Docker শেখার এই পর্যায়ে আমরা জানব Docker Network কী, কেন প্রয়োজন, কীভাবে কাজ করে এবং বিভিন্ন ধরনের Docker Network কীভাবে ব্যবহার করতে হয়।

আগের lesson-গুলোতে আমরা দেখেছি কীভাবে একটি container থেকে অন্য container-এর সঙ্গে communication করা যায়। এবার Docker Networking-এর মূল ধারণাগুলো বিস্তারিতভাবে শিখব।

1. What is Docker Networking?
   Docker Networking হলো এমন একটি ব্যবস্থা, যার মাধ্যমে Docker container-গুলো নিজেদের মধ্যে, Host Machine-এর সঙ্গে এবং বাইরের Internet-এর সঙ্গে communication করতে পারে।

ধরো, তুমি একটি E-commerce application তৈরি করছ। তোমার application-এ রয়েছে:

- Go Backend API
- PostgreSQL Database
- Redis Cache
- Nginx Reverse Proxy
  এখন এই service-গুলোর মধ্যে communication তৈরি করতে হবে।

darkwolfcave.de

Docker Network ব্যবহার করে আমরা নির্ধারণ করতে পারি:

1. কোন container কার সঙ্গে communication করতে পারবে।
2. Container কীভাবে Internet access করবে।
3. কোন container Host Machine-এর সঙ্গে communicate করবে।
4. কোন container কোন network-এ যুক্ত থাকবে।
5. Container-গুলো কীভাবে একে অপরকে খুঁজে পাবে।
6. Why Do We Need Docker Networks?
   Docker Network ছাড়া একাধিক container-এর মধ্যে communication এবং network management জটিল হয়ে যেতে পারে।

Docker Network ব্যবহারের প্রধান সুবিধাগুলো:
সুবিধা ব্যাখ্যা
Communication Container-to-container communication
Isolation প্রয়োজন অনুযায়ী container আলাদা রাখা
DNS Resolution Container name দিয়ে অন্য container খুঁজে পাওয়া
Internet Access Container থেকে Internet access
Port Management Host ও container-এর মধ্যে traffic পরিচালনা
Security কোন service কোন network-এ থাকবে তা নিয়ন্ত্রণ

Real-world example
ধরো, তোমার E-commerce application-এর architecture:
Internet
|
v
Nginx Proxy
|
frontend-network
|
v
Go Backend API
|
backend-network
/ \
 v v
PostgreSQL Redis

এখানে Nginx বাইরের request গ্রহণ করবে, Go Backend business logic পরিচালনা করবে এবং Database ও Redis প্রয়োজনীয় data সরবরাহ করবে। 3. Types of Docker Networks
Docker বিভিন্ন ধরনের Network Driver প্রদান করে।

প্রধান Network Driver:

1. Bridge
2. Host
3. None
4. Overlay
5. Macvlan

zainnsar.medium.com

এবার প্রতিটি সম্পর্কে বিস্তারিত জানি। 4. Bridge Network
Most commonly used
Bridge হলো Docker-এর সবচেয়ে প্রচলিত network driver। একই Docker Host-এর container-গুলোর মধ্যে communication করার জন্য এটি ব্যবহার করা হয়।

Docker-এ সাধারণত নতুন container তৈরি করলে সেটি default bridge network-এ যুক্ত হয়, যদি অন্য network নির্দিষ্ট না করা হয়।
How Bridge Network Works
Docker Host
┌─────────────────────────────┐
│ │
│ Bridge Network │
│ │
│ ┌─────────┐ ┌──────────┐ │
│ │Container│ │Container │ │
│ │ A │ │ B │ │
│ └─────────┘ └──────────┘ │
│ │
└─────────────────────────────┘

Bridge Network-এর দুটি গুরুত্বপূর্ণ ধরন:

- Default Bridge Network
- User-defined Bridge Network
  4.1 Default Bridge Network
  Docker-এর default bridge network-এ container-গুলো স্বয়ংক্রিয়ভাবে যুক্ত হতে পারে।

Container তৈরি করো:
docker run -d --name container-a nginx:alpine

আরেকটি container তৈরি করো:
docker run -d --name container-b nginx:alpine

Network পরীক্ষা করো:
docker network inspect bridge

Important: Default bridge network-এ container-গুলোর মধ্যে সাধারণত IP address ব্যবহার করে যোগাযোগ করতে হয়। User-defined bridge-এর মতো automatic container-name DNS resolution এখানে সাধারণত পাওয়া যায় না।
4.2 User-defined Bridge Network
এটি Default Bridge-এর তুলনায় বেশি সুবিধাজনক।

Network তৈরি করো:
docker network create my-network

Container তৈরি করো:
docker run -d \
 --name web-server \
 --network my-network \
 nginx:alpine

আরেকটি container:
docker run -it --rm \
 --network my-network \
 alpine:latest sh

Alpine terminal থেকে:
wget -qO- http://web-server

Nginx-এর HTML response দেখতে পাবে।

কেন এটি কাজ করছে?

কারণ Docker user-defined bridge network-এ embedded DNS ব্যবহার করে। তাই container-এর নাম web-server দিয়ে অন্য container-কে খুঁজে পাওয়া যায়।
Default Bridge vs User-defined Bridge
বিষয় Default Bridge User-defined Bridge
Automatic DNS সাধারণত নেই আছে
Container name resolution IP বা legacy linking প্রয়োজন হতে পারে Container name ব্যবহার করা যায়
Isolation Default network Custom isolation
Custom configuration সীমিত বেশি
Recommendation সাধারণ পরীক্ষার জন্য অধিকাংশ application-এর জন্য

5. Host Network
   Host Network ব্যবহার করলে container Host Machine-এর network namespace ব্যবহার করে।

সহজভাবে বললে, container আলাদা bridge network-এর মাধ্যমে Host-এর সঙ্গে যুক্ত থাকে না; এটি Host-এর network stack সরাসরি ব্যবহার করে।

wiz.io

Practical Example
docker run -d \
 --name nginx-host \
 --network host \
 nginx:alpine

Linux-এ Host Network ব্যবহার করলে Nginx সাধারণত Host-এর port 80-এ listen করবে।

এখানে -p 8080:80 দেওয়ার প্রয়োজন নেই এবং Host mode-এ port publishing ব্যবহার করা হয় না।

Important for Windows and Mac:

Docker Desktop-এ Host Networking-এর আচরণ Linux-এর মতো সরাসরি একই নয়। এটি ব্যবহার করতে হলে Docker Desktop-এর supported version ও Host Networking setting বিবেচনা করতে হবে।

Host Network ব্যবহারের ক্ষেত্রে:

- Network isolation কমে যায়।
- Port conflict হতে পারে।
- Container-এর network configuration-এর ওপর কম control থাকে।

6. None Network
   None Network ব্যবহার করলে container-এর জন্য Docker কোনো external network connectivity তৈরি করে না।

এটি মূলত এমন application-এর জন্য উপযোগী, যেগুলোর network access প্রয়োজন নেই।
Practical Example
docker run -it --rm \
 --network none \
 alpine:latest sh

এখন network interface পরীক্ষা করো:
ip addr

Container-এর loopback interface (lo) থাকতে পারে, কিন্তু সাধারণ external network connectivity থাকবে না।

blog.davidvarghese.net

Use cases:

- Isolated processing
- Network access ছাড়া কিছু batch jobs
- Security testing
- Offline workloads

7. Overlay Network
   Overlay Network একাধিক Docker Host-এর container-গুলোর মধ্যে communication তৈরি করতে সাহায্য করে।

যখন একটি application একাধিক server বা Docker Host-এ চলে, তখন Overlay Network কাজে আসে।

medium.com

Example Architecture
Overlay Network
/ \
 / \
 Docker Host 1 Docker Host 2
| |
Container A Container B
| |
└──── Communication ┘

কখন ব্যবহার হয়?

- Docker Swarm
- Multi-host container communication
- Distributed application deployment
  Overlay Network সাধারণত Docker Swarm-এর সঙ্গে ব্যবহার করা হয়। এর জন্য একাধিক Docker Host-এর মধ্যে প্রয়োজনীয় network connectivity ও configuration থাকতে হয়।

8. Macvlan Network
   Macvlan Network ব্যবহার করে container-কে Host-এর physical network-এ আলাদা MAC address-সহ যুক্ত করা যায়।

সহজভাবে বললে, container-টি physical network-এ আলাদা device-এর মতো দেখা যেতে পারে।

edureka.co

Example
docker network create \
 -d macvlan \
 --subnet=192.168.1.0/24 \
 --gateway=192.168.1.1 \
 -o parent=eth0 \
 macvlan-network

এটি একটি Linux network-interface example। তোমার actual network subnet, gateway এবং parent interface অনুযায়ী configuration পরিবর্তন করতে হবে।

Use cases:

- Legacy applications
- Physical LAN integration
- Container-কে আলাদা network device হিসেবে উপস্থাপন
  সাধারণ Docker Desktop development-এর জন্য Macvlan সাধারণত প্রয়োজন হয় না।

9. Docker Network Driver Comparison
   Driver Main purpose Typical use
   Bridge Same Docker Host communication Web applications
   Host Host network namespace ব্যবহার বিশেষ network performance/use case
   None Network isolation Offline processing
   Overlay Multiple Docker Host communication Docker Swarm
   Macvlan Physical LAN integration Legacy network applications

10. Useful Docker Network Commands
    প্রতিদিন Docker Networking শেখার সময় এই command-গুলো কাজে লাগবে।
    List all networks
    docker network ls

Create a network
docker network create app-network

Inspect a network
docker network inspect app-network

Connect a container to a network
docker network connect app-network my-container

Disconnect a container
docker network disconnect app-network my-container

Remove a network
docker network rm app-network

Remove unused networks
docker network prune

Caution
docker network prune ব্যবহার করলে বর্তমানে কোনো container-এ যুক্ত নেই এমন unused custom network মুছে যেতে পারে। 11. Practical Project: E-commerce Network
এবার আমরা একটি ছোট E-commerce infrastructure তৈরি করব।

আমাদের থাকবে:

- frontend-network
- backend-network
- nginx
- go-backend
- postgres-db
- redis-cache
  Step 1: Create Networks
  docker network create frontend-network
  docker network create backend-network

Step 2: Create PostgreSQL Container
docker run -d \
 --name postgres-db \
 --network backend-network \
 -e POSTGRES_USER=admin \
 -e POSTGRES_PASSWORD=change_me \
 -e POSTGRES_DB=ecommerce \
 postgres:17-alpine

Step 3: Create Redis Container
docker run -d \
 --name redis-cache \
 --network backend-network \
 redis:alpine

Step 4: Create Go Backend Container
এখানে ধরে নিচ্ছি তোমার Go application-এর Docker image আগে থেকেই তৈরি করা আছে।
docker run -d \
 --name go-backend \
 --network backend-network \
 -e DB_HOST=postgres-db \
 -e DB_PORT=5432 \
 -e REDIS_HOST=redis-cache \
 -e REDIS_PORT=6379 \
 your-go-backend:latest

Step 5: Connect Backend to Frontend Network
docker network connect frontend-network go-backend

এখন Backend দুটি network-এ যুক্ত:

- backend-network
- frontend-network
  Step 6: Create Nginx Container
  docker run -d \
   --name nginx-proxy \
   --network frontend-network \
   -p 80:80 \
   nginx:alpine

এখন architecture হবে:
E-commerce Network Architecture
Internet / Client

Nginx Proxy

Port 80 · frontend-network

frontend-network
Go Backend API

Also connected to backend-network

backend-network
PostgreSQL

5432

Redis

6379

Backend frontend ও database—দুই network-এ যুক্ত। Database এবং Redis শুধু backend network-এ আছে।
Security benefit: PostgreSQL ও Redis-কে frontend network-এ যুক্ত করতে হয়নি। ফলে network segmentation করা সম্ভব হয়েছে।

এই উদাহরণে Nginx container তৈরি করা হয়েছে, কিন্তু Go Backend-এর reverse-proxy configuration এখনো যোগ করা হয়নি। 12. Common Mistakes
সমস্যা কারণ সমাধান
Container name resolve হচ্ছে না Default bridge network ব্যবহার User-defined bridge ব্যবহার
Connection refused Service চালু নেই বা ভুল port Service status ও listening port check
Database connection failed Backend ও DB আলাদা network-এ একই network-এ যুক্ত করা
Port already allocated Host port অন্য service ব্যবহার করছে অন্য Host port ব্যবহার
Network remove হচ্ছে না Network-এ container যুক্ত আছে Container disconnect/remove

13. Practice Questions
    নিজে উত্তর দেওয়ার চেষ্টা করো:
1. Docker Network কী এবং কেন প্রয়োজন?
1. Default Bridge ও User-defined Bridge-এর মধ্যে পার্থক্য কী?
1. Host Network কীভাবে কাজ করে?
1. None Network ব্যবহার করলে কী হয়?
1. Overlay Network কখন প্রয়োজন হয়?
1. Macvlan Network-এর কাজ কী?
1. একই user-defined bridge network-এ container name দিয়ে communication কীভাবে হয়?
1. E-commerce application-এ Backend ও Database আলাদা network-এ রাখার সুবিধা কী?
1. Lesson Summary
   আজকের lesson-এর গুরুত্বপূর্ণ বিষয়:

- Docker Network container-গুলোর communication পরিচালনা করে।
- Bridge Network হলো সাধারণ single-host application-এর জন্য সবচেয়ে প্রচলিত driver।
- User-defined Bridge automatic DNS resolution দেয়।
- Host Network Host-এর network namespace ব্যবহার করে।
- None Network external network connectivity বন্ধ রাখে।
- Overlay Network multiple Docker Host-এর মধ্যে communication তৈরি করে।
- Macvlan container-কে physical network-এ আলাদা device-এর মতো যুক্ত করতে পারে।
- Docker Network ব্যবহার করে application-এর security ও isolation উন্নত করা যায়।
  Next Lesson: 4-10 | Docker Network – Under the Hood

Official Documentation:

- Docker Networking Overview
- Docker Network Drivers
- Bridge Network Driver
- Overlay Network Driver
