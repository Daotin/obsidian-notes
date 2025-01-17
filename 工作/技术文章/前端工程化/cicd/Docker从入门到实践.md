# Docker 从入门到实践

## Docker 简介

### Docker 是什么

Docker 是一种开源的容器技术，它可以让开发者和运维人员更轻松地部署和管理应用程序。**简单来说，Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。**

举个日常生活中的例子，假设你要搬家，你需要把所有的家具和物品都打包好，然后运到新家。在这个过程中，你需要确保所有的物品都能安全、完整地到达目的地。Docker 就像是给你提供了一个集装箱，你可以把所有的物品（应用程序及其依赖）都放进这个集装箱里，然后把集装箱运到新家（部署到服务器上）。这样，你就不用担心物品在运输过程中会丢失或损坏，而且在新家里，你可以很方便地把所有的物品都拿出来使用。

Docker 的主要优势在于它可以让你的应用程序在不同的环境中保持一致性，从而避免了“在我电脑上运行得好好的，为什么在服务器上就出问题了？”这样的问题。而且，Docker 还可以帮助你更高效地利用服务器资源，因为它比传统的虚拟机更轻量级，占用的资源更少。

### Docker vs 虚拟机

虚拟机（virtual machine）就是带环境安装的一种解决方案。它可以在一种操作系统里面运行另一种操作系统，比如在 Windows 系统里面运行 Linux 系统。应用程序对此毫无感知，因为虚拟机看上去跟真实系统一模一样，而对于底层系统来说，虚拟机就是一个普通文件，不需要了就删掉，对其他部分毫无影响。

但是虚拟机有几个缺点：

- **资源占用多**：虚拟机会独占一部分内存和硬盘空间。它运行的时候，其他程序就不能使用这些资源了。哪怕虚拟机里面的应用程序，真正使用的内存只有 1MB，虚拟机依然需要几百 MB 的内存才能运行。
- **冗余步骤多**：虚拟机是完整的操作系统，一些系统级别的操作步骤，往往无法跳过，比如用户登录。
- **启动慢**：启动操作系统需要多久，启动虚拟机就需要多久。可能要等几分钟，应用程序才能真正运行。

由于虚拟机存在这些缺点，Linux 发展出了另一种虚拟化技术：Linux 容器（Linux Containers，缩写为 LXC）。Linux 容器不是模拟一个完整的操作系统，而是**对进程进行隔离**。或者说，在正常进程的外面套了一个保护层。对于容器里面的进程来说，它接触到的各种资源都是虚拟的，从而实现与底层系统的隔离。

由于容器是进程级别的，相比虚拟机有很多优势。比如启动快，资源占用少，体积小。

**而 Docker 就属于 Linux 容器的一种封装**，提供简单易用的容器使用接口。它是目前最流行的 Linux 容器解决方案。Docker 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

参考文章：[Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html "Docker 入门教程")

### Docker 使用场景

传统软件行业中存在的问题：

- 开发、生产、测试环境不一致，开发环境下可用的服务挪到生产上不可用。
- 不同环境之间迁移成本太高，没有统一的软件部署封装标准及封装环境。
- 对于分布式软件持续集成（测试、打包、发布、部署、管理）周期很长，难以自动化、工程化。
- 面临瞬时用户流量增大的场景，很难实现分布式应用服务实例的快速部署。

Docker 的主要用途，目前有三大类。

1. **解决部署环境不一致的问题。** 通常, 程序员开发的时候是在开发环境, 提测阶段部署到测试环境. 那么常常会遇到一个现象, 在开发环境运行的好好的, 怎么一部署到测试环境就有问题了呢? 开始各种排查, 最后发现, 可能是机器配置不一样, 导致 tomcat 启动超时等等。
2. **解决集群环境, 服务器繁多复杂的问题**。如果使用集群部署的话，在一个集群里, 各种各样的软件, jdk, nginx, mysql, mongodb, redis......有很多. 以前运维老师是怎么干的? 搭建一个新的环境, 一台服务器一台服务器的安装. 像 mysql 还有配置环境, 一个服务器一个服务器的配置, 累的半死，而 docker 的实用场景之一就是一次部署, 到处使用。
3. **持续交付和部署。** 对开发和运维（DevOps）人员来说，最希望的就是一次创建或配置，可以在任意地方正常运行。
4. **提供弹性的云服务。** 因为 Docker 容器可以随开随关，很适合动态扩容和缩容。
5. **多租户环境**：使用 Docker，可以为每一个租户的应用层的多个实例创建隔离的环境。
6. **更高效的利用计算机资源**。docker 是内核级别的虚拟化, 可以在一个物理机上运行很多个容器实例, 服务器的性能可以被压榨到极致。通常, 一台主机只能同时运行 2-3 个虚拟机, 但是可以同时运行 20-30 个容器。

