2-11 Pulling Docker Image from Docker Hub
এই লেসনে আমরা শিখব কীভাবে Docker Hub থেকে Docker image নিজের কম্পিউটারে download করতে হয় এবং সেই image ব্যবহার করে container চালাতে হয়।
একটি ছোট সংশোধন: সাধারণত আমরা বলি Pulling Docker Image from Docker Hub। কারণ pull মানে registry থেকে image নিজের local machine-এ নিয়ে আসা।

1. Docker Pull কী?
   docker pull হলো Docker-এর একটি command, যার মাধ্যমে Docker Hub বা অন্য কোনো container registry থেকে Docker image download করা যায়।
   Docker Hub
   Image repository: typescript-backend-docker:v1

docker pull

Local Computer
Downloaded Docker image

সহজভাবে:

- docker push — Local machine থেকে Docker Hub-এ image upload।
- docker pull — Docker Hub থেকে Local machine-এ image download।

2. Step 1 — Docker Hub-এ image আছে কি না যাচাই করো
   তোমার আগের image tag:
   zamirulkabir/typescript-backend-docker:v1

Docker Hub-এর repository-তে v1 tag আছে কি না যাচাই করো।
Open Docker Hub repositoriesমনে রাখবে, আগের ধাপে image tag তৈরি হয়েছিল। সেটি Docker Hub-এ push সফল হয়েছে কি না, তা আলাদাভাবে যাচাই করতে হবে। 3. Step 2 — Docker Hub থেকে image pull করো
Terminal-এ চালাও:
docker pull zamirulkabir/typescript-backend-docker:v1

এখানে:
অংশ ব্যাখ্যা
docker pull Image download করার command
zamirulkabir Docker Hub username
typescript-backend-docker Repository name
v1 নির্দিষ্ট image version
Repository public হলে সাধারণত login ছাড়াই pull করা যায়। Private repository হলে authentication ও access permission লাগবে। 4. Step 3 — Download হয়েছে কি না যাচাই করো
docker images

তোমার output-এ এমন একটি entry দেখা যেতে পারে:
REPOSITORY TAG
zamirulkabir/typescript-backend-docker v1

Image আগে থেকেই local machine-এ থাকলে Docker সব layer নতুন করে download নাও করতে পারে।
গুরুত্বপূর্ণ: একই কম্পিউটারে image আগে থেকেই থাকলে pull command শেখার জন্য চালাতে পারো। তবে বাস্তব পরীক্ষা করতে অন্য কম্পিউটার বা Docker image না থাকা environment ব্যবহার করা ভালো। 5. Step 4 — Image থেকে container চালাও
docker run -d \
 --name typescript-backend \
 -p 5000:5000 \
 zamirulkabir/typescript-backend-docker:v1

কমান্ডের অংশগুলো:

- -d — Background-এ container চালায়।
- --name typescript-backend — Container-এর নাম নির্ধারণ করে।
- -p 5000:5000 — Host-এর port 5000-কে container-এর port 5000-এর সঙ্গে যুক্ত করে।
  তোমার অ্যাপ্লিকেশন যদি container-এর ভেতরে port 5000-এ listen করে, তবেই এই mapping ব্যবহার করবে। একই নামের container আগে থেকেই থাকলে অন্য নাম ব্যবহার করো অথবা পুরোনো container-এর অবস্থা যাচাই করো।

6. Step 5 — Container যাচাই করো
   docker ps

Logs দেখতে:
docker logs typescript-backend

Container বন্ধ হয়ে গেলে:
docker ps -a

docker run সফল হলেও অ্যাপ্লিকেশন সঠিকভাবে চলছে কি না, তা logs এবং health check দিয়ে যাচাই করতে হবে। 7. Push বনাম Pull
বিষয় docker push docker pull
দিক Local → Registry Registry → Local
কাজ Image upload Image download
কখন ব্যবহার করবে Image প্রকাশ করতে Image ব্যবহার করার জন্য আনতে 8. Practical exercise
নিজে এই তিনটি command চালিয়ে দেখো:
[ ] Docker Hub repository-তে v1 tag যাচাই করেছি
[ ] docker pull command চালিয়েছি
[ ] docker images দিয়ে image যাচাই করেছি
0 / 3 সম্পন্ন

এই লেসনের মূল কথা: docker pull দিয়ে Docker Hub থেকে image local machine-এ আনা হয়, আর docker run দিয়ে সেই image থেকে container চালানো হয়।
