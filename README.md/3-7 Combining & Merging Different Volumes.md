# 3-7 | Combining & Merging Different Volumes

Docker-এ Combining & Merging Different Volumes বলতে একাধিক Volume বা Storage Source-কে একটি Container-এর সঙ্গে যুক্ত করে ব্যবহার করাকে বোঝায়।

এর মাধ্যমে একটি Application-এর বিভিন্ন ধরনের Data আলাদাভাবে সংরক্ষণ ও পরিচালনা করা যায়।

1. Why Combine Multiple Volumes?
   ধরুন, আপনি একটি E-commerce Application তৈরি করছেন। এখানে বিভিন্ন ধরনের Data রয়েছে:

- Database Data
- Application Logs
- Uploaded Images
- Configuration Files
  সব Data একই জায়গায় না রেখে আলাদা Volume-এ সংরক্ষণ করা ভালো।

javascriptcentric.medium.com

উদাহরণ:
E-commerce Application
|
v
Docker Container
|
|------ Database Volume
|
|------ Uploads Volume
|
|------ Logs Volume
|
|------ Config Bind Mount

এতে প্রতিটি Data আলাদাভাবে Manage করা যায়। 2. Create Multiple Docker Volumes
প্রথমে তিনটি Docker Volume তৈরি করি।
docker volume create db-data

docker volume create app-uploads

docker volume create app-logs

তৈরি হওয়া Volume-গুলো দেখতে:
docker volume ls

Expected Output:
DRIVER VOLUME NAME
local db-data
local app-uploads
local app-logs

3. Attach Multiple Volumes to One Container
   এবার একটি Container-এর সঙ্গে একাধিক Volume যুক্ত করব।
   docker run -d \
    --name my-app \
    --mount source=db-data,target=/app/database \
    --mount source=app-uploads,target=/app/uploads \
    --mount source=app-logs,target=/app/logs \
    nginx

Command Explanation:
Command Explanation
docker run -d Background-এ Container চালায়
--name my-app Container-এর নাম
source=db-data Database Volume
target=/app/database Container-এর Database Directory
source=app-uploads Uploads Volume
target=/app/uploads Container-এর Upload Directory
source=app-logs Logs Volume
target=/app/logs Container-এর Logs Directory

medium.com

এখানে একটি Container-এর সঙ্গে তিনটি আলাদা Docker Volume যুক্ত হয়েছে। 4. Using Multiple Volumes with PostgreSQL
এবার একটি Real-world Example দেখি।

ধরুন, আপনি PostgreSQL Database চালাবেন এবং Database-এর Data ও Backup আলাদাভাবে রাখতে চান।

প্রথমে Volume তৈরি করুন:
docker volume create postgres-data

docker volume create postgres-backups

PostgreSQL Container চালান:
docker run -d \
 --name my-postgres \
 -e POSTGRES_PASSWORD=secret123 \
 -e POSTGRES_DB=myapp \
 -p 5432:5432 \
 --mount source=postgres-data,target=/var/lib/postgresql \
 --mount source=postgres-backups,target=/backups \
 postgres:18

Important
PostgreSQL-এর নির্দিষ্ট Version অনুযায়ী Data Directory পরিবর্তিত হতে পারে। Official Image-এর PGDATA Path যাচাই করে Volume Mount করবেন। PostgreSQL 18-এর ক্ষেত্রে সাধারণত /var/lib/postgresql mount করা হয়। 5. Inspect Multiple Volume Mounts
Container-এর সঙ্গে কোন কোন Volume যুক্ত আছে দেখতে:
docker inspect my-app

শুধু Mount Information দেখতে:
docker inspect my-app --format '{{json .Mounts}}'

এখানে Volume-এর Source, Destination এবং Mount Type দেখতে পাবেন। 6. Can We Merge Different Volumes into One Directory?
Docker-এ একাধিক Volume একই Container Directory-তে Mount করা technically সম্ভব হলেও সাধারণত এটি করা উচিত নয়।

উদাহরণ:
docker run -d \
 --name test-app \
 --mount source=db-data,target=/app/data \
 --mount source=app-uploads,target=/app/data \
 nginx

এভাবে একই Target Directory-তে একাধিক Volume Mount করলে একটি Mount অন্যটির Content আড়াল করতে পারে।

Best Practice: প্রতিটি Volume-এর জন্য আলাদা Target Directory ব্যবহার করুন।
/app/
|
|--- database/
|
|--- uploads/
|
|--- logs/

7. Docker Volume vs Bind Mount Together
   আপনি চাইলে একই Container-এ Docker Volume এবং Bind Mount একসঙ্গে ব্যবহার করতে পারবেন।
   docker run -d \
    --name web-app \
    -p 8080:80 \
    --mount source=app-uploads,target=/usr/share/nginx/html/uploads \
    --mount type=bind,source="E:/docker-learning/config",target=/app/config,readonly \
    nginx

এখানে:

- app-uploads হলো Docker Named Volume।
- E:/docker-learning/config হলো Host-এর Local Directory।
- readonly দিয়ে Config Directory-কে Read-only করা হয়েছে।

medium.com

8. Useful Docker Commands
   Command কাজ
   docker volume ls সব Volume দেখায়
   docker volume create name নতুন Volume তৈরি
   docker volume inspect name Volume বিস্তারিত দেখায়
   docker volume rm name Volume Delete করে
   docker inspect container Container-এর Mount Information
   docker volume prune Unused Volume Remove করে

সতর্কতা: docker volume rm এবং docker volume prune ব্যবহার করার আগে নিশ্চিত হবেন যে প্রয়োজনীয় Data হারিয়ে যাবে না।

9. Practice Tasks
   নিজে হাতে নিচের কাজগুলো করুন:

- [ ] db-data নামে একটি Volume তৈরি করুন।
- [ ] uploads-data নামে আরেকটি Volume তৈরি করুন।
- [ ] logs-data নামে তৃতীয় Volume তৈরি করুন।
- [ ] একটি Nginx Container চালান।
- [ ] তিনটি Volume একই Container-এ Mount করুন।
- [ ] docker inspect দিয়ে Mount Information দেখুন।
- [ ] Container Remove করে আবার একই Volume দিয়ে নতুন Container চালান।
- [ ] আগের Volume-এর Data পাওয়া যাচ্ছে কি না পরীক্ষা করুন।

10. Key Takeaways
1. একটি Container-এ একাধিক Docker Volume ব্যবহার করা যায়।
1. প্রতিটি Volume আলাদা Data সংরক্ষণ করতে পারে।
1. Named Volume এবং Bind Mount একই Container-এ একসঙ্গে ব্যবহার করা যায়।
1. একই Target Directory-তে একাধিক Volume Mount করা এড়িয়ে চলা উচিত।
1. Container Delete করলেও Named Volume আলাদাভাবে সংরক্ষিত থাকে, যতক্ষণ না সেটি Delete করা হয়।
   Next Topic: 3-8 | Sharing Data Between Containers

এখানে শিখবেন কীভাবে একাধিক Docker Container একই Volume ব্যবহার করে Data Share করতে পারে।
