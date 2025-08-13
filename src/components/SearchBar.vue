<template>
  <div class="search-container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="search-wrapper position-relative">
          <div class="input-group input-group-lg">
            <span class="input-group-text bg-white border-end-0">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              class="form-control border-start-0 ps-0"
              placeholder="Search Pokémon by name..."
              v-model="localSearchQuery"
              @input="handleSearch"
              @keyup.enter="handleSearch"
              @keyup.esc="clearSearch"
            >
            <button
              v-if="localSearchQuery"
              class="btn btn-outline-secondary"
              type="button"
              @click="clearSearch"
              aria-label="Clear search"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          
          <!-- Search suggestions or results count -->
          <div v-if="showSuggestions && localSearchQuery" class="search-suggestions">
            <div class="card shadow-sm">
              <div class="card-body py-2">
                <small class="text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  {{ filteredCount }} Pokémon found
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search tips -->
    <div class="row justify-content-center mt-3">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="search-tips text-center">
          <small class="text-muted">
            <i class="bi bi-lightbulb me-1"></i>
            <strong>Tip:</strong> Press <kbd>Esc</kbd> to clear search
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from '../stores/pokemonStore'
import { computed, ref, watch } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    showSuggestions: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Search Pokémon by name...'
    }
  },
  setup(props) {
    const pokemonStore = usePokemonStore()
    const localSearchQuery = ref('')

    // Computed property for filtered count
    const filteredCount = computed(() => {
      return pokemonStore.filteredPokemons.length
    })

    // Watch for changes in the store's search query and sync with local
    watch(() => pokemonStore.searchQuery, (newQuery) => {
      localSearchQuery.value = newQuery
    }, { immediate: true })

    // Handle search input with debouncing
    let searchTimeout = null
    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        pokemonStore.setSearchQuery(localSearchQuery.value)
      }, 300) // 300ms debounce
    }

    // Clear search
    const clearSearch = () => {
      localSearchQuery.value = ''
      pokemonStore.clearSearch()
    }

    return {
      localSearchQuery,
      filteredCount,
      handleSearch,
      clearSearch
    }
  }
}
</script>

<style scoped>
.search-container {
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: -1px -15px 0 -15px;
}

.search-wrapper {
  margin-bottom: 1rem;
}

.input-group-text {
  background-color: white !important;
  border-color: #ced4da;
}

.form-control {
  background-color: white;
  border-color: #ced4da;
  box-shadow: none;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-top: 0.25rem;
}

.search-tips {
  animation: fadeIn 0.5s ease-in-out;
}

.search-tips kbd {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.search-tips small {
  color: rgba(255, 255, 255, 0.8) !important;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .search-container {
    padding: 1.5rem 0;
  }
  
  .input-group-lg .form-control {
    font-size: 1rem;
  }
  
  .search-tips {
    font-size: 0.8rem;
  }
}

/* Focus styles for accessibility */
.btn:focus,
.form-control:focus {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Clear button hover effect */
.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}
</style>