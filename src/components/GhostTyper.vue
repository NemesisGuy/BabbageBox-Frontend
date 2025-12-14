<script setup lang="ts">
const props = defineProps({
  status: {
    type: String,
    default: 'AI is thinking...'
  }
})
</script>

<template>
  <div class="ghost-typer-container">
    <div class="ghost-card glass">
      <div class="ghost-header">
        <i class="fa-solid fa-ghost fa-bounce"></i>
        <span>{{ status }}</span>
      </div>
      <div class="ghost-lines">
        <div class="line short"></div>
        <div class="line medium"></div>
        <div class="line long"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ghost-typer-container {
  display: flex;
  justify-content: flex-start;
  /* margin/padding handled by parent context */
  animation: fadeIn 0.3s ease-out;
}

.ghost-card {
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.ghost-header {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #abf1e8; /* Light teal */
  font-size: 0.9rem;
  font-weight: 600;
}

.fa-ghost {
  color: #4fd1c5;
  filter: drop-shadow(0 0 4px #4fd1c5);
}

.ghost-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.line {
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, 
    rgba(79, 209, 197, 0.2) 0%, 
    rgba(79, 209, 197, 0.5) 50%, 
    rgba(79, 209, 197, 0.2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.line.short { width: 60px; }
.line.medium { width: 120px; }
.line.long { width: 180px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Light mode overrides */
:global(:root.light) .ghost-card {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(79, 209, 197, 0.3);
}
:global(:root.light) .ghost-header {
  color: #2c7a7b;
}
:global(:root.light) .fa-ghost {
  color: #319795;
}
</style>
