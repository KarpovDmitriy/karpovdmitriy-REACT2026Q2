import { validateImageFile, convertToBase64 } from './imageUtils';

describe('validateImageFile', () => {
  it('accepts PNG files under 2MB', () => {
    const file = new File(['x'], 'test.png', { type: 'image/png' });
    expect(validateImageFile(file)).toBeNull();
  });
  it('accepts JPEG files', () => {
    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(file)).toBeNull();
  });
  it('rejects non-image files', () => {
    const file = new File(['x'], 'test.txt', { type: 'text/plain' });
    expect(validateImageFile(file)).toContain('PNG or JPEG');
  });
  it('rejects files over 2MB', () => {
    const big = new Uint8Array(3 * 1024 * 1024);
    const file = new File([big], 'big.png', { type: 'image/png' });
    expect(validateImageFile(file)).toContain('2MB');
  });
});

describe('convertToBase64', () => {
  it('converts a file to base64 string', async () => {
    const file = new File(['hello'], 'test.png', { type: 'image/png' });
    const result = await convertToBase64(file);
    expect(result).toMatch(/^data:image\/png;base64,/);
  });
});
