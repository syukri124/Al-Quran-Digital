<template>
  <div class="juz-list container py-4">
    <h2 class="text-center fw-bold mb-4">📘 Daftar Juz</h2>
    <div class="row g-4 justify-content-center">
      <div 
        class="col-6 col-sm-4 col-md-3 col-lg-2"
        v-for="juz in juzList" 
        :key="juz.juz_number"
      >
        <div 
          class="card juz-card text-center h-100 border-0 shadow-sm" 
          @click="goToJuzDetail(juz.juz_number)"
        >
          <div class="card-body d-flex align-items-center justify-content-center">
            <h5 class="card-title mb-0 text-primary">Juz {{ juz.juz_number }}</h5>
          </div>
        </div>
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
      if (seen.has(juz.juz_number)) return false
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
.juz-card {
  background: linear-gradient(135deg, #e8f0fe, #f0f8ff); /* warna lembut */
  border-left: 5px solid #0d6efd;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  border-radius: 12px;
}

.juz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}
</style>
