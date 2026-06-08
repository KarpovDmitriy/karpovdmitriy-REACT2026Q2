const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Image must be PNG or JPEG format.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'Image must be smaller than 2MB.';
  }
  return null;
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}
