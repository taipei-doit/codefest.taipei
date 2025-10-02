<script setup lang="ts">
const route = useRoute();

// 定義需要顯示 NTPC logo 的路徑
const NTPC_LOGO_PATHS = ['2025-spring'];

const isShowNtpcLogo = computed(() => {
  return NTPC_LOGO_PATHS.includes(route.params.id as string);
});
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
          <img
            v-if="isShowNtpcLogo"
            src="/images/logos/logo-icon-ntpc.svg"
            class="lg:w-[40px] w-[30px]"
            alt=""
          />
          <img src="/images/logos/logo-icon-tpe.svg" class="lg:w-[40px] w-[30px]" alt="" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
