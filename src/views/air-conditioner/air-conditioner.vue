<template>
  <div class="air-conditioner">
    <!-- 主要内容区域 -->
    <div class="air-conditioner__content">
      <!-- MQTT连接状态显示 -->
      <div class="mqtt-status">
        <i
          :class="[
            'fa',
            'status-icon',
            { 'fa-check-circle': isMqttConnected, 'fa-exclamation-circle': !isMqttConnected }
          ]"
        ></i>
        <span :class="{ connected: isMqttConnected, disconnected: !isMqttConnected }">{{
          isMqttConnected ? "已连接" : "未连接"
        }}</span>
      </div>

      <!-- 运行时间 -->
      <!-- 定时倒计时显示，通过样式控制可见性 -->
      <div
        :style="{ opacity: isTimerSet ? 1 : 0, height: isTimerSet ? 'auto' : '0', overflow: 'hidden' }"
        class="run-time"
      >
        <i class="fa fa-clock-o"></i>
        <span class="countdown">{{ countdownDisplay }}</span>
      </div>

      <!-- 温度显示 -->
      <div class="temperature-display">
        <span class="temperature">{{ temperature }}</span>
        <span class="unit">°C</span>
      </div>

      <!-- 模式显示 -->
      <div class="mode-display">
        <i :class="['fa', modeIcon]"></i>
        {{ modeText }}
      </div>

      <!-- 风向指示 -->
      <div class="wind-direction-indicators">
        <div class="indicator-item">
          <i class="fa fa-refresh"></i>
          <span>自动风</span>
        </div>
        <div class="indicator-item">
          <i class="fa fa-exchange"></i>
          <span>上下风向</span>
        </div>
        <div class="indicator-item">
          <i class="fa fa-arrows-h"></i>
          <span>左右风向</span>
        </div>
      </div>

      <!-- 控制按钮网格 -->
      <div class="control-buttons">
        <!-- 第一行 -->
        <button class="control-btn" @click="decreaseTemperature">
          <i class="fa fa-minus"></i>
        </button>
        <button class="control-btn power-btn" @click="togglePower">
          <i class="fa fa-power-off" :class="{ active: isPowerOn }"></i>
        </button>
        <button class="control-btn" @click="increaseTemperature">
          <i class="fa fa-plus"></i>
        </button>

        <!-- 第二行 -->
        <button class="control-btn" @click="toggleSleepMode">
          <i class="fa fa-moon-o" :class="{ active: isSleepMode }"></i>
          <span>睡眠</span>
        </button>
        <button class="control-btn" @click="setCoolMode">
          <i class="fa fa-snowflake-o" :class="{ active: mode === 'cool' }"></i>
          <span>制冷</span>
        </button>
        <button class="control-btn" @click="setHeatMode">
          <i class="fa fa-sun-o" :class="{ active: mode === 'heat' }"></i>
          <span>制热</span>
        </button>

        <!-- 第三行 -->
        <button class="control-btn" @click="isTimerSet ? cancelTimer() : openTimerDialog()">
          <i class="fa fa-clock-o" :class="{ active: isTimerSet }"></i>
          <span>{{ isTimerSet ? "取消定时" : "定时" }}</span>
        </button>
        <button class="control-btn" @click="changeWindSpeed">
          <i class="fa fa-tachometer"></i>
          <span>风速</span>
        </button>
        <button class="control-btn" @click="toggleSwing">
          <i class="fa fa-arrows-v" :class="{ active: isSwingEnabled }"></i>
          <span>摆风</span>
        </button>
      </div>

      <!-- 特殊功能按钮 -->
      <div class="special-buttons">
        <button class="special-btn full-width-btn" @click="openGoodEveningDialog">
          <i class="fa fa-moon-o"></i>
          <span>晚安</span>
        </button>
        <button class="special-btn full-width-btn" @click="handleGoodMorning">
          <i class="fa fa-sun-o"></i>
          <span>早安</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 定时弹出层 -->
  <div v-if="isTimerDialogVisible" class="timer-dialog-overlay">
    <div class="timer-dialog">
      <h3>设置定时时间</h3>

      <div class="timer-display">
        <span class="timer-hours">{{ timerHours.toString().padStart(2, "0") }}</span>
        <span class="timer-separator">:</span>
        <span class="timer-minutes">{{ timerMinutes.toString().padStart(2, "0") }}</span>
      </div>

      <div class="timer-controls">
        <button class="timer-btn" @click="decreaseTimer">
          <i class="fa fa-minus"></i>
        </button>
        <button class="timer-btn" @click="increaseTimer">
          <i class="fa fa-plus"></i>
        </button>
      </div>

      <div class="timer-confirm">
        <button class="confirm-btn" @click="confirmTimer">确认</button>
        <button class="cancel-btn" @click="closeTimerDialog">取消</button>
      </div>
    </div>
  </div>

  <!-- 晚安模式弹出层 -->
  <div v-if="isGoodEveningDialogVisible" class="timer-dialog-overlay">
    <div class="timer-dialog">
      <h3>设置晚安模式</h3>

      <div class="good-evening-section">
        <h4>开启时长</h4>
        <div class="timer-display">
          <span class="timer-hours">{{ eveningOnHours.toString().padStart(2, "0") }}</span>
          <span class="timer-separator">:</span>
          <span class="timer-minutes">{{ eveningOnMinutes.toString().padStart(2, "0") }}</span>
        </div>
        <div class="timer-controls">
          <button class="timer-btn" @click="decreaseEveningOnTime">
            <i class="fa fa-minus"></i>
          </button>
          <button class="timer-btn" @click="increaseEveningOnTime">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="good-evening-section">
        <h4>关闭时长</h4>
        <div class="timer-display">
          <span class="timer-hours">{{ eveningOffHours.toString().padStart(2, "0") }}</span>
          <span class="timer-separator">:</span>
          <span class="timer-minutes">{{ eveningOffMinutes.toString().padStart(2, "0") }}</span>
        </div>
        <div class="timer-controls">
          <button class="timer-btn" @click="decreaseEveningOffTime">
            <i class="fa fa-minus"></i>
          </button>
          <button class="timer-btn" @click="increaseEveningOffTime">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="timer-confirm">
        <button class="confirm-btn" @click="confirmGoodEvening">确认</button>
        <button class="cancel-btn" @click="closeGoodEveningDialog">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import webViewBridge from "@/utils/android/utils/webViewBridge";

