<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';
import type { PastPhoto } from '~/interfaces/past.interface';
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
const runtimeConfig = useRuntimeConfig();

const props = defineProps<{
  isOpen: boolean;
  activePhoto?: PastPhoto | null;
}>();

const emit = defineEmits(['close']);

const thumbsSwiper = ref<Swiper | null>(null);
const swiperReady = ref(false);
const mainSwiper = ref<Swiper | null>(null);

const setThumbsSwiper = (swiper: Swiper) => {
  try {
    thumbsSwiper.value = swiper;
    swiperReady.value = true;
  } catch (error) {
    console.error('Error initializing thumbs swiper:', error);
  }
};

const setMainSwiper = (swiper: Swiper) => {
  mainSwiper.value = swiper;
};

// Reset swiper state when dialog closes
watch(
  () => props.isOpen,
  newValue => {
    if (!newValue) {
      thumbsSwiper.value = null;
      swiperReady.value = false;
    }
  }
);
</script>

<template>
  <Dialog :open="isOpen" class="relative z-50" @close="emit('close')">
    <!-- The backdrop, rendered as a fixed sibling to the panel container -->
    <div class="fixed inset-0 bg-black/85" aria-hidden="true" />

    <!-- Full-screen scrollable container -->
    <div class="fixed inset-0 w-screen overflow-y-auto">
      <!-- Container to center the panel -->
      <div class="flex min-h-full items-center justify-center p-4">
        <!-- The actual dialog panel -->
        <DialogPanel
          class="bg-white relative w-full max-w-[1147px] min-h-[684px] lg:p-10 px-4 py-10"
        >
          <button class="absolute top-0 right-0" @click="emit('close')">
            <img src="@/assets/images/icons/btn-close.svg" alt="" />
          </button>
          <!-- 標題區域 -->
          <div
            class="pt-16 px-6 flex lg:justify-between justify-center custom-dashed dashed-black pb-4 mb-4"
          >
            <DialogTitle class="text-primary-500 text-2xl">
              {{ props.activePhoto?.title }}
            </DialogTitle>
            <a
              :href="props.activePhoto?.more_photos_url"
              target="_blank"
              class="text-primary-500 lg:flex hidden items-center"
            >
              <span class="text-primary-500 text-lg mr-2 mb-1">更多照片回顧</span>
              <img
                src="@/assets/images/icons/primary-right-arrow.svg"
                width="24"
                alt="white-right-arrow"
              />
            </a>
          </div>
          <DialogDescription class="text-lg leading-8">
            <!-- 單圖模式 -->
            <div v-if="!props.activePhoto?.image_list.length" class="aspect-video">
              <img
                :src="runtimeConfig.app.baseURL + props.activePhoto?.thumbnail"
                class="w-full h-full object-cover lg:mb-0 mb-6"
                alt=""
              />
            </div>

            <!-- 多圖模式 -->
            <div v-else-if="props.activePhoto?.image_list?.length" class="lg:mb-0 mb-6">
              <div class="relative">
                <Swiper
                  :space-between="10"
                  :navigation="{
                    prevEl: '.team-swiper-button-prev',
                    nextEl: '.team-swiper-button-next',
                  }"
                  :thumbs="{ swiper: thumbsSwiper }"
                  :modules="[FreeMode, Navigation, Thumbs]"
                  class="mb-4"
                  @swiper="setMainSwiper"
                >
                  <SwiperSlide v-for="(item, index) in props.activePhoto?.image_list" :key="index">
                    <div class="aspect-video">
                      <img
                        :src="runtimeConfig.app.baseURL + item"
                        class="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
                <!-- 自訂左按鈕 -->
                <button
                  v-if="props.activePhoto?.image_list?.length > 1"
                  class="team-swiper-button-prev custom-nav-btn"
                >
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="22"
                    class="rotate-90"
                  />
                </button>
                <!-- 自訂右按鈕 -->
                <button
                  v-if="props.activePhoto?.image_list?.length > 1"
                  class="team-swiper-button-next custom-nav-btn"
                >
                  <img
                    src="@/assets/images/icons/white-down-arrow.svg"
                    alt="arrow"
                    width="22"
                    class="-rotate-90"
                  />
                </button>
              </div>
              <Swiper
                v-if="props.activePhoto?.image_list?.length > 1"
                :space-between="10"
                :slides-per-view="'auto'"
                :free-mode="true"
                :watch-slides-progress="true"
                :modules="[FreeMode, Navigation, Thumbs]"
                class="thumbs-swiper"
                @swiper="setThumbsSwiper"
              >
                <SwiperSlide
                  v-for="(item, index) in props.activePhoto?.image_list"
                  :key="index"
                  class="thumb-slide"
                >
                  <div class="aspect-square cursor-pointer">
                    <img
                      :src="runtimeConfig.app.baseURL + item"
                      class="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            <a
              :href="props.activePhoto?.more_photos_url"
              target="_blank"
              class="text-primary-500 lg:hidden flex items-center justify-end"
            >
              <span class="text-primary-500 text-lg mr-2 mb-1">更多照片回顧</span>
              <img
                src="@/assets/images/icons/primary-right-arrow.svg"
                width="24"
                alt="white-right-arrow"
              />
            </a>
          </DialogDescription>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<style lang="postcss">
.custom-nav-btn {
  @apply absolute top-0 h-full w-10 text-white flex items-center justify-center transition-all duration-300 z-50 cursor-pointer;
}

.custom-nav-btn:hover {
  @apply bg-white/50; /* 透明白色背景 */
}

.team-swiper-button-prev {
  @apply left-0;
}

.team-swiper-button-next {
  @apply right-0;
}

.thumb-slide {
  @apply lg:!w-12 lg:!h-12 w-10 h-10; /* 調整縮圖大小 */

  &:hover,
  &.swiper-slide-thumb-active {
    @apply border-[2.4px] border-primary-500;
  }
}
</style>
