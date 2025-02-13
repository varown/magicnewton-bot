import puppeteer from "puppeteer";
import fs from "fs";
import plimit from "p-limit";
const MAGICNEWTON_URL = "https://www.magicnewton.com/portal/rewards";
const RANDOM_EXTRA_DELAY = () =>
  Math.floor(Math.random() * (60 - 20 + 1) + 20) * 60 * 1000; // 20-60 mins random delay

let maxDelayTime = "00:00:00";
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const showTime = (totalMs) => {
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
  return `${hours}:${minutes}:${seconds}`;
};

function totalMs(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length !== 3) return null;

  return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
}

const index = async (cookies) => {
  try {
    console.log("🔄 新周期开始...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    if (cookies) {
      await page.setCookie(...cookies);
      console.log("✅ Cookies加载成功。\n⏳ 网页加载中：可能需要最多60秒...");
    } else {
      console.log(" ❌ 未找到Cookies。请先运行登录步骤。");
      await browser.close();
      return;
    }

    await page.goto(MAGICNEWTON_URL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log(" 🌐 页面加载完成.");

    const userEmail = await page
      .$eval("p.gGRRlH.WrOCw.AEdnq.hGQgmY.jdmPpC", (el) => el.innerText)
      .catch(() => "Unknown");
    console.log(`📧 登录用户： ${userEmail}`);

    let userCredits = await page
      .$eval("#creditBalance", (el) => el.innerText)
      .catch(() => "Unknown");
    console.log(`💰 当前积分：${userCredits}`);

    await page.waitForSelector("button", { timeout: 30000 });
    const rollNowClicked = await page.$$eval("button", (buttons) => {
      const target = buttons.find(
        (btn) => btn.innerText && btn.innerText.includes("Roll now")
      );
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (rollNowClicked) {
      console.log("✅ 点击了“Roll now”按钮！");
    }
    await delay(5000);

    const letsRollClicked = await page.$$eval("button", (buttons) => {
      const target = buttons.find(
        (btn) => btn.innerText && btn.innerText.includes("Let's roll")
      );
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (letsRollClicked) {
      console.log("✅ 点击了“Let's roll”按钮！");
      await delay(5000);
      const throwDiceClicked = await page.$$eval("button", (buttons) => {
        const target = buttons.find(
          (btn) => btn.innerText && btn.innerText.includes("Throw Dice")
        );
        if (target) {
          target.click();
          return true;
        }
        return false;
      });

      if (throwDiceClicked) {
        console.log("✅ 点击了“Throw Dice”按钮！");
        console.log("⏳ 等待60秒骰子动画...");
        await delay(60000);
        userCredits = await page
          .$eval("#creditBalance", (el) => el.innerText)
          .catch(() => "Unknown");
        console.log(`💰 更新后的积分： ${userCredits}`);
        maxDelayTime = "24:00:00";
      } else {
        console.log("⚠️ 未找到“Throw Dice”按钮。");
      }
    } else {
      console.log("👇 等待！ROLL尚不可用。 ");
      const timerText = await page.evaluate(() => {
        const h2Elements = Array.from(document.querySelectorAll("h2"));
        for (let h2 of h2Elements) {
          const text = h2.innerText.trim();
          if (/^\d{2}:\d{2}:\d{2}$/.test(text)) {
            return text;
          }
        }
        return null;
      });

      if (timerText) {
        console.log(`⏱ 距离下一次ROLL的剩余时间：${timerText}`);
        if (maxDelayTime < timerText) {
          maxDelayTime = timerText;
        }
      } else {
        console.log("⚠️ 未找到计时器。使用默认休眠时间。");
      }
    }
    await browser.close();

    console.log(`🔄 完成.`);
  } catch (error) {
    console.error("❌ 错误:", error);
  }
};

const main = async () => {
  console.log("🚀 启动机器人..");
  const limit = plimit(1);
  const cookies = JSON.parse(fs.readFileSync("cookies.json"));
  const tasks = cookies.map((item) => {
    return limit(async () => {
      await index(item);
    });
  });
  await Promise.all(tasks);
  const extraDelay = RANDOM_EXTRA_DELAY();
  const total = totalMs(maxDelayTime);
  const time = total + extraDelay;
  console.log(
    `本轮所有认为已全部结束，当前时间${new Date()}，下轮时间：${showTime(time)}`
  );
  await delay(time);
  main();
};
main();
