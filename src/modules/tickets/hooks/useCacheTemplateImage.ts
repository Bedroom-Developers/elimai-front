export const useCacheTemplateImage = () => {
    const cachedImages = new Map<string, HTMLImageElement>();
    const imageLoadPromises = new Map<string, Promise<HTMLImageElement>>();

    // Функция для загрузки изображения один раз
    const loadTemplateImage = (url: string): Promise<HTMLImageElement> => {
        if (cachedImages.get(url)) {
            return Promise.resolve(cachedImages.get(url)!);
        }

        if (imageLoadPromises.has(url)) {
            return imageLoadPromises.get(url)!;
        }

        const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                cachedImages.set(url, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });

        imageLoadPromises.set(url, loadPromise);
        return loadPromise;
    };
    return {
        loadTemplateImage
    }
}