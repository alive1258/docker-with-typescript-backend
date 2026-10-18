2-7 Attached & Detached Containers — বাংলায়
Docker-এ container চালানোর দুটি গুরুত্বপূর্ণ পদ্ধতি হলো Attached Mode এবং Detached Mode। কোন mode ব্যবহার করবে, তা নির্ভর করে তুমি terminal-এ সরাসরি application output দেখতে চাও, নাকি background-এ application চালাতে চাও।

1. Attached Container কী?
   Attached mode-এ container চালালে container-এর output সরাসরি তোমার terminal-এ দেখতে পাবে। সাধারণত application-এর logs terminal-এ দেখানো হয়।
   Command:
   docker run --name backend-attached -p 5000:5000 docker-with-typescript-backend:latest

এখানে -d ব্যবহার করা হয়নি, তাই Docker terminal-এ output দেখাবে এবং command-টি foreground-এ চলবে।
Terminal

> docker run ...
> Server starting...
> Listening on port 5000
> Request received...

এগুলো উদাহরণস্বরূপ logs। তোমার application-এর output আলাদা হতে পারে।

Attached mode কখন ব্যবহার করবে?

- Development করার সময়
- Application-এর logs দেখতে
- Startup error debug করতে
- Container-এর output তাৎক্ষণিকভাবে পর্যবেক্ষণ করতে
  সাধারণত attached mode-এ Ctrl + C চাপলে foreground container বন্ধ হয়ে যায়।

2. Detached Container কী?
   Detached mode-এ container background-এ চলে। Container চালু হওয়ার পর terminal-এ ফিরে এসে অন্য command চালাতে পারবে।
   Command:
   docker run -d --name backend-detached -p 5000:5000 docker-with-typescript-backend:latest

এখানে -d অর্থ --detach।
Terminal

$ docker run -d ...
a1b2c3d4e5f6...

Container ID দেখিয়ে terminal prompt ফিরে আসে।

Background container

Application চলতে থাকে, যতক্ষণ না এটি বন্ধ হয় বা কোনো error-এ exit করে।

Detached mode কখন ব্যবহার করবে?

- Backend API চালু রাখতে
- Local development-এ terminal খালি রাখতে
- একাধিক service চালাতে
- Background-এ database বা web server চালাতে

3. Attached vs Detached
   বিষয় Attached Detached
   Flag -d ছাড়া -d সহ
   Terminal Output দেখায় দ্রুত prompt ফিরে আসে
   Logs সরাসরি দেখা যায় docker logs দিয়ে দেখা যায়
   Terminal থেকে Ctrl + C সাধারণত container বন্ধ হয় Container সাধারণত চালু থাকে
   ব্যবহার Debugging Background services
4. Detached Container-এর Logs দেখা
   Detached mode-এ container চালালেও logs দেখতে পারবে।
   docker logs backend-detached

Live logs:
docker logs -f backend-detached

Ctrl + C দিয়ে logs দেখা বন্ধ করলে container চালু থাকবে।
Container status দেখতে:
docker ps

বন্ধ হওয়া container-সহ সব দেখতে:
docker ps -a

5. Running Container-এ Attached হওয়া
   ইতিমধ্যে চলমান container-এর output দেখতে:
   docker attach backend-detached

এটি container-এর প্রধান process-এর সঙ্গে terminal সংযুক্ত করে। সাধারণভাবে শুধু logs দেখতে চাইলে docker logs -f backend-detached বেশি নিরাপদ ও সুবিধাজনক।
সংযোগ বিচ্ছিন্ন করতে container বন্ধ না করেই বের হতে চাইলে Ctrl + P, তারপর Ctrl + Q ব্যবহার করা যায়—যদি terminal ও Docker configuration এই detach sequence সমর্থন করে। 6. তোমার Project-এ Practical Example
তোমার আগের container Exited (1) হয়েছিল, তাই আগে startup error ঠিক করা জরুরি। Container ঠিকভাবে চালু হলে detached mode-এ এইভাবে পরীক্ষা করতে পারো:
docker run -d --name typescript-backend -p 5000:5000 docker-with-typescript-backend:latest

তারপর:
docker ps
docker logs -f typescript-backend

যদি Exited (1) দেখায়, তাহলে:
docker logs typescript-backend

Port 5000 এখানে উদাহরণ; তোমার src/app/server.ts-এর প্রকৃত port অনুযায়ী পরিবর্তন করবে।

7. ছোট্ট অনুশীলন
   প্রশ্ন: তুমি একটি backend API background-এ চালাতে চাও এবং terminal-এ অন্য command চালাতে চাও। কোন command সঠিক?

docker run --name api my-image

docker run -d --name api my-image

docker stop api

উত্তর যাচাই করো
মনে রাখবে: Attached মানে terminal-এ সরাসরি যুক্ত থেকে output দেখা; Detached মানে terminal থেকে আলাদা হয়ে background-এ container চালানো।
