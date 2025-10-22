const checkImageRatio = (file, targetWidth, targetHeight, tolerance = 0.05) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const ratio = width / height;
      const targetRatio = targetWidth / targetHeight;

      if (Math.abs(ratio - targetRatio) > tolerance) {
        reject(
          `Image must have a ${targetWidth}:${targetHeight} ratio (current: ${Math.round(
            width,
          )}x${Math.round(height)})`,
        );
      } else {
        resolve(true);
      }
    };
    img.onerror = () => reject("Failed to load image for ratio check");
    img.src = URL.createObjectURL(file);
  });
};

export default checkImageRatio;
