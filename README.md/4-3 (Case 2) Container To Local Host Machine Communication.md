## 4-3 (Case 2) Container to Local Host Machine Communication

Docker Networking-এর এই লেসনে আমরা শিখব কীভাবে একটি Docker container থেকে নিজের Host Machine বা Local Computer-এ চলমান application, server এবং service-এর সঙ্গে communication করা যায়।

এটি Backend Development-এর জন্য খুবই গুরুত্বপূর্ণ। বিশেষ করে যখন তোমার Node.js Backend Docker container-এর মধ্যে চলছে, কিন্তু PostgreSQL, MongoDB অথবা অন্য কোনো service তোমার Windows computer-এ সরাসরি চলছে।

1. Local Host Machine কী?
   Host Machine হলো সেই computer যেখানে Docker Engine বা Docker Desktop চলছে।

তোমার ক্ষেত্রে:

- Host Machine: Windows Desktop
- Terminal: Git Bash
- Application: TypeScript Backend
- Container: Docker-এর মধ্যে চলমান Backend
  ধরো, তোমার Windows computer-এ একটি Node.js server চলছে:
  http://localhost:4000

এখন তুমি Docker container-এর ভেতর থেকে এই server-এ request পাঠাতে চাও।

এখানেই একটি গুরুত্বপূর্ণ বিষয় আসে:

Container-এর ভিতরে localhost বলতে Host Machine-কে বোঝায় না।

Container-এর localhost বা 127.0.0.1 বলতে সেই container নিজেকেই বোঝায়। 2. Host এবং Container-এর localhost-এর পার্থক্য
Host Machine — Windows

localhost:4000

Local API Server

Docker Container

localhost:4000

এটি Container-এর নিজের localhost

দুটি আলাদা network environment। তাই container-এর localhost দিয়ে সরাসরি Host-এর server পাওয়া যায় না।

উদাহরণ:

Host Machine-এ:
npm run dev

ধরো server চলছে:
http://localhost:4000

এখন container-এর ভেতর থেকে:
wget -qO- http://localhost:4000

এটি Host Machine-এর server-এ request পাঠাবে না। বরং container-এর নিজের port 4000-এ request পাঠাবে। 3. তাহলে Container থেকে Host Machine-এ কীভাবে Connect করব?
Docker Desktop-এ Windows ও macOS-এর জন্য একটি বিশেষ hostname রয়েছে:
host.docker.internal

এটি ব্যবহার করে container থেকে Host Machine-এর service access করা যায়।
Docker Docs+1

উদাহরণ:
http://host.docker.internal:4000

এখানে:

- host.docker.internal — Host Machine-এর address।
- 4000 — Host Machine-এর application port।
  অর্থাৎ, তোমার container যদি Host Machine-এর port 4000-এ চলমান server-এ request পাঠাতে চায়, তাহলে এই address ব্যবহার করবে।

4. Practical Example: Host Machine থেকে Container Connect করা
   এবার আমরা একটি practical example করব।

ধরো, তোমার Windows computer-এ একটি Node.js server চলছে এবং Docker container থেকে সেটিতে request পাঠাতে হবে।
Step 1: Host Machine-এ একটি Node.js server চালাও
একটি server.js ফাইল তৈরি করো:
const http = require("http");

const server = http.createServer((req, res) => {
res.writeHead(200, {
"Content-Type": "application/json",
});

res.end(
JSON.stringify({
message: "Hello from Host Machine!",
})
);
});

server.listen(4000, "0.0.0.0", () => {
console.log("Server running on port 4000");
});

এবার Windows terminal-এ চালাও:
node server.js

Output:
Server running on port 4000

এখন Host Machine-এর server চলছে:
http://localhost:4000

Step 2: Docker Container তৈরি করো
Git Bash-এ চালাও:
docker run -it --name host-communication alpine sh

এতে Alpine Linux container-এর terminal খুলবে।
Step 3: Container থেকে Host Machine-এ request পাঠাও
Container-এর terminal-এ চালাও:
wget -qO- http://host.docker.internal:4000

Expected output:
{"message":"Hello from Host Machine!"}

Success
এর অর্থ হলো Docker container সফলভাবে Host Machine-এর Node.js server-এর সঙ্গে যোগাযোগ করেছে। 5. কেন host.docker.internal ব্যবহার করি?
Docker Desktop একটি বিশেষ DNS hostname প্রদান করে:
host.docker.internal

এর মাধ্যমে container থেকে Host Machine-এ চলমান service-এ যোগাযোগ করা যায়।
Address অর্থ
localhost Container নিজেই
127.0.0.1 Container-এর loopback address
host.docker.internal Host Machine
host.docker.internal:4000 Host-এর port 4000

