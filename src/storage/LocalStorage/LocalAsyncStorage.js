const storeData =  (key, value) => {
  try {
     localStorage.setItem(key, value);
  } catch (e) {
  }
};

const getData =  (key) => {
  try {
    const value =  localStorage.getItem(key);
    return value;
  } catch (e) {
  }
};

const removeData =  (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
  }
};

const clearSession =  () => {
  try {
    localStorage.clear();
  } catch (e) {
  }
};

export {storeData, getData, removeData, clearSession};