// 创建音频上下文
let audioContext: AudioContext;
try {
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
} catch (error) {
  console.error("Web Audio API is not supported in this browser:", error);
}

// 播放点击音效函数
const playClickSound = () => {
  if (!audioContext) return;

  // 检查音频上下文是否已暂停（iOS和一些浏览器需要用户交互后才能播放音频）
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // 设置音频参数
  oscillator.frequency.value = 350; // 频率（Hz）
  oscillator.type = "sine"; // 波形类型

  // 设置音量变化
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  // 播放音频
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

// 状态管理
const isPowerOn = ref(true);
const temperature = ref(26);
const isMqttConnected = ref(false); // MQTT连接状态
const mode = ref<"cool" | "heat" | "fan" | "dry" | "auto">("cool");
const isSleepMode = ref(false);
const windSpeed = ref<"low" | "medium" | "high" | "auto">("auto");
const isSwingEnabled = ref(false);

// 定时相关状态
const isTimerDialogVisible = ref(false);
const timerHours = ref(1);
const timerMinutes = ref(0);
const isTimerSet = ref(false);
const timerDisplay = ref("");
// 倒计时相关状态
const countdownSeconds = ref(0);
const countdownDisplay = ref("");
let countdownInterval: number | null = null;

// 晚安模式相关状态
const isGoodEveningDialogVisible = ref(false);
const eveningOnHours = ref(1);
const eveningOnMinutes = ref(0);
const eveningOffHours = ref(2);
const eveningOffMinutes = ref(0);

// 计算属性
// 模式文本计算属性
const modeText = computed(() => {
  const modeMap = {
    cool: "制冷模式",
    heat: "制热模式",
    fan: "送风模式",
    dry: "除湿模式",
    auto: "自动模式"
  };
  return modeMap[mode.value];
});

// 模式图标计算属性
const modeIcon = computed(() => {
  const iconMap = {
    cool: "fa-snowflake-o",
    heat: "fa-sun-o",
    fan: "fa-wind",
    dry: "fa-tint",
    auto: "fa-refresh"
  };
  return iconMap[mode.value];
});

// 方法
const togglePower = () => {
  playClickSound();
  isPowerOn.value = !isPowerOn.value;
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/togglePower");
};

const increaseTemperature = () => {
  playClickSound();
  if (temperature.value < 30) {
    temperature.value++;
  }
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/increaseTemperature");
};

const decreaseTemperature = () => {
  playClickSound();
  if (temperature.value > 16) {
    temperature.value--;
  }
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/decreaseTemperature");
};

const toggleSleepMode = () => {
  playClickSound();
  isSleepMode.value = !isSleepMode.value;
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/toggleSleepMode");
};

// 直接设置制冷模式
const setCoolMode = () => {
  playClickSound();
  mode.value = "cool";
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/setCoolingMode");
};

// 直接设置制热模式
const setHeatMode = () => {
  playClickSound();
  mode.value = "heat";
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/setHeatingMode");
};

const changeWindSpeed = () => {
  playClickSound();
  const speeds: Array<"low" | "medium" | "high" | "auto"> = ["low", "medium", "high", "auto"];
  const currentIndex = speeds.indexOf(windSpeed.value);
  windSpeed.value = speeds[(currentIndex + 1) % speeds.length];
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/toggleWindSpeed");
};

const toggleSwing = () => {
  playClickSound();
  isSwingEnabled.value = !isSwingEnabled.value;
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/toggleSwing");
};

// 打开定时弹出层
const openTimerDialog = () => {
  playClickSound();
  isTimerDialogVisible.value = true;
};

// 取消定时
const cancelTimer = () => {
  playClickSound();
  isTimerSet.value = false;
  timerDisplay.value = "";
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/cancelTiming");
};

// 增加定时时间（1小时）
const increaseTimer = () => {
  playClickSound();
  timerHours.value += 1;
  // 限制最大定时时间为9小时
  if (timerHours.value > 9) {
    timerHours.value = 9;
  }
  // 确保分钟为0
  timerMinutes.value = 0;
};

// 减少定时时间（1小时）
const decreaseTimer = () => {
  playClickSound();
  // 限制最小定时时间为1小时
  if (timerHours.value <= 1) {
    return; // 不允许设置小于1小时的时间
  }

  timerHours.value -= 1;
  // 确保分钟为0
  timerMinutes.value = 0;
};

// 确认定时
const confirmTimer = () => {
  playClickSound();
  isTimerSet.value = true;

  // 发送指令到Android端
  webViewBridge.send("bedroomAC/setTiming", {
    hours: timerHours.value
  });
  const formattedHours = timerHours.value.toString().padStart(2, "0");
  const formattedMinutes = timerMinutes.value.toString().padStart(2, "0");
  timerDisplay.value = `${formattedHours}:${formattedMinutes}`;

  // 计算总秒数
  countdownSeconds.value = timerHours.value * 3600 + timerMinutes.value * 60;

  // 启动倒计时
  startCountdown();

  isTimerDialogVisible.value = false;
};

// 关闭定时弹出层
const closeTimerDialog = () => {
  playClickSound();
  isTimerDialogVisible.value = false;
};

// 打开晚安模式弹出层
const openGoodEveningDialog = () => {
  playClickSound();
  isGoodEveningDialogVisible.value = true;
};

// 关闭晚安模式弹出层
const closeGoodEveningDialog = () => {
  playClickSound();
  isGoodEveningDialogVisible.value = false;
};

// 增加晚安开启时间
const increaseEveningOnTime = () => {
  playClickSound();
  eveningOnMinutes.value += 30;
  if (eveningOnMinutes.value >= 60) {
    eveningOnHours.value += Math.floor(eveningOnMinutes.value / 60);
    eveningOnMinutes.value = eveningOnMinutes.value % 60;
  }
  if (eveningOnHours.value >= 24) {
    eveningOnHours.value = 23;
    eveningOnMinutes.value = 30;
  }
};

// 减少晚安开启时间
const decreaseEveningOnTime = () => {
  playClickSound();
  if (eveningOnMinutes.value === 0) {
    if (eveningOnHours.value === 0) return;
    eveningOnHours.value -= 1;
    eveningOnMinutes.value = 30;
  } else {
    eveningOnMinutes.value -= 30;
  }
};

// 增加晚安关闭时间
const increaseEveningOffTime = () => {
  playClickSound();
  eveningOffMinutes.value += 30;
  if (eveningOffMinutes.value >= 60) {
    eveningOffHours.value += Math.floor(eveningOffMinutes.value / 60);
    eveningOffMinutes.value = eveningOffMinutes.value % 60;
  }
  if (eveningOffHours.value >= 24) {
    eveningOffHours.value = 23;
    eveningOffMinutes.value = 30;
  }
};

// 减少晚安关闭时间
const decreaseEveningOffTime = () => {
  playClickSound();
  if (eveningOffMinutes.value === 0) {
    if (eveningOffHours.value === 0) return;
    eveningOffHours.value -= 1;
    eveningOffMinutes.value = 30;
  } else {
    eveningOffMinutes.value -= 30;
  }
};

// 确认晚安模式设置
const confirmGoodEvening = () => {
  playClickSound();
  // 计算总分钟数
  const openMinute = eveningOnHours.value * 60 + eveningOnMinutes.value;
  const closeMinute = eveningOffHours.value * 60 + eveningOffMinutes.value;

  // 发送指令到Android端
  webViewBridge.send("bedroomAC/goodEvening", {
    openMinute: openMinute,
    closeMinute: closeMinute
  });

  isGoodEveningDialogVisible.value = false;
};

// 处理早安按钮点击
const handleGoodMorning = () => {
  playClickSound();
  // 发送指令到Android端
  webViewBridge.send("bedroomAC/goodMorning");
};

// 定义组件名称
defineOptions({
  name: "air-conditioner"
});

// 启动倒计时
const startCountdown = () => {
  // 清除可能存在的计时器
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // 更新初始显示
  updateCountdownDisplay();

  // 设置新的计时器
  countdownInterval = setInterval(() => {
    if (countdownSeconds.value > 0) {
      countdownSeconds.value--;
      updateCountdownDisplay();
    } else {
      // 倒计时结束
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      // 自动变为未定时状态
      isTimerSet.value = false;
      timerDisplay.value = "";
      console.log("定时结束");
    }
  }, 1000) as unknown as number;
};

// 更新倒计时显示
const updateCountdownDisplay = () => {
  const hours = Math.floor(countdownSeconds.value / 3600);
  const minutes = Math.floor((countdownSeconds.value % 3600) / 60);
  const seconds = countdownSeconds.value % 60;

  countdownDisplay.value = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// 监听定时状态变化
watch(isTimerSet, (newVal) => {
  if (newVal && timerDisplay.value) {
    console.log(`已设置定时时间: ${timerDisplay.value}`);
  }
});

// MQTT状态变化回调函数
const handleMqttStateChange = (isConnected) => {
  alert(isConnected);
  isMqttConnected.value = isConnected;
};

// 组件挂载时监听MQTT状态变化并获取初始状态
onMounted(() => {
  // 监听MQTT连接状态变化事件
  webViewBridge.globalChannel.on("mqttStateChange", handleMqttStateChange);

  // 初始进入页面时获取一次MQTT状态
  webViewBridge
    .invoke("bedroomAC/getMQTTState")
    .then((state) => {
      isMqttConnected.value = state;
    })
    .catch((error) => {
      console.error("获取MQTT状态失败:", error);
    });
});

// 组件卸载时清除计时器和事件监听
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  // 移除MQTT状态变化监听
  webViewBridge.globalChannel.off("mqttStateChange", handleMqttStateChange);
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/variable.scss";

.air-conditioner {
  height: 100vh;
  background-color: $background-color;
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1;
    padding: 16px 20px 20px 20px; // 顶部内边距16px，替代移除的头部空间
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative; // 为MQTT状态显示提供定位基准

    // MQTT连接状态样式
    .mqtt-status {
      position: absolute;
      top: 16px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: $font-size-small;
      padding: 4px 8px;
      border-radius: 12px;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 10;

      .status-icon {
        font-size: 14px;
        margin-right: 3px;
      }

      .connected {
        color: #4cd964; // 绿色表示连接
      }

      .disconnected {
        color: #ff3b30; // 红色表示断开连接
      }
    }

    .run-time {
      font-size: $font-size-small;
      color: $theme-color; // 定时模式下使用主题色
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      align-self: flex-start; // 居左显示
      position: relative;
      font-weight: 500;

      i {
        margin-right: 4px;
        color: $theme-color;
      }

      .countdown {
        font-family: "Courier New", monospace;
      }

      .timer-indicator {
        position: absolute;
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: $theme-color;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 2px 6px;
        border-radius: 10px;
      }
    }

    .temperature-display {
      margin-bottom: 10px;
      display: flex;
      align-items: center;

      .temperature {
        font-size: 60px;
        color: $font-color-dd;
        font-weight: 300;
        position: relative;
      }

      .unit {
        font-size: 30px;
        color: $font-color-dd;
        margin-left: 4px;
        position: relative;
        top: -10px;
      }
    }

    .mode-display {
      font-size: $font-size-medium;
      color: $font-color-d;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center; // 居中对齐

      i {
        margin-right: 4px;
        color: $theme-color;
      }
    }

    .wind-direction-indicators {
      display: flex;
      justify-content: space-around;
      width: 100%;
      margin-bottom: 40px;

      .indicator-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        i {
          font-size: 24px;
          color: $font-color-d;
          margin-bottom: 8px;
        }

        span {
          font-size: $font-size-small;
          color: $font-color;
        }
      }
    }

    .control-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      width: 100%;
      margin-bottom: 10px;

      .control-btn {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 1px solid $border-color-m;
        background-color: $background-color;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;

        &:active {
          background-color: $touch-color;
        }

        i {
          font-size: 24px;
          color: $font-color-d;
          margin-bottom: 4px;

          &.active {
            color: $theme-color;
          }
        }

        span {
          font-size: $font-size-small;
          color: $font-color;
        }
      }

      .power-btn {
        i {
          color: #ff4500;
        }
      }
    }

    // 特殊功能按钮样式
    .special-buttons {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      width: 100%;

      .special-btn {
        padding: 10px 20px;
        border-radius: 30px;
        border: 2px solid $theme-color;
        background-color: $background-color;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;

        &:active {
          background-color: $theme-color;
        }

        i {
          font-size: 24px;
          color: $theme-color;
          margin-bottom: 8px;
        }

        span {
          font-size: $font-size-medium;
          color: $theme-color;
          font-weight: 500;
        }

        &:active {
          i,
          span {
            color: white;
          }
        }
      }

      .full-width-btn {
        flex-grow: 1;
        padding: 10px 0;
        margin: 10px 0;
        border-radius: 10px;

        &:last-child {
          margin-left: 20px;
        }
      }
    }

    .bottom-tip {
      font-size: $font-size-small;
      color: $font-color;
      text-align: center;

      .tip-link {
        color: $theme-color;
        background: none;
        border: none;
        padding: 0;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}

/* 定时弹出层样式 */
.timer-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.timer-dialog {
  background-color: white;
  border-radius: 20px 20px 0 0;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.timer-dialog h3 {
  color: $font-color;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 600;
}

.timer-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: $theme-color;
  margin-bottom: 40px;
}

.timer-hours,
.timer-minutes {
  min-width: 60px;
}

.timer-separator {
  margin: 0 10px;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.timer-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: $background-color;
  border: none;
  color: $font-color;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-btn:hover {
  background-color: $theme-color;
  color: white;
}

.timer-confirm {
  display: flex;
  gap: 20px;
}

.confirm-btn,
.cancel-btn {
  flex: 1;
  padding: 15px;
  border-radius: 30px;
  border: none;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn {
  background-color: $theme-color;
  color: white;
}

.confirm-btn:hover {
  background-color: darken($theme-color, 10%);
}

.cancel-btn {
  background-color: $background-color;
  color: $font-color;
}

.cancel-btn:hover {
  background-color: lighten($background-color, 10%);
}

// 晚安模式部分样式
.good-evening-section {
  margin-bottom: 30px;

  h4 {
    color: $font-color-d;
    font-size: $font-size-medium;
    margin-bottom: 15px;
    text-align: center;
    font-weight: 500;
  }
}
</style>
