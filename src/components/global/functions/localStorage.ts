export const setLocalStorageItem = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);

    localStorage.setItem(key, serializedValue);
    console.log(`Set ${key} in Local Storage:`, value);
    window.dispatchEvent(new Event('localStorageChange'));
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};

export const getLocalStorageItem = (key: string, defaultValue: any = null) => {
  try {
    const serializedValue = localStorage.getItem(key);

    console.log(`Get ${key} from Local Storage:`, serializedValue);

    if (serializedValue === null) {
      return defaultValue;
    }


    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error getting localStorage item:', error);

    return defaultValue;
  }
};
