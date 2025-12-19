---
title: Claude Cli
sidebar_position: 2
---
# Claude

Claude CLI 是 Anthropic公司官方提供的命令行接口工具。它允许开发者和用户在终端（命令行）环境中直接与Claude API进行交互，无需通过网页界面或构建复杂的应用程序。

需要安装好 git 和 nodejs

安装 claude

参考 https://code.claude.com/docs/en/overview

```
sudo npm install -g @anthropic-ai/claude-code
```

### Claude Code Router

直接使用 claude cli 需要付费的 pro 账户才可以，但可以通过 claude code router 调用第三方平台，例如 gemini modelscope 

安装 Claude code router

```
sudo npm install -g @musistudio/claude-code-router
```

可以通过 ui 配置
```
ccr ui
```

也可以通过配置文件 `~/.claude-code-router/config.json`

```json
{
  "APIKEY": "your-secret-key",
  "PROXY_URL": "http://127.0.0.1:1085",
  "LOG": true,
  "API_TIMEOUT_MS": 600000,
  "NON_INTERACTIVE_MODE": false,
  "Providers": [
    {
      "name": "modelscope",
      "api_base_url": "https://api-inference.modelscope.cn/v1/chat/completions",
      "api_key": "xx",
      "models": ["Qwen/Qwen3-Coder-480B-A35B-Instruct", "Qwen/Qwen3-235B-A22B-Thinking-2507"],
      "transformer": {
        "use": [
          [
            "maxtoken",
            {
              "max_tokens": 65536
            }
          ],
          "enhancetool"
        ],
        "Qwen/Qwen3-235B-A22B-Thinking-2507": {
          "use": ["reasoning"]
        }
      }
    }
  ],
  "Router": {
    "default": "modelscope,Qwen/Qwen3-Coder-480B-A35B-Instruct"
  }
}
```



通过 `ccr code` 可以启动 claude

```
ccr code


╭─── Claude Code v2.0.42 ───────────────────────────────────────────────────────────────────────────────╮
│                                                │ Tips for getting started                             │
│                  Welcome back!                 │ Ask Claude to create a new app or clone a repository │
│                                                │ ──────────────────────────────────────────────────── │
│                     ▐▛███▜▌                    │ Recent activity                                      │
│                    ▝▜█████▛▘                   │ No recent activity                                   │
│                      ▘▘ ▝▝                     │                                                      │
│                                                │                                                      │
│         Sonnet 4.5 · API Usage Billing         │                                                      │
│   /Users/wjf/claude-study                      │                                                      │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────╯

```

### Claude 使用


CLAUDE.md 项目级配置文件可用于制定规范

CLAUDE.md 可以用 `/init` 生成，作为当前项目多配置。
CLAUDE.local.md 可作为当前项目的个人配置。
~/.claude/CLAUDE.md 可作为所有项目全局配置。

```
# Project Guidelines for Claude

## Tech Stack
- Java 17
- Spring Boot 3.5
- Gradle
- H2
- Reactive WebFlux

## Architecture
- Hexagonal architecture
- Controllers → Application Services → Domain
- No repository access from controllers

## Coding Rules
- Constructor injection only
- No field injection

## Reactive Rules
- No blocking calls
- Use boundedElastic only when unavoidable

## Testing
- JUnit 5 + Mockito
- Prefer slice tests
- Avoid @SpringBootTest unless necessary

## Output Expectations
- Explain changes briefly
- Keep diffs minimal

```

`#` 开头的命令可以往里面添加内容

```
# Write comment if code is complex 
  ⎿  Got it.
```

`shift + Tab` 可以切换模式，例如 plan mode 或 accept edits on

Think, Think more, Think a lot, Think longer, Ultra think 可以让 claude 思考

`@` 可以引用文件，便于 claude 定位，减少上下文节约 token ，可以拖动文件到控制台

```
> @src/main/java/com/wjftu/application/service/UserServiceImpl.java in this file reactor.test.StepVerifier can't be resolved 
  ⎿  Read src/main/java/com/wjftu/application/service/UserServiceImpl.java (25 lines)
  ⎿  ⧉ Selected 1 lines from src/test/java/com/wjftu/application/service/UserServiceImplTest.java in Visual Studio Code

⏺ Update(build.gradle)
  ⎿  Updated build.gradle with 1 addition                                                   
       24      implementation 'org.springframework.data:spring-data-relational'
       25        runtimeOnly 'io.r2dbc:r2dbc-h2'
       26      testImplementation 'org.springframework.boot:spring-boot-starter-test'
       27 +    testImplementation 'io.projectreactor:reactor-test'
       28          implementation 'org.springdoc:springdoc-openapi-starter-webflux-ui:2.2.0'
       29      testRuntimeOnly 'org.junit.platform:junit-platform-launcher'```
```

一些减少上下文帮助 claude 专注的使用技巧：

中断 claude 可以按 ESC 键，可以用 `continue` 让 claude 继续执行。例如我们发现 claude 执行方式不对，可以先中断，修改 CLAUDE.md ，然后 continue

连续两次 ESC ，选择时间点，可以回到之前到时间点，例如有时执行过程中反复调试，积累了大量不必要的上下文，然后回到之前的地方继续，可以节约上下文

`/compact` 可以对当前会话进行总结，压缩

`/clear` 可以清空对话历史，用于开始一个与当前任务无关的新任务

