---
title: Gemini Cli
sidebar_position: 1
---

# Gemini Cli

基于 Google Gemimi API 的命令好工具，允许你直接在终端或命令提示符中与 Google 的 Gemini 大模型进行交互

官网： https://geminicli.com/

### 安装

多种安装方式，例如基于 NodeJS 安装

```
npm install -g @google/gemini-cli
```



```
gemini
```

多种认证方式支持，例如 Login with Google ，会打开浏览器进行认证，确认后看到“Authentication successful”即认证成功


* / 内置功能  
* ! shell 命令  
* @ 引用文件

查看版本信息

```
/about

╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                    │
│ About Gemini CLI                                                                                   │
│                                                                                                    │
│ CLI Version                       0.19.2                                                           │
│ Git Commit                        95f9032bf                                                        │
│ Model                             auto                                                             │
│ Sandbox                           no sandbox                                                       │
│ OS                                darwin                                                           │
│ Auth Method                       OAuth                                                            │
│ User Email                        samuelqbo@gmail.com                                              │
│                                                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

工具

```
> /tools

Available Gemini CLI tools:

  - Codebase Investigator Agent (codebase_investigator)
  - Edit (replace)
  - FindFiles (glob)
  - GoogleSearch (google_web_search)
  - ReadFile (read_file)
  - ReadFolder (list_directory)
  - SaveMemory (save_memory)
  - SearchText (search_file_content)
  - Shell (run_shell_command)
  - WebFetch (web_fetch)
  - WriteFile (write_file)
  - WriteTodos (write_todos)

```

查看每种工具的介绍

```
> /tools desc

Available Gemini CLI tools:

  - Codebase Investigator Agent (codebase_investigator)
    The specialized tool for codebase analysis, architectural mapping, and understanding system-wide
    dependencies. 
        Invoke this tool for tasks like vague requests, bug root-cause analysis, system refactoring,
    comprehensive feature implementation or to answer questions about the codebase that require
    investigation. 
        It returns a structured report with key file paths, symbols, and actionable architectural
    insights.
  - Edit (replace)
    Replaces text within a file. By default, replaces a single occurrence, but can replace multiple
    occurrences when expected_replacements is specified. This tool requires providing significant
    context around the change to ensure precise targeting. Always use the read_file tool to examine
    the file's current content before attempting a text replacement.


```

价格



```
> what is my quota


ℹ Gemini CLI update available! 0.19.2 → 0.19.3
  Installed with npm. Attempting to automatically update now...
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  GoogleSearch Searching the web for: "Gemini API quota"                                          │
│                                                                                                    │
│ Search results for "Gemini API quota" returned.                                                    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ The Gemini API has various quotas and rate limits. For the free tier (Gemini API Key, unpaid), the
  limits are typically 5 requests per minute (RPM) and 25 requests per day (RPD). For Gemini Code
  Assist for individuals, it's 60 RPM and 1000 RPD.

  If you enable billing, the limits increase significantly to 300 RPM, 1 million TPM (tokens per
  minute), and 1,000 RPD. Higher tiers are available for increased usage, and enterprise-level quotas
  can be negotiated. Limits can also vary based on the specific Gemini model being used.
```

### 文本处理

```
> Tell 3 jokes and write each one into a separate file.

╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  WriteFile Writing to joke1.txt                                                                  │
│                                                                                                    │
│ 1 Why don't scientists trust atoms? Because they make up everything!                               │
│                                                                                                    │
│ ✓  WriteFile Writing to joke2.txt                                                                  │
│                                                                                                    │
│ 1 What do you call a fake noodle? An Impasta!                                                      │
│                                                                                                    │
│ ✓  WriteFile Writing to joke3.txt                                                                  │
│                                                                                                    │
│ 1 I'm reading a book on anti-gravity. It's impossible to put down!                                 │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ I have written the jokes to the files.
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  Shell ls [current working directory /Users/wjf/geminicli]                    │
│                                                                                                    │
│ 1.md            2.md            joke1.txt       joke2.txt       joke3.txt                          │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ Done.

> combine 3 jokes file into one

