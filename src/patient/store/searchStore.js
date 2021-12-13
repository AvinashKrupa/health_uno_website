import create from 'zustand'

const useSearchStore = create(set => ({
  searchText: '',
  searchSpeciality: '',
  setSearchText: (text) => set({ searchText: text }),
  setSearchSpeciality: (specl) => set({ searchSpeciality: specl }),
}));

export default useSearchStore;