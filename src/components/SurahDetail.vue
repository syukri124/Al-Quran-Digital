<template>
  <div class="surah-detail">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="mb-0">{{ surah.name_simple }}</h3>
              <p class="mb-0 mt-2 arabic-title">{{ surah.name_arabic }}</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary" @click="showArabic">Teks Arab</button>
              <button class="btn btn-success" @click="showTranslation">Terjemahan</button>
              <button class="btn btn-info" @click="showBoth">Kedua-duanya</button>
            </div>
          </div>
          <div class="mt-3">
            <p class="mb-0">Jumlah Ayat: {{ surah.verses_count }}</p>
            <p class="mb-0">Tempat Turun: {{ surah.revelation_place === 'makkah' ? 'Mekah' : 'Madinah' }}</p>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Memuat ayat...</p>
          </div>

          <!-- Verses Display -->
          <div v-else class="verses-container">
            <div v-for="verse in verses" :key="verse.id" class="verse-item mb-4">
              <div class="verse-header" v-if="verse.verse_number">
                <div class="verse-number">
                  <span class="badge bg-primary">{{ verse.verse_number }}</span>
                </div>
              </div>
              <div class="verse-content" :class="{ 'basmalah': !verse.verse_number }">
                <p v-if="showArabicText" class="arabic-text" dir="rtl">{{ verse.text_uthmani }}</p>
                <p v-if="showTranslationText" class="translation">{{ verse.translation }}</p>
              </div>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-center mt-4">
              <button 
                class="btn btn-primary me-2" 
                @click="loadMoreVerses" 
                :disabled="isLoadingMore || !hasMoreVerses"
              >
                <span v-if="isLoadingMore" class="spinner-border spinner-border-sm me-2" role="status"></span>
                Muat Lebih Banyak
              </button>
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
const surah = ref({})
const verses = ref([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const showArabicText = ref(true)
const showTranslationText = ref(true)
const currentPage = ref(1)
const perPage = 10
const hasMoreVerses = ref(true)

const loadSurah = async () => {
  isLoading.value = true
  try {
    const surahResponse = await fetch(`https://api.quran.com/api/v4/chapters/${route.params.id}`)
    const surahData = await surahResponse.json()
    surah.value = surahData.chapter
    await loadVerses()
  } catch (error) {
    console.error('Error loading surah:', error)
  } finally {
    isLoading.value = false
  }
}

const loadVerses = async () => {
  try {
    const versesResponse = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${route.params.id}?translations=33&language=id&page=${currentPage.value}&per_page=${perPage}&fields=text_uthmani`
    )
    const versesData = await versesResponse.json()
    
    const newVerses = versesData.verses.map(verse => ({
      id: verse.id,
      verse_number: verse.verse_number,
      text_uthmani: verse.text_uthmani || 'Teks Arab tidak tersedia',
      translation: (verse.translations[0]?.text || 'Terjemahan tidak tersedia')
        .replace(/<sup[^>]*>.*?<\/sup>/g, '')
        .replace(/<foot_note=.*?>/g, '')
        .trim()
    }))

    verses.value = currentPage.value === 1 ? newVerses : [...verses.value, ...newVerses]
    hasMoreVerses.value = versesData.pagination.total_pages > currentPage.value
  } catch (error) {
    console.error('Error loading verses:', error)
  }
}

const loadMoreVerses = async () => {
  if (isLoadingMore.value || !hasMoreVerses.value) return
  isLoadingMore.value = true
  currentPage.value++
  await loadVerses()
  isLoadingMore.value = false
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

onMounted(() => {
  loadSurah()
})
</script>

<style scoped>
.surah-detail {
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
