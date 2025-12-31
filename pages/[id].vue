<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import type { PastPhoto, PastWinningTeam } from '~/interfaces/past.interface';
import type { Sponsor } from '~/interfaces/sponsor.interface';

const runtimeConfig = useRuntimeConfig();
const { tm } = useI18n();

const dialogStore = useDialogStore();
const { activeDialog } = storeToRefs(dialogStore);

const route = useRoute();
const id = route.params.id;

const router = useRouter();

const bannerHeight = ref('100vh');

const calculateBannerHeight = () => {
  const header = document.querySelector('header');
  if (header) {
    const headerRect = header.getBoundingClientRect();
    const availableHeight = window.innerHeight - headerRect.height + 20;
    bannerHeight.value = `${availableHeight}px`;
  }
};

/** 根據 id 找到對應的活動 */
const currentActivity = computed(() => {
  console.log('route', route);
  // 直接從所有活動中尋找對應的 id
  const allActivities = tm('history.activities');
  if (allActivities && typeof allActivities === 'object') {
    // 遍歷所有活動類型
    for (const activityType in allActivities) {
      const activities = allActivities[activityType];
      if (Array.isArray(activities)) {
        const found = activities.find(activity => activity.id === id);
        if (found) return found;
      }
    }
  }
  return null;
});

/** 驗證活動 ID 是否有效 */
const isValidActivityId = computed(() => {
  return currentActivity.value !== null;
});

/** 監聽 ID 變化，如果無效則重定向到根目錄 */
watch(
  () => route.params.id,
  () => {
    // 等待 i18n 載入完成後再檢查
    nextTick(() => {
      if (!isValidActivityId.value) {
        console.log(`Invalid activity ID: ${route.params.id}, redirecting to home`);
        navigateTo('/');
      }
    });
  },
  { immediate: true }
);

/** 參賽回顧 */
const winningTeamList = computed<PastWinningTeam[]>(() => {
  if (!currentActivity.value?.past?.winning_teams?.list) {
    return [];
  }
  const data = currentActivity.value.past.winning_teams.list;
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

/** 選中的獲獎團隊 */
const activeWinningTeam = ref<PastWinningTeam | null>(null);

/**
 * 參賽回顧 - 當前頁數
 */
const pastCurrentPage = ref(1);
/**
 * 參賽回顧 - 每次顯示影片數量
 */
const pastSlidesPerPage = 3;
/**
 * 參賽回顧 - 總頁數
 */
const _pastTotalPages = computed(() => Math.ceil(winningTeamList.value.length / pastSlidesPerPage));
// 監聽 Swiper 變更時，更新 `pastCurrentPage`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _onPastSlideChange = (event: any) => {
  // console.log(event);
  if (event) {
    pastCurrentPage.value = Math.ceil(event.realIndex / pastSlidesPerPage) + 1;
  }
};

/** 重要時程 */
const scheduleList = computed(() => {
  const data = currentActivity.value?.schedule?.list;
  return data ? (Array.isArray(data) ? data : Object.values(data)) : []; // 轉換 Object 為 Array
});
/** 選中的重要時程 */
const activeSchedule = ref(scheduleList.value[0]);
// 存放距離
const tabToContentDistance = ref(0);
// 存放高度
const tabHeight = ref(0);

const calculateDistance = () => {
  nextTick(() => {
    const activeTab = document.querySelector('.schedule-tab');
    const rightContent = document.querySelector('.right-content'); // 右側內容區

    if (activeTab && rightContent) {
      const tabRect = activeTab.getBoundingClientRect();
      const contentRect = rightContent.getBoundingClientRect();
      tabToContentDistance.value = parseFloat((contentRect.left - tabRect.right).toFixed(2));
      tabHeight.value = parseFloat(tabRect.height.toFixed(2));
    }
  });
};

/** 感謝單位 */
const sponsorList = computed<Sponsor[]>(() => {
  const data = currentActivity.value?.sponsor?.list;
  return Array.isArray(data) ? data : Object.values(data); // 轉換 Object 為 Array
});

const duplicatedSponsorList = computed(() => {
  // 重複 4 次內容以確保無縫循環
  const originalList = sponsorList.value;
  return [...originalList, ...originalList, ...originalList, ...originalList];
});

/** 選中的照片回顧 */
const activePhoto = ref<PastPhoto | null>(null);

const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Backspace':
      e.preventDefault();
      router.back();
      break;
    default:
      break;
  }
};

