<script setup lang="ts">
import { useDialogStore } from '~/stores/dialogStore';

const dialogStore = useDialogStore();
const { activeDialog } = storeToRefs(dialogStore);
</script>

<template>
  <header class="bg-black p-5 pb-0">
    <div class="container mx-auto border border-white h-full flex flex-col">
      <div class="m-1 border border-white flex-1 flex relative">
        <NuxtLink to="/history" class="px-4 flex items-center space-x-2" tabindex="0">
          <img
            src="@/assets/images/icons/white-down-arrow.svg"
            alt="arrow"
            width="14"
            class="rotate-90"
          />
          <span class="text-white">返回</span>
        </NuxtLink>
        <NuxtLink to="/" class="px-4 flex space-x-2 ml-auto lg:ml-0" tabindex="0">
          <img src="/images/logos/logo-icon-ntpc.svg" class="lg:w-[40px] w-[30px]" alt="" />
          <img src="/images/logos/logo-icon-tpe.svg" class="lg:w-[40px] w-[30px]" alt="" />
        </NuxtLink>
        <!-- <p class="text-white text-2xl font-fusion-pixel text-center py-4">
              {{ currentActivity?.name }}
            </p> -->
      </div>
    </div>
  </header>
</template>