### Docker 历史背景

2008 年，Solomon Hykes 和他的朋友 Kamel Founadi、Sebastien Pahl 共同创立了一家名为 DotCloud 的公司，目标是利用一种叫做容器的技术来创建他们称作是“大规模的创新工具”：任何人都可以使用的编程工具。

2010 年，DotCloud 获得了创业孵化器 Y Combinator 的支持，并开始吸引到一些真正的投资，在接下来的 3 年中，dotCloud 内部孵化了一款名为 Docker 的产品。

Docker 刚诞生的时候, 并没有引起行业的注意, dotCloud 公司越来越难, 经济效益也不景气, 后来就要活不下去了, 他们有强烈的愿望, 希望能活下去. 于是, 想了一个办法, 将 docker 开源。2013 年 3 月 Docker 创始人 Solomon Hykes 在 PyCon 大会上的演讲中首次公开介绍了 Docker 这一产品。

在 2013 年 PyCon 大会之后，Docker 的 "创新式镜像格式" 以及 "容器运行时" 迅速成为社区、客户和更广泛行业的实际标准和基石。Docker 的强大之处在于它通过可移植的形式和易于使用的工具在应用程序和基础设施之间创造了独立性。其结果是，Docker 将容器技术大众化，并解决了困扰数百万开发人员的 "matrix from hell" 问题，使容器技术成为主流。

### Docker 优缺点

优点

- 更高效的利用系统资源
- 更快速的启动时间
- 一致的运行环境
- 更易于持续交付和部署(CI/CD)
- 更轻松的迁移
- 更轻松的维护和扩展

## Docker 核心组成

在 Docker 体系里，有四个对象是我们不得不进行介绍的，因为几乎所有 Docker 以及周边生态的功能，都是围绕着它们所展开的。它们分别是：

- **镜像 ( Image )**
- **容器 ( Container )**
- **网络 ( Network )**
- **数据卷 ( Volume )**

### 镜像

Docker 是一个用于管理和运行软件应用的工具。**在 Docker 中，镜像就像是一个软件应用的模板。它包含了运行一个应用所需要的所有文件，资源和设置等。** 你可以把 Docker 镜像想象成一个已经打包好的盒子，里面有一份详细的说明书和所有需要的零件，让你能够轻松地组装和运行一个应用。这样，无论你在哪里使用这个镜像，都能保证应用的一致性和正确性。

Docker 的镜像与虚拟机中的镜像还是有一定区别的。首先，之前我们谈到了 Docker 中的一个创新是利用了 AUFS 作为底层文件系统实现，通过这种方式，Docker 实现了一种增量式的镜像结构。每次对镜像内容的修改，Docker 都会将这些修改铸造成一个镜像层，而一个镜像其实就是由其下层所有的镜像层所组成的。当然，每一个镜像层单独拿出来，与它之下的镜像层都可以组成一个镜像。由于这种结构，Docker 的镜像实质上是无法被修改的，因为所有对镜像的修改只会产生新的镜像，而不是更新原有的镜像。

### 容器

**Docker 中的容器可以看作是一个运行中的软件应用实例。** 当你使用 Docker 镜像（就像一个软件应用的模板）创建一个容器时，它就像是从模板中复制出一个真正的应用，并开始运行它。容器包含了应用所需的所有文件、设置和环境，使得应用能够在不同的计算机和操作系统上一致地运行。

你可以把容器想象成一个运行在沙箱里的应用。沙箱是一个受限制的环境，可以确保应用不会影响到其他应用或系统。这样，你可以在同一台计算机上运行多个不同的容器，它们彼此之间互不干扰。

### 网络

在 Docker 中，实现了强大的网络功能，我们不但能够十分轻松的对每个容器的网络进行配置，还能在容器间建立虚拟网络，将数个容器包裹其中，同时与其他网络环境隔离。

另外，利用一些技术，Docker 能够在容器中营造独立的域名解析环境，这使得我们可以在不修改代码和配置的前提下直接迁移容器，Docker 会为我们完成新环境的网络适配。对于这个功能，我们甚至能够在不同的物理服务器间实现，让处在两台物理机上的两个 Docker 所提供的容器，加入到同一个虚拟网络中，形成完全屏蔽硬件的效果。

![](image_ch1d1tSVcj.png)

