import create from 'zustand'

const addDoctorStore = create(set => ({
  selectedDoctor: {},
  setAddDoctor: (doctor) => set({ selectedDoctor: doctor }),
}));

export default addDoctorStore;
