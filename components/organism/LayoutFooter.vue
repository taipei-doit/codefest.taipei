<script setup lang="ts">
import type { HistoryActivity } from '~/interfaces/history-activity.interface';

const { tm } = useI18n();

const props = defineProps<{
  currentActivity: HistoryActivity;
}>();
</script>

<template>
  <footer class="bg-black p-5 pt-0 font-fusion-pixel">
    <div class="container mx-auto border border-white">
      <div class="m-1 border border-white">
        <div class="grid lg:grid-cols-5 grid-cols-1 text-white">
          <div class="lg:col-span-4 gap-x-6 p-4 lg:flex lg:items-start border border-r-white">
            <div class="grid lg:grid-cols-1 grid-cols-2 gap-x-4">
              <span class="col-span-2 lg:col-span-1 text-center lg:text-left mb-4"
                >主辦單位<span class="lg:inline hidden">：</span></span
              >
              <span
                v-for="(item, index) in props.currentActivity?.footer?.organizer"
                :key="index"
                class="text-center lg:text-left lg:mb-4"
                :class="
                  props.currentActivity?.footer?.organizer.length &&
                  props.currentActivity?.footer?.organizer.length > 1
                    ? ''
                    : 'col-span-2 lg:col-span-1'
                "
              >
                {{ item }}
              </span>
            </div>
            <div
              v-if="props.currentActivity?.footer?.co_organizer"
              class="grid lg:grid-cols-1 grid-cols-2 gap-x-4 mt-4 lg:mt-0"
            >
              <span class="col-span-2 lg:col-span-1 text-center lg:text-left mb-4"
                >協辦單位<span class="lg:inline hidden">：</span></span
              >
              <span
                v-for="(item, index) in props.currentActivity?.footer?.co_organizer"
                :key="index"
                class="text-center lg:text-left lg:mb-4"
                :class="
                  props.currentActivity?.footer?.co_organizer.length &&
                  props.currentActivity?.footer?.co_organizer.length > 1
                    ? ''
                    : 'col-span-2 lg:col-span-1'
                "
              >
                {{ item }}
              </span>
            </div>
            <div
              v-if="props.currentActivity?.footer?.implementer"
              class="grid lg:grid-cols-1 grid-cols-2 gap-x-4 mt-4 lg:mt-0"
            >
              <span class="col-span-2 lg:col-span-1 text-center lg:text-left mb-4"
                >執行單位<span class="lg:inline hidden">：</span></span
              >
              <span
                v-for="(item, index) in props.currentActivity?.footer?.implementer"
                :key="index"
                class="text-center lg:text-left lg:mb-4"
                :class="
                  props.currentActivity?.footer?.implementer.length &&
                  props.currentActivity?.footer?.implementer.length > 1
                    ? ''
                    : 'col-span-2 lg:col-span-1'
                "
              >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="lg:col-span-1 p-4 border border-r-white font-px437">
            <p class="mb-3">Connect with us......</p>
            <div class="grid lg:grid-flow-row grid-flow-col lg:grid-cols-1 grid-rows-2">
              <div
                v-for="(btn, index) in props.currentActivity?.footer?.buttons"
                :key="index"
                class="flex items-center mb-3"
              >
                <img src="@/assets/images/icons/white-arrow-down-right.svg" class="mr-2" alt="" />
                <a :href="btn.link" target="_blank">
                  <span class="connect-btn">{{ btn.name }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="postcss">
.connect-btn {
  @apply inline-block px-6 py-2 border border-white text-white uppercase;
}
</style>
