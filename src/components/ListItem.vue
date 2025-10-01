<template>
  <div class="wrapper list bg-base-100 rounded-2xl">
    <slot name="default" class="hello"></slot>
  </div>
</template>


<style scoped>
@reference "../assets/main.css";

.wrapper> ::v-deep(*) {
  @apply hover:bg-base-200/25 p-4
}

.wrapper> ::v-deep(*):not(:first-child) {
  @apply border-t-2 border-underline-100 border-solid;
}
</style>
