<template>
  <div class="loading">
    <div class="loading-spinner">正在加载...</div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  font-size: 20px;
  background: repeating-linear-gradient(
    135deg,
    hsl(240, 100%, 90%) 0%,
    hsl(240, 50%, 70%) 15%,
    hsl(240, 60%, 60%) 65%,
    hsl(240, 100%, 90%) 80%,
    hsl(240, 100%, 90%) 100%
  );
  color: transparent;
  background-clip: text;
  background-repeat: repeat;
  background-size: 200% 100%;
  animation: gradient-flow 1.5s linear infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 200% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>
