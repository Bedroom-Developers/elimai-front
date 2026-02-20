
export const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};