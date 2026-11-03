4-10 | Docker Network Management and How Docker Resolves IP Addresses
এই lesson-এ আমরা Docker Networking-এর দুটি গুরুত্বপূর্ণ বিষয় শিখব:

1. Docker Network Management: কীভাবে Docker Network তৈরি, inspect, connect, disconnect এবং remove করতে হয়।
2. IP Address Resolution: Docker কীভাবে একটি container-এর নাম থেকে অন্য container-এর IP address খুঁজে বের করে।
   আগের lesson-গুলোতে আমরা শিখেছি কীভাবে Docker container-গুলো নিজেদের মধ্যে communication করে। এবার বুঝব Docker-এর ভেতরে এই communication কীভাবে পরিচালিত হয়।
3. Understanding Docker Network Management
   Docker Network Management হলো Docker-এর বিভিন্ন network তৈরি, configure, monitor এবং নিয়ন্ত্রণ করার প্রক্রিয়া।

ধরো, তোমার E-commerce application-এ রয়েছে:

- Go Backend API
- PostgreSQL Database
- Redis Cache
- Nginx Reverse Proxy
  তুমি চাইছ:
- Go Backend যেন PostgreSQL-এর সঙ্গে communicate করতে পারে।
- Go Backend যেন Redis-এর সঙ্গে communicate করতে পারে।
- Nginx যেন Go Backend-এ request পাঠাতে পারে।
- Database যেন অপ্রয়োজনীয়ভাবে frontend network-এ exposed না থাকে।
  এসব নিয়ন্ত্রণ করতে Docker Network Management ব্যবহার করা হয়।

darkwolfcave.de

2. Understanding Docker Network Types
   প্রথমে Docker-এর কয়েকটি গুরুত্বপূর্ণ Network Driver মনে রাখো।
   Network Driver কাজ
   Bridge একই Docker Host-এর container communication
   Host Host-এর network namespace ব্যবহার
   None External network connectivity ছাড়া container
   Overlay একাধিক Docker Host-এর মধ্যে communication
   Macvlan Container-কে physical network-এ আলাদা device হিসেবে যুক্ত করা

সাধারণ E-commerce backend-এর ক্ষেত্রে User-defined Bridge Network দিয়েই শুরু করতে পারো। 3. List All Docker Networks
Docker Host-এ বর্তমানে কী কী network রয়েছে তা দেখতে:
docker network ls

Example output:
NETWORK ID NAME DRIVER SCOPE
a1b2c3d4 bridge bridge local
e5f6g7h8 host host local
i9j0k1l2 none null local

এখানে:

- NETWORK ID: Network-এর unique identifier।
- NAME: Network-এর নাম।
- DRIVER: কোন network driver ব্যবহার হচ্ছে।
- SCOPE: Network-এর scope।
  local অর্থ network-টি একটি Docker Host-এর জন্য।

4. Create a Docker Network
   নিজের application-এর জন্য custom network তৈরি করতে:
   docker network create app-network

এটি একটি User-defined Bridge Network তৈরি করবে।

Network তৈরি হয়েছে কি না যাচাই করো:
docker network ls

Custom subnet দিয়ে Network তৈরি
Docker স্বয়ংক্রিয়ভাবে subnet নির্বাচন করতে পারে। তবে প্রয়োজন হলে নিজেও subnet নির্ধারণ করতে পারো।
docker network create \
 --driver bridge \
 --subnet 172.20.0.0/16 \
 --gateway 172.20.0.1 \
 custom-network

এখানে:
Option কাজ
--driver bridge Bridge driver নির্বাচন
--subnet Network-এর IP address range
--gateway Network gateway
custom-network Network-এর নাম

সতর্কতা: নিজের LAN, VPN বা অন্য Docker network-এর সঙ্গে overlapping subnet ব্যবহার করবে না। এতে routing conflict হতে পারে। 5. Inspect Docker Network
কোনো network-এর বিস্তারিত জানতে:
docker network inspect app-network

এতে সাধারণত পাওয়া যায়:

