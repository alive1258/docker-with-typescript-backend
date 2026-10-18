এই lesson-এ আমরা শিখব কীভাবে একটি `Dockerfile` থেকে নিজের Docker image তৈরি করতে হয় এবং সেই image ব্যবহার করে container চালাতে হয়।

আমরা তোমার Language Learning School Express API project ব্যবহার করব।

## 1. পুরো Workflow বুঝে নাও

Dockerfile + Application Code

Image তৈরির নির্দেশনা ও project files

Docker Image

Build করা application image

Docker Container

Image থেকে চালানো application

Browser / API Client

localhost-এর মাধ্যমে API পরীক্ষা

সহজভাবে:

- `docker build` — image তৈরি করে।
- `docker run` — image থেকে container তৈরি করে চালায়।
- `docker ps` — চলমান container দেখায়।
- `docker logs` — application-এর log দেখায়।

## 2. Step 1 — Project directory-তে যাও

Windows PowerShell খুলে চালাও:

```
cd E:\backend\language-learning-school-server
```

Project root-এ প্রয়োজনীয় files আছে কি না দেখো:

```
dir
```

প্রত্যাশিত structure:

```
language-learning-school-server/
├── index.js
├── package.json
├── package-lock.json
├── Dockerfile
└── .dockerignore
```

তোমার project-এ অতিরিক্ত files থাকতে পারে। গুরুত্বপূর্ণ বিষয় হলো, Dockerfile এবং `package.json` যেন সঠিক build context-এ থাকে।

## 3. Step 2 — Dockerfile যাচাই করো

তোমার basic Express API-এর জন্য Dockerfile এমন হতে পারে:

```

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY index.js ./

ENV PORT=5000

EXPOSE 5000

CMD ["node", "index.js"]
```

এখানে `npm ci --omit=dev` ব্যবহার করা হয়েছে। এটি কাজ করার জন্য project-এ `package-lock.json` থাকতে হবে। যদি lockfile না থাকে, আগে `npm install` দিয়ে সেটি তৈরি করো।

গুরুত্বপূর্ণ: এই উদাহরণটি তখনই যথেষ্ট, যখন application-এর প্রয়োজনীয় source code শুধু `index.js`-এ আছে। অন্য files বা local modules ব্যবহার করলে সেগুলোও image-এ কপি করতে হবে।

## 4. Step 3 — Docker image build করো

PowerShell-এ চালাও:

```
docker build -t language-school-api .
```

এই command-টি ভেঙে বুঝি:

| অংশ                   | অর্থ                                |
| --------------------- | ----------------------------------- |
| `docker build`        | Dockerfile থেকে image তৈরি          |
| `-t`                  | Image-এর নাম ও tag নির্ধারণ         |
| `language-school-api` | আমাদের image-এর নাম                 |
| `.`                   | বর্তমান directory হলো build context |

Build সফল হলে সাধারণত শেষে `Successfully tagged` অথবা `naming to docker.io/library/language-school-api`-এর মতো message দেখতে পারো।

Image যাচাই করো:

```
docker images
```

অথবা নির্দিষ্ট image দেখতে:

```
docker image inspect language-school-api
```

## 5. Step 4 — Image থেকে container চালাও

প্রথমে একই নামের container আগে থেকে আছে কি না যাচাই করো:

```
docker ps -a
```

যদি `language-school-api` নামে কোনো container না থাকে, চালাও:

```
docker run -d --name language-school-api -p 5000:5000 language-school-api
```

এখানে:

- `d` — background-এ চালায়।
- `-name language-school-api` — container-এর নাম নির্ধারণ করে।
- `p 5000:5000` — host-এর port `5000` থেকে container-এর port `5000`এ traffic পাঠায়।
- শেষের `language-school-api` — যে image থেকে container তৈরি হবে।

Image name ও container name এক জিনিস নয়। এখানে দুটির নাম একই হলেও তারা আলাদা Docker object।