✦ I am about to combine the three joke files into a single file named all_jokes.txt.
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  Shell cat joke1.txt joke2.txt joke3.txt > all_jokes.txt [current working directory /Users/wjf/… │
│                                                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  ReadFile all_jokes.txt                                                                          │
│                                                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  ReadFile joke1.txt                                                                              │
│                                                                                                    │
│                                                                                                    │
│ ✓  ReadFile joke2.txt                                                                              │
│                                                                                                    │
│                                                                                                    │
│ ✓  ReadFile joke3.txt                                                                              │
│                                                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  WriteFile Writing to all_jokes.txt                                                              │
│                                                                                                    │
│ 1 - Why don't scientists trust atoms? Because they make up everything!What do you call a fake      │
│   noodle? An Impasta!I'm reading a book on anti-gravity. It's impossible to put down!              │
│ 1 + Why don't scientists trust atoms? Because they make up everything!                             │
│ 2 + What do you call a fake noodle? An Impasta!                                                    │
│ 3 + I'm reading a book on anti-gravity. It's impossible to put down!                               │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  ReadFile all_jokes.txt                                                                          │
│                                                                                                    │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ Done.

```

### 图片识别

通过 `@filename` 引用文件

```
> @1.jpeg tell me the content of this image

✦ The image shows a wedding couple standing outdoors. The bride is on the left, wearing a white
  strapless wedding gown with intricate lace details on the sleeves and skirt, holding a bouquet of
  white flowers. The groom is on the right, dressed in a black suit with a white shirt and a blue and
  white striped tie. They are standing in front of a modern white structure, possibly an altar or
  backdrop, with parts of it forming geometric shapes. The setting appears to be a garden or park,
  with green grass at their feet and lush green trees and foliage in the background, under a bright
  blue sky with some wispy clouds.
```

### 上下文压缩

因为上下文窗口有限，所以需要进行压缩，而且可以节约 token

```
> /compress

✦ Chat history compressed from 10414 to 1777 tokens.
```

### 会话

```
# 保存会话
/chat save contextName
# 列出会话
/chat list contextName
# 恢复会话
/chat resume contextName
# 删除会话
/chat delete contextName
```

### MCP

使用 mcp-playwright 操作浏览器

https://github.com/executeautomation/mcp-playwright

安装

```
sudo npm install -g @executeautomation/playwright-mcp-server
```

将文档中的 Claude Desktop 的配置文件加入 `~/.gemini/settings.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

完整配置文件

```json
{
  "security": {
    "auth": {
      "selectedType": "oauth-personal"
    }
  },
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}

```

查看当前的 MCP

```
> /mcp list

Configured MCP servers:

🟢 playwright - Ready (32 tools)
  Tools:
  - clear_codegen_session
  - end_codegen_session
  - get_codegen_session
  - playwright_assert_response
  - playwright_click
  - playwright_click_and_switch_tab
  ...
```

使用 MCP 打开浏览器，搜索 gemini cli ，并打开 git 仓库

```
> open browser, search for gemini cli, open git repository

╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  playwright_navigate (playwright MCP Server) {"url":"https://www.google.com"}                    │
│                                                                                                    │
│ Navigated to https://www.google.com                                                                │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  playwright_get_visible_html (playwright MCP Server) {}                                          │
│                                                                                                    │
│ ... first 138 lines hidden ...                                                                     │
│ g-fab,.VdehBf.btpNFe g-fab{box-shadow:0 0 0 1px rgba(0,0,0,.04),0 4px 8px 0                        │
...
│ <!-- Output truncated due to size limits -->                                                       │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  playwright_fill (playwright MCP Server) {"selector":"textarea[name=\"q\"]","value":"gemini cli… │
│                                                                                                    │
│ Filled textarea[name="q"] with: gemini cli                                                         │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  playwright_press_key (playwright MCP Server) {"key":"Enter"}                                    │
│                                                                                                    │
│ Pressed key: Enter                                                                                 │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  playwright_get_visible_html (playwright MCP Server) {}                                          │
│                                                                                                    │
│ HTML content:                                                                                      │
│ <html><head><meta http-equiv="origin-trial"                                                        │
│ content="A7vZI3v+Gz7JfuRolKNM4Aff6zaGuT7X0mf3wtoZTnKv6497cVMnhy03KDqX7kBz/q/iidW7srW31oQbBt4VhgoAA │
...
│ </body></html>                                                                                     │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ I've encountered a CAPTCHA page while searching, which is preventing me from proceeding. I am unable
  to solve the CAPTCHA. Would you like me to try a different approach, or would you like to solve it
  manually?
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  playwright_close (playwright MCP Server) {}                                                     │
│                                                                                                    │
│ Browser closed successfully                                                                        │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  GoogleSearch Searching the web for: "gemini cli git repository"                                 │
│                                                                                                    │
│ Search results for "gemini cli git repository" returned.                                           │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ ✓  playwright_navigate (playwright MCP Server) {"url":"https://github.com/google-gemini/gemini-cl… │
│                                                                                                    │
│ Navigated to https://github.com/google-gemini/gemini-cli                                           │
╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ I have opened the Gemini CLI git repository in the browser.

 Using: 1 MCP server

```

### 上下文

添加上下文记忆功能

将内容写入文件

```
# Web Based Gomoku

Do not use third-party UI libraries, use ES6, and do not add semicolons at the end of lines of JavaScript file.
```

刷新上下文

```
> /memory refresh


ℹ Refreshing memory from source files...

ℹ Memory refreshed successfully. Loaded 202 characters from 1 file(s).

> /memory show


ℹ Current memory content from 1 file(s):
  ---
  --- Context from: GEMINI.md ---
  # Web Based Gomoku
  Do not use third-party UI libraries, use ES6, and do not add semicolons at the end of lines of
  JavaScript file.
  --- End of Context from: GEMINI.md ---
  ---


```

生成的 Html 文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gomoku</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Gomoku</h1>
    <div id="board"></div>
    <script src="script.js"></script>
</body>
</html>
```

生成的 JavaScript 文件

还是有行尾分号...

```js
const boardElement = document.getElementById('board');
const cells = [];
let currentPlayer = 'black';
const boardSize = 15;
const board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));

for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cells.push(cell);
        boardElement.appendChild(cell);
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (board[row][col]) {
            return;
        }

        board[row][col] = currentPlayer;
        cell.classList.add(currentPlayer);

        if (checkWin(row, col)) {
            setTimeout(() => {
                alert(`${currentPlayer.toUpperCase()} wins!`);
                resetBoard();
            }, 100);
        } else {
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        }
    });
});

function checkWin(row, col) {
    const directions = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: -1 }
    ];

    for (const dir of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            const newRow = row + dir.x * i;
            const newCol = col + dir.y * i;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 5; i++) {
            const newRow = row - dir.x * i;
            const newCol = col - dir.y * i;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && board[newRow][newCol] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 5) {
            return true;
        }
    }
    return false;
}

function resetBoard() {
    cells.forEach(cell => {
        cell.classList.remove('black', 'white');
    });
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = null;
        }
    }
    currentPlayer = 'black';
}

```



