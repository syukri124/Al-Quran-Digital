<template>
  <div class="juz-detail">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="mb-0">Juz {{ juzNumber }}</h3>
              <p class="mb-0 mt-2" v-if="juzInfo">
                Mulai: Surah {{ juzInfo.verse_mapping.first.surah_name }} Ayat {{ juzInfo.verse_mapping.first.verse_number }}<br>
                Sampai: Surah {{ juzInfo.verse_mapping.last.surah_name }} Ayat {{ juzInfo.verse_mapping.last.verse_number }}
              </p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="showArabic">Teks Arab</button>
              <button class="btn btn-success" @click="showTranslation">Terjemahan</button>
              <button class="btn btn-info" @click="showBoth">Kedua-duanya</button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-4">
            <div class="progress mb-3" style="height: 20px;">
              <div class="progress-bar progress-bar-striped progress-bar-animated" 
                   role="progressbar" 
                   :style="{ width: loadingProgress + '%' }" 
                   :aria-valuenow="loadingProgress" 
                   aria-valuemin="0" 
                   aria-valuemax="100">
                {{ loadingProgress }}%
              </div>
            </div>
            <p class="mt-2">Memuat ayat-ayat Juz {{ juzNumber }}...</p>
            <small class="text-muted">Mohon tunggu sebentar</small>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Terjadi Kesalahan</h4>
            <p>{{ error }}</p>
            <hr>
            <button class="btn btn-outline-danger" @click="retryLoading">
              Coba Lagi
            </button>
          </div>

          <!-- Verses Display -->
          <div v-else class="verses-container">
            <template v-for="(verse, index) in verses" :key="verse.id">
              <!-- Surah Header -->
              <div v-if="index === 0 || verses[index-1].surah_number !== verse.surah_number" 
                   class="surah-header mb-4 text-center">
                <h4>{{ verse.surah_name }}</h4>
              </div>

              <div class="verse-item mb-4">
                <div class="verse-number">
                  <span class="badge bg-primary">{{ verse.verse_number }}</span>
                </div>
                <div class="verse-content">
                  <p v-if="showArabicText" class="arabic-text" dir="rtl">{{ verse.text_uthmani }}</p>
                  <p v-if="showTranslationText" class="translation">{{ verse.translation }}</p>
                </div>
              </div>
            </template>

            <!-- Empty State -->
            <div v-if="verses.length === 0 && !isLoading" class="text-center py-4">
              <p class="text-muted">Tidak ada ayat yang ditampilkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const juzNumber = ref(parseInt(route.params.id))
const juzInfo = ref(null)
const verses = ref([])
const isLoading = ref(false)
const showArabicText = ref(true)
const showTranslationText = ref(true)
const error = ref(null)
const loadingProgress = ref(0)

const loadJuzData = async () => {
  isLoading.value = true
  error.value = null
  verses.value = []
  loadingProgress.value = 0

  try {
    // Langsung muat data juz dari endpoint yang lebih ringan
    const response = await fetch(
      `https://api.alquran.cloud/v1/juz/${juzNumber.value}/quran-uthmani`
    )
    
    if (!response.ok) {
      throw new Error('Gagal memuat data juz')
    }

    loadingProgress.value = 30
    const data = await response.json()
    
    if (!data.data || !data.data.ayahs) {
      throw new Error('Format data tidak valid')
    }

    loadingProgress.value = 50

    // Muat terjemahan secara terpisah
    const translationResponse = await fetch(
      `https://api.alquran.cloud/v1/juz/${juzNumber.value}/id.indonesian`
    )

    if (!translationResponse.ok) {
      throw new Error('Gagal memuat terjemahan')
    }

    loadingProgress.value = 80
    const translationData = await translationResponse.json()

    // Gabungkan data Arab dan terjemahan
    const combinedVerses = data.data.ayahs.map((ayah, index) => ({
      id: ayah.number,
      verse_number: ayah.numberInSurah,
      surah_number: ayah.surah.number,
      surah_name: ayah.surah.name,
      text_uthmani: ayah.text,
      translation: translationData.data.ayahs[index]?.text || 'Terjemahan tidak tersedia'
    }))

    verses.value = combinedVerses
    loadingProgress.value = 100

    // Set juz info
    juzInfo.value = {
      verse_mapping: {
        first: {
          surah_name: combinedVerses[0].surah_name,
          verse_number: combinedVerses[0].verse_number
        },
        last: {
          surah_name: combinedVerses[combinedVerses.length - 1].surah_name,
          verse_number: combinedVerses[combinedVerses.length - 1].verse_number
        }
      }
    }

  } catch (err) {
    console.error('Error:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const showArabic = () => {
  showArabicText.value = true
  showTranslationText.value = false
}

const showTranslation = () => {
  showArabicText.value = false
  showTranslationText.value = true
}

const showBoth = () => {
  showArabicText.value = true
  showTranslationText.value = true
}

const retryLoading = () => {
  loadJuzData()
}

onMounted(() => {
  loadJuzData()
})
</script>

<style scoped>
.juz-detail {
  padding: 20px 0;
}

.verse-item {
  position: relative;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

.verse-number {
  position: absolute;
  top: 10px;
  right: 10px;
}

.verse-number .badge {
  font-size: 1rem;
  padding: 8px 12px;
}

.verse-content {
  margin-top: 40px;
}

.arabic-text {
  font-size: 2rem;
  line-height: 2.5;
  text-align: right;
  margin-bottom: 15px;
  font-family: 'Scheherazade', 'Traditional Arabic', serif;
  color: #000;
  padding: 10px 0;
  direction: rtl;
  word-spacing: 0.2em;
  letter-spacing: 0.02em;
}

.translation {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  margin-top: 10px;
}

.progress {
  border-radius: 10px;
  background-color: #e9ecef;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
}

.progress-bar {
  background-color: #0d6efd;
  transition: width 0.3s ease;
}

.surah-header {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.surah-header h4 {
  margin: 0;
  color: #0d6efd;
  font-family: 'Scheherazade', serif;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 