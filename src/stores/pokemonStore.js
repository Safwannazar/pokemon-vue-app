import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    pokemonDetails: {},
    loading: false,
    error: null,
    searchQuery: '',
    editedPokemons: {} // Store edited pokemon data
  }),

  getters: {
    // Filter pokemons based on search query
    filteredPokemons: (state) => {
      if (!state.searchQuery) return state.pokemons
      
      return state.pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    },

    // Get pokemon by ID with edited data if available
    getPokemonById: (state) => (id) => {
      const originalPokemon = state.pokemonDetails[id]
      const editedPokemon = state.editedPokemons[id]
      
      if (editedPokemon && originalPokemon) {
        return { ...originalPokemon, ...editedPokemon }
      }
      
      return originalPokemon
    },

    // Check if pokemon has been edited
    isPokemonEdited: (state) => (id) => {
      return !!state.editedPokemons[id]
    }
  },

  actions: {
    // Fetch list of 100 pokemons
    async fetchPokemons() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100')
        
        // Fetch basic details for each pokemon
        const pokemonPromises = response.data.results.map(async (pokemon, index) => {
          try {
            const detailResponse = await axios.get(pokemon.url)
            return {
              id: detailResponse.data.id,
              name: detailResponse.data.name,
              image: detailResponse.data.sprites.other['official-artwork'].front_default || 
                     detailResponse.data.sprites.front_default,
              types: detailResponse.data.types.map(type => type.type.name),
              height: detailResponse.data.height,
              weight: detailResponse.data.weight,
              url: pokemon.url
            }
          } catch (error) {
            console.error(`Error fetching pokemon ${pokemon.name}:`, error)
            return {
              id: index + 1,
              name: pokemon.name,
              image: null,
              types: ['unknown'],
              height: 0,
              weight: 0,
              url: pokemon.url
            }
          }
        })

        this.pokemons = await Promise.all(pokemonPromises)
      } catch (error) {
        this.error = 'Failed to fetch Pokémon data. Please try again later.'
        console.error('Error fetching pokemons:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch detailed pokemon information
    async fetchPokemonDetails(id) {
      if (this.pokemonDetails[id]) {
        return this.pokemonDetails[id]
      }

      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const pokemon = response.data

        // Fetch species data for description
        let description = 'A mysterious Pokémon with unknown origins.'
        try {
          const speciesResponse = await axios.get(pokemon.species.url)
          const englishEntry = speciesResponse.data.flavor_text_entries.find(
            entry => entry.language.name === 'en'
          )
          if (englishEntry) {
            description = englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
          }
        } catch (error) {
          console.warn('Could not fetch species data:', error)
        }

        const detailedPokemon = {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.other['official-artwork'].front_default || 
                 pokemon.sprites.front_default,
          images: {
            front_default: pokemon.sprites.front_default,
            front_shiny: pokemon.sprites.front_shiny,
            back_default: pokemon.sprites.back_default,
            official_artwork: pokemon.sprites.other['official-artwork'].front_default
          },
          types: pokemon.types.map(type => type.type.name),
          height: pokemon.height,
          weight: pokemon.weight,
          base_experience: pokemon.base_experience,
          abilities: pokemon.abilities.map(ability => ({
            name: ability.ability.name,
            is_hidden: ability.is_hidden
          })),
          stats: pokemon.stats.map(stat => ({
            name: stat.stat.name,
            base_stat: stat.base_stat,
            effort: stat.effort
          })),
          moves: pokemon.moves.slice(0, 10).map(move => move.move.name), // Limit to 10 moves
          description: description
        }

        this.pokemonDetails[id] = detailedPokemon
        return detailedPokemon
      } catch (error) {
        this.error = 'Failed to fetch Pokémon details. Please try again later.'
        console.error('Error fetching pokemon details:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update search query
    setSearchQuery(query) {
      this.searchQuery = query
    },

    // Clear search query
    clearSearch() {
      this.searchQuery = ''
    },

    // Edit pokemon data
    editPokemon(id, editedData) {
      this.editedPokemons[id] = {
        ...this.editedPokemons[id],
        ...editedData
      }
      
      // Also update the main pokemon list if it exists
      const pokemonIndex = this.pokemons.findIndex(p => p.id === parseInt(id))
      if (pokemonIndex !== -1) {
        this.pokemons[pokemonIndex] = {
          ...this.pokemons[pokemonIndex],
          ...editedData
        }
      }
    },

    // Reset edited data for a pokemon
    resetPokemonEdits(id) {
      delete this.editedPokemons[id]
    },

    // Clear all errors
    clearError() {
      this.error = null
    }
  }
})