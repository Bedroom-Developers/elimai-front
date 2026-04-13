export const generateQrDataUrl = async (text: string): Promise<string> => {
  const { default: QrCode } = await import("qrcode");

  return QrCode.toDataURL(text);
};