- Network ID
- Network Driver
- Subnet
- Gateway
- Connected Containers
- Container IP Addresses
  Example output-এর একটি অংশ:
  {
  "Name": "app-network",
  "Driver": "bridge",
  "IPAM": {
  "Config": [
  {
  "Subnet": "172.20.0.0/16",
  "Gateway": "172.20.0.1"
  }
  ]
  }
  }

এটি বোঝানোর জন্য সংক্ষিপ্ত example; তোমার actual output ভিন্ন হতে পারে। 6. Connect a Container to a Network
ধরো, তোমার একটি container আগে থেকেই চালু রয়েছে:
docker run -d \
 --name web-server \
 nginx:alpine

এখন এটিকে app-network-এ যুক্ত করতে চাও।
docker network connect app-network web-server

এখন পরীক্ষা করো:
docker network inspect app-network

web-server container network-এর সঙ্গে যুক্ত হয়েছে কি না দেখতে পাবে।
Disconnect a Container
Container-কে network থেকে বিচ্ছিন্ন করতে:
docker network disconnect app-network web-server

মনে রাখবে, container-টি বন্ধ না করেও network থেকে disconnect করা যায়। 7. Remove Docker Network
কোনো network আর প্রয়োজন না হলে remove করতে পারো।
docker network rm app-network

তবে network-এর সঙ্গে container যুক্ত থাকলে সাধারণত সেটি remove করা যাবে না।

প্রথমে container disconnect অথবা remove করতে হবে।

Unused network remove করতে:
docker network prune

Caution
docker network prune unused custom network মুছে দেয়। গুরুত্বপূর্ণ network মুছে যাচ্ছে কি না command চালানোর আগে যাচাই করবে।

8. How Docker Resolves IP Addresses
   এবার এই lesson-এর দ্বিতীয় এবং সবচেয়ে গুরুত্বপূর্ণ বিষয়।

IP Address Resolution হলো কোনো hostname বা domain name থেকে সংশ্লিষ্ট IP address খুঁজে বের করার প্রক্রিয়া।

সাধারণভাবে Internet-এ আমরা DNS ব্যবহার করি।

উদাহরণ:
google.com
|
v
DNS Resolution
|
v
IP Address

Docker-ও container networking-এর ক্ষেত্রে DNS ব্যবহার করে।

ধরো, তোমার দুটি container রয়েছে:
app-network
|
|---- backend-container
|
|---- postgres-db

এখন Backend container থেকে PostgreSQL-এ connect করতে চাও।

তুমি ব্যবহার করবে:
postgres-db:5432

Docker কীভাবে বুঝবে postgres-db কোন container?

এখানেই Docker-এর Embedded DNS System কাজ করে। 9. Docker Embedded DNS
Docker-এর User-defined Network-এ একটি Embedded DNS Server থাকে।

সাধারণত এর IP address:
127.0.0.11

এটি container-এর DNS resolver হিসেবে কাজ করে।

blog.csdn.net

Communication Flow
ধরো, Backend container এই request পাঠাল:
postgres-db:5432

এরপর:

1. Backend container postgres-db hostname resolve করতে চায়।
2. Container-এর DNS resolver query পাঠায়।
3. Docker Embedded DNS postgres-db-এর IP খুঁজে দেয়।
4. Backend সেই IP address-এর port 5432-এ connection তৈরি করে।
5. PostgreSQL request গ্রহণ করে।
   সহজভাবে:
   Backend Container
   |
   | DNS Query: postgres-db
   v
   Docker Embedded DNS
   |
   | IP Address: 172.20.0.3
   v
   PostgreSQL Container

   172.20.0.3 একটি illustrative IP address; তোমার environment-এ ভিন্ন হতে পারে।

6. Practical Example: Docker DNS Resolution
   এবার নিজের হাতে পরীক্ষা করি।
   Step 1: Create a Network
   docker network create app-network

Step 2: Create PostgreSQL Container
docker run -d \
 --name postgres-db \
 --network app-network \
 -e POSTGRES_USER=admin \
 -e POSTGRES_PASSWORD=change_me \
 -e POSTGRES_DB=ecommerce \
 postgres:17-alpine

Step 3: Create Backend Testing Container
docker run -it --rm \
 --name backend-test \
 --network app-network \
 alpine:latest sh

