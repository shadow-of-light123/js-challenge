function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// async/await版
async function trafficLight() {
  while (true) {
    console.log('🔴 红灯')
    await sleep(1000)
    console.log('🟡 黄灯')
    await sleep(1000)
    console.log('🟢 绿灯')
    await sleep(1000)
  }
}

// promise.then版
function trafficLightV2() {
  const light = (color, ms) => () => {
    console.log(color)
    return sleep(ms)
  }

  Promise.resolve()
    .then(light('🔴 红灯', 1000))
    .then(light('🟢 绿灯', 1000))
    .then(light('🟡 黄灯', 1000))
    .then(trafficLightV2) // 递归循环
}

trafficLight()
