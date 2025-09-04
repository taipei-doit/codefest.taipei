<script setup lang="ts">
import type { Activity } from '~/interfaces/activity.interface';
import type { HistoryActivity, HistoryNavigation } from '~/interfaces/history-activity.interface';

const { tm } = useI18n();

const _activities = computed<Activity[]>(() => {
  const data = tm('index.activities');
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});
type ActivityKeys = string;

const router = useRouter();
const isLeftPanelActive = ref(true);
const isF1Pressed = ref(false);

// ✅ 直接從 `i18n.global.messages` 讀取 JSON
const navigation = ref<HistoryNavigation[]>(
  Array.isArray(tm('history.navigation')) ? tm('history.navigation') : []
);

const selectedType = ref<ActivityKeys>(tm('history.navigation')[0].type as ActivityKeys);
const selectedActivities = ref<HistoryActivity[]>([]);

watch(
  selectedType,
  (newType: ActivityKeys) => {
    const activitiesData = tm('history.activities') as Record<string, HistoryActivity[]>;
    selectedActivities.value =
      activitiesData[newType]?.filter((item: HistoryActivity) => item.available) || [];
  },
  { immediate: true }
);

// 通用方法：選擇主選單項目
const selectNavigationItem = (index: number) => {
  navigation.value.forEach((item: HistoryNavigation, idx: number) => {
    item.current = idx === index;
  });
  isLeftPanelActive.value = true;
  selectedType.value = navigation.value[index].type as ActivityKeys;
  resetActivities();

  // 🚀 滾動到選中的元素
  nextTick(() => {
    const activeElement = document.querySelector('.active-item');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
};

// 通用方法：選擇活動項目
const selectActivity = (index: number) => {
  isLeftPanelActive.value = false;
  selectedActivities.value = selectedActivities.value.map((item: HistoryActivity, idx: number) => ({
    ...item,
    isSelected: idx === index,
  }));

  // 🚀 滾動到選中的元素
  nextTick(() => {
    const activeElement = document.querySelector('.active-sub-item');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
};

// 重置所有活動選中狀態
const resetActivities = () => {
  selectedActivities.value = selectedActivities.value.map((item: HistoryActivity) => ({
    ...item,
    isSelected: false,
  }));
};

const handleKeydown = (e: KeyboardEvent) => {
  const activities = selectedActivities.value;
  const currentNavIdx = navigation.value.findIndex((item: HistoryNavigation) => item.current);
  const currentActivityIdx = activities.findIndex((item: HistoryActivity) => item.isSelected);

  switch (e.key) {
    case 'ArrowUp':
      if (isLeftPanelActive.value) {
        if (currentNavIdx > 0) {
          selectNavigationItem(currentNavIdx - 1);
        }
      } else {
        if (currentActivityIdx > 0) {
          selectActivity(currentActivityIdx - 1);
        }
      }
      break;
    case 'ArrowDown':
      if (isLeftPanelActive.value) {
        if (currentNavIdx < navigation.value.length - 1) {
          selectNavigationItem(currentNavIdx + 1);
        }
      } else {
        if (currentActivityIdx < activities.length - 1) {
          selectActivity(currentActivityIdx + 1);
        }
      }
      break;
    case 'ArrowRight':
      if (isLeftPanelActive.value) {
        selectActivity(0); // 預設選中第一項活動
      }
      break;
    case 'ArrowLeft':
      isLeftPanelActive.value = true;
      resetActivities();
      break;
    case 'Enter':
      if (currentActivityIdx !== -1) {
        const selectedActivity = activities[currentActivityIdx];
        if (selectedActivity.available) {
          window.open(selectedActivity.link, '_blank');
        }
      }
      break;
    case 'F1':
      e.preventDefault();
      isF1Pressed.value = !isF1Pressed.value;
      break;
    case 'Backspace':
      e.preventDefault();
      router.push('/');
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <section
    id="history-section"
    :class="[
      isF1Pressed ? 'scanlines' : '',
      'md:h-screen md:overflow-hidden bg-primary-400 flex flex-col',
    ]"
  >
    <header
      class="relative bg-primary-700 p-4 text-white flex justify-center items-center md:text-4xl text-2xl font-fusion-pixel"
    >
      <router-link to="/" class="absolute left-4 top-1/2 -translate-y-1/2">
        <img src="@/assets/images/icons/left-arrow-svgrepo-com.svg" width="30" alt="" />
      </router-link>
      歷年回顧
    </header>
    <div class="grid md:grid-cols-5 grid-cols-1 flex-1">
      <div class="col-span-1 md:my-2 md:ml-1 m-2 border border-primary-50 flex flex-col">
        <div class="m-1 flex flex-1 border border-primary-50">
          <nav class="flex flex-1 flex-col bg-primary-800 md:py-12 py-6">
            <div class="flex flex-1 flex-col gap-y-7">
              <p
                class="md:text-5xl text-4xl font-px437 text-white pb-7 border-b border-primary-50 px-2 md:text-left text-center"
              >
                TYPE
              </p>
              <ul role="list" class="max-h-[400px] overflow-y-auto">
                <li
                  v-for="(item, index) in navigation"
                  :key="item.name"
                  class="font-fusion-pixel px-2"
                >
                  <button
                    :class="[
                      item.current
                        ? 'bg-primary-50 text-primary-850 active-item'
                        : 'text-primary-50',
                      'group flex gap-x-3 md:px-2 py-5 text-2xl w-full justify-center',
                    ]"
                    @click="selectNavigationItem(index)"
                  >
                    {{ item.name }}
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <div class="col-span-4 md:my-2 md:mx-1 m-2 border border-primary-50 flex flex-col">
        <div class="m-1 flex flex-1 border border-primary-50">
          <div class="md:py-12 py-6 flex-1 bg-primary-800">
            <p
              class="md:text-5xl text-4xl font-fusion-pixel tracking-widest text-white pb-7 border-b border-primary-50 md:px-12 px-6 md:text-left text-center"
            >
              {{ navigation.find(item => item.current)?.name }}&nbsp;歷年精華
            </p>
            <div class="md:px-12 px-6">
              <p class="my-6 font-px437 text-white md:text-4xl text-2xl">please select......</p>
              <ul
                class="text-white md:text-4xl text-2xl font-fusion-pixel max-h-[400px] overflow-y-auto"
              >
                <li
                  v-for="(activity, index) in selectedActivities"
                  :key="index"
                  class="flex items-center"
                >
                  <img
                    src="@/assets/images/icons/white-right-arrow-svgrepo-com.svg"
                    width="20"
                    alt="right-arrow"
                    :class="[activity.isSelected ? 'opacity-100' : 'opacity-0', 'mr-4']"
                  />
                  <a
                    :href="activity.link"
                    target="_blank"
                    :class="[
                      activity.isSelected
                        ? 'bg-primary-50 text-primary-850 active-item active-sub-item'
                        : '',
                      'flex items-center flex-1 md:px-2 py-5',
                    ]"
                    @click="selectActivity(index)"
                  >
                    <p>{{ activity.name }}</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md:block hidden border border-primary-50 md:mx-1 mx-2 mb-2">
      <div class="m-1 flex flex-1 border border-primary-50">
        <div class="p-3 text-xl grid md:grid-cols-4 grid-cols-1 flex-1">
          <!-- <p class="text-white font-fusion-pixel">Task Manager：\ ></p> -->
          <p class="text-white font-fusion-pixel">⭠⭡⭢⭣：Select Item</p>
          <p class="text-white font-fusion-pixel">Enter：Open Link</p>
          <p class="text-white font-fusion-pixel">F1：Open Scanlines</p>
          <p class="text-white font-fusion-pixel">⌫：Back</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="postcss">
/* @import '@/assets/retro-effect.scss'; */

.active-item {
  position: relative;
  box-shadow: 2px 2px 0px black;
}

.active-item::after {
  content: '';
  position: absolute;
  top: 3px; /* 內縮 3px，讓點點遠離邊緣 */
  left: 3px;
  right: 3px;
  bottom: 3px;
  border: 2px dotted theme('colors.primary.850'); /* 點狀邊框 */
  pointer-events: none; /* 避免影響點擊 */
}

.nav-bg-border {
  position: relative;
}

.nav-bg-border::after {
  content: '';
  position: absolute;
  left: -0.5rem;
  bottom: 0;
  width: 100%;
  height: 10px; /* 控制底線高度 */
  background-image: url('@/assets/images/line_A.svg');
  background-repeat: repeat-x;
}

.activity-bg-border {
  position: relative;
}

.activity-bg-border::after {
  content: '';
  position: absolute;
  left: -3rem;
  bottom: 0;
  width: 100%;
  height: 10px; /* 控制底線高度 */
  background-image: url('@/assets/images/line_B.svg');
  background-repeat: repeat-x;

  @media (max-width: 767px) {
    left: -1.5rem;
  }
}
</style>
