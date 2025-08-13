<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="display-4 fw-bold text-white mb-4">
                Discover the World of 
                <span class="text-warning">Pokémon</span>
              </h1>
              <p class="lead text-white-50 mb-4">
                Explore detailed information about your favorite Pokémon, 
                including stats, types, abilities, and more!
              </p>
              <div class="hero-stats row text-center">
                <div class="col-4">
                  <div class="stat-number text-warning fw-bold">100+</div>
                  <div class="stat-label text-white-50">Pokémon</div>
                </div>
                <div class="col-4">
                  <div class="stat-number text-warning fw-bold">18</div>
                  <div class="stat-label text-white-50">Types</div>
                </div>
                <div class="col-4">
                  <div class="stat-number text-warning fw-bold">∞</div>
                  <div class="stat-label text-white-50">Adventure</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image text-center">
              <div class="floating-pokeball">
                <div class="pokeball-large">
                  <div class="pokeball-top"></div>
                  <div class="pokeball-middle"></div>
                  <div class="pokeball-bottom"></div>
                  <div class="pokeball-center">
                    <div class="pokeball-button"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section">
      <div class="container-fluid">
        <SearchBar :show-suggestions="true" />
      </div>
    </section>

    <!-- Main Content -->
    <section class="main-content py-5">
      <div class="container">
        <!-- Error State -->
        <div v-if="pokemonStore.error" class="row">
          <div class="col-12">
            <div class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <strong>Oops!</strong> {{ pokemonStore.error }}
                <button 
                  class="btn btn-sm btn-outline-danger ms-3" 
                  @click="retryFetch"
                >
                  <i class="bi bi-arrow-clockwise me-1"></i>Retry
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <LoadingSpinner 
          v-if="pokemonStore.loading && pokemonStore.pokemons.length === 0"
          title="Loading Pokémon..."
          subtitle="Fetching data from PokéAPI"
          size="large"
        />

        <!-- Content -->
        <div v-else>
          <!-- Results Header -->
          <div class="row mb-4" v-if="!pokemonStore.loading">
            <div class="col-12">
              <div class="results-header d-flex justify-content-between align-items-center flex-wrap">
                <div class="results-info">
                  <h2 class="h4 mb-1">
                    <span v-if="pokemonStore.searchQuery">
                      Search Results for "{{ pokemonStore.searchQuery }}"
                    </span>
                    <span v-else>All Pokémon</span>
                  </h2>
                  <p class="text-muted mb-0">
                    Showing {{ filteredPokemons.length }} of {{ pokemonStore.pokemons.length }} Pokémon
                  </p>
                </div>
                
                <div class="results-actions">
                  <button 
                    v-if="pokemonStore.searchQuery" 
                    class="btn btn-outline-secondary btn-sm"
                    @click="clearSearch"
                  >
                    <i class="bi bi-x-circle me-1"></i>Clear Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="filteredPokemons.length === 0 && !pokemonStore.loading" class="row">
            <div class="col-12">
              <div class="no-results text-center py-5">
                <div class="no-results-icon mb-3">
                  <i class="bi bi-search display-1 text-muted"></i>
                </div>
                <h3 class="h4 mb-3">No Pokémon Found</h3>
                <p class="text-muted mb-4">
                  <span v-if="pokemonStore.searchQuery">
                    We couldn't find any Pokémon matching "{{ pokemonStore.searchQuery }}".
                  </span>
                  <span v-else>
                    No Pokémon data available at the moment.
                  </span>
                </p>
                <div class="no-results-actions">
                  <button 
                    v-if="pokemonStore.searchQuery" 
                    class="btn btn-primary me-2"
                    @click="clearSearch"
                  >
                    <i class="bi bi-arrow-left me-1"></i>Show All Pokémon
                  </button>
                  <button 
                    v-else
                    class="btn btn-primary"
                    @click="retryFetch"
                  >
                    <i class="bi bi-arrow-clockwise me-1"></i>Retry Loading
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pokemon Grid -->
          <div v-if="filteredPokemons.length > 0" class="pokemon-grid">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
              <PokemonCard 
                v-for="pokemon in filteredPokemons" 
                :key="pokemon.id"
                :pokemon="pokemon"
              />
            </div>
          </div>

          <!-- Load More Button (for future pagination) -->
          <div v-if="filteredPokemons.length > 0 && !pokemonStore.loading" class="row mt-5">
            <div class="col-12 text-center">
              <div class="load-more-info">
                <p class="text-muted mb-0">
                  <i class="bi bi-info-circle me-1"></i>
                  Showing all available Pokémon (Limited to 100 for optimal performance)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section bg-light py-5" v-if="!pokemonStore.loading && pokemonStore.pokemons.length > 0">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2 class="h3 fw-bold">Features</h2>
            <p class="text-muted">Everything you need to explore the Pokémon world</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-search display-4 text-primary"></i>
              </div>
              <h4 class="h5 mb-3">Smart Search</h4>
              <p class="text-muted">Quickly find your favorite Pokémon by name with real-time filtering</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-phone display-4 text-success"></i>
              </div>
              <h4 class="h5 mb-3">Responsive Design</h4>
              <p class="text-muted">Optimized for all devices - desktop, tablet, and mobile</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-pencil-square display-4 text-warning"></i>
              </div>
              <h4 class="h5 mb-3">Edit Information</h4>
              <p class="text-muted">Customize Pokémon details and save your changes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { usePokemonStore } from '../stores/pokemonStore'
