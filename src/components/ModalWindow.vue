<!-- ModalWindow.vue -->
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
  <div v-if="visible" class="modal1" @click.self="handleClose">
    <div class="modal-content">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal1 {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* Основное содержимое модалки */
.modal-content {
  background: white;
  padding: 20px;
  max-width: 400px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
