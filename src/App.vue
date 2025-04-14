<script setup>
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app">
    <!-- Tampilkan navbar hanya jika bukan di halaman utama -->
    <nav 
      v-if="route.path !== '/'" 
      class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top"
    >
      <div class="container">
        <router-link class="navbar-brand fw-bold text-primary" to="/">📖 Al-Qur'an Digital</router-link>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/juz" active-class="active">🧩 Daftar Juz</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/surah" active-class="active">📜 Daftar Surah</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';

.app {
  min-height: 100vh;
  background-color: #f4f6f9;
}

.navbar-brand {
  font-size: 1.5rem;
}

.navbar-nav .nav-link {
  margin-left: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.navbar-nav .nav-link:hover {
  color: #0d6efd;
  text-decoration: underline;
}

.navbar-nav .nav-link:active {
  transform: scale(0.95);
}

.active {
  font-weight: bold;
  color: #0d6efd !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
