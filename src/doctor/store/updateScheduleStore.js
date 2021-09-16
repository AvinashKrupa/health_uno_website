import moment from 'moment';
import create from 'zustand'

const updateScheduleStore = create(set => ({
  date: moment().format('YYYY-MM-DD'),
  slot_id:'',
  startTime: '',
  setStartTime: (startTime) => {
    set({startTime: startTime})
  },
  setDate: (date) => {
    set({date: date})
  },
  setSlotId: (id) => {
    set({slot_id: id})
  },
  // unavailable_slots
  // available_slots
}));

export default updateScheduleStore;