import PokemonCard from '../components/PokemonCard.vue'
import SearchBar from '../components/SearchBar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
  name: 'HomeView',
  components: {
    PokemonCard,
    SearchBar,
    LoadingSpinner
  },
  setup() {
    const pokemonStore = usePokemonStore()

    // Computed properties
    const filteredPokemons = computed(() => {
      return pokemonStore.filteredPokemons
    })

    // Methods
    const retryFetch = async () => {
      pokemonStore.clearError()
      await pokemonStore.fetchPokemons()
    }

    const clearSearch = () => {
      pokemonStore.clearSearch()
    }

    // Lifecycle
    onMounted(async () => {
      // Only fetch if we don't have pokemons already
      if (pokemonStore.pokemons.length === 0) {
        await pokemonStore.fetchPokemons()
      }
    })

    return {
      pokemonStore,
      filteredPokemons,
      retryFetch,
      clearSearch
    }
  }
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  background-size: 50px 50px;
}

.min-vh-50 {
  min-height: 50vh;
}

.hero-content {
  z-index: 2;
  position: relative;
}

.hero-stats .stat-number {
  font-size: 2rem;
  display: block;
}

.hero-stats .stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Floating Pokeball Animation */
.floating-pokeball {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
  75% { transform: translateY(-15px) rotate(270deg); }
}

.pokeball-large {
  width: 200px;
  height: 200px;
  position: relative;
  margin: 0 auto;
}

.pokeball-large .pokeball-top {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  border-top-left-radius: 200px;
  border-top-right-radius: 200px;
  position: absolute;
  top: 0;
  border: 4px solid #333;
  border-bottom: 2px solid #333;
}

.pokeball-large .pokeball-bottom {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom-left-radius: 200px;
  border-bottom-right-radius: 200px;
  position: absolute;
  bottom: 0;
  border: 4px solid #333;
  border-top: 2px solid #333;
}

.pokeball-large .pokeball-middle {
  width: 100%;
  height: 8px;
  background: #333;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.pokeball-large .pokeball-center {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border: 6px solid #333;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokeball-large .pokeball-button {
  width: 16px;
  height: 16px;
  background: #6c757d;
  border-radius: 50%;
}

/* Search Section */
.search-section {
  margin-top: -1px;
}

/* Results Header */
.results-header {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

/* No Results */
.no-results {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 3rem 2rem;
}

.no-results-icon i {
  opacity: 0.5;
}

/* Pokemon Grid */
.pokemon-grid {
  margin-top: 2rem;
}

/* Features Section */
.features-section {
  border-top: 1px solid #dee2e6;
}

.feature-card {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.feature-icon {
  opacity: 0.8;
}

/* Load More Info */
.load-more-info {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px dashed #dee2e6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    text-align: center;
  }
  
  .display-4 {
    font-size: 2.5rem;
  }
  
  .hero-stats .stat-number {
    font-size: 1.5rem;
  }
  
  .pokeball-large {
    width: 150px;
    height: 150px;
  }
  
  .pokeball-large .pokeball-center {
    width: 30px;
    height: 30px;
    border-width: 4px;
  }
  
  .pokeball-large .pokeball-button {
    width: 12px;
    height: 12px;
  }
  
  .results-header {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .results-header .results-info,
  .results-header .results-actions {
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .feature-card {
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .hero-stats {
    margin-top: 2rem;
  }
  
  .hero-stats .col-4 {
    margin-bottom: 1rem;
  }
  
  .no-results {
    padding: 2rem 1rem;
  }
  
  .pokemon-grid .row {
    --bs-gutter-x: 1rem;
  }
}

/* Animation delays for cards */
.pokemon-grid .col:nth-child(1) .pokemon-card { animation-delay: 0.1s; }
.pokemon-grid .col:nth-child(2) .pokemon-card { animation-delay: 0.2s; }
.pokemon-grid .col:nth-child(3) .pokemon-card { animation-delay: 0.3s; }
.pokemon-grid .col:nth-child(4) .pokemon-card { animation-delay: 0.4s; }
.pokemon-grid .col:nth-child(5) .pokemon-card { animation-delay: 0.5s; }

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .floating-pokeball {
    animation: none;
  }
  
  .feature-card:hover {
    transform: none;
  }
}

/* Focus states */
.btn:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Loading states */
.main-content {
  min-height: 60vh;
}

/* Error alert improvements */
.alert {
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 2px 10px rgba(220, 53, 69, 0.2);
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>