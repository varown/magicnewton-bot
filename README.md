# 🎲 MagicNewton 骰子机器人

一个简单的 Puppeteer 机器人，用于在 [MagicNewton](https://magicnewton.com/portal?referral=aesxyn3wi03s5221) 上自动掷骰子。该机器人使用会话 Cookies 登录，并在骰子可用时尝试掷骰子。

## 🚀 功能
- **自动掷骰子：** 自动点击“Roll now”和“Let's roll”按钮。
- **显示积分和邮箱：** 在控制台中显示当前登录用户的邮箱和积分。
- **智能计时器：** 如果骰子不可用，机器人会显示倒计时并等待。
- **每 24 小时循环运行：** 机器人每 24 小时自动运行一次。

## ✨ 别忘了关注并点个 Star 支持我们

## 🛠️ 安装

### 1️⃣ 克隆仓库
```sh
git clone https://github.com/varown/magicnewton-bot.git 
cd magicnewton-bot
```

### 2️⃣  获取会话 Cookies
```sh
npm i
```

### 3️⃣ Get Your Session Cookies
你需要会话 Cookies 来保持登录状态。以下是获取方法：

![MagicNewton Dice Bot](https://raw.githubusercontent.com/varown/magicnewton-bot/refs/heads/master/cookies.png)

1. 在 浏览器 中打开 [MagicNewton](https://magicnewton.com/portal?referral=aesxyn3wi03s5221)。
2. 按 `F12` 或 `Ctrl` + `Shift` + `I` 打开开发者工具。
3. 转到 **Application** 标签 → **Storage** → **Cookies**。
4. 找到名为 __Secure-next-auth.session-token 的 Cookie。
5. 复制它的值。
注意：cookies 有效期为一个月，一个月后记得更换



### 4️⃣  编辑 Cookies.json 文件（保存时，按 CTRL+X，然后按 Y，最后按 Enter）

```sh
nano cookies.json
```
![MagicNewton Dice Bot](https://raw.githubusercontent.com/varown/magicnewton-bot/refs/heads/master/account.png)
1、支持多账号，按照上图输入数值

### 5️⃣ 运行机器人
```sh
node index.js
```

## ***更新机器人t***

```sh
git pull
```

## ***更新后，使用以下命令重新启动机器人：:***
```sh
node index.js
```
  
## 📌注意事项
- 机器人以 无头模式（后台运行）运行。如果你想看到浏览器界面，可以将 headless: true 改为 headless: false。
- 如果“Roll”按钮不可用，机器人会等待并显示倒计时。
- 使用风险自负。 自动化操作可能违反网站的服务条款。

## 📝 License
本项目仅用于教育目的，请负责任地使用，如违反规定使用请后果自负。
