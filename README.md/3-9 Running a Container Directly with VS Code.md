## 3-9 | Running a Container Directly with VS Code

এই অধ্যায়ে আমরা শিখব কীভাবে Visual Studio Code (VS Code) ব্যবহার করে সরাসরি Docker Container চালানো, Container-এর ভেতরের Project নিয়ে কাজ করা এবং Local Files-কে Container-এর সঙ্গে Connect করা যায়।

VS Code-এর Docker Extension এবং Dev Containers Extension ব্যবহার করে Docker Development Workflow অনেক সহজ করা যায়।

1. What is Running a Container with VS Code?
   সাধারণত Docker Container চালানোর জন্য Terminal-এ Docker Command লিখতে হয়।

কিন্তু VS Code ব্যবহার করে আপনি:

- Docker Container দেখতে পারবেন।
- Container Start, Stop এবং Remove করতে পারবেন।
- Container-এর Logs দেখতে পারবেন।
- Container-এর ভেতরের Terminal খুলতে পারবেন।
- Container-এর ভেতরে সরাসরি Code Edit করতে পারবেন।
- Local Project-কে Container-এর সঙ্গে Connect করতে পারবেন।

code.visualstudio.com

2. Required Tools and Extensions
   প্রথমে আপনার Computer-এ প্রয়োজনীয় Software Install করুন।

1. Visual Studio Code

Code Editor
Download VS Code

2. Docker Desktop

Container Runtime
Download Docker Desktop

3. Docker Extension

Manage Docker Containers and Images
Install Docker Extension

4. Dev Containers Extension

Develop inside a Docker Container
Install Dev Containers

3. Verify Docker Installation
   প্রথমে Docker Desktop চালু করুন।

তারপর VS Code Terminal খুলুন:
docker --version

Docker Engine চালু আছে কি না পরীক্ষা করুন:
docker info

Docker Images দেখতে:
docker images

Containers দেখতে:
docker ps -a

যদি সব Command ঠিকভাবে কাজ করে, তাহলে Docker Environment প্রস্তুত। 4. Create a New Project
প্রথমে আপনার Computer-এ একটি Project Folder তৈরি করুন।
E:/docker-learning/vscode-docker/

VS Code খুলে:

1. File → Open Folder নির্বাচন করুন।
2. vscode-docker Folder নির্বাচন করুন।
3. VS Code Terminal খুলুন।
   এবার Project-এর মধ্যে একটি File তৈরি করুন:
   vscode-docker/
   └── index.html

index.html:

<!DOCTYPE html>
<html>
<head>
    <title>Docker with VS Code</title>
</head>
<body>
    <h1>Hello from Docker!</h1>
    <p>Running a container directly with VS Code.</p>
</body>
</html>

5. Pull Nginx Docker Image
   VS Code Terminal-এ লিখুন:
   docker pull nginx

এটি Docker Hub থেকে Nginx Image Download করবে।

Image পরীক্ষা করুন:
docker images

medium.com

6. Run Container Using VS Code Terminal
   এবার VS Code Terminal থেকেই Container চালান।

Windows PowerShell:
docker run -d `  --name vscode-nginx`
-p 8080:80 `  --mount "type=bind,source=${PWD},target=/usr/share/nginx/html"`
nginx

Linux/macOS:
docker run -d \
 --name vscode-nginx \
 -p 8080:80 \
 --mount type=bind,source="$(pwd)",target=/usr/share/nginx/html \
 nginx

এখানে আমরা Local Project Folder-কে Nginx Container-এর Web Directory-তে Mount করেছি।

weseek-inc.medium.com

7. Access Your Application
   Browser খুলে এই URL-এ যান:
   http://localhost:8080

আপনি দেখতে পাবেন:
Container Running
Hello from Docker!
Running a container directly with VS Code.

localhost:8080

এবার VS Code-এর index.html File পরিবর্তন করুন:

<h1>Updated from VS Code!</h1>
<p>My Docker development environment is working.</p>

