<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4">
      📜 Daftar Surah
    </h2>

    <div class="row g-4">
      <div 
        class="col-12 col-md-6 col-lg-4" 
        v-for="surah in surahs" 
        :key="surah.id"
      >
        <div 
          class="card h-100 border-0 shadow-sm bg-light surah-card" 
          @click="goToDetail(surah.id)"
        >
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title mb-1 text-primary">{{ surah.name_simple }}</h5>
              <p class="card-text mb-1">Jumlah Ayat: {{ surah.verses_count }}</p>
            </div>
            <div class="fs-3 text-end arabic-text">
              {{ surah.name_arabic }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const surahs = ref([])

const fetchSurahs = async () => {
  try {
    const response = await fetch('https://api.quran.com/api/v4/chapters')
    const data = await response.json()
    surahs.value = data.chapters
  } catch (error) {
    console.error('Gagal memuat surah:', error)
  }
}

const goToDetail = (id) => {
  router.push(`/surah/${id}`)
}

onMounted(fetchSurahs)
</script>

<style scoped>
.surah-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 5px solid #0d6efd;
  background: linear-gradient(135deg, #f8f9fa, #e7f1ff);
}

.surah-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.arabic-text {
  font-family: 'Scheherazade', 'Traditional Arabic', serif;
  color: #212529;
}
</style>
