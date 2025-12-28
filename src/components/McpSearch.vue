<template>
  <div class="mcp-search-container">
    <div class="search-hero">
      <h1>MCP Search</h1>
      <p class="subtitle">
        Search the web and local knowledge with BabbageBox MCP.
      </p>

      <div class="search-input-wrapper glass">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          v-model="query"
          type="text"
          placeholder="What do you want to find?"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch" :disabled="loading">
          <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
          <span v-else>Search</span>
        </button>
      </div>
    </div>

    <div class="results-area">
      <div v-if="loading" class="loading-state">
        <div class="loader-pulse"></div>
        <p>Gathering information...</p>
      </div>

      <div v-else-if="results.length > 0" class="results-list">
        <div v-if="providers.length > 0" class="providers-tag">
          <span>Sources:</span>
          <span v-for="p in providers" :key="p" class="provider-badge">{{
            p
          }}</span>
        </div>

        <div v-for="(res, idx) in results" :key="idx" class="result-card glass">
          <div class="result-icon">
            <i class="fa-solid fa-file-invoice"></i>
          </div>
          <div class="result-content">
            <p>{{ res }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="searched" class="empty-results">
        <i class="fa-solid fa-ghost"></i>
        <p>No specifics found. Try a different query.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
const results = ref<string[]>([])
const providers = ref<string[]>([])
const loading = ref(false)
const searched = ref(false)

async function handleSearch() {
  if (!query.value.trim() || loading.value) return

  loading.value = true
  searched.value = true
  results.value = []
  providers.value = []

  try {
    const res = await fetch('http://localhost:8000/api/mcp/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query.value, top_k: 5 }),
    })

    if (res.ok) {
      const data = await res.json()
      results.value = data.results
      providers.value = data.providers
    }
  } catch (e) {
    console.error('Search failed:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.mcp-search-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.search-hero {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-color), #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.search-input-wrapper {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 24px;
  border-radius: 99px;
  background: var(--nav-pill-bg);
  border: 1px solid var(--border-subtle);
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 0 30px var(--accent-shadow);
  transform: translateY(-2px);
}

.search-icon {
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.search-input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.search-input-wrapper input:focus {
  outline: none;
}

.search-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 99px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-btn:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.results-area {
  min-height: 200px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  color: var(--text-secondary);
}

.loader-pulse {
  width: 40px;
  height: 40px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.providers-tag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.provider-badge {
  background: var(--nav-pill-bg);
  padding: 2px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
  text-transform: uppercase;
}

.result-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--border-subtle);
  transition: all 0.2s;
}

.result-card:hover {
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.03);
}

.result-icon {
  width: 40px;
  height: 40px;
  background: var(--nav-pill-bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  flex-shrink: 0;
}

.result-content p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-primary);
}

.empty-results {
  text-align: center;
  color: var(--text-secondary);
  opacity: 0.5;
  margin-top: 2rem;
}

.empty-results i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 640px) {
  .mcp-search-container {
    padding: 2rem 1rem;
  }
  .search-hero h1 {
    font-size: 1.8rem;
  }
  .search-input-wrapper {
    padding: 4px 4px 4px 16px;
  }
  .search-btn {
    padding: 10px 20px;
  }
}
</style>
