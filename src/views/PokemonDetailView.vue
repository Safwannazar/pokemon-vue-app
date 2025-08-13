<template>
  <div class="pokemon-detail-view">
    <!-- Back Button -->
    <div class="container mt-3">
      <button 
        class="btn btn-outline-primary"
        @click="goBack"
      >
        <i class="bi bi-arrow-left me-2"></i>Back to Pokémon List
      </button>
    </div>

    <!-- Loading State -->
    <LoadingSpinner 
      v-if="loading"
      title="Loading Pokémon Details..."
      subtitle="Fetching comprehensive information"
      :fullscreen="false"
      size="large"
    />

    <!-- Error State -->
    <div v-else-if="error" class="container mt-4">
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Error:</strong> {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchPokemonData">
          <i class="bi bi-arrow-clockwise me-1"></i>Retry
        </button>
      </div>
    </div>

    <!-- Pokemon Details -->
    <div v-else-if="pokemon" class="container mt-4">
      <!-- Header Section -->
      <div class="pokemon-header mb-5">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="pokemon-image-section text-center">
              <div class="pokemon-id-large mb-3">
                #{{ String(pokemon.id).padStart(3, '0') }}
              </div>
              <img 
                :src="pokemon.image || placeholderImage"
                :alt="pokemon.name"
                class="pokemon-main-image img-fluid"
                @error="handleImageError"
              >
              
              <!-- Additional Images -->
              <div class="pokemon-image-gallery mt-3">
                <div class="row g-2 justify-content-center">
                  <div class="col-3" v-if="pokemon.images?.front_default">
                    <img 
                      :src="pokemon.images.front_default"
                      :alt="`${pokemon.name} front`"
                      class="img-fluid gallery-image"
                      @click="setMainImage(pokemon.images.front_default)"
                    >
                  </div>
                  <div class="col-3" v-if="pokemon.images?.front_shiny">
                    <img 
                      :src="pokemon.images.front_shiny"
                      :alt="`${pokemon.name} shiny`"
                      class="img-fluid gallery-image"
                      @click="setMainImage(pokemon.images.front_shiny)"
                    >
                  </div>
                  <div class="col-3" v-if="pokemon.images?.back_default">
                    <img 
                      :src="pokemon.images.back_default"
                      :alt="`${pokemon.name} back`"
                      class="img-fluid gallery-image"
                      @click="setMainImage(pokemon.images.back_default)"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="pokemon-basic-info">
              <h1 class="pokemon-name display-4 fw-bold mb-3">
                {{ capitalizedName }}
                <span v-if="pokemonStore.isPokemonEdited(routeId)" class="badge bg-warning text-dark ms-2">
                  <i class="bi bi-pencil-fill"></i> Edited
                </span>
              </h1>
              
              <!-- Types -->
              <div class="pokemon-types mb-4">
                <span 
                  v-for="type in pokemon.types" 
                  :key="type"
                  :class="`badge type-${type} me-2`"
                  class="type-badge-large text-white"
                >
                  {{ capitalizeWord(type) }}
                </span>
              </div>
              
              <!-- Description -->
              <div class="pokemon-description mb-4">
                <p class="lead text-muted">{{ pokemon.description }}</p>
              </div>
              
              <!-- Quick Stats -->
              <div class="pokemon-quick-stats">
                <div class="row g-3">
                  <div class="col-6 col-sm-3">
                    <div class="stat-card text-center">
                      <div class="stat-icon">
                        <i class="bi bi-arrows-vertical text-primary"></i>
                      </div>
                      <div class="stat-value">{{ formatHeight(pokemon.height) }}</div>
                      <div class="stat-label">Height</div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-3">
                    <div class="stat-card text-center">
                      <div class="stat-icon">
                        <i class="bi bi-speedometer2 text-success"></i>
                      </div>
                      <div class="stat-value">{{ formatWeight(pokemon.weight) }}</div>
                      <div class="stat-label">Weight</div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-3">
                    <div class="stat-card text-center">
                      <div class="stat-icon">
                        <i class="bi bi-star-fill text-warning"></i>
                      </div>
                      <div class="stat-value">{{ pokemon.base_experience || 'N/A' }}</div>
                      <div class="stat-label">Base Exp</div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-3">
                    <div class="stat-card text-center">
                      <div class="stat-icon">
                        <i class="bi bi-lightning-fill text-danger"></i>
                      </div>
                      <div class="stat-value">{{ pokemon.abilities?.length || 0 }}</div>
                      <div class="stat-label">Abilities</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Edit Button -->
              <div class="pokemon-actions mt-4">
                <button 
                  class="btn btn-warning btn-lg"
                  @click="showEditModal = true"
                >
                  <i class="bi bi-pencil-fill me-2"></i>Edit Pokémon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Information Tabs -->
      <div class="pokemon-details-tabs">
        <ul class="nav nav-tabs nav-fill mb-4" id="pokemonTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab">
              <i class="bi bi-bar-chart-fill me-2"></i>Stats
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="abilities-tab" data-bs-toggle="tab" data-bs-target="#abilities" type="button" role="tab">
              <i class="bi bi-lightning-fill me-2"></i>Abilities
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="moves-tab" data-bs-toggle="tab" data-bs-target="#moves" type="button" role="tab">
              <i class="bi bi-shield-fill me-2"></i>Moves
            </button>
          </li>
        </ul>

        <div class="tab-content" id="pokemonTabsContent">
          <!-- Stats Tab -->
          <div class="tab-pane fade show active" id="stats" role="tabpanel">
            <div class="stats-section">
              <h3 class="mb-4">Base Statistics</h3>
              <div class="stats-list">
                <div 
                  v-for="stat in pokemon.stats" 
                  :key="stat.name"
                  class="stat-item mb-3"
                >
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="stat-name">{{ formatStatName(stat.name) }}</span>
                    <span class="stat-value-badge badge bg-primary">{{ stat.base_stat }}</span>
                  </div>
                  <div class="progress">
                    <div 
                      class="progress-bar"
                      :class="getStatColor(stat.base_stat)"
                      role="progressbar"
                      :style="{ width: `${(stat.base_stat / 255) * 100}%` }"
                      :aria-valuenow="stat.base_stat"
                      aria-valuemin="0"
                      aria-valuemax="255"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Abilities Tab -->
          <div class="tab-pane fade" id="abilities" role="tabpanel">
            <div class="abilities-section">
              <h3 class="mb-4">Abilities</h3>
              <div class="row g-3">
                <div 
                  v-for="ability in pokemon.abilities" 
                  :key="ability.name"
                  class="col-md-6"
                >
                  <div class="ability-card">
                    <div class="card h-100">
                      <div class="card-body">
                        <h5 class="card-title d-flex align-items-center">
                          {{ capitalizeWord(ability.name.replace('-', ' ')) }}
                          <span v-if="ability.is_hidden" class="badge bg-secondary ms-2">Hidden</span>
                        </h5>
                        <p class="card-text text-muted">
                          This is {{ ability.is_hidden ? 'a hidden' : 'a normal' }} ability that provides special effects during battle.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Moves Tab -->
          <div class="tab-pane fade" id="moves" role="tabpanel">
            <div class="moves-section">
              <h3 class="mb-4">Sample Moves</h3>
              <div class="row g-2">
                <div 
                  v-for="move in pokemon.moves" 
                  :key="move"
                  class="col-md-4 col-sm-6"
                >
                  <div class="move-badge">
                    <span class="badge bg-light text-dark border w-100 p-2">
                      {{ capitalizeWord(move.replace('-', ' ')) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <small class="text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  Showing first 10 moves. This Pokémon can learn many more moves through leveling up, TMs, and breeding.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div 
      class="modal fade" 
      id="editModal" 
      tabindex="-1" 
      aria-labelledby="editModalLabel" 
      aria-hidden="true"
      :class="{ show: showEditModal }"
      :style="{ display: showEditModal ? 'block' : 'none' }"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">
              <i class="bi bi-pencil-fill me-2"></i>Edit {{ capitalizedName }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showEditModal = false"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="saveEdit">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="editName" class="form-label">Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="editName"
                    v-model="editForm.name"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label for="editHeight" class="form-label">Height (decimeters)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="editHeight"
                    v-model.number="editForm.height"
                    min="1"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label for="editWeight" class="form-label">Weight (hectograms)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="editWeight"
                    v-model.number="editForm.weight"
                    min="1"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label for="editBaseExp" class="form-label">Base Experience</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="editBaseExp"
                    v-model.number="editForm.base_experience"
                    min="0"
                  >
                </div>
                <div class="col-12">
                  <label for="editDescription" class="form-label">Description</label>
                  <textarea 
                    class="form-control" 
                    id="editDescription"
                    v-model="editForm.description"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="showEditModal = false"
              >
                Cancel
              </button>
              <button 
                type="button" 
                class="btn btn-outline-warning" 
                @click="resetEdit"
                v-if="pokemonStore.isPokemonEdited(routeId)"
              >
                <i class="bi bi-arrow-clockwise me-1"></i>Reset to Original
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
              >
                <i class="bi bi-check-lg me-1"></i>Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div 
      v-if="showEditModal"
      class="modal-backdrop fade show"
      @click="showEditModal = false"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonStore } from '../stores/pokemonStore'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
  name: 'PokemonDetailView',
  components: {
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const pokemonStore = usePokemonStore()
    
    // Reactive data
    const loading = ref(false)
    const error = ref(null)
    const showEditModal = ref(false)
    const mainImage = ref('')
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
    
    // Edit form
    const editForm = reactive({
      name: '',
      height: 0,
      weight: 0,
      base_experience: 0,
      description: ''
    })

    // Computed properties
    const routeId = computed(() => route.params.id)
    
    const pokemon = computed(() => {
      return pokemonStore.getPokemonById(routeId.value)
    })
    
    const capitalizedName = computed(() => {
      if (!pokemon.value) return ''
      return pokemon.value.name.charAt(0).toUpperCase() + pokemon.value.name.slice(1)
    })

    // Methods
    const capitalizeWord = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }

    const formatHeight = (height) => {
      return `${(height / 10).toFixed(1)}m`
    }

    const formatWeight = (weight) => {
      return `${(weight / 10).toFixed(1)}kg`
    }

    const formatStatName = (statName) => {
      const statNames = {
        'hp': 'HP',
        'attack': 'Attack',
        'defense': 'Defense',
        'special-attack': 'Sp. Attack',
        'special-defense': 'Sp. Defense',
        'speed': 'Speed'
      }
      return statNames[statName] || capitalizeWord(statName.replace('-', ' '))
    }

    const getStatColor = (value) => {
      if (value >= 100) return 'bg-success'
      if (value >= 80) return 'bg-info'
      if (value >= 60) return 'bg-warning'
      return 'bg-danger'
    }

    const setMainImage = (imageUrl) => {
      mainImage.value = imageUrl
    }

    const handleImageError = (event) => {
      event.target.src = placeholderImage
    }

    const goBack = () => {
      router.push('/')
    }

    const fetchPokemonData = async () => {
      loading.value = true
      error.value = null
      
      try {
        await pokemonStore.fetchPokemonDetails(routeId.value)
        
        // Set main image
        if (pokemon.value?.image) {
          mainImage.value = pokemon.value.image
        }
      } catch (err) {
        error.value = err.message || 'Failed to load Pokémon details'
      } finally {
        loading.value = false
      }
    }

    const initializeEditForm = () => {
      if (pokemon.value) {
        editForm.name = pokemon.value.name
        editForm.height = pokemon.value.height
        editForm.weight = pokemon.value.weight
        editForm.base_experience = pokemon.value.base_experience || 0
        editForm.description = pokemon.value.description || ''
      }
    }

    const saveEdit = () => {
      pokemonStore.editPokemon(routeId.value, {
        name: editForm.name,
        height: editForm.height,
        weight: editForm.weight,
        base_experience: editForm.base_experience,
        description: editForm.description
      })
      
      showEditModal.value = false
      
      // Show success message (you could implement a toast notification here)
      console.log('Pokémon updated successfully!')
    }

    const resetEdit = () => {
      pokemonStore.resetPokemonEdits(routeId.value)
      initializeEditForm()
      showEditModal.value = false
      
      // Show success message
      console.log('Pokémon reset to original values!')
    }

    // Watch for pokemon changes to update edit form
    watch(pokemon, () => {
      if (pokemon.value) {
        initializeEditForm()
      }
    }, { immediate: true })

    // Lifecycle
    onMounted(async () => {
      await fetchPokemonData()
    })

    return {
      loading,
      error,
      pokemon,
      capitalizedName,
      routeId,
      pokemonStore,
      showEditModal,
      editForm,
      mainImage,
      placeholderImage,
      capitalizeWord,
      formatHeight,
      formatWeight,
      formatStatName,
      getStatColor,
      setMainImage,
      handleImageError,
      goBack,
      fetchPokemonData,
      saveEdit,
      resetEdit
    }
  }
}
</script>

<style scoped>
.pokemon-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding-bottom: 3rem;
}

