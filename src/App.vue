<template>
  <div id="app" class="min-vh-100 bg-light">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <span class="fs-4 me-2">⚡</span>
          <span class="fw-bold">PokéApp</span>
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact-active-class="active">
                <i class="bi bi-house-fill me-1"></i>Home
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container text-center">
        <div class="row">
          <div class="col-12">
            <p class="mb-2">
              Built with <i class="bi bi-heart-fill text-danger"></i> using 
              <strong>Vue 3</strong>, <strong>Bootstrap 5</strong> & <strong>Pinia</strong>
            </p>
            <p class="text-muted mb-0">
              Data provided by <a href="https://pokeapi.co/" class="text-info text-decoration-none" target="_blank">PokéAPI</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Global Styles */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Smooth transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #0d6efd;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0b5ed7;
}

/* Router link transitions */
.router-link-active {
  font-weight: bold;
}

/* Card hover effects */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Type badges colors */
.type-normal { background-color: #A8A878 !important; }
.type-fire { background-color: #F08030 !important; }
.type-water { background-color: #6890F0 !important; }
.type-electric { background-color: #F8D030 !important; }
.type-grass { background-color: #78C850 !important; }
.type-ice { background-color: #98D8D8 !important; }
.type-fighting { background-color: #C03028 !important; }
.type-poison { background-color: #A040A0 !important; }
.type-ground { background-color: #E0C068 !important; }
.type-flying { background-color: #A890F0 !important; }
.type-psychic { background-color: #F85888 !important; }
.type-bug { background-color: #A8B820 !important; }
.type-rock { background-color: #B8A038 !important; }
.type-ghost { background-color: #705898 !important; }
.type-dragon { background-color: #7038F8 !important; }
.type-dark { background-color: #705848 !important; }
.type-steel { background-color: #B8B8D0 !important; }
.type-fairy { background-color: #EE99AC !important; }
</style>