Browser Refresh করলে নতুন Content দেখতে পাবেন।

কারণ Local Folder এবং Container-এর Web Directory Bind Mount-এর মাধ্যমে Connected। 8. Manage Containers Using VS Code Docker Extension
VS Code-এর বাম পাশের Activity Bar থেকে Docker Icon নির্বাচন করুন।

007ffflearning.com

এখানে আপনি দেখতে পাবেন:
Section কাজ
Containers Running ও Stopped Containers
Images Download করা Docker Images
Volumes Docker Volumes
Networks Docker Networks

Container-এর ওপর Right Click করলে বিভিন্ন Action পাবেন।

- Start
- Stop
- Restart
- Remove
- View Logs
- Attach Shell

9. Open a Terminal Inside the Container
   VS Code Terminal থেকে Container-এর ভেতরে প্রবেশ করতে:
   docker exec -it vscode-nginx sh

এবার আপনি Container-এর ভেতরের Shell-এ আছেন।

কিছু Command চালিয়ে দেখুন:
pwd

ls -la

cat index.html

Container থেকে বের হতে:
exit

10. Running a Container Directly with Dev Containers
    Docker Extension এবং Dev Containers Extension এক জিনিস নয়।

- Docker Extension: Docker Resources Manage করতে সাহায্য করে।
- Dev Containers: VS Code-এর Development Environment-কে Container-এর ভেতরে চালাতে সাহায্য করে।

devcontainer.community

Dev Containers ব্যবহার করতে Project-এর মধ্যে এই Folder তৈরি করুন:
.devcontainer/
devcontainer.json

devcontainer.json:
{
"name": "Node.js Development",
"image": "node:22",
"forwardPorts": [3000],
"customizations": {
"vscode": {
"extensions": [
"dbaeumer.vscode-eslint"
]
}
}
}

এবার:

1. VS Code-এ Command Palette খুলুন (Ctrl + Shift + P)।
2. Dev Containers: Reopen in Container লিখুন।
3. Command নির্বাচন করুন।
4. VS Code প্রয়োজনীয় Container তৈরি করে তার ভেতরে Project খুলবে।
   এখন আপনার VS Code Terminal Container-এর Development Environment ব্যবহার করবে।
5. Useful Docker Commands
   Command Description
   docker ps Running Containers
   docker ps -a All Containers
   docker images Available Images
   docker logs vscode-nginx Container Logs
   docker exec -it vscode-nginx sh Container Shell
   docker stop vscode-nginx Stop Container
   docker start vscode-nginx Start Container
   docker rm -f vscode-nginx Remove Container

6. Practice Tasks
   নিজে হাতে নিচের কাজগুলো করুন:

- [ ] VS Code Install করুন।
- [ ] Docker Desktop Install ও Run করুন।
- [ ] Docker Extension Install করুন।
- [ ] Dev Containers Extension Install করুন।
- [ ] একটি নতুন Project Folder তৈরি করুন।
- [ ] Nginx Image Pull করুন।
- [ ] VS Code Terminal থেকে Container চালান।
- [ ] Bind Mount ব্যবহার করুন।
- [ ] Browser-এ localhost:8080 Open করুন।
- [ ] HTML File পরিবর্তন করে Live Update দেখুন।
- [ ] VS Code Docker Explorer থেকে Container Logs দেখুন।
- [ ] Container-এর Shell Open করুন।
- [ ] Dev Containers ব্যবহার করে Node.js Environment তৈরি করুন।

13. Key Takeaways
1. VS Code Docker Extension দিয়ে Docker Resources Manage করা যায়।
1. VS Code Terminal থেকে সরাসরি Docker Container চালানো যায়।
1. Bind Mount দিয়ে Local Project Container-এর সঙ্গে Connect করা যায়।
1. Docker Extension এবং Dev Containers Extension-এর কাজ আলাদা।
1. Dev Containers ব্যবহার করে সম্পূর্ণ Development Environment Container-এর ভেতরে চালানো যায়।
