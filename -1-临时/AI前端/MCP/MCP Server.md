MCP（Model Context Protocol）是 Anthropic 在去年提出的一种开放协议，用于标准化应用程序与大语言模型（LLMs）之间的上下文交互，它在外部数据源和 AI 工具之间建立链接，实现了类似 AI 应用的'USB-C'通用接口。

简单来说借助 MCP 可以用来给 AI 使用插件，来帮助 AI 能够看见、理解其他数据源，典型的应用场景比如在 Windsurf 和 Cursor 里，通过各种 MCP 工具连接到其他的服务，来完成一些 AI 本身无法实现的功能。

比如连接文本生成图像的 MCP，在 Curosr 中，让其[将 emoji 替换成图片](https://www.youtube.com/watch?v=oAoigBWLZgE)：

![alt text](images/image-20250302101206.png)

比如，根据外部的编码规范，[自动格式化代码](https://www.youtube.com/watch?v=oAoigBWLZgE)：

![alt text](images/image-20250302103346.png)

资料：

- MCP 文章科普：https://guangzhengli.com/blog/zh/model-context-protocol/
- https://x.com/xiaokedada/status/1895100171043901871
- https://x.com/nicekate8888/status/1894978009284899202

MCP tools：

- https://glama.ai/mcp/servers
- https://smithery.ai/
- 官方的 MCP Server 列表：https://github.com/modelcontextprotocol/servers