### 数据卷

**Docker 中的数据卷是一种用于在容器之间共享和持久化数据的方法。** 你可以把它想象成一个可移动的存储盒子，这个盒子可以在不同的容器之间传递和共享数据。
当你运行一个 Docker 容器时，容器里的数据通常是暂时性的，这意味着当容器被删除时，其中的数据也会消失。而数据卷可以让你在容器之外存储和管理数据，这样即使容器被删除，数据依然可以保留下来。

数据卷还可以让你在多个容器之间共享数据。例如，你可以在一个容器中创建和修改数据，然后将数据卷连接到另一个容器，这样第二个容器就可以访问和使用这些数据了。这对于需要在不同容器之间共享配置文件、数据文件或其他资源的应用来说非常有用。

能够这么简单的实现挂载，主要还是得益于 Docker 底层的 Union File System 技术。在 UnionFS 的加持下，除了能够从宿主操作系统中挂载目录外，还能够建立独立的目录持久存放数据，或者在容器间共享。

在 Docker 中，通过这几种方式进行数据共享或持久化的文件或目录，我们都称为数据卷 ( Volume )。

## Docker 的安装

Docker 从 17.03 版本之后分为 CE（Community Edition: 社区版） 和 EE（Enterprise Edition: 企业版），企业版包含了一些收费服务，个人开发者一般用不到，我们用社区版就可以了。

> 下面安装以 CentOS 为例：

安装

```bash
sudo yum install yum-utils device-mapper-persistent-data lvm2

sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce
```

启动 docker

```bash
sudo systemctl start docker
```

为了实现 Docker 服务开机自启动，我们还可以运行这个命令：

```bash
sudo systemctl enable docker
```

测试 Docker 是否启动：

```bash
sudo docker version # 或者 sudo docker info
```

关闭 Docker：

```bash
sudo systemctl stop docker
```

如果提示：

```
Warning: Stopping docker.service, but it can still be activated by:docker.socket
```

这个警告通常表示，Docker 仍在通过 docker.socket 进程监听着你的系统，尽管 Docker 服务已被停止。这是因为 docker.socket 是一个用于 Docker 的 socket 实例，它可以让其他进程连接到 Docker 守护进程。当你启动 Docker Socket 后，即使 Docker 服务已经被关闭， docker.socket 仍然会保持激活状态。

如果你想完全停止 Docker，可以使用以下命令来禁用 docker.socket，这将停止 docker.socket 进程并阻止其他进程连接到 Docker 守护进程，从而确保 Docker 完全停止运行。

```
sudo systemctl stop docker.socket

```

删除镜像

```bash
# 如果要强制删除正在运行的容器所使用的镜像，则需要加-f
docker rmi [-f] <IMAGE ID>
```

### 配置国内镜像源

编辑（新增）`/etc/docker/daemon.json`文件：

```bash
{
    "registry-mirrors": [
        "https://registry.docker-cn.com"
    ]
}
```

重新启动 docker 来让配置生效。

然后通过 `docker info` 查看是否生效：

```bash
## ......
Registry Mirrors:
 https://registry.docker-cn.com/
## ......
```

## Docker 指令

### 镜像仓库

- 官方镜像仓库

