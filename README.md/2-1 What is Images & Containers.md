Docker শেখার ক্ষেত্রে Image এবং Container হলো সবচেয়ে গুরুত্বপূর্ণ দুটি concept। সহজভাবে বুঝি, বাস্তব উদাহরণ দেখি, তারপর command দিয়ে practice করি।

## 1. Docker Image কী?

Docker Introduction — Techologies for Advanced Programming

tapunict.github.io

Docker Image হলো একটি application চালানোর জন্য প্রয়োজনীয় ফাইল, dependency এবং configuration-এর read-only template।

একটি Image-এর মধ্যে থাকতে পারে:

- Application code
- Runtime, যেমন Node.js
- Dependencies, যেমন Express
- প্রয়োজনীয় files ও configuration
- Application চালু করার default command

বাস্তব উদাহরণ: তুমি যদি একটি Express API তৈরি করো, তাহলে তার code এবং Node.js dependencies নিয়ে Docker Image build করতে পারো। এই Image থেকে একই application-এর একাধিক Container তৈরি করা যায়।

### Image তৈরি করার command

```
docker build -t language-school-api .
```

এখানে:

- `docker build` — Image তৈরি করে।
- `t language-school-api` — Image-এর নাম দেয়।
- `.` — বর্তমান directory-কে build context হিসেবে ব্যবহার করে।

Image দেখতে:

```
docker images
```

## 2. Docker Container কী?

Docker Image vs Container — Explained in Simple Terms | by Moinul Hossain | Feb, 2026 | Medium

medium.com

Docker Container হলো Docker Image থেকে তৈরি হওয়া একটি running বা stopped instance।

সহজভাবে বললে, Image হলো template আর Container হলো সেই template ব্যবহার করে চালানো application instance।

একটি Container-এর নিজস্ব থাকে:

- Isolated process environment
- Filesystem view
- Network configuration
- Runtime state

### Container চালানোর command

```
docker run -d \
  --name language-school-api \
  -p 5000:5000 \
  language-school-api
```

এখানে:

- `docker run` — Image থেকে Container তৈরি করে এবং চালায়।
- `d` — Background-এ চালায়।
- `-name` — Container-এর নাম নির্ধারণ করে।
- `p 5000:5000` — Host-এর port `5000`কে Container-এর port `5000`এর সঙ্গে যুক্ত করে।
- শেষের `language-school-api` — যে Image ব্যবহার হবে তার নাম।

## 3. Image vs Container

| বিষয়      | Docker Image                    | Docker Container                    |
| --------- | ------------------------------- | ----------------------------------- |
| কী?       | Application template            | Image-এর instance                   |
| ভূমিকা    | Application package করে         | Application চালায়                  |
| অবস্থা    | Read-only template              | Runtime state ও writable layer থাকে |
| তৈরি      | `docker build` বা `docker pull` | `docker run`                        |
| তালিকা    | `docker images`                 | `docker ps -a`                      |
| মুছে ফেলা | `docker rmi`                    | `docker rm`                         |
| সংখ্যা    | একটি Image                      | একই Image থেকে অনেক Container       |

## 4. Image ও Container-এর সম্পর্ক

Docker Image

language-school-api

docker run

Container 1

Port 5000

Container 2

Port 5001

একটি Image থেকে একাধিক Container তৈরি করা যায়। একই host port একসঙ্গে একাধিক Container-এ publish করা যাবে না।

## 5. Practical Example — তোমার Express API

তুমি ইতিমধ্যে `language-school-api` Image build করেছ এবং Container চালিয়েছ।

Step 1: Image দেখো

```
docker images
```

Step 2: Running Container দেখো

```
docker ps
```

Step 3: সব Container দেখো

```
docker ps -a
```

Step 4: Container বন্ধ করো

```
docker stop language-school-api
```

Step 5: আবার চালু করো

```
docker start language-school-api
```

Step 6: Logs দেখো

```
docker logs language-school-api
```

Step 7: Container মুছে ফেলো

```
docker rm -f language-school-api
```

মনে রেখো, Container মুছে ফেললেও Image সাধারণত থেকে যায়। আবার নতুন Container তৈরি করতে পারবে:

```
docker run -d \
  --name language-school-api \
  -p 5000:5000 \
  language-school-api
```

## 6. গুরুত্বপূর্ণ বিষয়: Container মুছলে কি Data মুছে যায়?

Container-এর writable layer-এ থাকা data Container মুছে ফেললে হারিয়ে যায়। স্থায়ী data রাখার জন্য Docker Volume ব্যবহার করা হয়।

উদাহরণ:

```
docker volume create app-data
docker volume ls
```

## 7. Quick Knowledge Check

1. Docker Image কী?

চালু থাকা application

Application-এর read-only template

Docker network

2. কোন command Image থেকে Container চালায়?

`docker images`

`docker rm`

`docker run`

3. একটি Image থেকে কি একাধিক Container তৈরি করা যায়?

হ্যাঁ

না

Check Answers

আজকের মূল কথা: Docker Image হলো application-এর packaged template, আর Container হলো সেই Image থেকে তৈরি isolated runtime instance।
