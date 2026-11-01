## 3-6 | Getting Started With Bind Mounts

Docker-এর Bind Mounts হলো এমন একটি পদ্ধতি, যার মাধ্যমে আপনার computer-এর নির্দিষ্ট folder বা file সরাসরি Docker container-এর সঙ্গে connect করতে পারেন।

এর ফলে container-এর ভেতর থেকে আপনার local computer-এর file access করা যায় এবং পরিবর্তন করলে দুই জায়গাতেই পরিবর্তন দেখা যায়।

1. What is a Bind Mount?
   সহজ ভাষায়:

ধরুন, আপনার computer-এ একটি project আছে:
E:/docker-learning/my-app

আপনি চান Docker container-এর ভেতর থেকেও এই project-এর file access করতে।

এক্ষেত্রে Bind Mount ব্যবহার করবেন।

blog.adrianrubico.com

এখানে দুটি বিষয় রয়েছে:

- Host: আপনার নিজের computer (Windows/Linux/Mac)।
- Container: Docker-এর ভেতরে চলমান isolated environment।
  Bind Mount Host-এর folder-কে Container-এর নির্দিষ্ট folder-এর সঙ্গে যুক্ত করে।

2. Bind Mount কেন ব্যবহার করবেন?
   ধরুন, আপনি একটি Node.js application তৈরি করছেন।

প্রতিবার code পরিবর্তন করার পর container rebuild করতে হলে development অনেক ধীর হয়ে যাবে।

Bind Mount ব্যবহার করলে:

1. Local computer-এ code লিখবেন।
2. সেই code container-এর ভেতরেও available থাকবে।
3. Local file পরিবর্তন করলে container থেকেও পরিবর্তন দেখতে পারবেন।
4. বারবার Docker image rebuild করার প্রয়োজন হবে না।
   Common Use Cases:

- Local development
- Live code editing
- Configuration files share করা
- Application logs access করা
- Development environment তৈরি করা

3. Bind Mount Command
   Docker-এ Bind Mount করার জন্য -v অথবা --mount ব্যবহার করা যায়।

Using -v:
docker run -d \
 -v /host/path:/container/path \
 nginx

Using --mount:
docker run -d \
 --mount type=bind,source=/host/path,target=/container/path \
 nginx

দুটিই Bind Mount তৈরি করতে পারে। 4. Practical Example (Windows)
ধরুন আপনার project directory:
E:\docker-learning\my-app

প্রথমে folder তৈরি করুন:
mkdir E:\docker-learning\my-app

এরপর folder-এর মধ্যে একটি file তৈরি করুন:
my-app/
└── index.html

index.html:

<h1>Hello Docker Bind Mount!</h1>

এবার Nginx container চালান:
docker run -d \
 --name my-nginx \
 -p 8080:80 \
 --mount type=bind,source="E:/docker-learning/my-app",target=/usr/share/nginx/html \
 nginx

medium.com

Command Explanation:
Command Explanation
docker run নতুন container চালায়
-d Background-এ চালায়
--name my-nginx Container-এর নাম
-p 8080:80 Host ও container port connect
type=bind Bind Mount নির্ধারণ
source আপনার computer-এর folder
target Container-এর folder
nginx Docker image

এখন browser-এ যান:
http://localhost:8080

আপনি দেখতে পাবেন:
Hello Docker Bind Mount!

5. Test Live File Changes
এবার আপনার local computer-এর index.html পরিবর্তন করুন:
<h1>Updated Docker Bind Mount!</h1>
<p>Learning Docker with Zamirul</p>

Browser refresh করুন:
http://localhost:8080

নতুন content দেখতে পাবেন।

এটাই Bind Mount-এর সবচেয়ে গুরুত্বপূর্ণ সুবিধা। 6. Bind Mount vs Volume
Docker-এ Bind Mount এবং Volume দুটোই container-এর data persist ও share করতে সাহায্য করে। তবে এদের মধ্যে পার্থক্য রয়েছে।
Feature Bind Mount Docker Volume
Storage Location Host-এর নির্দিষ্ট path Docker-managed location
File Access Host থেকে সহজে access Docker command দিয়ে manage
Development খুবই উপযোগী ব্যবহার করা যায়
Management User manages Docker manages
Portability Host path-এর ওপর নির্ভরশীল তুলনামূলক বেশি portable

rafftechnologies.com

7. Useful Docker Commands
   Check running containers:
   docker ps

Inspect container mounts:
docker inspect my-nginx

Stop container:
docker stop my-nginx

Remove container:
docker rm my-nginx

Remove container forcefully:
docker rm -f my-nginx

8. Important Notes

- Bind Mount ব্যবহার করার সময় Host-এর সঠিক folder path দিতে হবে।
- Container-এর target directory আগে থেকেই থাকলে তার existing content mount-এর আড়ালে চলে যেতে পারে।
- Container-এর ভেতরের application-এর file permission সমস্যা হতে পারে।
- Production environment-এ প্রয়োজন ছাড়া অতিরিক্ত Host directory mount করবেন না।
- Read-only mount প্রয়োজন হলে readonly ব্যবহার করতে পারেন।
  Example:
  docker run -d \
   --name readonly-nginx \
   --mount type=bind,source="E:/docker-learning/my-app",target=/usr/share/nginx/html,readonly \
   nginx

এতে container থেকে mounted folder-এর content পরিবর্তন করা যাবে না।

9. Practice Tasks
   নিজে হাতে নিচের কাজগুলো করুন:

- [ ] একটি my-app folder তৈরি করুন।
- [ ] Folder-এর মধ্যে index.html তৈরি করুন।
- [ ] Nginx container চালিয়ে Bind Mount করুন।
- [ ] Browser-এ localhost:8080 open করুন।
- [ ] Local HTML file পরিবর্তন করুন।
- [ ] Browser refresh করে পরিবর্তন দেখুন।
- [ ] docker inspect দিয়ে mount configuration দেখুন।
- [ ] একটি Read-only Bind Mount তৈরি করুন।

10. Key Takeaways

- Bind Mount Host-এর file/folder container-এর সঙ্গে connect করে।
- Local file পরিবর্তন করলে container সেই পরিবর্তন দেখতে পারে।
- Development environment-এ এটি অনেক কার্যকর।
- -v এবং --mount দুটো দিয়েই Bind Mount করা যায়।
- Bind Mount এবং Docker Volume এক জিনিস নয়।
  Next Topic: Docker Compose-এর মাধ্যমে Bind Mount ব্যবহার করে একটি real-world Node.js development environment তৈরি করা।