onMounted(() => {
  console.log('currentActivity', currentActivity.value);
  calculateBannerHeight();
  calculateDistance();
  window.addEventListener('resize', () => {
    calculateBannerHeight();
    calculateDistance();
  });
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    calculateBannerHeight();
    calculateDistance();
  });
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="lg:mt-[100px] mt-[80px]">
    <OrganismLayoutHeader
      class="lg:h-[100px] h-[80px] fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300"
    />

    <!-- 第1幀 - Hero Banner -->
    <section class="flex flex-col h-full lg:p-0 p-5 relative" :style="{ minHeight: bannerHeight }">
      <div class="lg:border-0 border border-white flex flex-1">
        <div
          class="lg:border-0 m-1 border border-white text-white flex-1 flex items-center justify-center text-center bg-tp"
        >
          <!-- desktop noise -->
          <img
            class="lg:block hidden hero-banner-noise hero-banner-noise--1"
            src="@/assets/images/hero-banner-noise1.svg"
            alt="noise"
          />
          <img
            class="lg:block hidden hero-banner-noise hero-banner-noise--3"
            src="@/assets/images/hero-banner-noise3.svg"
            alt="noise"
          />
          <div class="lg:p-10 p-8 flex flex-col justify-around h-full max-h-[250px] relative">
            <!-- desktop noise -->
            <img
              class="lg:block hidden hero-banner-noise hero-banner-noise--2"
              src="@/assets/images/hero-banner-noise2.svg"
              alt="noise"
            />
            <!-- mobile noise -->
            <img
              class="lg:hidden block hero-banner-noise"
              src="@/assets/images/hero-banner-noise-mobile.svg"
              alt="noise"
            />
            <!-- title -->
            <p class="lg:text-2xl text-xl font-fusion-pixel text-are-you-ready mt-6">
              <!-- {{ currentActivity?.hero_banner?.section_title }} -->
            </p>
            <p
              class="lg:text-5xl text-2xl lg:leading-[1.4] leading-[1.4] font-fusion-pixel whitespace-pre-line"
            >
              {{ currentActivity?.hero_banner?.section_title }}
            </p>
            <!-- <p
            v-for="item in bannerContentList"
            :key="item.label"
            class="lg:flex items-center font-fusion-pixel"
          >
            <span class="lg:mr-4 lg:text-base text-sm lg:inline block lg:mb-0 mb-2">{{
              item.label
            }}</span>
            <span class="lg:text-4xl text-2xl lg:inline block">{{ item.value }}</span>
          </p> -->
            <!-- <div class="flex justify-center">
            <AtomButton
              class="min-w-60"
              :icon-type="isRegistrationClosed ? null : 'arrow'"
              :disabled="isRegistrationClosed"
              @click="dialogStore.openDialog('apply')"
              @keydown.enter.prevent="dialogStore.openDialog('apply')"
            >
              {{ isRegistrationClosed ? '報名截止' : '立即報名' }}
            </AtomButton>
          </div> -->
          </div>
        </div>
      </div>
    </section>
    <AtomSectionDecoration class="lg:block hidden" />
    <AtomSectionDecoration class="lg:hidden" />
    <div class="container mx-auto">
      <!-- 參賽回顧 -->
      <template v-if="currentActivity?.past?.available">
        <!-- <div class="lg:flex justify-start hidden">
        <MoleculeSectionNav active-nav-name="past" :focus-y="30" />
      </div> -->
        <section id="past" class="2xl:px-0 p-5">
          <div class="border border-white relative">
            <div class="m-1 border border-white">
              <p class="section-title font-fusion-pixel">參賽回顧</p>
              <div
                class="lg:flex block justify-center items-center font-fusion-pixel text-white lg:p-10 px-2 py-6 text-center border border-b-white"
              >
                <p class="lg:text-2xl text-lg">{{ currentActivity?.past?.description }}</p>
              </div>
              <!-- 獲獎團隊 -->
              <Disclosure v-slot="{ open }" :default-open="true">
                <DisclosureButton
                  class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
                >
                  <p class="font-fusion-pixel text-white text-lg text-center mx-auto">
                    {{ currentActivity?.past?.winning_teams?.title }}
                  </p>
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="20"
                    class="absolute right-5 transition-transform duration-300"
                    :class="{ 'rotate-180': open }"
                  />
                </DisclosureButton>
                <DisclosurePanel>
                  <div class="lg:p-12 p-6 border-b border-white">
                    <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                      <div v-for="(group, index) in winningTeamList" :key="index">
                        <div :key="group.id">
                          <a
                            href="#"
                            @click.prevent="
                              activeWinningTeam = group;
                              dialogStore.openDialog('winningTeam');
                            "
                          >
                            <div class="video-box relative">
                              <img
                                :src="
                                  group.thumbnail.includes('https')
                                    ? group.thumbnail
                                    : runtimeConfig.app.baseURL + group.thumbnail
                                "
                                class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                                alt=""
                              />
                            </div>
                            <div
                              class="lg:block flex items-center mt-2 lg:text-lg text-base text-white"
                            >
                              <p class="mr-2 lg:mr-0">{{ group.ranking }} |</p>
                              <p class="flex justify-between items-center">
                                <span>{{ group.team_name }}</span>
                                <img
                                  src="@/assets/images/icons/white-right-arrow.svg"
                                  width="24"
                                  class="lg:inline-block hidden"
                                  alt="white-right-arrow"
                                />
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
              <!-- 照片回顧 -->
              <Disclosure v-slot="{ open }" :default-open="false">
                <DisclosureButton
                  class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
                >
                  <p class="font-fusion-pixel text-white text-lg text-center mx-auto">
                    {{ currentActivity?.past?.photos?.title }}
                  </p>
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="20"
                    class="absolute right-5 transition-transform duration-300"
                    :class="{ 'rotate-180': open }"
                  />
                </DisclosureButton>
                <DisclosurePanel>
                  <!-- 純照片 -->
                  <div
                    v-if="currentActivity?.past?.photos?.image_list?.length"
                    class="lg:p-12 p-6 border-b border-white"
                  >
                    <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                      <div
                        v-for="(image, index) in currentActivity?.past?.photos?.image_list"
                        :key="index"
                      >
                        <div :key="image.id">
                          <!-- <a
                            href="#"
                            @click.prevent="
                              activePhoto = group;
                              dialogStore.openDialog('photo');
                            "
                          > -->
                          <div class="video-box relative">
                            <img
                              :src="
                                image.includes('https') ? image : runtimeConfig.app.baseURL + image
                              "
                              class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                              alt=""
                            />
                          </div>
                          <!-- <div
                            class="lg:block flex items-center mt-2 lg:text-lg text-base text-white"
                          >
                            <p class="flex justify-between items-center">
                              <span>{{ group.title }}</span>
                              <img
                                src="@/assets/images/icons/white-right-arrow.svg"
                                width="24"
                                class="lg:inline-block hidden"
                                alt="white-right-arrow"
                              />
                            </p>
                          </div> -->
                          <!-- </a> -->
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 分資料夾方式 -->
                  <div
                    v-if="currentActivity?.past?.photos?.list?.length"
                    class="lg:p-12 p-6 border-b border-white"
                  >
                    <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                      <div
                        v-for="(group, index) in currentActivity?.past?.photos?.list"
                        :key="index"
                      >
                        <div :key="group.id">
                          <a
                            :href="group.more_photos_url"
                            target="_blank"
                            @click.prevent="
                              activePhoto = group;
                              dialogStore.openDialog('photo');
                            "
                          >
                            <div class="video-box relative">
                              <img
                                :src="group.thumbnail"
                                class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                                alt=""
                              />
                            </div>
                            <div
                              class="lg:block flex items-center mt-2 lg:text-lg text-base text-white"
                            >
                              <p class="flex justify-between items-center">
                                <span>{{ group.title }}</span>
                                <img
                                  src="@/assets/images/icons/white-right-arrow.svg"
                                  width="24"
                                  class="lg:inline-block hidden"
                                  alt="white-right-arrow"
                                />
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="currentActivity?.past?.photos?.more_photos_url"
                    class="flex flex-col lg:flex-row justify-between items-center p-4 m-1"
                  >
                    <!-- 文字區塊 (lg 以上才顯示) -->
                    <div class="hidden lg:block flex-1">
                      <p class="font-px437 text-white typing-container mr-2">
                        View More Photos：View →
                      </p>
                    </div>

                    <!-- 按鈕區塊 -->
                    <div
                      class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8"
                    >
                      <AtomButton
                        :href="currentActivity?.past?.photos?.more_photos_url"
                        :icon-type="'arrow'"
                        class="w-1/2 lg:w-auto lg:min-w-60"
                      >
                        更多照片回顧
                      </AtomButton>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
              <!-- 影音回顧 -->
              <Disclosure v-slot="{ open }" :default-open="false">
                <DisclosureButton
                  class="w-full h-16 flex items-center justify-between p-2 border border-t-white border-b-white bg-primary-300"
                >
                  <p class="font-fusion-pixel text-white text-lg text-center mx-auto">
                    {{ currentActivity?.past?.videos?.title }}
                  </p>
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="20"
                    class="absolute right-5 transition-transform duration-300"
                    :class="{ 'rotate-180': open }"
                  />
                </DisclosureButton>
                <DisclosurePanel>
                  <div class="lg:p-12 p-6 border-b border-white">
                    <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
                      <div
                        v-for="(group, index) in currentActivity?.past?.videos?.list"
                        :key="index"
                      >
                        <div :key="group.id">
                          <a :href="group.video_url" target="_blank">
                            <div class="video-box relative">
                              <img
                                :src="
                                  group.thumbnail.includes('https')
                                    ? group.thumbnail
                                    : runtimeConfig.app.baseURL + group.thumbnail
                                "
                                class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                                alt=""
                              />
                              <!-- 播放按鈕 -->
                              <div
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                              >
                                <img
                                  src="@/assets/images/icons/play.png"
                                  width="40"
                                  alt="play_btn"
                                />
                              </div>
                            </div>
                            <div
                              class="flex justify-between items-center mt-2 lg:text-lg text-base text-white"
                            >
                              <span class="whitespace-pre-line">{{ group.title }}</span>
                              <span>
                                <img
                                  src="@/assets/images/icons/white-right-arrow.svg"
                                  width="24"
                                  class="lg:inline-block hidden"
                                  alt="white-right-arrow"
                                />
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    <!-- 無資料時 -->
                    <div
                      v-if="currentActivity?.past?.videos?.list?.length === 0"
                      class="flex-1 flex justify-center items-center"
                    >
                      <div>
                        <img
                          src="@/assets/images/icons/white-coming-soon.svg"
                          alt="no-data"
                          width="60"
                          class="m-auto"
                        />
                        <p class="text-white text-center font-px437 mt-8">Coming Soon......</p>
                      </div>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </div>
          </div>
        </section>
        <AtomSectionDecoration direction="right" />
      </template>
      <!-- 競賽規則 -->
      <template v-if="currentActivity?.rules?.available">
        <!-- <div class="lg:flex justify-end hidden">
        <MoleculeSectionNav active-nav-name="rules" :focus-y="3" />
      </div> -->
        <section id="rules" class="2xl:px-0 p-5">
          <div class="border border-white relative">
            <div class="m-1 border border-white">
              <p class="section-title font-fusion-pixel">
                {{ currentActivity.rules.section_title }}
              </p>
              <div class="text-white p-10 text-center border border-b-white">
                <p class="whitespace-pre-wrap">{{ currentActivity.rules.description }}</p>
              </div>
              <div class="grid lg:grid-cols-5 grid-cols-1 border border-b-white">
                <div class="lg:col-span-3 lg:p-16 p-4 lg:border lg:border-r-white">
                  <div class="relative">
                    <div class="bg-white p-1 border-b-2 border-r-2 border-b-black border-r-black">
                      <div class="bg-black p-1">
                        <img
                          src="@/assets/images/window-action.svg"
                          class="ml-auto"
                          alt="視窗操作鈕"
                        />
                      </div>
                      <!-- desktop image -->
                      <img
                        :src="
                          currentActivity.rules.promotion_images.desktop_url.includes('https')
                            ? currentActivity.rules.promotion_images.desktop_url
                            : runtimeConfig.app.baseURL +
                              currentActivity.rules.promotion_images.desktop_url
                        "
                        class="lg:block hidden mt-1"
                        alt="黑客松宣傳圖"
                      />
                      <!-- mobile image -->
                      <img
                        :src="
                          currentActivity.rules.promotion_images.mobile_url.includes('https')
                            ? currentActivity.rules.promotion_images.mobile_url
                            : runtimeConfig.app.baseURL +
                              currentActivity.rules.promotion_images.mobile_url
                        "
                        class="lg:hidden block"
                        alt="黑客松宣傳圖"
                      />
                    </div>
                    <!-- desktop noise1 -->
                    <img
                      class="lg:block hidden rules-noise rules-noise--1"
                      src="@/assets/images/rules-noise1.svg"
                      alt="noise"
                    />
                    <!-- desktop noise2 -->
                    <img
                      class="lg:block hidden rules-noise rules-noise--2"
                      src="@/assets/images/rules-noise2.svg"
                      alt="noise"
                    />
                  </div>
                </div>

                <div class="lg:col-span-2 lg:p-10 p-4">
                  <div class="text-white leading-loose mb-6">
                    <p class="text-xl text-center my-4">
                      {{ currentActivity.rules.content_title }}
                    </p>
                    <p class="whitespace-pre-wrap">{{ currentActivity.rules.content }}</p>
                  </div>
                  <div class="flex lg:justify-start justify-between space-x-4">
                    <a
                      v-for="(btn, index) in currentActivity.rules.buttons"
                      :key="index"
                      :href="btn.link"
                      target="_blank"
                      class="connect-btn font-px437"
                    >
                      {{ btn.name }}
                    </a>
                  </div>
                </div>
              </div>
              <!-- <div
              class="flex flex-col lg:flex-row justify-between items-center lg:p-10 p-4 bg-primary-300 m-1"
            > -->
              <!-- 文字區塊 (lg 以上才顯示) -->
              <!-- <div class="hidden lg:block flex-1">
                <p class="font-px437 text-white typing-container">
                  LEARN MORE OR JOIN NOW? ( Y / N )
                </p>
              </div> -->

              <!-- 按鈕區塊 -->
              <!-- <div
                class="w-full lg:w-auto flex flex-nowrap justify-center lg:justify-end space-x-8"
              >
                <AtomButton
                  :to="ROUTE_PATHS.RULES"
                  :icon-type="'arrow'"
                  class="w-1/2 lg:w-auto lg:min-w-60 text-center block"
                >
                  瞭解詳情
                </AtomButton>
                <AtomButton
                  :icon-type="isRegistrationClosed ? null : 'arrow'"
                  :disabled="isRegistrationClosed"
                  class="w-1/2 lg:w-auto lg:min-w-60"
                  @click="dialogStore.openDialog('apply')"
                  @keydown.enter.prevent="dialogStore.openDialog('apply')"
                >
                  {{ isRegistrationClosed ? '報名截止' : '立即報名' }}
                </AtomButton>
              </div>
            </div> -->

              <!-- 評審介紹 -->
              <div
                v-if="currentActivity.rules.judges.available"
                class="judge border border-t-white"
              >
                <div class="judge border border-t-white">
                  <div class="p-10">
                    <p class="font-fusion-pixel text-2xl text-white text-center">本屆評審介紹</p>
                  </div>

                  <template v-for="(item, index) in currentActivity.rules.judges.list" :key="index">
                    <Disclosure v-slot="{ open }" :default-open="true">
                      <DisclosureButton
                        class="w-full flex items-center justify-between p-2 border border-t-white border-b-white"
                      >
                        <p class="text-white text-center font-fusion-pixel mx-auto">
                          {{ item.name }}
                        </p>
                        <img
                          src="@/assets/images/icons/white-down-arrow.svg"
                          alt="arrow"
                          width="20"
                          class="absolute right-5 transition-transform duration-300"
                          :class="{ 'rotate-180': open }"
                        />
                      </DisclosureButton>
                      <DisclosurePanel>
                        <div class="relative w-full py-10 pb-4 lg:py-10">
                          <!-- desktop -->
                          <div class="lg:flex hidden">
                            <div
                              v-for="judge in item.list"
                              :key="judge.id"
                              class="w-1/5 p-4 flex-shrink-0"
                            >
                              <div
                                class="judge-box relative"
                                :class="{ 'aspect-square': judge.thumbnail }"
                              >
                                <img
                                  v-if="judge.thumbnail"
                                  :src="judge.thumbnail"
                                  class="w-full h-full object-cover object-top"
                                  :alt="`評審照片-${judge.name}`"
                                />
                                <p
                                  class="px-4 py-2 bg-white"
                                  :class="
                                    judge.thumbnail ? 'absolute -left-3 -bottom-3' : 'text-center'
                                  "
                                >
                                  {{ judge.name }}
                                </p>
                              </div>
                              <div class="mt-4 text-white text-center">
                                <p>{{ judge.corporation }}</p>
                                <p>{{ judge.position }}</p>
                              </div>
                            </div>
                          </div>
                          <!-- mobile Swiper -->
                          <div class="lg:hidden">
                            <Swiper
                              :modules="[Navigation, Pagination]"
                              :slides-per-view="'auto'"
                              :space-between="20"
                              :centered-slides="true"
                              :loop="false"
                              :pagination="{ type: 'bullets', clickable: true }"
                            >
                              <SwiperSlide
                                v-for="judge in item.list"
                                :key="judge.id"
                                class="swiper-judge-slide"
                              >
                                <div
                                  class="judge-box relative"
                                  :class="{ 'aspect-square': judge.thumbnail }"
                                >
                                  <img
                                    v-if="judge.thumbnail"
                                    :src="
                                      judge.thumbnail.includes('https')
                                        ? judge.thumbnail
                                        : runtimeConfig.app.baseURL + judge.thumbnail
                                    "
                                    class="w-full h-full object-cover object-top"
                                    :alt="`評審照片-${judge.name}`"
                                  />
                                  <p
                                    class="px-4 py-2 bg-white"
                                    :class="
                                      judge.thumbnail ? 'absolute -left-3 -bottom-3' : 'text-center'
                                    "
                                  >
                                    {{ judge.name }}
                                  </p>
                                </div>
                                <div class="mt-8 text-white text-center">
                                  <p>{{ judge.corporation }}</p>
                                  <p>{{ judge.position }}</p>
                                </div>
                              </SwiperSlide>
                            </Swiper>
                          </div>
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </section>
        <AtomSectionDecoration />
      </template>
      <!-- 重要時程 -->
      <template v-if="currentActivity?.schedule?.available">
        <div class="lg:flex justify-start hidden">
          <!-- <MoleculeSectionNav active-nav-name="schedule" :focus-y="8" /> -->
        </div>
        <section id="schedule" class="2xl:px-0 p-5">
          <div class="border border-white relative">
            <div class="m-1 border border-white">
              <p class="section-title font-fusion-pixel">
                {{ currentActivity.schedule.section_title }}
              </p>
              <!-- <div
              class="lg:flex block justify-center items-center font-fusion-pixel text-white lg:p-10 px-2 py-4 pt-6 text-center border border-b-white"
            >
              <p class="mb-4 lg:mb-0">競賽倒數</p>
              <MoleculeCountDown :target-date="new Date(currentActivity.schedule.count_down)" />
            </div> -->
              <!-- desktop -->
              <div class="hidden lg:p-10 px-2 py-4 lg:grid lg:grid-cols-7">
                <div class="col-span-2">
                  <div class="flex">
                    <!-- 左側 Tabs -->
                    <div class="relative flex flex-col font-fusion-pixel">
                      <div
                        v-for="(tab, index) in currentActivity.schedule.list"
                        :key="tab.id"
                        class="schedule-tab relative p-6 border border-white text-xl text-center cursor-pointer mb-4 hover:bg-primary-50 hover:text-primary-500"
                        :class="
                          activeSchedule.id === tab.id
                            ? 'bg-primary-50 text-primary-500 border-0 shadow-[4px_4px_0px_black]'
                            : 'text-white'
                        "
                        @click="activeSchedule = tab"
                      >
                        {{ tab.schedule_name }}

                        <!-- 第一個選項：純水平線 -->
                        <div
                          v-if="
                            index === 0 &&
                            scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                          "
                          class="absolute top-1/2 right-[-100%] w-[100%] h-[2px] bg-white"
                        ></div>

                        <!-- 其他選項：水平 → 垂直 → 水平的折線 -->
                        <div
                          v-if="
                            index > 0 &&
                            scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                          "
                          class="absolute right-[-20px] top-1/2 h-[2px] bg-white"
                          :style="{
                            width: tabToContentDistance / 2 + 'px',
                            right: -tabToContentDistance / 2 + 'px',
                          }"
                        ></div>
                        <div
                          v-if="
                            index > 0 &&
                            scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                          "
                          class="absolute w-[2px] bg-white"
                          :style="{
                            right: -tabToContentDistance / 2 + 'px',
                            height: (tabHeight + 16) * index + 2 + 'px',
                            bottom: tabHeight / 2 - 1 + 'px',
                          }"
                        ></div>
                        <div
                          v-if="
                            index > 0 &&
                            scheduleList.findIndex(tab => tab.id === activeSchedule.id) === index
                          "
                          class="absolute h-[2px] bg-white"
                          :style="{
                            width: tabToContentDistance / 2 + 2 + 'px',
                            right: -tabToContentDistance + 'px',
                            bottom: tabHeight / 2 + (tabHeight + 16) * index + 'px',
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-span-5 bg-primary-300 border border-white z-0 right-content">
                  <!-- 右側內容區 -->
                  <div class="flex-1 text-white">
                    <div
                      class="flex justify-between items-center p-4 border border-b-white min-h-[83px]"
                    >
                      <p class="text-xl whitespace-pre-wrap">
                        <AtomSaveHtml :html="activeSchedule.schedule_sub_name" />
                      </p>

                      <!-- 按鈕（根據類型顯示）-->
                      <template v-if="activeSchedule.button?.text">
                        <AtomButton
                          class="min-w-60"
                          :href="
                            activeSchedule.button.type === 'outside_link'
                              ? activeSchedule.button.link
                              : undefined
                          "
                          :to="
                            activeSchedule.button.type === 'route'
                              ? activeSchedule.button.link
                              : undefined
                          "
                          @click="
                            () => {
                              if (activeSchedule.button.type === 'dialog') {
                                dialogStore.openDialog(activeSchedule.button.link);
                              }
                            }
                          "
                        >
                          {{ activeSchedule.button.text }}
                        </AtomButton>
                      </template>
                    </div>
                    <div class="p-4 w-full overflow-auto">
                      <table
                        class="w-full min-w-max border-collapse text-white"
                        :class="{
                          hidden: !(
                            activeSchedule.id === 'online' ||
                            activeSchedule.id === 'workshop' ||
                            activeSchedule.id === 'competition'
                          ),
                        }"
                      >
                        <thead>
                          <tr class="border-white custom-dashed text-left">
                            <th
                              v-for="(header, index) in activeSchedule.schedule_headers"
                              :key="index"
                              class="p-2"
                            >
                              {{ header.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in activeSchedule.schedule" :key="index">
                            <td v-if="item.col1" class="p-2 whitespace-pre-wrap">
                              {{ item.col1 }}
                            </td>
                            <td v-if="item.col2" class="p-2 whitespace-pre-wrap">
                              {{ item.col2 }}
                            </td>
                            <td v-if="item.col3" class="p-2 whitespace-pre-wrap">
                              {{ item.col3 }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <!-- mobile -->
              <div class="mt-8 lg:hidden">
                <Disclosure
                  v-for="(tab, index) in scheduleList"
                  v-slot="{ open }"
                  :key="index"
                  :default-open="activeSchedule.id === tab.id"
                >
                  <DisclosureButton
                    class="w-full flex items-center justify-between p-6 border border-t-white border-b-white transition-colors duration-200"
                    :class="[open ? 'bg-primary-50 text-primary-500' : 'text-white']"
                  >
                    <p
                      class="text-center mx-auto"
                      :class="open ? 'text-primary-500' : 'text-white'"
                    >
                      {{ tab.schedule_name }}
                    </p>
                    <img
                      src="@/assets/images/icons/white-down-arrow.svg"
                      alt="arrow"
                      width="20"
                      class="absolute right-5 transition-transform duration-300"
                      :class="{ 'rotate-180': open }"
                    />
                  </DisclosureButton>
                  <DisclosurePanel class="bg-primary-300">
                    <!-- 右側內容區 -->
                    <div class="flex-1 text-white">
                      <div class="flex flex-col text-center p-4 border border-b-white">
                        <p class="text-xl mb-2 whitespace-pre-wrap">
                          <AtomSaveHtml :html="activeSchedule.schedule_sub_name" />
                        </p>
                        <!-- 按鈕（根據類型顯示）-->
                        <template v-if="tab.button?.text">
                          <AtomButton
                            class="min-w-60"
                            :href="tab.button.type === 'outside_link' ? tab.button.link : undefined"
                            :to="tab.button.type === 'route' ? tab.button.link : undefined"
                            @click="
                              () => {
                                if (tab.button.type === 'dialog') {
                                  dialogStore.openDialog(tab.button.link);
                                }
                              }
                            "
                          >
                            {{ tab.button.text }}
                          </AtomButton>
                        </template>
                      </div>
                      <div class="p-4 w-full overflow-auto">
                        <table
                          :class="{
                            hidden: !(
                              tab.id === 'online' ||
                              tab.id === 'workshop' ||
                              tab.id === 'competition'
                            ),
                          }"
                          class="w-full min-w-max border-collapse text-white"
                        >
                          <thead>
                            <tr class="border-white custom-dashed text-left">
                              <th
                                v-for="(header, headerIndex) in tab.schedule_headers"
                                :key="headerIndex"
                                class="p-2"
                              >
                                {{ header.name }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, itemIndex) in tab.schedule" :key="itemIndex">
                              <td v-if="item.col1" class="p-2 whitespace-pre-wrap">
                                {{ item.col1 }}
                              </td>
                              <td v-if="item.col2" class="p-2 whitespace-pre-wrap">
                                {{ item.col2 }}
                              </td>
                              <td v-if="item.col3" class="p-2 whitespace-pre-wrap">
                                {{ item.col3 }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p class="custom-dashed dashed-top p-4 text-center scroll-arrow">
                        向右滑看更多資訊
                      </p>
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </div>
            </div>
          </div>
        </section>
        <AtomSectionDecoration direction="right" />
      </template>
      <!-- 第6幀 - 感謝單位 -->
      <template v-if="currentActivity?.sponsor?.available">
        <div class="lg:flex justify-end hidden">
          <!-- <MoleculeSectionNav active-nav-name="sponsor" :focus-y="40" /> -->
        </div>
        <section id="sponsor" class="2xl:p-0 p-5">
          <div class="border border-white relative">
            <div class="m-1 border border-white">
              <p class="section-title font-fusion-pixel">
                {{ currentActivity.sponsor.section_title }}
              </p>
              <div class="p-10 border border-b-white">
                <!-- 輪播效果 -->
                <div class="relative w-full overflow-hidden">
                  <!-- Desktop 輪播 -->
                  <div class="hidden lg:block">
                    <div class="marquee-container flex">
                      <div class="marquee-content marquee-left flex">
                        <!-- 重複多次內容以實現無縫循環 -->
                        <div
                          v-for="(sponsor, index) in duplicatedSponsorList"
                          :key="`desktop-${sponsor.id}-${index}`"
                          class="sponsor-item flex-shrink-0 mr-10 flex items-center justify-center"
                        >
                          <div class="group block">
                            <img
                              v-if="sponsor.image_url"
                              :src="
                                sponsor.image_url.includes('https')
                                  ? sponsor.image_url
                                  : runtimeConfig.app.baseURL + sponsor.image_url
                              "
                              alt="sponsor"
                              class="w-auto max-h-[80px] object-contain"
                            />
                            <p v-else class="text-white text-2xl">{{ sponsor.name }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mobile 輪播 -->
                  <div class="lg:hidden block">
                    <!-- 第一排：往右移動 -->
                    <div class="marquee-container mb-4">
                      <div class="marquee-content marquee-right flex">
                        <!-- 重複多次內容以實現無縫循環 -->
                        <div
                          v-for="(sponsor, index) in duplicatedSponsorList"
                          :key="`mobile-right-${sponsor.id}-${index}`"
                          class="sponsor-item flex-shrink-0 mr-10 flex items-center justify-center"
                        >
                          <div class="group block">
                            <img
                              v-if="sponsor.image_url"
                              :src="
                                sponsor.image_url.includes('https')
                                  ? sponsor.image_url
                                  : runtimeConfig.app.baseURL + sponsor.image_url
                              "
                              alt="sponsor"
                              class="w-auto max-h-[60px] object-contain"
                            />
                            <p v-else class="text-white text-2xl">{{ sponsor.name }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 第二排：往左移動 -->
                    <div class="marquee-container">
                      <div class="marquee-content marquee-left flex">
                        <!-- 重複多次內容以實現無縫循環 -->
                        <div
                          v-for="(sponsor, index) in duplicatedSponsorList"
                          :key="`mobile-left-${sponsor.id}-${index}`"
                          class="sponsor-item flex-shrink-0 mr-10 flex items-center justify-center"
                        >
                          <div class="group block">
                            <img
                              v-if="sponsor.image_url"
                              :src="
                                sponsor.image_url.includes('https')
                                  ? sponsor.image_url
                                  : runtimeConfig.app.baseURL + sponsor.image_url
                              "
                              alt="sponsor"
                              class="w-auto max-h-[60px] object-contain"
                            />
                            <p v-else class="text-white text-2xl">{{ sponsor.name }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <AtomSectionDecoration />
      </template>

      <OrganismWinningTeamDialog
        :is-open="activeDialog === 'winningTeam'"
        :active-winning-team="activeWinningTeam"
        @close="
          activeWinningTeam = null;
          dialogStore.closeDialog();
        "
      />

      <OrganismPhotoDialog
        :is-open="activeDialog === 'photo'"
        :active-photo="activePhoto"
        @close="
          activePhoto = null;
          dialogStore.closeDialog();
        "
      />
    </div>
    <OrganismLayoutFooter :current-activity="currentActivity" />
  </div>
</template>
<style scoped lang="postcss">
.section-title {
  @apply text-white lg:text-4xl text-[28px] absolute -top-7 left-1/2 -translate-x-1/2;
  @apply px-6 py-2 bg-primary-500;
}

.text-are-you-ready {
  @apply relative;
  &::before {
    content: url('@/assets/images/are-you-ready.svg');
    position: absolute;
    top: -50px;
    left: 40px;

    @media (max-width: 1024px) {
      left: 0;
    }
  }
}

.bg-tp {
  @apply relative;
  &::before {
    content: url('@/assets/images/hero-banner-tpe.svg');
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  &::after {
    content: url('@/assets/images/hero-banner-ntpc.svg');
    background-repeat: no-repeat;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
@media (max-width: 1024px) {
  .bg-tp::before,
  .bg-tp::after {
    display: none;
  }

  .bg-tp {
    background-image: url('@/assets/images/hero-banner-tp.svg');
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }
}

.hero-banner-noise {
  @apply absolute;
  &--1 {
    @apply left-16 top-14;
  }
  &--2 {
    @apply left-6 bottom-[-25%];
  }
  &--3 {
    @apply right-16 top-20;
  }

  animation: move-noise 1s infinite steps(1);

  @media (max-width: 1024px) {
    @apply left-4 top-[8%];
  }
}

.rules-noise {
  @apply absolute;
  &--1 {
    @apply top-1/2 -translate-y-1/2 right-8;
  }

  &--2 {
    @apply -bottom-12 right-0;
  }
  animation: move-noise 1s infinite steps(1);
}

@keyframes move-noise {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}

.swiper-judge-slide {
  width: 80%;
}

.scroll-arrow {
  display: flex;
  align-items: center;
  justify-content: center; /* 讓文字置中 */
  gap: 10px; /* 圖示與文字間距 */

  &::before {
    content: url('@/assets/images/icons/scroll-left.svg');
    width: 30px;
    height: 30px;
  }

  &::after {
    content: url('@/assets/images/icons/scroll-right.svg');
    width: 30px;
    height: 30px;
  }
}

/** 輪播 */
.marquee-container {
  height: 120px; /* Desktop 高度 */
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    height: 80px; /* Mobile 單排高度，因為有兩排 */
  }

  .marquee-content {
    display: flex;
    animation-play-state: running;
    width: max-content; /* 讓內容自然展開 */

    img {
      max-width: none; /* 移除寬度限制 */
      object-fit: contain; /* 保持比例 */
    }
  }

  .marquee-content.marquee-left {
    animation: marquee-left 40s linear infinite;
  }

  .marquee-content.marquee-right {
    animation: marquee-right 40s linear infinite;
  }

  &:hover .marquee-content {
    animation-play-state: paused;
  }
}

/* 向左滑動 - 無限輪播 */
@keyframes marquee-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%); /* 只移動一半，因為內容已經重複了 */
  }
}

/* 向右滑動 - 無限輪播 */
@keyframes marquee-right {
  0% {
    transform: translateX(-50%); /* 從一半開始 */
  }
  100% {
    transform: translateX(0);
  }
}

/* 贊助項目樣式 */
.sponsor-item {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