এখন Alpine terminal-এর মধ্যে কাজ করবে।

DNS testing-এর জন্য package install করো:
apk add --no-cache bind-tools

Step 4: Resolve Container Name
এখন command চালাও:
nslookup postgres-db

Example output:
Server: 127.0.0.11
Address: 127.0.0.11:53

Name: postgres-db
Address: 172.20.0.3

এখানে:

- 127.0.0.11 হলো Docker Embedded DNS।
- postgres-db হলো target container-এর hostname।
- 172.20.0.3 হলো example container IP।
  Step 5: Test Database Port
  apk add --no-cache netcat-openbsd

এরপর:
nc -zv postgres-db 5432

PostgreSQL connection গ্রহণ করলে port open দেখাবে।
Expected result
postgres-db (172.20.0.3:5432) open

11. How to Find a Container's IP Address
    Docker container-এর IP address দেখার কয়েকটি উপায় আছে।
    Method 1: Docker Inspect
    docker inspect postgres-db

অনেক information দেখাবে।

শুধু IP address দেখতে:
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' postgres-db

Method 2: Network Inspect
docker network inspect app-network

এখানে network-এর সঙ্গে যুক্ত container এবং তাদের IP address দেখতে পাবে।
Method 3: Container-এর ভিতর থেকে
Linux-based container-এর ভিতরে:
ip addr

অথবা:
hostname -i

Important: Docker-managed network-এ container IP hardcode না করে container name ব্যবহার করাই ভালো। Container recreate করলে তার IP পরিবর্তিত হতে পারে।

12. Default Bridge vs User-defined Bridge DNS
    এখানে একটি গুরুত্বপূর্ণ পার্থক্য রয়েছে।
    বিষয় Default Bridge User-defined Bridge
    DNS resolution Automatic container-name DNS সাধারণত নেই Embedded DNS আছে
    Container discovery IP address বা legacy linking Container name
    Isolation Default network Custom network
    Configuration সীমিত বেশি flexible
    Recommendation সাধারণ testing Application deployment

উদাহরণ:

Default Bridge-এ:
172.17.0.2

User-defined Bridge-এ:
postgres-db:5432

দ্বিতীয় পদ্ধতিটি সাধারণত বেশি maintainable। 13. Docker Network Alias
Docker Network Alias ব্যবহার করে container-এর জন্য অতিরিক্ত hostname নির্ধারণ করা যায়।

ধরো, PostgreSQL container-এর নাম postgres-db, কিন্তু তুমি একই container-কে database নামেও access করতে চাও।

Container চালানোর সময়:
docker run -d \
 --name postgres-db \
 --network app-network \
 --network-alias database \
 -e POSTGRES_PASSWORD=change_me \
 postgres:17-alpine

এখন একই network-এর অন্য container থেকে:
postgres-db:5432

অথবা:
database:5432

দুই hostname দিয়েই PostgreSQL service-টি resolve করা যেতে পারে।

14. Real-world E-commerce Example
    এবার আগের lesson-এর architecture-টি একটু আরও ভালোভাবে বুঝি।

আমাদের E-commerce application:

- Nginx
- Go Backend
- PostgreSQL
- Redis
  Network তৈরি:
  docker network create frontend-network
  docker network create backend-network

PostgreSQL:
docker run -d \
 --name postgres-db \
 --network backend-network \
 -e POSTGRES_USER=admin \
 -e POSTGRES_PASSWORD=change_me \
 -e POSTGRES_DB=ecommerce \
 postgres:17-alpine

Redis:
docker run -d \
 --name redis-cache \
 --network backend-network \
 redis:alpine

Go Backend:
docker run -d \
 --name go-backend \
 --network backend-network \
 -e DB_HOST=postgres-db \
 -e DB_PORT=5432 \
 -e REDIS_HOST=redis-cache \
 -e REDIS_PORT=6379 \
 your-go-backend:latest

Backend-কে frontend network-এ যুক্ত করো:
docker network connect frontend-network go-backend

Nginx:
docker run -d \
 --name nginx-proxy \
 --network frontend-network \
 -p 80:80 \
 nginx:alpine

