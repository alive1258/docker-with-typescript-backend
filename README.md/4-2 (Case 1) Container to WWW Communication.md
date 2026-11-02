## 4-2 (Case 1) Container to WWW Communication

Docker-এর এই লেসনে আমরা শিখব কীভাবে একটি Docker container থেকে বাইরের Internet বা WWW (World Wide Web)-এ থাকা website, API এবং অন্যান্য online service-এর সঙ্গে communication করা যায়।

তোমার Node.js ও TypeScript Backend-এর উদাহরণ দিয়ে বিষয়টি ব্যাখ্যা করছি।

1. Container to WWW Communication কী?
   ধরো, তোমার একটি Node.js Backend application Docker container-এর মধ্যে চলছে।

এই application-কে বিভিন্ন external service-এর সঙ্গে যোগাযোগ করতে হতে পারে:

- External REST API
- Payment Gateway
- Weather API
- Google APIs
- Third-party authentication service
- অন্য কোনো public website
  Container থেকে এসব external service-এ HTTP request পাঠানোকে Container-to-WWW Communication বলা যায়।
  Docker Container

Node.js / TypeScript Backend

HTTP / HTTPS Request & Response

WWW / Internet

External API / Website / Online Services

সহজভাবে:

তোমার Backend container থেকে কোনো external API-তে request যাবে। API response পাঠাবে এবং তোমার application সেই response ব্যবহার করবে। 2. Docker Container কীভাবে Internet Access পায়?
Docker সাধারণত container তৈরি করার সময় একটি network তৈরি বা ব্যবহার করে। Linux-এ Docker-এর default bridge network এবং NAT/masquerading-এর মাধ্যমে container বাইরের network-এ যোগাযোগ করতে পারে।

সাধারণত Docker-এর default bridge networking ব্যবহার করলে container থেকে Internet access করার জন্য আলাদা কোনো configuration প্রয়োজন হয় না।
Docker Docs+1

উদাহরণ:
docker run -d --name my-container alpine sleep 3600

এখানে:

- docker run — নতুন container তৈরি ও চালায়।
- -d — Background-এ চালায়।
- --name my-container — Container-এর নাম।
- alpine — Lightweight Linux image।
- sleep 3600 — Container-কে এক ঘণ্টা চালু রাখে।

3. Container থেকে Internet পরীক্ষা করা
   প্রথমে container-এর ভেতরে প্রবেশ করো:
   docker exec -it my-container sh

এখন container-এর terminal থেকে একটি public website-এ request পাঠাও।

Alpine-এ wget ব্যবহার করতে পারো:
wget -qO- https://example.com

অথবা:
wget --spider https://example.com

যদি website থেকে response পাও, তাহলে container থেকে WWW-তে communication কাজ করছে।

পরীক্ষা শেষে container থেকে বের হও:
exit

একটি গুরুত্বপূর্ণ বিষয়

Alpine-এর সব image-এ curl আগে থেকে install করা থাকে না। তাই curl command না পেলে সেটি Internet connection failure প্রমাণ করে না। wget ব্যবহার করতে পারো।

4. Container থেকে External API Call করা
   এবার একটি বাস্তব API example দেখি।

ধরো, তোমার TypeScript Backend থেকে JSONPlaceholder API-তে request পাঠাতে হবে।

API URL:
https://jsonplaceholder.typicode.com/posts/1

Container-এর ভিতরে পরীক্ষা:
wget -qO- https://jsonplaceholder.typicode.com/posts/1

সম্ভাব্য response:
{
"userId": 1,
"id": 1,
"title": "sunt aut facere repellat provident occaecati",
"body": "quia et suscipit..."
}

এর অর্থ হলো Docker container সফলভাবে external API-এর সঙ্গে যোগাযোগ করতে পারছে। 5. Node.js Application থেকে WWW Communication
তোমার TypeScript Backend-এ fetch() ব্যবহার করে external API call করতে পারো।

উদাহরণ:
const getExternalData = async () => {
const response = await fetch(
"https://jsonplaceholder.typicode.com/posts/1"
);

if (!response.ok) {
throw new Error(`API Error: ${response.status}`);
}

const data = await response.json();

console.log(data);
};

getExternalData();

এই application Docker container-এর মধ্যে চললেও external API-তে request পাঠাতে পারবে, যদি container-এর network connectivity এবং DNS ঠিক থাকে। 6. Container থেকে Internet কাজ না করলে কী করবে?
কখনো কখনো container থেকে external website access করা যায় না। তখন কয়েকটি বিষয় পরীক্ষা করতে হবে।

১. Container চলছে কি না:
docker ps

২. Container-এর network configuration:
docker inspect my-container

৩. DNS resolution পরীক্ষা:
docker exec my-container nslookup example.com

nslookup না থাকলে Alpine-এ প্রয়োজনীয় DNS utility install করতে হতে পারে।

৪. HTTPS connectivity পরীক্ষা:
docker exec my-container wget -S --spider https://example.com

সমস্যার কারণ হতে পারে:

- Internet connection সমস্যা।
- DNS resolution সমস্যা।
- Firewall বা proxy restriction।
- Docker network configuration সমস্যা।
- External API-এর server unavailable থাকা।

7. Host-to-WWW এবং Container-to-WWW পার্থক্য
   বিষয় Host-to-WWW Container-to-WWW
   Request কোথা থেকে যায়? নিজের Computer Docker Container
   Network Host network Container network
   Internet access Host-এর network configuration Docker networking-এর মাধ্যমে
   ব্যবহার Browser, local application Dockerized Backend

8. গুরুত্বপূর্ণ Docker Networking Commands
   Command কাজ
   docker network ls সব Docker network দেখায়
   docker network inspect bridge Bridge network-এর বিস্তারিত দেখায়
   docker inspect my-container Container configuration দেখায়
   docker exec -it my-container sh Container terminal-এ প্রবেশ করে
   docker logs my-container Container logs দেখায়

9. Practical Exercise
   এবার নিজে নিচের কাজগুলো করে দেখো।
   [ ] Alpine container তৈরি করেছি
   [ ] Container-এর ভিতরে প্রবেশ করেছি
   [ ] wget দিয়ে example.com access করেছি
   [ ] JSONPlaceholder API থেকে JSON response পেয়েছি
   [ ] Container থেকে exit করেছি
   0 / 5 completed

Lesson Summary
আজকের লেসনে শিখলে:

1. Container থেকে WWW বা Internet-এ communication করা যায়।
2. Docker-এর default networking সাধারণত outbound Internet access দেয়।
3. Container থেকে wget ব্যবহার করে external website পরীক্ষা করা যায়।
4. Node.js-এর fetch() দিয়ে external API call করা যায়।
5. DNS, Firewall এবং Network configuration-এর কারণে connectivity সমস্যা হতে পারে।
   মনে রাখবে: Container-to-WWW Communication মানে Container থেকে বাইরের Internet-এ request পাঠানো। এটি WWW থেকে সরাসরি তোমার container-এ incoming connection গ্রহণ করার বিষয় নয়—সেটি আলাদা networking concept।