যদি একই নামের container আগে থেকেই থাকে, সেটি যাচাই করো। পুরোনো container আর দরকার না থাকলে তবেই remove করো; অন্যথায় নতুন container-এর জন্য আলাদা নাম ব্যবহার করো।

## 6. Step 5 — Container চলছে কি না দেখো

```
docker ps
```

সব container দেখতে:

```
docker ps -a
```

Application-এর logs দেখতে:

```
docker logs language-school-api
```

আরও সহজে live logs দেখতে:

```
docker logs -f language-school-api
```

Live logs থেকে বের হতে `Ctrl + C` চাপতে পারো। এতে সাধারণত শুধু logs দেখা বন্ধ হয়; background container বন্ধ হয় না।

## 7. Step 6 — API পরীক্ষা করো

Browser-এ নিচের URL দুটো খোলো:

Root endpoint

http://localhost:5000/

Open

Health endpoint

http://localhost:5000/health

Open

তোমার `index.js` অনুযায়ী `/health` থেকে এমন JSON response পাওয়ার কথা:

```
{
  "status": "success",
  "message": "API is healthy"
}
```

এটি কাজ করলে বুঝবে যে তোমার image থেকে চালানো container-এর Express API request গ্রহণ করছে।

## 8. Step 7 — Container বন্ধ ও পুনরায় চালু করা

Container বন্ধ করতে:

```
docker stop language-school-api
```

আবার চালু করতে:

```
docker start language-school-api
```

মনে রাখবে, `docker start` আগের container-টিই চালু করে। আর `docker run` সাধারণত একটি নতুন container তৈরি করে চালায়।

Container remove করতে হলে:

```
docker rm language-school-api
```

Container চলমান থাকলে আগে stop করতে হবে, অথবা `docker rm -f` দিয়ে জোর করে বন্ধ করে remove করা যায়। তবে কোনো container মুছে ফেলার আগে সেটির প্রয়োজনীয় data আছে কি না যাচাই করো।

Image মুছতে:

```
docker rmi language-school-api
```

Image কোনো container ব্যবহার করলে সেটি মুছতে বাধা পেতে পারো। প্রয়োজনীয় container ও image যাচাই না করে delete করো না।

## 9. Common errors

| Error                                | সম্ভাব্য কারণ ও সমাধান                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `port is already allocated`          | Host port `5000` অন্য application ব্যবহার করছে। `-p 5001:5000` ব্যবহার করে `localhost:5001` দিয়ে পরীক্ষা করতে পারো। |
| `container name is already in use`   | একই নামে container আছে। `docker ps -a` দিয়ে যাচাই করো।                                                              |
| `Cannot find module`                 | Dependencies ইনস্টল হয়নি অথবা প্রয়োজনীয় source file image-এ কপি হয়নি।                                            |
| Container সঙ্গে সঙ্গে বন্ধ হয়ে যায় | `docker logs language-school-api` চালিয়ে startup error দেখো।                                                        |
| Browser-এ connection refused         | Container চলছে কি না, port mapping ঠিক কি না এবং server `0.0.0.0`-এ listen করছে কি না যাচাই করো।                     |

## 10. আজকের শেখার বিষয়

Practice checklist

0/5 completed

- [ ] Dockerfile যাচাই করেছি
- [ ] docker build দিয়ে image তৈরি করেছি
- [ ] docker images দিয়ে image দেখেছি
- [ ] docker run দিয়ে container চালিয়েছি
- [ ] Browser-এ /health endpoint পরীক্ষা করেছি

মূল পার্থক্যটি মনে রাখো:

- Build: Dockerfile থেকে image তৈরি।
- Run: Image থেকে নতুন container তৈরি ও চালু।
- Start: আগে তৈরি করা container পুনরায় চালু।
- Stop: চলমান container বন্ধ।

পরবর্তী lesson: 2-5 — Understanding Docker Container Lifecycle।
