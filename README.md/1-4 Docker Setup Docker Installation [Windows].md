# 1-4 Docker Setup & 1-5 Docker Installation [Windows]

এই লেসনে আমরা Windows 11 computer-এ Docker Desktop install, configure এবং verify করব। এরপর প্রথম Docker container চালাব, যাতে পরবর্তী সময়ে Node.js, NestJS, Go এবং PostgreSQL project-এ Docker ব্যবহার করতে পারো।

## 1-4. Docker Setup — Installation-এর আগে প্রস্তুতি

### Step 1: System requirements check করো

Docker-এর official documentation অনুযায়ী Windows-এ Docker Desktop চালানোর জন্য hardware virtualization এবং supported Windows environment প্রয়োজন। WSL 2 backend ব্যবহার করলে অন্তত 8 GB RAM এবং WSL 2.1.5 বা পরবর্তী সংস্করণ প্রয়োজন।

[](https://www.google.com/s2/favicons?domain=https://docs.docker.com&sz=32)

Docker Docs

+1

| বিষয়             | কী check করবে                                |
| ---------------- | -------------------------------------------- |
| Operating System | Supported Windows 11 version                 |
| RAM              | কমপক্ষে 8 GB                                 |
| CPU              | 64-bit processor with SLAT                   |
| Virtualization   | BIOS/UEFI-তে enabled                         |
| Backend          | WSL 2 recommended                            |
| Internet         | Docker installer ও images download করার জন্য |

### Step 2: Virtualization enabled কি না দেখো

How to Check If Virtualization is Enabled on Windows 11

windowsloop.com

1. `Ctrl + Shift + Esc` চাপো।
2. Task Manager → Performance → CPU-তে যাও।
3. `Virtualization` খুঁজে দেখো।

যদি `Enabled` দেখায়, তাহলে ঠিক আছে। `Disabled` দেখালে BIOS/UEFI settings থেকে enable করতে হতে পারে।

### Step 3: WSL 2 install বা update করো

Windows PowerShell Run as administrator দিয়ে খোলো।

প্রথমে চালাও:

```
wsl --version
```

যদি WSL install করা না থাকে, তাহলে:

```
wsl --install -d Debin
```

এরপর computer restart করার প্রয়োজন হতে পারে। Restart-এর পর WSL update করো:

```
wsl --update
```

তারপর version ও installed distributions যাচাই করো:

```
wsl --status
wsl --list --verbose
```

WSL install করতে সমস্যা হলে Microsoft-এর official guide দেখো: Install WSL — Microsoft Documentation।

[](https://www.google.com/s2/favicons?domain=https://docs.docker.com&sz=32)

Docker Docs

+1

## 1-5. Docker Installation — Windows

### Step 4: Docker Desktop download করো

Getting Started with Docker, Kubernetes, and Istio on Windows - DEV Community

dev.to

Docker-এর official website থেকে installer download করো।

Use docker on reComputer | Seeed Studio Wiki

Docker Desktop for Windows

Official installer and installation guide

Download Docker Desktop

Official installation documentation

### Step 5: Docker Desktop install করো

Setup Docker Desktop on Windows Machine | by siddharth Saxena | Medium

medium.com

1. Download করা `Docker Desktop Installer.exe` ফাইলটি open করো।
2. Installation wizard-এর নির্দেশনা অনুসরণ করো।
3. Backend option এলে Use WSL 2 instead of Hyper-V নির্বাচন করো, যদি optionটি দেখায়।
4. Install সম্পন্ন হলে `Close` চাপো।
5. Windows Start Menu থেকে Docker Desktop open করো।
6. প্রথমবারের terms গ্রহণ করে Docker Desktop চালু হতে দাও।

বেশিরভাগ Windows developer-এর জন্য WSL 2 backend ভালো starting point।

[](https://www.google.com/s2/favicons?domain=https://docs.docker.com&sz=32)

Docker Docs

+1

### Step 6: Docker Engine চালু হয়েছে কি না check করো

Docker Desktop open করার পর engine চালু হওয়া পর্যন্ত অপেক্ষা করো।

তারপর PowerShell বা VS Code terminal-এ চালাও:

```
docker --version
```

Expected output-এর উদাহরণ:

```
Docker version XX.YY.Z, build ...
```

এরপর:

```
docker info
```

Docker Engine ঠিকমতো চলছে কি না বোঝার জন্য এই command ব্যবহার করবে। Engine চালু না থাকলে connection error দেখাতে পারে।

### Step 7: First Docker container চালাও

এখন তোমার প্রথম container চালানোর পালা!

```
docker run hello-world
```

Docker প্রয়োজন হলে `hello-world` image download করবে এবং container চালিয়ে একটি success message দেখাবে।

এরপর নিচের commands চালিয়ে দেখো:

```
# Downloaded images
docker images

# Currently running containers
docker ps

# All containers, including stopped ones
docker ps -a
```

`hello-world` কাজ শেষ করে বন্ধ হয়ে যায়, তাই `docker ps`-এ সেটি না দেখালেও সমস্যা নেই।

## Common Problems & Solutions

| Problem                        | কী করবে                                                               |
| ------------------------------ | --------------------------------------------------------------------- |
| `docker is not recognized`     | Docker Desktop install হয়েছে কি না দেখো; প্রয়োজনে terminal reopen করো |
| Docker Engine connection error | Docker Desktop চালু আছে কি না দেখো                                    |
| WSL version error              | `wsl --update` চালিয়ে প্রয়োজন হলে restart করো                         |
| Virtualization disabled        | BIOS/UEFI settings check করো                                          |
| Installation permission error  | Installer-এর নির্দেশনা অনুযায়ী প্রয়োজনীয় permission নাও               |

## Practice Checklist

### Installation progress

0/6 completed

- [ ] WSL version check করেছি
- [ ] Virtualization enabled কি না দেখেছি
- [ ] Docker Desktop install করেছি
- [ ] Docker Desktop চালু করেছি
- [ ] docker --version সফলভাবে চালিয়েছি
- [ ] docker run hello-world সফল হয়েছে

Next lesson: `1-6 Docker Images, Containers & Essential Commands` — এরপর আমরা নিজের Node.js বা Go application-এর জন্য Dockerfile তৈরি করব।
