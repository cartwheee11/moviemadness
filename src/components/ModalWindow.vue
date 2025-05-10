<script setup lang="ts">

defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['hide'])

const handleClose = () => {
  emit('hide')
}
</script>

<template>
  <div v-if="visible"
    class="modal1 flex justify-center items-center fixed top-0 left-0 bottom-0 w-full h-full bg-black/50 z-10"
    @mousedown.self="handleClose">
    <div class="modal-content rounded-2xl text-center max-w-100 p-6 bg-base-100 shadow-sm">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