[Docker Hub](https://hub.docker.com/ "Docker Hub") 是一个公共的 Docker 仓库，用户可以在其中搜索和共享 Docker 镜像。它提供了一个方便的方式来发现和使用 Docker 镜像，而不必担心安全性和管理。

- 私有镜像仓库搭建：[Harbor](https://goharbor.io/ "Harbor")

Harbor 是一个私有的 Docker 仓库，它允许用户在自己的环境中管理和部署 Docker 镜像。它提供了一个安全的仓库，用户可以使用它来存储和分发自己的 Docker 镜像。

### 镜像指令

| 镜像指令                  | 描述                 | 备注 |
| ------------------------- | -------------------- | ---- |
| `docker images`           | 查看本地镜像列表     |      |
| `docker pull <镜像名>`    | 获取镜像             |      |
| `docker search <镜像名>`  | 搜索镜像             |      |
| `docker inspect <镜像名>` | 获取镜像更详细的信息 |      |
| `docker rmi <镜像名>`     | 删除本地镜像         |      |
| `docker history <镜像名>` | 查看镜像的构建历史   |      |

### 容器指令

| 容器指令                                    | 描述                   | 备注                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `docker create <镜像名> [--name <容器名>] ` | 创建容器(指定了容器名) |                                                                                                                                                                                                                                                                                                                                                                    |
| `docker start <容器名> `                    | 启动容器               |                                                                                                                                                                                                                                                                                                                                                                    |
| `docker run --name <容器名> -d <镜像名>`    | 创建并启动容器         | 通过 `-d` 或 `--detach` 这个选项告诉 Docker 在启动后将程序与控制台分离，使其进入“后台”运行。                                                                                                                                                                                                                                                                       |
| `docker ps -a`                              | 查看容器状态           | `-a` 表示查看包括未运行的 docker 状态                                                                                                                                                                                                                                                                                                                              |
| `docker stop <容器名>`                      | 停止容器               | 容器停止后，其维持的文件系统沙盒环境还是存在的，内部被修改的内容也都会保留，我们可以通过 docker start 命令将这个容器再次启动。                                                                                                                                                                                                                                     |
| `docker rm <容器名>`                        | 删除容器               |                                                                                                                                                                                                                                                                                                                                                                    |
| `sudo docker exec -it <容器名> bash`        | 进入容器运行指令       | 在借助 `docker exec` 进入容器的时候，我们需要特别注意命令中的两个选项不可或缺，即 `-i` 和 `-t` ( 它们俩可以利用简写机制合并成 `-it` )。&#xA;其中 `-i` ( `--interactive` ) 表示保持我们的输入流，只有使用它才能保证控制台程序能够正确识别我们的命令。而 `-t` ( `--tty` ) 表示启用一个伪终端，形成我们与 bash 的交互，如果没有它，我们无法看到 bash 内部的执行结果。 |

### Dockerfile

Dockerfile 是一个文本文件，它包含了一系列**用于创建 Docker 镜像的指令。** 通过这些指令，你可以定义应用程序的运行环境、安装所需的依赖、配置系统设置等。Dockerfile 的主要目的是让你能够自动化地创建和配置 Docker 镜像，从而确保应用程序在不同环境中的一致性。

举个日常生活中的例子，假设你要为一个聚会准备食物，你可能需要提前写一个菜单（Dockerfile），列出你打算做的菜肴以及每道菜所需的食材和烹饪步骤。这样，在聚会当天，你就可以按照菜单上的指示来准备食物，确保每道菜都能按照你的预期来制作。

在 Dockerfile 中，你需要使用一些特定的指令，例如：

1. `FROM`：指定基础镜像。这是构建新镜像的起点，通常是一个已经存在的镜像，例如：`FROM ubuntu:18.04`。
2. `RUN`：执行命令。在镜像中安装软件或执行其他命令，例如：`RUN apt-get update && apt-get install -y curl`。
3. `COPY`：复制文件。从构建上下文（通常是与 Dockerfile 同一目录的文件）复制文件或目录到镜像中，例如：`COPY . /app`。
4. `ADD`：添加文件。与 `COPY` 类似，但它还可以解压压缩文件，例如：`ADD app.tar.gz /app`。
5. `WORKDIR`：设置工作目录。指定后续指令（如 `RUN`, `CMD`, `ENTRYPOINT` 等）的工作目录，例如：`WORKDIR /app`。
6. `ENV`：设置环境变量。在镜像中定义环境变量，例如：`ENV NODE_ENV=production`。
7. `EXPOSE`：暴露端口。告诉 Docker 该镜像将在指定端口上运行，例如：`EXPOSE 80`。
8. `CMD`：指定容器启动时要运行的命令。如果没有提供命令，将使用基础镜像的默认命令，例如：`CMD ["npm", "start"]`。
9. `ENTRYPOINT`：指定容器启动时要运行的可执行文件。与 `CMD` 类似，但它允许在启动容器时提供参数，例如：`ENTRYPOINT ["npm"]`。

当你编写好 Dockerfile 后，可以使用 `docker build`命令根据 Dockerfile 创建 Docker 镜像。

**根据 Dockerfile 构建镜像**

```bash
docker build -t your_image_name:your_tag -f ./webapp/a.Dockerfile ./webapp

# -t 指定镜像名
# -f 指定dockerfile路径
# 最后的路径表示
```

以下是一个完整的 `docker build` 指令示例：

```bash
docker build -t my_app:1.0 -f Dockerfile.custom --build-arg API_KEY=12345 --no-cache --rm=true .
```

现在，让我们逐个解释这个指令中的每个部分：

1. `docker build`：这是 Docker 的基本命令，用于根据 Dockerfile 构建镜像。
2. `-t my_app:1.0`：`-t` 选项用于为构建的镜像指定名称（`my_app`）和标签（`1.0`）。名称和标签用冒号分隔。
3. `-f Dockerfile.custom`：`-f` 选项用于指定要用于构建过程的 Dockerfile。在这个例子中，我们使用名为 Dockerfile.custom 的文件。如果省略此选项，Docker 默认会在当前目录中查找名为 Dockerfile 的文件。
4. `--build-arg API_KEY=12345`：`--build-arg` 选项用于设置构建时的变量。在这个例子中，我们设置了一个名为 API_KEY 的变量，其值为 12345。这些变量可以在 Dockerfile 的 ARG 指令中使用。
5. `--no-cache`：此选项告诉 Docker 在构建过程中不使用缓存。这意味着 Docker 将重新执行 Dockerfile 中的所有指令，即使它们之前已经执行过。这有助于确保镜像包含最新的依赖项和更新。
6. `--rm=true`：此选项告诉 Docker 在构建完成后删除所有中间容器。这有助于减少磁盘空间占用。默认情况下，此选项为 true，因此可以省略。
7. `.`：最后，这个点表示 Docker 构建上下文的路径，通常是 Dockerfile 所在的路径。构建上下文包含了 Dockerfile 以及与之相关的所有文件和目录，这些文件和目录可能会在构建过程中被复制到镜像中。（请注意，这里的 `.` 并不表示生成的镜像所在的路径。生成的镜像会被存储在 Docker 镜像仓库中，而不是在本地文件系统的某个特定目录）

::: info 什么是 Docker 构建上下文的路径？能否举个例子说明？

当然可以。Docker 构建上下文是指包含 Dockerfile 及其相关文件和目录的文件系统路径。在构建 Docker 镜像时，Docker 需要访问这些文件和目录，以便在镜像中复制文件、安装依赖项等。构建上下文就是将这些文件和目录打包到一起的一个概念。
举个例子，假设您有一个项目，目录结构如下：

```bash
my_project/
|-- Dockerfile
|-- app/
|   |-- index.js
|   |-- package.json
|-- config/
    |-- config.json
```

在这个例子中，`my_project` 目录包含 Dockerfile、一个名为 `app` 的应用程序目录和一个名为 `config` 的配置目录。要构建一个 Docker 镜像，您需要将这些文件和目录作为构建上下文提供给 Docker。

在这种情况下，构建上下文的路径就是 `my_project` 目录。要构建镜像，您需要在终端中切换到 `my_project` 目录，然后运行 `docker build` 命令。例如：

```bash
cd my_project
docker build -t my_image:latest .
```

在这个 `docker build` 命令中，最后的 `.` 表示当前目录，即 `my_project` 目录。这告诉 Docker 使用 `my_project` 目录作为构建上下文，从中获取 Dockerfile 及其相关文件和目录。

简而言之，Docker 构建上下文的路径是包含 Dockerfile 和与之相关的所有文件和目录的文件系统路径。在构建镜像时，Docker 需要知道这个路径，以便正确访问和处理这些文件和目录。

:::

**运行镜像（生成容器）**

```bash
docker run --name <容器名> -d <镜像名> -p {local_port:image_port}

# --name : 容器运行时的名称，名称在当前机器上面是唯一的；
# -p : 本机的端口与容器端口的映射关系；
# -d : 容器在后台运行，并输出容器 ID；
# image_name:image_tag: 镜像tag，一般是完整的镜像 URL；

```

## 使用 Docker 部署项目

### Demo 部署示例

当我们完成代码开发工作之后，该如何使用 `Docker` 来完成部署服务呢？

大体分为 3 步：

1. 编写 `Dockfile` 文件
2. 通过 `Dockerfile` 文件构建镜像
3. 运行镜像生成容器即可。

我们以 nodejs 服务为例：

通过 `nodeJS` 的 `http` 模块监听 `8110` 端口，当我们访问 `http:localhost:8110`时， 就会输出“Hello World”。

1、准备代码文件 `server.js`

```javascript
const http = require("http");

http
  .createServer(function (request, response) {
    // 发送 HTTP 头部
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, { "Content-Type": "text/plain" });

    // 发送响应数据 "Hello World"
    response.end("Hello World");
  })
  .listen(8110);

// 终端打印如下信息
console.log("Server running at http://127.0.0.1:8110/");
```

2、编写 Dockerfile

```docker
# 选择基础镜像
FROM node:16.19-slim

# 设定服务工作路径
WORKDIR /app

# 从当前路径拷贝到容器中的 /app/ 目录下
ADD server.js /app/

# 指定容器监听端口
EXPOSE 8110

# 在容器运行时执行
CMD ["node", "server.js"]
```

3、构建镜像

```bash
docker build -t docker-test:v0.0.1 . # 生成的镜像为docker-test:v0.0.1
```

4、运行镜像（生成容器）

```bash
docker run --name docker-test:v0.0.1 -p 8080:8110 docker-test-con # 生成的容器为docker-test-con
```

5、然后访问 [http://127.0.0.1:8080/](http://127.0.0.1:8110/ "http://127.0.0.1:8080/") 即可看到界面出现“hello world”。

### Vue 项目部署实战

下面是使用 Docker 和 Nginx 部署 Vue.js 前端项目的一步一步详细说明：

**1、构建前端项目**

首先，您需要构建 Vue.js 项目。假设您已经有了一个 Vue.js 应用程序，并且使用 `npm run build` 命令将其构建到 `dist/` 目录中。

**2、创建 Nginx 配置文件**

在前端项目的根目录中创建一个名为 `nginx.conf` 的文件，并添加以下内容：

```nginx
worker_processes 1;

events {
  worker_connections 1024;
}

http {
  include mime.types;

  server {
    listen 80;
    server_name localhost;

    # 静态文件目录
    root /usr/share/nginx/html;

    index index.html;

    location / {
      # 支持history路由模式
      try_files $uri $uri/ /index.html;
    }
  }
}
```

上述配置文件中定义了 Nginx 的基本配置，包括监听 80 端口、静态文件目录和路由配置。

**3、创建 Dockerfile**

在前端项目的根目录中创建一个名为 `Dockerfile` 的文件，并添加以下内容：

```docker
# 使用 Node.js 12 作为基础镜像
FROM node:16.18.1 AS builder

# 将工作目录设置为 /app
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到镜像中
COPY package*.json ./

# 安装依赖
RUN npm install

# 将整个应用程序复制到镜像中
COPY . .

# 构建应用程序
RUN npm run build-only

# 使用 Nginx 作为基础镜像
FROM nginx:latest

# 将 Nginx 配置文件复制到镜像中
COPY nginx.conf /etc/nginx/nginx.conf

# 将构建好的应用程序复制到 Nginx 的默认站点目录中
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]

```

上述 Dockerfile 包含两个阶段：

- 第一个阶段使用 Node.js 12 作为基础镜像，并将 Vue.js 项目的源代码复制到镜像中。然后，安装依赖并构建应用程序。
- 第二个阶段使用 Nginx 作为基础镜像，并将构建好的应用程序复制到 Nginx 的默认站点目录中。然后，将 Nginx 配置文件复制到镜像中，并暴露 80 端口并启动 Nginx 服务。

::: info 💡 关于路径

All paths in a Dockerfile, except the first half of COPY and ADD instructions, refer to image filesystem paths。

Dockerfile 中的所有路径，除了 `COPY`和 `ADD`指令的前半部分，都是指镜像文件系统路径。

:::

::: info 💡 关于 `daemon off`补充说明

对于正常生产（在服务器上），使用默认的 `daemon on;` 指令，以便 Nginx 服务器将在后台启动。 Nginx 和其他服务以这种方式运行并相互通信。一台服务器运行许多服务。
对于 Docker 容器（或调试）， `daemon off;` 指令告诉 Nginx 留在前台。对于容器，这很有用，因为最佳实践是一个容器 = 一个进程。一台服务器（容器）只有一项服务。

:::

**4、构建 Docker 镜像**

在前端项目的根目录中，使用以下命令构建 Docker 镜像：

```bash
docker build -t my-vue-app .
```

这将使用名为 `my-vue-app` 的标签构建 Docker 镜像。请注意，最后的 `.` 表示 Dockerfile 位于当前目录。

**5、运行 Docker**

使用以下命令运行 Docker 镜像：

```bash
docker run --name my-vue-app-con [-d] -p 8080:80 my-vue-app
```

这将启动 Docker 容器，并将容器内的 80 端口映射到主机上的 8080 端口。因此，您可以通过 `http://localhost:8080` 访问应用程序，并应该看到您的 Vue.js 应用程序已经成功部署。

## 可视化 Docker 管理

[Podman Desktop](https://podman-desktop.io/ "Podman Desktop")：一个跨平台桌面应用，可以使用图形界面进行 Docker 容器管理。

## Docker Compose

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。

通过使用 Docker Compose，您不需要使用 shell 脚本来启动容器，可以使用 YAML 文件来配置应用程序的服务、网络和卷。然后，通过一个简单的命令，您可以创建并启动所有配置中定义的服务。

我们知道使用一个 `Dockerfile` 模板文件，可以让用户很方便的定义一个单独的应用容器。然而，在日常工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。

`Compose` 恰好满足了这样的需求。它允许用户通过一个单独的 `docker-compose.yml` 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。

Docker Compose 的主要作用包括：

1. 简化多容器应用程序的部署和管理：通过使用单个 YAML 文件，您可以定义整个应用程序的结构，包括服务、网络和存储卷。这使得部署和管理多容器应用程序变得更加简单和高效。
2. 提高开发和测试的效率：Docker Compose 允许您在本地环境中轻松启动、停止和重建服务，从而加快开发和测试过程。
3. 便于团队协作：通过共享 Docker Compose 文件，团队成员可以轻松地在各自的环境中运行相同的多容器应用程序，确保一致性和避免“在我机器上可以运行”的问题。

### Docker Compose 安装和使用

`Compose` 支持 Linux、macOS、Windows 10 三大平台。

Window 安装

`Docker Desktop for Mac/Windows` 自带 `docker-compose` 二进制文件，安装 Docker 之后可以直接使用。

Linux 安装

直接从 [官方 GitHub Release](https://github.com/docker/compose/releases) 处直接下载编译好的二进制文件即可。

```bash
$ sudo curl -L https://github.com/docker/compose/releases/download/v2.17.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
# 或者另一种写法：sudo curl -L "https://github.com/docker/compose/releases/download/v2.17.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose


# 国内用户可以使用以下方式加快下载
# $ sudo curl -L https://get.daocloud.io/docker/compose/releases/download/v2.17.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

# 设置文件执行权限
$ sudo chmod +x /usr/local/bin/docker-compose
```

检测是否安装成功

```bash
docker-compose --version
```

卸载

```bash
$ sudo rm /usr/local/bin/docker-compose
```

:::tip
如何安装不了，参考：[浅析 docker-compose 安装及解决遇到的问题](https://www.cnblogs.com/goloving/p/16253880.html)
:::

:::warning
PS：我在 linux 虚拟机测试，最新的 `v2.17.2`，在安装后执行 `docker-compose --version`，可能会报错：`Segmentation fault`。然后又试了 `v2.13.0`，是可以的。
:::

### yml 模板文件

默认的模板文件名称为 `docker-compose.yml`，格式为 YAML 格式。

简单示例：

```yaml
version: "3"

services:
  webapp:
    image: examples/web
    ports:
      - "8080:80"
    volumes:
      - "/data"
```

> 注意每个服务都必须通过 image 指令指定镜像或 build 指令（需要 Dockerfile）等来自动构建生成镜像。

参数说明：

- `image`: 指定为镜像名称或镜像 ID。如果镜像在本地不存在，Compose 将会尝试拉取这个镜像。
- `build`：指定 Dockerfile 所在文件夹的路径（可以是绝对路径，或者相对 docker-compose.yml 文件的路径）。 Compose 将会利用它自动构建这个镜像，然后使用这个镜像。更多用法参考：https://yeasy.gitbook.io/docker_practice/compose/compose_file#build
- `ports`：暴露端口信息。使用 `宿主端口：容器端口 (HOST:CONTAINER)` 格式
- `container_name`: 指定容器名称。默认将会使用 `项目名称_服务名称_序号` 这样的格式。
- `volumes`: 数据卷所挂载路径设置。可以设置为 `宿主机路径(HOST:CONTAINER)`或者 `数据卷名称(VOLUME:CONTAINER)`。如果路径为数据卷名称，必须在文件中配置数据卷。
- `restart`: 指定容器退出后的重启策略为始终重启。该命令对保持服务始终运行十分有效，在生产环境中推荐配置为 always 或者 unless-stopped。

更多参数：https://yeasy.gitbook.io/docker_practice/compose/compose_file

**读取变量**

Compose 模板文件支持动态读取主机的系统环境变量和当前目录下的 `.env` 文件中的变量。

例如，下面的 Compose 文件将从运行它的环境中读取变量 `${MONGO_VERSION}` 的值，并写入执行的指令中。

```yaml
version: "3"
services:

db:
  image: "mongo:${MONGO_VERSION}"
```

### 命令说明

`docker-compose` 命令的基本的使用格式是：

```bash
docker-compose [-f=<arg>...] [options] [COMMAND] [ARGS...]
```

- `-f, --file FILE` 指定使用的 Compose 模板文件，默认为 `docker-compose.yml`，可以多次指定。
- `-p, --project-name NAME` 指定项目名称，默认将使用所在目录名称作为项目名。
- `--verbose` 输出更多调试信息。
- `-v, --version` 打印版本并退出。

COMMAND

> 参考：https://yeasy.gitbook.io/docker_practice/compose/commands

- `build`：构建（重新构建）项目中的服务容器。
- `up`：该命令十分强大，它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作。
  - `docker-compose up -d`，将会在后台启动并运行所有的容器。一般推荐生产环境下使用该选项。
  - 默认情况，如果服务容器已经存在，`docker-compose up` 将会尝试停止容器，然后重新创建。
- `down`：停止 up 命令所启动的容器，并移除网络。
- `stop`：停止已经处于运行状态的容器，但不删除它。通过 `docker-compose start` 可以再次启动这些容器。
- `rm`：删除所有（停止状态的）服务容器。
- `ps`：列出项目中目前的所有容器。
- `pull`：拉取服务依赖的镜像。

参考文档：

- https://github.com/yeasy/docker_practice
- https://www.cnblogs.com/crazymakercircle/p/15505199.html

### Vue 项目部署实战-docker compose 版

项目背景为[Vue 项目部署实战](#vue-项目部署实战)

项目中已经包含了 nginx.conf 和 Dockerfile 文件。

下面是一个基本的 `docker-compose.yml` 文件，用于部署您的 Vue 项目：

```yaml
version: "3" # 指定了docker-compose文件的版本

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8081:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: always
```

我们定义一个名为“app”的服务。它包含以下几个子项：

- `app`: 生成 docker 镜像名称为`项目名称_app`
- `build`: 它指定了如何构建 Docker 镜像。在这个例子中，我们使用当前目录作为构建上下文，使用 Dockerfile 文件进行构建。
- `ports`: 它指定了容器的端口映射。在这个例子中，我们将容器的 80 端口映射到主机的 8080 端口上。
- `volumes`: 它指定了容器与主机之间的文件映射。在这个例子中，我们将主机的 `nginx.conf`文件挂载到容器的 `/etc/nginx/nginx.conf`路径上，并设置为只读模式。这样我们可以在不重新构建容器的情况下更改 Nginx 配置。
- `restart`: 它指定了容器的重启策略。在这个例子中，我们指定了容器始终重启。

:::warning
在上面的 Dockerfile 中，已经包含了使用 Nginx 作为基础镜像，并将构建好的应用程序复制到 Nginx 的默认站点目录中。因此，在 docker-compose.yml 中，您不需要再单独定义一个 nginx 服务。
:::

**启动服务**

将 docker-compose.yml 文件放在 Vue 项目根目录中，然后执行 `docker-compose up -d`命令。

Docker 会按照 docker-compose.yml 文件中的定义，启动一个新的 Docker 容器并在后台运行。

具体的执行步骤如下：

- 如果当前目录下不存在与 docker-compose.yml 文件同名的 Docker 容器，Docker 会先构建一个新的 Docker 镜像。该镜像是基于 Dockerfile 文件构建的，其中包含了 Vue 项目的应用程序和 Nginx 服务器。
- Docker 会根据 docker-compose.yml 文件的定义，将容器的 80 端口映射到主机的 8080 端口上，这样我们可以通过浏览器访问应用程序。
- Docker 会将主机上的 nginx.conf 文件挂载到容器内的/etc/nginx/nginx.conf 路径上，这样我们可以在不重新构建容器的情况下更改 Nginx 配置。
- 最后，Docker 会启动一个新的容器，并将其设置为在后台运行。

![1681393533878](1681393533878.png)

可以看到已经执行成功，然后使用`docker ps`看一下容器已经执行了：

![](2023-04-13-21-57-49.png)

然后打开 `http://localhost:8081` ，发现已经可以正常访问了。

如果您需要停止服务，可以运行 `docker-compose down`。

## 相关文章

- [掌握这 5 个技巧，让你的 Dockerfile 像个大师！](https://mp.weixin.qq.com/s/v9kznJ1OezUxA49-nd_r_Q)

## 进阶学习资料

- [Docker 入门教程-阮一峰](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html "Docker 入门教程-阮一峰")
- [跟胖哥一起学 Docker](https://jspang.com/article/75 "跟胖哥一起学Docker")
- [https://cavalheiro.cn/frontend/Docker_build_Nginx.html](https://cavalheiro.cn/frontend/Docker_build_Nginx.html)
- [开发者必备的 Docker 实践指南](https://juejin.cn/book/6844733746462064654)
- [Docker — 从入门到实践](https://yeasy.gitbook.io/docker_practice/)
