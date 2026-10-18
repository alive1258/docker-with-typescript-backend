এই লেসনে আমরা Windows 11-এ VS Code-কে Docker development-এর জন্য configure করব এবং একটি real Docker container তৈরি করে চালাব।

তোমার আগের `docker info` output অনুযায়ী Docker Engine এবং Docker Compose ইতোমধ্যে কাজ করছে। তাই এখন সরাসরি practical শুরু করতে পারো।

## Part 1: Configure VS Code for Docker

### Step 1: Install VS Code

যদি VS Code আগে থেকেই install করা থাকে, এই ধাপ skip করো।

Download Visual Studio Code

### Step 2: Install the Docker extension

Build and push your first image | Docker Docs

docs.docker.com

1. VS Code খোলো।
2. `Ctrl + Shift + X` চাপো।
3. Search করো `Docker`।
4. Microsoft-এর Docker extension install করো।

Extension link: Docker extension for VS Code

এটি দিয়ে তুমি VS Code থেকে images, containers, volumes ও networks দেখতে এবং manage করতে পারবে।

### Step 3: Open the integrated terminal

VS Code-এ:

- `Ctrl + `` চাপো, অথবা
- Terminal → New Terminal নির্বাচন করো।

তারপর যাচাই করো:

```
docker --version
docker compose version
docker info
```

তিনটি command-ই সফল হলে VS Code terminal থেকে Docker ব্যবহার করতে পারবে।

## Part 2: Create Your First Docker Container

আমরা একটি Nginx web server container চালাব। Nginx একটি web server, যা browser-এ web page পরিবেশন করতে পারে।

<box border radius="lg" padding={3} gap={2} align="center">
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **Your Windows Computer**
    <text color="secondary" size="sm">VS Code + Docker Desktop</text>
  </box>
  <icon name="arrow-down" size="xl" color="secondary"/>
  <box background="rgba(59,130,246,0.10)" radius="md" padding={3} width="100%" align="center">
    **Nginx Container**
    <text color="secondary" size="sm">Container port: 80</text>
  </box>
  <icon name="arrow-down" size="xl" color="secondary"/>
  <box border radius="md" padding={3} width="100%" align="center">
    <icon name="globe" size="xl"/>
    **Browser: localhost:8080**
    <text color="secondary" size="sm">Host port 8080 → Container port 80</text>
  </box>
</box>

### Step 1: Create a project folder

VS Code terminal-এ চালাও:

```
mkdir docker-first-container
cd docker-first-container
code .
```

`code .` কাজ না করলে VS Code থেকে File → Open Folder ব্যবহার করে `docker-first-container` folder খুলবে।

### Step 2: Run your first Nginx container

VS Code terminal-এ এই command চালাও:

```
docker run -d --name my-nginx -p 8080:80 nginx:alpine
```

Command-এর অংশগুলো বুঝে নাও:

| অংশ               | অর্থ                                                   |
| ----------------- | ------------------------------------------------------ |
| `docker run`      | নতুন container তৈরি ও চালায়                            |
| `-d`              | Background-এ চালায়                                     |
| `--name my-nginx` | Container-এর নাম নির্ধারণ করে                          |
| `-p 8080:80`      | Host port 8080-কে container port 80-এর সঙ্গে যুক্ত করে |
| `nginx:alpine`    | Nginx-এর Alpine-based image ব্যবহার করে                |

প্রথমবার image download হতে কিছু সময় লাগতে পারে।

### Step 3: Verify the container

```
docker ps
```

Expected output-এর গুরুত্বপূর্ণ অংশ:

```
CONTAINER ID   IMAGE          STATUS         PORTS
...            nginx:alpine   Up ...         0.0.0.0:8080->80/tcp
```

Container-এর ID ও status তোমার computer অনুযায়ী আলাদা হবে।

### Step 4: Open the web server

Browser-এ খোলো:

<box border radius="lg" padding={3} gap={2}>
  <row align="center" gap={2}>
    <icon name="globe" size="xl"/>
    <box flex="1" gap={1}>
      **Nginx Welcome Page**
      <text color="secondary" size="sm">তোমার local Docker container থেকে পরিবেশিত page</text>
    </box>
  </row>
  <button block onClick={() => GenUI.openUrl("http://localhost:8080")}>Open localhost:8080 <icon name="external-link" size="xs" inline/></button>
</box>

যদি Welcome to nginx! দেখো, তাহলে অভিনন্দন! তোমার প্রথম web server container সফলভাবে চলছে।

## Part 3: Manage the Container from VS Code

Docker extension-এর Containers section-এ `my-nginx` দেখতে পাবে। সেখান থেকে container inspect, logs দেখা, stop বা remove করার সুবিধা পেতে পারো।

Command line দিয়েও একই কাজ করা যায়:

Logs দেখো

```
docker logs my-nginx
```

Container বন্ধ করো

```
docker stop my-nginx
```

আবার চালু করো

```
docker start my-nginx
```

Container মুছে ফেলো

```
docker rm -f my-nginx
```

মনে রাখবে, `docker stop` container বন্ধ করে, কিন্তু `docker rm` container মুছে দেয়। Image সাধারণত আলাদাভাবে থেকে যায়।

## Part 4: Practice Checklist

{@body const steps = ["VS Code Docker extension install করেছি","VS Code terminal-এ Docker command চালিয়েছি","Nginx container তৈরি করেছি","docker ps দিয়ে container যাচাই করেছি","Browser-এ localhost:8080 খুলেছি"]}
{@body const [checked,setChecked] = DIL.useState([])}
<box border radius="lg" padding={3} gap={3}>
<row align="center" justify="between">
Your progress<text color="secondary" size="sm">{checked.length}/{steps.length}</text>
</row>
<box background="surface-tertiary" height="6px" radius="full" clip>
<box background="surface-inverted" height="6px" radius="full" width={`$DIL1%`}/>

Next lesson: Docker Images vs Containers এবং Dockerfile। সেখানে আমরা শুধু ready-made image চালানো নয়, নিজের application-এর Docker image তৈরি করাও শিখব।

# Docker Build — বাংলায় সহজ ব্যাখ্যা

docker run -p 5000:5000 --name language-school-api sha256:96cbd0d5e839f46a587d6dae3010ec0807348a37449019da9ba95c74a7246470
Server running on port 5000

`docker build` command ব্যবহার করে Dockerfile থেকে একটি Docker Image তৈরি করা হয়। এরপর সেই image থেকে container চালানো যায়।

Docker workflow:

Dockerfile

Build instructions

Docker Image

docker build

Docker Container

docker run

## 1. Docker Build-এর syntax

```
docker build -t my-app .
```

- `docker build` — image তৈরি করে।
- `t my-app` — image-এর নাম `my-app` দেয়।
- `.` — বর্তমান directory-কে build context হিসেবে ব্যবহার করে।

## 2. প্রথম Docker Image তৈরি করো

VS Code-এ `docker-first-container` নামে একটি folder খোলো।

এই folder-এর মধ্যে `Dockerfile` নামে একটি ফাইল তৈরি করো। ফাইলের নামের শেষে `.txt` দেবে না।

### Dockerfile

```
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80
```

একই folder-এ `index.html` তৈরি করো:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Docker App</title>
</head>
<body>
    <h1>Hello from My First Docker Image!</h1>
    <p>Built with Docker.</p>
</body>
</html>
```

