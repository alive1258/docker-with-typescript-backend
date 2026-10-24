## 3-5 Named Volumes & Removing Anonymous Volumes

এই লেসনে আমরা Docker-এর দুটি গুরুত্বপূর্ণ বিষয় বিস্তারিত শিখব:

1. Named Volumes — নির্দিষ্ট নাম দিয়ে Docker Volume তৈরি ও ব্যবহার করা।
2. Removing Anonymous Volumes — প্রয়োজন শেষ হলে Anonymous Volume নিরাপদে সরানো।
   তোমার docker-with-typescript-backend প্রজেক্টের কথা মাথায় রেখে আমরা practical command দিয়ে বিষয়গুলো বুঝব।
3. Named Volume কী?
   Named Volume হলো এমন একটি Docker-managed storage, যেটিকে আমরা নিজের পছন্দমতো একটি নাম দিতে পারি। যেমন:
   docker volume create backend-data

এখানে backend-data হলো Volume-এর নাম।

এই Volume-এ data রাখলে container মুছে ফেলা বা নতুন container তৈরি করার পরও একই Volume পুনরায় mount করে data ব্যবহার করা যায়।
Container A

Data লিখছে

Mount

Named Volume: backend-data

Container থেকে আলাদা persistent storage

Container B

একই Volume থেকে data পড়ছে

Named Volume-এর সুবিধা:

- সহজে নাম দিয়ে শনাক্ত করা যায়।
- Container recreate করলেও একই Volume ব্যবহার করা যায়।
- একাধিক container একই Volume ব্যবহার করতে পারে।
- Database-এর persistent data সংরক্ষণে উপযোগী।

2. Named Volume তৈরি করা
   প্রথমে Volume তৈরি করো:
   docker volume create backend-data

Volume তৈরি হয়েছে কি না দেখো:
docker volume ls

সম্ভাব্য output:
DRIVER VOLUME NAME
local backend-data

একটি নির্দিষ্ট Volume সম্পর্কে বিস্তারিত দেখতে:
docker volume inspect backend-data

এখানে Docker Volume-এর driver, mount point এবং অন্যান্য তথ্য দেখাবে। Docker Desktop ব্যবহার করলে Mountpoint সাধারণ Linux host-এর path-এর মতো সরাসরি Windows File Explorer-এ নাও পাওয়া যেতে পারে। 3. Named Volume ব্যবহার করা
এবার একটি test container-এর সঙ্গে Volume যুক্ত করি:
docker run --name volume-test \
 --mount source=backend-data,target=/data \
 alpine sh -c "echo 'Hello from Docker Volume' > /data/message.txt"

এখানে:

- --name volume-test — Container-এর নাম।
- --mount — Storage mount করার পদ্ধতি।
- source=backend-data — আগে তৈরি করা Named Volume।
- target=/data — Container-এর directory।
- alpine — ছোট Linux-based image।
- echo — /data/message.txt ফাইলে লেখা সংরক্ষণ করে।
  Command শেষ হলে container বন্ধ হয়ে যাবে। কিন্তু backend-data Volume আলাদা থাকবে।

এবার container-টি সরাও:
docker rm volume-test

তারপর একটি নতুন container দিয়ে আগের data পড়ো:
docker run --rm \
 --mount source=backend-data,target=/data \
 alpine cat /data/message.txt

Output:
Hello from Docker Volume

এটাই Named Volume-এর মূল সুবিধা: Container মুছে ফেলার পরও Volume-এর data অক্ষত থাকে। 4. Anonymous Volume কী?
Anonymous Volume হলো এমন Volume, যেটি ব্যবহার করার সময় আমরা নিজেরা কোনো নির্দিষ্ট নাম দিই না।

উদাহরণ:
docker run -d \
 --name anonymous-test \
 -v /data \
 alpine sleep 3600

এখানে -v /data ব্যবহার করায় Docker /data-এর জন্য একটি Anonymous Volume তৈরি করবে।

Volume-এর নাম Docker নিজে তৈরি করে। সেটি দেখতে:
docker volume ls

Output-এ এমন একটি দীর্ঘ নাম দেখা যেতে পারে:
DRIVER VOLUME NAME
local 7b4f9c2a8d...

এই নামটি Docker তৈরি করেছে; এটি anonymous-test container-এর নাম নয়।
Named ও Anonymous Volume-এর পার্থক্য
বিষয় Named Volume Anonymous Volume
নাম নিজেরা নির্ধারণ করি Docker তৈরি করে
উদাহরণ backend-data দীর্ঘ generated identifier
পুনরায় ব্যবহার সহজ তুলনামূলক কঠিন
Container মুছলে সাধারণত থেকে যায় সাধারণত থেকে যায়, যদি আলাদাভাবে সরানো না হয়
ব্যবহার Database ও persistent data স্বয়ংক্রিয় বা নির্দিষ্ট container-এর storage

মনে রাখবে: Anonymous Volume মানেই অস্থায়ী Volume নয়। Container মুছে ফেললেও এটি থেকে যেতে পারে। 5. Anonymous Volume কীভাবে শনাক্ত করবে?
প্রথমে একটি container তৈরি করো:
docker run -d \
 --name anonymous-demo \
 -v /data \
 alpine sleep 3600

এবার container-এর সঙ্গে যুক্ত Volume দেখো:
docker inspect anonymous-demo

Output-এর Mounts অংশে এমন তথ্য পাবে:
[
{
"Type": "volume",
"Name": "7b4f9c2a8d...",
"Destination": "/data"
}
]

এখানে:

- Type: volume — এটি Docker Volume।
- Name — Volume-এর generated নাম।
- Destination: /data — Container-এর যে path-এ Volume যুক্ত হয়েছে।
  শুধু Mounts অংশ দেখতে চাইলে Git Bash-এ চালাতে পারো:
  docker inspect --format='{{json .Mounts}}' anonymous-demo

