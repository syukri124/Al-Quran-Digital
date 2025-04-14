<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Daftar Surah</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="surah in surahs"
        :key="surah.id"
        class="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition border-2 border-gray-300"
        @click="goToDetail(surah.id)"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">{{ surah.name_simple }}</h3>
            <!-- Arti dari nama surat dihapus -->
            <p class="text-sm mt-1">Jumlah Ayat: {{ surah.verses_count }}</p>
          </div>
          <p class="text-3xl font-arabic text-right text-gray-800">{{ surah.name_arabic }}</p>
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
  const response = await fetch('https://api.quran.com/api/v4/chapters')
  const data = await response.json()
  surahs.value = data.chapters
}

const goToDetail = (id) => {
  router.push(`/surah/${id}`)
}

onMounted(fetchSurahs)
</script>

<style scoped>
.font-arabic {
  font-family: 'Scheherazade', 'Traditional Arabic', serif;
}

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Memperbesar lebar minimum */
}

.bg-white {
  background-color: #fff;
}

.border-2 {
  border-width: 2px; /* Menambahkan border dengan ketebalan 2px */
}

.border-gray-300 {
  border-color: #d1d5db; /* Warna border */
}
</style>
