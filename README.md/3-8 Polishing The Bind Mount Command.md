## 3-8 | Polishing the Bind Mount Command

Docker-এর Bind Mount Command ব্যবহার করে Host Machine-এর File বা Directory সরাসরি Container-এর সঙ্গে Connect করা যায়।

এই অধ্যায়ে আমরা শিখব কীভাবে Bind Mount Command আরও পরিষ্কার, নিরাপদ এবং সহজে ব্যবহারযোগ্য করা যায়।

1. Basic Bind Mount Command
   প্রথমে Bind Mount-এর Basic Syntax দেখি।
   docker run -d \
    -v /host/path:/container/path \
    nginx

এখানে:
Parameter Explanation
docker run নতুন Container তৈরি ও চালু করে
-d Background-এ চালায়
-v Bind Mount নির্ধারণ করে
/host/path Host Machine-এর Directory
/container/path Container-এর Target Directory
nginx Docker Image

তবে -v-এর পরিবর্তে --mount ব্যবহার করলে Command আরও Explicit এবং Readable হয়। 2. Using --mount Instead of -v
Docker-এ Bind Mount করার দুটি জনপ্রিয় পদ্ধতি রয়েছে।

Method 1: Using -v
docker run -d \
 -v "$(pwd)":/app \
 nginx

Method 2: Using --mount
docker run -d \
 --mount type=bind,source="$(pwd)",target=/app \
 nginx

Recommended
--mount ব্যবহার করলে Mount-এর Type, Source এবং Target আলাদাভাবে বোঝা যায়। 3. Understanding $(pwd)
pwd হলো একটি Terminal Command, যার পূর্ণরূপ Print Working Directory।

এটি আপনার বর্তমানে যে Directory-তে কাজ করছেন, তার Path দেখায়।

Example:
pwd

Output:
/home/zamirul/docker-learning

এবার:
docker run -d \
 --mount type=bind,source="$(pwd)",target=/app \
 nginx

এখানে:

- $(pwd) Host-এর বর্তমান Directory নির্ধারণ করে।
- /app Container-এর Directory।
- Host-এর Directory Container-এর /app-এ Mount হবে।

do4ds.com

Windows PowerShell ব্যবহার করলে:
docker run -d `  --name my-nginx`
-p 8080:80 `  --mount type=bind,source="${PWD}",target=/usr/share/nginx/html`
nginx

PowerShell-এ Line Continuation-এর জন্য Backtick (`) ব্যবহার করা হয়। 4. Making Bind Mount Read-Only
কখনো কখনো আমরা চাই Container Host-এর File Read করতে পারবে, কিন্তু পরিবর্তন করতে পারবে না।

এক্ষেত্রে readonly ব্যবহার করা হয়।
docker run -d \
 --mount type=bind,source="$(pwd)",target=/app,readonly \
 nginx

এখানে:

- Container File Read করতে পারবে।
- Container File Modify করতে পারবে না।
- Host-এর Original Files সুরক্ষিত থাকবে Container-এর Write Operation থেকে।

blog.roc-it.tech

5. Preventing Accidental Directory Creation
   Bind Mount-এর ক্ষেত্রে একটি গুরুত্বপূর্ণ বিষয় হলো Source Directory না থাকলে Docker-এর আচরণ।

-v ব্যবহার করলে Source Directory না থাকলে Docker সাধারণত সেটি তৈরি করে।

অন্যদিকে:
docker run -d \
 --mount type=bind,source=/path/does-not-exist,target=/app \
 nginx

এক্ষেত্রে Source Directory না থাকলে Docker Error দেখাবে।

এটি ভালো, কারণ ভুল Path দিয়ে Mount করার সম্ভাবনা কমে যায়। 6. Practical Example: Node.js Development
ধরুন আপনার Node.js Project রয়েছে:
E:/docker-learning/node-app/
│
├── package.json
├── server.js
└── index.js

আপনি চান Local Project-টি Container-এর /app Directory-তে Mount করতে।

PowerShell থেকে Project Directory-তে যান:
cd E:\docker-learning\node-app

তারপর:
docker run -d `  --name node-dev`
--mount "type=bind,source=${PWD},target=/app" `  -w /app`
node:22 `
node server.js

এখানে:
Option কাজ
--name node-dev Container-এর নাম
--mount Bind Mount তৈরি
source=${PWD} Local Project Directory
target=/app Container Directory
-w /app Working Directory নির্ধারণ
node:22 Node.js Image
node server.js Application চালায়

docker.com

Important
এই Example চালাতে server.js-এ একটি চালু থাকা Node.js Server থাকতে হবে। এছাড়া node_modules Host ও Container-এর মধ্যে আলাদাভাবে পরিচালনা করতে হবে। 7. Useful Bind Mount Options
Option কাজ
type=bind Bind Mount নির্ধারণ
source Host Directory
target Container Directory
readonly Read-only Mount
ro Read-only-এর সংক্ষিপ্ত রূপ
bind-propagation Mount Propagation নিয়ন্ত্রণ
--mount Explicit Mount Syntax

8. Best Practices
1. Bind Mount-এর জন্য --mount ব্যবহার করুন।
1. Source এবং Target Path সঠিকভাবে নির্ধারণ করুন।
1. প্রয়োজন না থাকলে Read/Write Permission দেবেন না।
1. Configuration File-এর জন্য Read-only Mount বিবেচনা করুন।
1. Production Environment-এ Host Directory Mount করার আগে Security যাচাই করুন।
1. Windows-এ PowerShell এবং Linux/macOS-এ Shell Syntax-এর পার্থক্য মনে রাখুন।
1. Practice Tasks
   নিজে হাতে নিচের কাজগুলো করুন:

- [ ] docker-learning নামে একটি Folder তৈরি করুন।
- [ ] pwd অথবা PowerShell-এর ${PWD} ব্যবহার করুন।
- [ ] --mount দিয়ে একটি Nginx Container চালান।
- [ ] Browser-এ localhost:8080 খুলুন।
- [ ] Local HTML File পরিবর্তন করে Live Update দেখুন।
- [ ] Read-only Bind Mount তৈরি করুন।
- [ ] ভুল Source Path দিয়ে --mount চালিয়ে Error দেখুন।
- [ ] docker inspect দিয়ে Mount Configuration পরীক্ষা করুন।

10. Key Takeaways

- --mount Bind Mount-এর Explicit Syntax।
- $(pwd) বর্তমান Working Directory নির্দেশ করে।
- readonly দিয়ে Container-এর Write Access বন্ধ করা যায়।
- --mount দিয়ে Source Directory না থাকলে Docker Error দেয়।
- সঠিক Mount Configuration Development Workflow সহজ করে।