/* Pokemon Header */
.pokemon-header {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.pokemon-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, transparent 70%);
  z-index: 0;
}

.pokemon-header > .row {
  position: relative;
  z-index: 1;
}

.pokemon-id-large {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6c757d;
  background: rgba(108, 117, 125, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  display: inline-block;
}

.pokemon-main-image {
  max-height: 300px;
  max-width: 300px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.pokemon-main-image:hover {
  transform: scale(1.05);
}

.gallery-image {
  max-height: 60px;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.gallery-image:hover {
  border-color: #0d6efd;
  transform: scale(1.1);
}

.pokemon-name {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.type-badge-large {
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  border-radius: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid rgba(255,255,255,0.3);
}

.pokemon-description {
  background: rgba(248, 249, 250, 0.8);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid #0d6efd;
}

.stat-card {
  background: rgba(248, 249, 250, 0.8);
  padding: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.1);
}

.stat-card:hover {
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.stat-icon i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tabs */
.pokemon-details-tabs {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
}

.nav-tabs {
  border-bottom: 2px solid #dee2e6;
}

.nav-tabs .nav-link {
  border: none;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #6c757d;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  border: none;
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.nav-tabs .nav-link.active {
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
}

/* Stats Section */
.stats-section {
  padding: 1rem 0;
}

.stat-item {
  background: rgba(248, 249, 250, 0.5);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0,0,0,0.05);
}

.stat-name {
  font-weight: 600;
  color: #2c3e50;
  text-transform: capitalize;
}

.stat-value-badge {
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
}

.progress {
  height: 8px;
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}

.progress-bar {
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* Abilities Section */
.ability-card .card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.1);
}

.ability-card .card:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.ability-card .card-title {
  color: #2c3e50;
  font-size: 1.1rem;
}

/* Moves Section */
.move-badge {
  margin-bottom: 0.5rem;
}

.move-badge .badge {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.6rem 1rem;
  text-transform: capitalize;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.move-badge .badge:hover {
  background-color: #0d6efd !important;
  color: white !important;
  transform: translateY(-1px);
}

/* Modal Styling */
.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.modal-header {
  background: linear-gradient(135deg, #0d6efd, #0b5ed7);
  color: white;
  border-radius: 1rem 1rem 0 0;
  padding: 1.5rem 2rem;
}

.modal-header .btn-close {
  filter: invert(1);
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(0,0,0,0.1);
}

/* Form Styling */
.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Responsive Design */
@media (max-width: 768px) {
  .pokemon-header,
  .pokemon-details-tabs {
    padding: 1.5rem;
    margin: 0 -15px;
    border-radius: 0;
  }
  
  .pokemon-main-image {
    max-height: 200px;
    max-width: 200px;
  }
  
  .pokemon-name {
    font-size: 2rem;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .nav-tabs .nav-link {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .modal-dialog {
    margin: 1rem;
  }
  
  .modal-body,
  .modal-footer {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .display-4 {
    font-size: 1.8rem;
  }
  
  .type-badge-large {
    font-size: 0.85rem;
    padding: 0.4rem 1rem;
    margin-bottom: 0.5rem;
    display: inline-block;
  }
  
  .pokemon-quick-stats .row {
    --bs-gutter-x: 0.5rem;
  }
  
  .stat-card {
    padding: 0.75rem 0.5rem;
  }
  
  .stat-icon i {
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .nav-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  
  .nav-tabs .nav-link {
    white-space: nowrap;
    min-width: fit-content;
  }
}

/* Animation Classes */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pokemon-header {
  animation: slideInUp 0.6s ease-out;
}

.pokemon-details-tabs {
  animation: slideInUp 0.6s ease-out 0.2s both;
}

/* Loading and Error States */
.alert {
  border-radius: 0.5rem;
  border: none;
}

.alert-danger {
  background: linear-gradient(135deg, #f8d7da, #f5c2c7);
  color: #721c24;
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  .pokemon-main-image:hover,
  .gallery-image:hover,
  .stat-card:hover,
  .ability-card .card:hover,
  .move-badge .badge:hover {
    transform: none;
  }
  
  .pokemon-header,
  .pokemon-details-tabs {
    animation: none;
  }
}

/* Focus States */
.gallery-image:focus,
.nav-link:focus,
.btn:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* Custom Scrollbar for Modal */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #0d6efd;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #0b5ed7;
}
</style>