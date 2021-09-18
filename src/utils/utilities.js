export function getTimer(timeString) {
    const dateOneObj = new Date(timeString);
    const dateTwoObj = new Date();
    const milliseconds = dateTwoObj - dateOneObj;
    const hours = parseFloat(milliseconds / 36e5).toFixed(3);

    if(Math.sign(hours) < 0) {
        return hours >= -1
    }  else if(Math.sign(hours) < 0) {
        return false;
    }
}