এখন:
Source Destination Address
Go Backend PostgreSQL postgres-db:5432
Go Backend Redis redis-cache:6379
Nginx Go Backend go-backend:5000

এখানে একটি গুরুত্বপূর্ণ security principle আছে: PostgreSQL এবং Redis-কে Host-এর public port-এ publish করার প্রয়োজন নেই, যদি শুধু Backend container-ই এগুলো ব্যবহার করে। 15. Common Problems and Solutions
সমস্যা সম্ভাব্য কারণ সমাধান
Could not resolve host একই user-defined network-এ নেই Network membership check
Connection refused Service চলছে না বা ভুল port Container logs ও port check
Wrong IP address Container recreate হয়েছে Container name ব্যবহার
Database connection timeout Network/firewall/service সমস্যা Network inspect ও service check
Network cannot be removed Container এখনো যুক্ত Disconnect বা remove container

Useful troubleshooting commands:

# List networks

docker network ls

# Inspect network

docker network inspect app-network

# List containers

docker ps -a

# Check container logs

docker logs postgres-db

# Check container IP

docker inspect postgres-db

16. Practical Exercises
    নিজে চেষ্টা করো:

- [ ] app-network নামে User-defined Bridge Network তৈরি করো।
- [ ] postgres-db নামে PostgreSQL container চালু করো।
- [ ] backend-test নামে Alpine container তৈরি করো।
- [ ] nslookup postgres-db দিয়ে DNS resolution পরীক্ষা করো।
- [ ] nc -zv postgres-db 5432 দিয়ে port পরীক্ষা করো।
- [ ] docker network inspect app-network দিয়ে container IP দেখো।
- [ ] PostgreSQL container recreate করে নতুন IP পরীক্ষা করো।
- [ ] Container name ব্যবহার করে আবার connection পরীক্ষা করো।
      Cleanup:
      docker rm -f postgres-db
      docker network rm app-network

backend-test interactive session থেকে exit লিখে বের হলে --rm থাকার কারণে সেটি নিজে থেকেই remove হবে। 17. Important Interview Questions
Q1. What is Docker Embedded DNS?

Docker Embedded DNS হলো Docker-এর built-in DNS service, যা User-defined Network-এ container name resolve করতে সাহায্য করে।

Q2. What is the default DNS address in Docker containers on user-defined networks?

সাধারণত 127.0.0.11।

Q3. Why should we use container names instead of IP addresses?

Container recreate বা network পরিবর্তনের কারণে IP address বদলাতে পারে। Container name ব্যবহার করলে application configuration বেশি stable থাকে।

Q4. What is the difference between Default Bridge and User-defined Bridge?

User-defined Bridge automatic container-name DNS resolution এবং custom network isolation প্রদান করে।

Q5. What happens when a container is removed and recreated?

নতুন container নতুন IP পেতে পারে। তবে একই user-defined network-এ একই নাম ব্যবহার করলে অন্য container সেই নাম resolve করতে পারে।

18. Lesson Summary
    আজকের lesson থেকে মনে রাখবে:
1. docker network ls দিয়ে সব network দেখা যায়।
1. docker network create দিয়ে নতুন network তৈরি করা যায়।
1. docker network inspect দিয়ে network-এর বিস্তারিত জানা যায়।
1. docker network connect দিয়ে container-কে network-এ যুক্ত করা যায়।
1. docker network disconnect দিয়ে network থেকে বিচ্ছিন্ন করা যায়।
1. docker network rm দিয়ে network remove করা যায়।
1. User-defined Bridge Network-এ Docker Embedded DNS container name resolve করে।
1. 127.0.0.11 হলো Docker-এর embedded DNS address।
1. Container IP পরিবর্তিত হতে পারে, তাই container name ব্যবহার করা ভালো।
1. Production application-এ network isolation এবং private service communication গুরুত্বপূর্ণ।
   Next Lesson: 4-11 | Docker Network – Practical Examples and Troubleshooting

Official Documentation:

- Docker Networking Overview
- Bridge Network Driver
- Docker Network CLI Reference
- Docker DNS Services
