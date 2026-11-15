/**
 * Calcula el hash SHA-256 de un texto usando la Web Crypto API (crypto.subtle).
 * Devuelve el resultado en hexadecimal.
 * Nota: crypto.subtle solo está disponible en contextos seguros (https o localhost).
 */
export async function sha256(texto) {
  const datos = new TextEncoder().encode(texto);
  const buffer = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