Folder structure হবে:

```
docker-first-container/
├── Dockerfile
└── index.html
```

## 3. Build the image

VS Code terminal-এ project folder-এর ভেতরে চালাও:

```
docker build -t my-nginx-app .
```

Build সফল হলে image দেখতে:

```
docker images
```

তোমার `my-nginx-app` নামে একটি image দেখা যাবে।

## 4. Image থেকে container চালাও

```
docker run -d --name my-first-app -p 8081:80 my-nginx-app
```

Browser-এ খোলো:

http://localhost:8081

তুমি `Hello from My First Docker Image!` দেখতে পাবে।

## 5. দরকারি Docker Build commands

| Command                               | কাজ                          |
| ------------------------------------- | ---------------------------- |
| `docker build -t my-app .`            | Image তৈরি                   |
| `docker images`                       | Images দেখা                  |
| `docker build --no-cache -t my-app .` | Cache ছাড়া build             |
| `docker build -t my-app:v1 .`         | Version tag-সহ build         |
| `docker history my-app`               | Image layers-এর history দেখা |
| `docker image inspect my-app`         | Image-এর বিস্তারিত তথ্য দেখা |

মনে রাখবে: `docker build` image তৈরি করে, আর `docker run` সেই image থেকে container চালায়। `EXPOSE 80` documentation হিসেবে container-এর intended port জানায়; host থেকে access করার জন্য `-p 8081:80` ব্যবহার করা হয়েছে।
