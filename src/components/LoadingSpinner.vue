<template>
  <div class="loading-container d-flex flex-column justify-content-center align-items-center" :class="containerClass">
    <div class="spinner-container">
      <!-- Pokeball Spinner -->
      <div class="pokeball-spinner">
        <div class="pokeball">
          <div class="pokeball-top"></div>
          <div class="pokeball-middle"></div>
          <div class="pokeball-bottom"></div>
          <div class="pokeball-center">
            <div class="pokeball-button"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading-text mt-3">
      <h5 class="text-primary mb-2">{{ title }}</h5>
      <p class="text-muted mb-0">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    title: {
      type: String,
      default: 'Loading Pokémon...'
    },
    subtitle: {
      type: String,
      default: 'Please wait while we fetch the data'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: value => ['small', 'medium', 'large'].includes(value)
    }
  },
  computed: {
    containerClass() {
      return {
        'loading-fullscreen': this.fullscreen,
        'loading-inline': !this.fullscreen,
        [`loading-${this.size}`]: true
      }
    }
  }
}
</script>

<style scoped>
.loading-container {
  min-height: 200px;
}

.loading-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 9999;
  min-height: 100vh;
}

.loading-inline {
  padding: 3rem 1rem;
}

/* Pokeball Spinner Animation */
.pokeball-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokeball {
  width: 60px;
  height: 60px;
  position: relative;
  animation: spin 2s linear infinite;
}

.loading-small .pokeball {
  width: 40px;
  height: 40px;
}

.loading-large .pokeball {
  width: 80px;
  height: 80px;
}

.pokeball-top {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  position: absolute;
  top: 0;
  border: 2px solid #333;
  border-bottom: 1px solid #333;
}

.pokeball-bottom {
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  position: absolute;
  bottom: 0;
  border: 2px solid #333;
  border-top: 1px solid #333;
}

.pokeball-middle {
  width: 100%;
  height: 4px;
  background: #333;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.pokeball-center {
  width: 20px;
  height: 20px;
  background: #f8f9fa;
  border: 3px solid #333;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokeball-button {
  width: 8px;
  height: 8px;
  background: #6c757d;
  border-radius: 50%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Text animations */
.loading-text {
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .loading-container {
    min-height: 150px;
  }
  
  .pokeball {
    width: 50px;
    height: 50px;
  }
  
  .loading-text h5 {
    font-size: 1.1rem;
  }
  
  .loading-text p {
    font-size: 0.9rem;
  }
}
</style>