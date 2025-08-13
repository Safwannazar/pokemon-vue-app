<template>
  <div class="col">
    <div 
      class="card h-100 pokemon-card shadow-sm"
      @click="goToPokemonDetail"
      role="button"
      tabindex="0"
      @keyup.enter="goToPokemonDetail"
      @keyup.space="goToPokemonDetail"
    >
      <!-- Pokemon Image -->
      <div class="card-img-top-wrapper position-relative">
        <div class="pokemon-id-badge">
          #{{ String(pokemon.id).padStart(3, '0') }}
        </div>
        
        <img 
          :src="pokemon.image || placeholderImage" 
          :alt="pokemon.name"
          class="card-img-top pokemon-image"
          @error="handleImageError"
          loading="lazy"
        >
        
        <!-- Loading overlay for image -->
        <div v-if="imageLoading" class="image-loading-overlay">
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body d-flex flex-column">
        <!-- Pokemon Name -->
        <h5 class="card-title pokemon-name text-center mb-3">
          {{ capitalizedName }}
        </h5>

        <!-- Pokemon Types -->
        <div class="pokemon-types d-flex justify-content-center flex-wrap gap-2 mb-3">
          <span 
            v-for="type in pokemon.types" 
            :key="type"
            :class="`badge type-${type}`"
            class="type-badge text-white"
          >
            {{ capitalizeWord(type) }}
          </span>
        </div>

        <!-- Pokemon Stats -->
        <div class="pokemon-stats row text-center mt-auto">
          <div class="col-6">
            <div class="stat-item">
              <i class="bi bi-arrows-vertical text-primary"></i>
              <div class="stat-value">{{ formatHeight(pokemon.height) }}</div>
              <div class="stat-label">Height</div>
            </div>
          </div>
          <div class="col-6">
            <div class="stat-item">
              <i class="bi bi-speedometer2 text-success"></i>
              <div class="stat-value">{{ formatWeight(pokemon.weight) }}</div>
              <div class="stat-label">Weight</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer bg-transparent border-0 pt-0">
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary btn-sm w-100" @click.stop="goToPokemonDetail">
            <i class="bi bi-eye me-2"></i>View Details
          </button>
        </div>
      </div>

      <!-- Hover overlay -->
      <div class="card-hover-overlay">
        <div class="hover-content">
          <i class="bi bi-arrow-right-circle-fill"></i>
          <span>Click to explore</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
      validator(value) {
        return value && typeof value.id !== 'undefined' && value.name
      }
    }
  },
  setup(props) {
    const router = useRouter()
    const imageLoading = ref(true)
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'

    // Computed properties
    const capitalizedName = computed(() => {
      return props.pokemon.name.charAt(0).toUpperCase() + props.pokemon.name.slice(1)
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

    const goToPokemonDetail = () => {
      router.push(`/pokemon/${props.pokemon.id}`)
    }

    const handleImageError = (event) => {
      event.target.src = placeholderImage
      imageLoading.value = false
    }

    const handleImageLoad = () => {
      imageLoading.value = false
    }

    return {
      imageLoading,
      placeholderImage,
      capitalizedName,
      capitalizeWord,
      formatHeight,
      formatWeight,
      goToPokemonDetail,
      handleImageError,
      handleImageLoad
    }
  }
}
</script>

<style scoped>
.pokemon-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  position: relative;
  overflow: hidden;
}

.pokemon-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important;
  border-color: #0d6efd;
}

.pokemon-card:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.card-img-top-wrapper {
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pokemon-image {
  max-height: 180px;
  max-width: 180px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.pokemon-card:hover .pokemon-image {
  transform: scale(1.1);
}

.pokemon-id-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
}

.image-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.pokemon-name {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.type-badge {
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
  border-radius: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
}

.pokemon-stats {
  background: rgba(248,249,250,0.8);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-item i {
  font-size: 1.2rem;
}

.stat-value {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 110, 253, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.pokemon-card:hover .card-hover-overlay {
  opacity: 1;
}

.hover-content {
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.hover-content i {
  font-size: 2rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .card-img-top-wrapper {
    height: 150px;
  }
  
  .pokemon-image {
    max-height: 130px;
    max-width: 130px;
  }
  
  .pokemon-name {
    font-size: 1.1rem;
  }
  
  .type-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }
}

/* Animation for card appearance */
@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pokemon-card {
  animation: cardAppear 0.5s ease-out;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .pokemon-card,
  .pokemon-image,
  .card-hover-overlay {
    transition: none;
  }
  
  .pokemon-card:hover {
    transform: none;
  }
  
  .pokemon-card:hover .pokemon-image {
    transform: none;
  }
}
</style>