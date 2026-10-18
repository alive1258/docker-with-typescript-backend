## 2-6 Managing Images & Containers

এই লেসনে আমরা শিখব কীভাবে Docker Images ও Containers list, start, stop, restart, rename এবং remove করতে হয়। তোমার `docker-with-typescript-backend` project ব্যবহার করেই প্রতিটি command বুঝব।

## 1. Docker Images Manage করা

Docker Image হলো application চালানোর template। Container তৈরি করার আগে image থাকতে হয়।

### সব Images দেখা

```
docker images
```

আরেকটি সমতুল্য command:

```
docker image ls
```

তোমার output-এ যেমন:

```
REPOSITORY                         TAG      IMAGE ID
docker-with-typescript-backend     latest   bbb9f171d42f
```

### Image-এর বিস্তারিত তথ্য দেখা

```
docker image inspect docker-with-typescript-backend:latest
```

### Image-এর layer history দেখা

```
docker history docker-with-typescript-backend:latest
```

### Image remove করা

```
docker rmi docker-with-typescript-backend:latest
```

মনে রাখবে: কোনো container image-টি ব্যবহার করলে সেটি সরাসরি remove করা নাও যেতে পারে। প্রয়োজন হলে আগে সংশ্লিষ্ট container বন্ধ করে remove করতে হবে।

## 2. Docker Containers Manage করা

Container হলো image থেকে তৈরি application instance।

Image

Application-এর template

Container

Image থেকে তৈরি application instance

### সব running containers দেখা

```
docker ps
```

### Running ও stopped—সব containers দেখা

```
docker ps -a
```

তোমার আগের output-এ `Exited (1)` ছিল। তার অর্থ container চালু হতে গিয়ে error পেয়ে বন্ধ হয়েছে।

### Container-এর logs দেখা

```
docker logs typescript-backend
```

Live logs দেখতে:

```
docker logs -f typescript-backend
```

বের হতে `Ctrl + C` চাপবে; এতে container বন্ধ হবে না।

## 3. Container Start, Stop ও Restart

ধরো, তোমার container-এর নাম `typescript-backend`।

Start — বন্ধ container চালু করা

```
docker start typescript-backend
```

আগে তৈরি করা container-টি আবার চালু করে।

Stop — container বন্ধ করা

```
docker stop typescript-backend
```

চলমান container-কে graceful shutdown-এর সুযোগ দেয়।

Restart — বন্ধ করে আবার চালু করা

```
docker restart typescript-backend
```

`docker start` নতুন container তৈরি করে না; আগে থেকে থাকা container চালু করে।

## 4. Container Remove ও Rename

### Container remove করা

প্রথমে বন্ধ করো:

```
docker stop typescript-backend
```

তারপর remove করো:

```
docker rm typescript-backend
```

একটি running container সরাসরি remove করতে `docker rm -f` ব্যবহার করা যায়, তবে সতর্কতার সঙ্গে ব্যবহার করবে।

### Container rename করা

```
docker rename typescript-backend my-backend
```

এখন container-এর নতুন নাম হবে `my-backend`।

## 5. নতুন Container তৈরি ও চালানো

তোমার image থেকে নতুন container তৈরি করার command:

```
docker run -d \
  --name typescript-backend \
  -p 5000:5000 \
  docker-with-typescript-backend:latest
```

Git Bash-এ এটি multiline আকারে কাজ করবে। চাইলে এক লাইনেও লিখতে পারো:

```
docker run -d --name typescript-backend -p 5000:5000 docker-with-typescript-backend:latest
```

এখানে:

- `d` — background-এ চালাবে।
- `-name` — container-এর নাম নির্ধারণ করবে।
- `p 5000:5000` — host port ও container port map করবে।
- শেষের অংশ — কোন image থেকে container তৈরি হবে।

তোমার application-এর port যদি 5000 না হয়, তাহলে সঠিক port ব্যবহার করবে। আর আগের মতো `Exited (1)` দেখালে আগে logs পরীক্ষা করবে।

## 6. Docker Cleanup Commands

| Command                  | কাজ                                       |
| ------------------------ | ----------------------------------------- |
| `docker container prune` | সব stopped container remove করে           |
| `docker image prune`     | unused dangling images remove করে         |
| `docker system df`       | Docker-এর disk usage দেখায়               |
| `docker system prune`    | কিছু unused Docker resources পরিষ্কার করে |

সতর্কতা: Cleanup command চালানোর আগে কী remove হবে তা বুঝে নেবে। `docker system prune -a` আরও বেশি unused images remove করতে পারে।

## 7. তোমার জন্য Practical Lab

এই ধাপগুলো ক্রমানুসারে অনুশীলন করো।

Lab progress

## 0/6

- [ ] docker images দিয়ে image দেখো
- [ ] docker ps -a দিয়ে সব container দেখো
- [ ] docker logs typescript-backend দিয়ে error পরীক্ষা করো
- [ ] docker start typescript-backend দিয়ে container চালু করার চেষ্টা করো
- [ ] docker ps দিয়ে status যাচাই করো
- [ ] docker stop typescript-backend দিয়ে container বন্ধ করো

তোমার আগের container `Exited (1)` ছিল বলে, সরাসরি `docker start` করলে একই error আবার হতে পারে। সে ক্ষেত্রে আগে `docker logs typescript-backend` দেখবে এবং startup error ঠিক করবে।

এই লেসনের মূল কথা: `docker images` image পরিচালনার জন্য, আর `docker ps`, `docker start`, `docker stop`, `docker logs` ও `docker rm` container পরিচালনার জন্য ব্যবহার করা হয়।