গুরুত্বপূর্ণ: host.docker.internal হলো Docker Desktop-এর সুবিধা। Native Linux Docker Engine-এ এটি সবসময় স্বয়ংক্রিয়ভাবে পাওয়া যায় না।

Linux-এ প্রয়োজনে container চালানোর সময়:
docker run -it \
 --add-host=host.docker.internal:host-gateway \
 alpine sh

এতে host.docker.internal hostname-টি host gateway address-এর সঙ্গে যুক্ত হবে। 6. TypeScript Backend-এর বাস্তব উদাহরণ
ধরো, তোমার TypeScript Backend Docker container-এর মধ্যে চলছে।

অন্যদিকে, তোমার Windows computer-এ একটি আলাদা development API চলছে:
http://localhost:4000/api/users

Container-এর Backend থেকে এই API call করতে চাইলে:
const getUsers = async () => {
const response = await fetch(
"http://host.docker.internal:4000/api/users"
);

if (!response.ok) {
throw new Error("Failed to fetch users");
}

return response.json();
};

এখানে localhost-এর পরিবর্তে host.docker.internal ব্যবহার করা হয়েছে।

এটি বিশেষভাবে কাজে আসে যখন:

- Backend Docker container-এ চলছে।
- Database Host Machine-এ চলছে।
- Redis Host Machine-এ চলছে।
- অন্য কোনো local development server Host Machine-এ চলছে।

7. Docker Compose-এ কীভাবে ব্যবহার করবে?
   ধরো, তোমার docker-compose.yml আছে:
   services:
   backend:
   build: .
   container_name: typescript-backend
   ports: - "5000:5000"
   extra_hosts: - "host.docker.internal:host-gateway"

এখানে extra_hosts Linux compatibility-এর জন্য hostname mapping যোগ করে। Docker Desktop-এ সাধারণত এই hostname আগে থেকেই পাওয়া যায়।

তারপর তোমার application থেকে:
const API_URL = "http://host.docker.internal:4000";

এভাবে Host Machine-এর API access করতে পারবে। 8. Common Errors এবং Solutions
Error সম্ভাব্য কারণ সমাধান
ECONNREFUSED Host-এর server চলছে না Server চালু করো
ENOTFOUND Hostname resolve হচ্ছে না Docker Desktop বা hostname configuration যাচাই করো
ETIMEDOUT Network বা firewall সমস্যা Firewall ও network পরীক্ষা করো
404 Not Found API endpoint ভুল সঠিক route ব্যবহার করো
localhost connection failure ভুল localhost ব্যবহার host.docker.internal ব্যবহার করো

আরেকটি গুরুত্বপূর্ণ বিষয়: Host Machine-এর application যদি শুধু 127.0.0.1-এ listen করে, তাহলে Docker Desktop-এর মাধ্যমে সেটি access করতে সমস্যা হতে পারে। প্রয়োজন হলে application-কে 0.0.0.0-এ listen করাও এবং Windows Firewall-এর অনুমতি যাচাই করো। 9. Case 1 বনাম Case 2
আগের লেসন এবং বর্তমান লেসনের পার্থক্য বুঝে রাখো।
Case 1: Container to WWW
Docker Container

External Website / API

উদাহরণ: JSONPlaceholder API-তে request পাঠানো।

Case 2: Container to Host Machine
Docker Container

Host Machine

উদাহরণ: host.docker.internal:4000 ব্যবহার করে local API access করা।

10. Practical Exercise
    নিজে নিচের কাজগুলো করে দেখো।
    [ ] Host Machine-এ Node.js server port 4000-এ চালিয়েছি
    [ ] Alpine Docker container তৈরি করেছি
    [ ] host.docker.internal ব্যবহার করে request পাঠিয়েছি
    [ ] Host Machine থেকে JSON response পেয়েছি
    [ ] Container-এর localhost এবং Host Machine-এর address-এর পার্থক্য বুঝেছি
    0 / 5 completed

Lesson Summary
আজকের লেসনের সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলো:

1. Host Machine হলো সেই computer যেখানে Docker চলছে।
2. Container-এর localhost এবং Host Machine-এর localhost আলাদা।
3. Docker Desktop-এ Host Machine access করতে host.docker.internal ব্যবহার করা যায়।
4. Host-এর service-এর port ব্যবহার করে container থেকে request পাঠানো যায়।
5. এই communication-এর জন্য সাধারণত -p port mapping প্রয়োজন হয় না; -p মূলত Host থেকে container-এর service access করার জন্য ব্যবহৃত হয়।
   মনে রাখবে:
   Container → Host Machine

http://host.docker.internal:PORT

এটাই আজকের লেসনের মূল ধারণা।
