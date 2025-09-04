<script setup lang="ts">
import type { Activity } from '@/interfaces/activity.interface';

const { t, tm } = useI18n();

const activities = computed<Activity[]>(() => {
  const data = tm('index.activities');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
</script>

<template>
  <main class="wrapper grid md:grid-cols-5 grid-cols-1 relative overflow-hidden">
    <section class="col-span-2 left-container flex items-center justify-center z-10">
      <div class="flex justify-center items-center w-[60px] h-[60px] absolute top-8 left-8">
        <img src="@/assets/images/icons/taipeicode_logo.svg" alt="" />
      </div>
      <img
        src="@/assets/images/computer.gif"
        class="md:mt-24 mt-10 md:max-w-full sm:max-w-[26%] max-w-[50%]"
        alt=""
      />
    </section>
    <section class="col-span-3 md:p-24 p-5 z-10 flex items-center">
      <div class="flex-1">
        <div>
          <div class="flex items-center md:justify-start justify-center mb-8">
            <div id="typing-effect" class="typing-container md:text-left text-center">
              <span class="inline font-fusion-pixel tracking-[.2em] text-5xl text-[#D9FE68]"
                >ARE YOU READY?</span
              >
            </div>
          </div>
          <div class="text-white font-sans font-bold tracking-wider mb-12">
            <p class="mb-4 md:text-4xl md:text-left text-xl font-fusion-pixel text-center">
              {{ t('index.title') }}
            </p>
            <div class="max-w-[400px] md:mx-0 mx-auto max-h-[400px] overflow-y-auto pr-4">
              <a
                v-for="(item, index) in activities"
                :key="index"
                :href="item.link"
                target="_blank"
                class="mb-4 flex items-center"
                :class="!item.link ? 'cursor-default' : 'cursor-pointer hover:text-primary-100'"
              >
                <img :src="`images/icons/${item.icon_type}.png`" width="40" class="mr-4" alt="" />
                <div class="flex-1 flex justify-between border-b border-white py-3 text-[20px]">
                  <span class="font-fusion-pixel">{{ item.name }}</span>
                  <span class="font-px437">{{ item.date }}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <router-link
      to="/history"
      class="absolute md:bottom-8 bottom-3 md:right-8 right-3 text-center text-white z-10"
    >
      <img src="@/assets/images/folder.png" class="md:w-[80px] w-[50px] mx-auto" alt="" />
      <p class="mt-2 font-fusion-pixel">歷年回顧</p>
    </router-link>
    <img src="@/assets/images/pixel.gif" class="absolute top-6 left-4 scale-[1.3] z-0" alt="" />
  </main>
</template>

<style scoped lang="postcss">
.wrapper {
  @apply h-screen bg-gradient-to-b from-primary-500 to-primary-600;
}

.left-container {
  background-image:
    url(@/assets/images/left-bg.png),
    linear-gradient(to bottom, theme('colors.primary.500'), theme('colors.primary.600'));
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
  background-blend-mode: luminosity; /* 定義混合模式 */

  /* background-position: bottom, bottom; */
}

.typing-container {
  display: inline-block; /* 保持游標跟隨文字 */
  white-space: pre-wrap; /* 支援換行 */
  word-wrap: break-word; /* 響應式適應容器寬度 */
  font-size: 20px; /* 文字大小 */

  &::after {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1.6em;
    background-color: #d9fe68;
    animation: blink 1s steps(1) infinite;
  }
}

/* 定義閃爍動畫 */
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