6. Anonymous Volume কীভাবে Remove করবে?
   অপ্রয়োজনীয় Anonymous Volume সরানোর কয়েকটি পদ্ধতি আছে।
   পদ্ধতি ১: Container মুছে Anonymous Volume সরানো
   যদি তুমি নিশ্চিত হও যে container-এর সঙ্গে যুক্ত Anonymous Volume-এর data আর প্রয়োজন নেই, তাহলে চালাও:
   docker rm -v anonymous-demo

এখানে:

- docker rm — Container সরায়।
- -v — Container-এর সঙ্গে যুক্ত Anonymous Volume সরানোর অনুরোধ করে।
  সতর্কতা: এই command container-টি সরিয়ে দেবে। Named Volume-গুলো সাধারণত এই command দিয়ে সরানো হয় না।
  পদ্ধতি ২: --rm দিয়ে স্বয়ংক্রিয় cleanup
  Test container চালানোর সময়:
  docker run --rm \
   --name temporary-demo \
   -v /data \
   alpine sh -c "echo 'Temporary data' > /data/message.txt"

Command শেষ হলে container নিজে থেকে সরিয়ে দেওয়া হবে এবং --rm-এর কারণে এর সঙ্গে যুক্ত Anonymous Volume-ও পরিষ্কার করা হবে।

এই পদ্ধতি ছোট test বা temporary workload-এর জন্য সুবিধাজনক। গুরুত্বপূর্ণ data সংরক্ষণের জন্য এটি ব্যবহার কোরো না।
পদ্ধতি ৩: অব্যবহৃত Anonymous Volume পরিষ্কার করা
কোনো container ব্যবহার করছে না—এমন Anonymous Volume পরিষ্কার করতে:
docker volume prune

Docker-এর সংস্করণ ও command options অনুযায়ী কোন ধরনের unused Volume পরিষ্কার হবে, তা যাচাই করে নাও। docker volume prune চালানোর আগে confirmation ও প্রভাব বুঝে নেবে।

আরও স্পষ্টভাবে, সব ধরনের unused Volume—Named Volume-সহ—সরানোর option হলো:
docker volume prune -a

এই command বিশেষভাবে সতর্কতার সঙ্গে ব্যবহার করবে। এটি গুরুত্বপূর্ণ Named Volume-ও সরিয়ে দিতে পারে, যদি সেগুলো কোনো container ব্যবহার না করে। আগে docker volume ls দিয়ে তালিকা যাচাই করো। 7. Named Volume কি সরাসরি Remove করা যায়?
হ্যাঁ। উদাহরণস্বরূপ, backend-data Volume আর প্রয়োজন না হলে:
docker volume rm backend-data

তবে কোনো container Volume-টি ব্যবহার করলে সাধারণত সেটি সরানো যাবে না। আগে কোন container ব্যবহার করছে তা যাচাই করো।
docker ps -a --filter volume=backend-data

তারপর data প্রয়োজন নেই এবং কোনো container এটি ব্যবহার করছে না নিশ্চিত হলে Volume সরাও। 8. তোমার TypeScript Backend-এর জন্য কোনটি ভালো?
তোমার docker-with-typescript-backend project-এর ক্ষেত্রে:

- PostgreSQL বা MySQL database-এর গুরুত্বপূর্ণ data হলে Named Volume ব্যবহার করা ভালো।
- Development-এর সময় local source code container-এ দেখাতে Bind Mount বেশি উপযোগী।
- অস্থায়ী test-এর জন্য Anonymous Volume ব্যবহার করা যায়।
- Container delete করার আগে data কোথায় রাখা হয়েছে, তা যাচাই করা উচিত।
  উদাহরণ হিসেবে, PostgreSQL-এর official image ব্যবহার করলে Named Volume এভাবে যুক্ত করা যায়:
  docker volume create postgres-data

docker run -d \
 --name postgres-db \
 -e POSTGRES_PASSWORD=change_this_password \
 --mount source=postgres-data,target=/var/lib/postgresql/data \
 postgres

এটি একটি শেখার উদাহরণ। বাস্তবে password environment variable হিসেবে সরাসরি command-এ না দিয়ে নিরাপদ secrets ব্যবস্থাপনা ব্যবহার করা ভালো। PostgreSQL-এর data directory image-এর সংস্করণ অনুযায়ী যাচাই করবে। 9. Practical exercise
নিচের কাজগুলো নিজে করো:
[ ] backend-data নামে Named Volume তৈরি করেছি
[ ] Named Volume-এ file লিখে নতুন container থেকে পড়েছি
[ ] Anonymous Volume তৈরি করে docker volume ls দিয়ে দেখেছি
[ ] Container ও Volume সরানোর আগে data কোথায় আছে যাচাই করেছি
0 / 4 কাজ সম্পন্ন

Lesson summary

- Named Volume-এর নাম আমরা নিজেরা দিই।
- Anonymous Volume-এর নাম Docker নিজে তৈরি করে।
- Container মুছে ফেললে Volume সবসময় স্বয়ংক্রিয়ভাবে মুছে যায় না।
- docker rm -v সংশ্লিষ্ট Anonymous Volume সরাতে পারে।
- docker run --rm temporary container-এর সঙ্গে যুক্ত Anonymous Volume পরিষ্কার করতে পারে।
- docker volume prune ও docker volume prune -a চালানোর আগে কোন data মুছে যেতে পারে, তা অবশ্যই যাচাই করবে।
  পরবর্তী ধাপ হিসেবে Docker Compose-এ Named Volume ব্যবহার করা শিখলে TypeScript backend এবং database একসঙ্গে পরিচালনা করা আরও সহজ হবে।
