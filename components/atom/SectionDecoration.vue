<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    direction?: 'left' | 'right';
  }>(),
  {
    direction: 'left',
  }
);

const currentImage = ref(0); // 0 or 1

const toggleImage = () => {
  currentImage.value = (currentImage.value + 1) % 2;
};

let intervalId: ReturnType<typeof setInterval>;

onMounted(() => {
  intervalId = setInterval(toggleImage, 1000); // 每秒切換一次
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div
    class="p-4 overflow-hidden flex"
    :class="props.direction === 'right' ? 'justify-end' : 'justify-start'"
  >
    <!-- desktop (lg+) -->
    <img
      src="/images/section-decoration.svg"
      class="hidden lg:block w-[750px]"
      :class="[
        props.direction === 'right' ? 'scale-x-[-1]' : '',
        currentImage === 0 ? '' : 'lg:hidden',
      ]"
      alt=""
    />
    <img
      src="/images/section-decoration-2.svg"
      class="hidden lg:block w-[750px]"
      :class="[
        props.direction === 'right' ? 'scale-x-[-1]' : '',
        currentImage === 1 ? '' : 'lg:hidden',
      ]"
      alt=""
    />

    <!-- mobile (<lg) -->
    <img
      src="/images/section-decoration-mobile.svg"
      class="block lg:hidden"
      :class="[
        props.direction === 'right' ? 'scale-x-[-1]' : '',
        currentImage === 0 ? '' : 'hidden',
      ]"
      alt=""
    />
    <img
      src="/images/section-decoration-mobile-2.svg"
      class="block lg:hidden"
      :class="[
        props.direction === 'right' ? 'scale-x-[-1]' : '',
        currentImage === 1 ? '' : 'hidden',
      ]"
      alt=""
    />
  </div>
</template>
