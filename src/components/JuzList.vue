<template>
  <div class="juz-list container">
    <h2 class="mb-4 text-center">Daftar Juz</h2>
    <div class="vertical-grid">
      <div 
        class="juz-item"
        v-for="juz in juzList" 
        :key="juz.juz_number"
        @click="goToJuzDetail(juz.juz_number)"
      >
        Juz {{ juz.juz_number }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const juzList = ref([])
const router = useRouter()

const loadJuzList = async () => {
  try {
    const response = await fetch('https://api.quran.com/api/v4/juzs')
    const data = await response.json()

    // Filter agar hanya data Juz yang unik berdasarkan juz_number
    const seen = new Set()
    const uniqueJuzs = data.juzs.filter(juz => {
      if (seen.has(juz.juz_number)) {
        return false
      }
      seen.add(juz.juz_number)
      return true
    })

    juzList.value = uniqueJuzs
  } catch (error) {
    console.error('Gagal memuat data Juz:', error)
  }
}

const goToJuzDetail = (juzId) => {
  router.push({ name: 'JuzDetail', params: { id: juzId } })
}

onMounted(() => {
  loadJuzList()
})
</script>

<style scoped>
.vertical-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 600px; /* Maksimum lebar grid */
  margin: 0 auto; /* Centering the grid */
}

.juz-item {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #212529;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s, transform 0.3s ease; /* Menambahkan animasi untuk zoom */
  width: 100%; /* Full width inside the max-width */
  box-sizing: border-box; /* Ensure padding is included in width */
}

.juz-item:hover {
  background-color: #f8f9fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transform: scale(1.05); /* Zoom in sedikit saat hover */
}

@media (min-width: 576px) {
  .juz-item {
    width: calc(33.33% - 8px); /* 3 items per row on small screens */
  }
}

@media (min-width: 768px) {
  .juz-item {
    width: calc(25% - 8px); /* 4 items per row on medium screens */
  }
}

@media (min-width: 1024px) {
  .juz-item {
    width: calc(20% - 8px); /* 5 items per row on large screens */
  }
}
</style>
