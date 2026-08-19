<script setup>
useHead({
  title: 'Boardgame table',
  meta: [
    {
      name: 'description',
      content: 'Boardgame table - ร้านบอร์ดเกมออนไลน์'
    }
  ]
})
</script>

<template>
  <div class="app-layout">

    <AppHeader />

    <main>
      <NuxtPage />
    </main>

    <AppFooter />

  </div>
</template>

<style>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout main {
  flex: 1;
}
</style>