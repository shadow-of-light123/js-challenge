// function getRandomMoney(money, size) {
//   if (typeof money !== "number" || typeof size !== "number")
//     throw new Error("请输入正确的数字");
//   if (money < 0.01 * size) throw new Error(`红包金额太小，无法分${size}份`);
//   let afterMoney = money;
//   const res = [];
//   for (let i = 0; i < size - 1; i++) {
//     let redCount = afterMoney * Math.random();
//     while (redCount > afterMoney * 0.7) {
//       redCount = afterMoney * Math.random();
//     }
//     if (redCount < 0.01) redCount = 0.01;
//     afterMoney -= redCount;
//     res.push(parseFloat(redCount.toFixed(2)));
//   }

//   if (afterMoney > money * 0.7) {
//     let more = afterMoney - money * 0.7;
//     afterMoney = afterMoney - more;
//     let low = Infinity;
//     for (let i of res) {
//       low = Math.min(low, i);
//     }
//     const index = res.indexOf(low);
//     res[index] = low + more;
//   }
//   res.push(parseFloat(afterMoney.toFixed(2)));
//   return res;
// }

// console.log(getRandomMoney(1000, 100));

/**
 * 分红包算法 —— 二倍均值法
 *
 * 核心思路：
 *   每次从剩余金额中随机取一个值，范围是 [0.01, 剩余均值 × 2]
 *   这样能保证每个人分到的金额相对均匀，不会出现某个人拿走大头的情况
 *
 * 举例：100元分5人
 *   第1人：随机范围 [0.01, 100/5×2] = [0.01, 40]
 *   假设拿到 20，剩余 80
 *   第2人：随机范围 [0.01, 80/4×2]  = [0.01, 40]
 *   假设拿到 15，剩余 65
 *   ...以此类推，最后一人直接拿剩余
 *
 * @param {number} money - 总金额（元）
 * @param {number} size  - 红包份数
 * @returns {number[]}   - 每份红包的金额数组
 */
function getRandomMoney(money, size) {
  // ====== 参数校验 ======
  if (typeof money !== "number" || typeof size !== "number") {
    throw new Error("金额和份数必须是数字");
  }
  if (size <= 0 || !Number.isInteger(size)) {
    throw new Error("份数必须是正整数");
  }
  if (money < 0.01 * size) {
    throw new Error(
      `总金额 ${money} 元太小，无法分给 ${size} 人（每人至少 0.01 元）`,
    );
  }

  // ====== 核心逻辑 ======
  const res = []; // 存放每份红包金额
  let remain = money; // 剩余待分配金额

  for (let i = 0; i < size - 1; i++) {
    // 剩余人数 = size - i
    // 二倍均值 = 剩余金额 / 剩余人数 × 2
    // 随机范围：[0, 二倍均值]
    const avg = (remain / (size - i)) * 2;
    let redPacket = Math.random() * avg;

    // 兜底：每人至少 0.01 元
    if (redPacket < 0.01) redPacket = 0.01;

    // 保留两位小数（金额精度）
    redPacket = parseFloat(redPacket.toFixed(2));

    res.push(redPacket);
    remain -= redPacket;
  }

  // 最后一人直接拿剩余（保证总金额精确，不会出现 0.01 的误差）
  res.push(parseFloat(remain.toFixed(2)));

  return res;
}

// ====== 测试 ======
const result = getRandomMoney(1000, 100);
console.log("每份金额：", result);
console.log("总金额：", result.reduce((a, b) => a + b, 0).toFixed(2));
console.log("最大值：", Math.max(...result).toFixed(2));
console.log("最小值：", Math.min(...result).toFixed(2));
