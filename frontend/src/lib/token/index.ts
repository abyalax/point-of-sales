export class TokenValidator {
  static isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  static getTimeToExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch {
      return 0;
    }
  }

  static shouldRefresh(token: string, bufferMinutes: number = 5): boolean {
    const timeToExpiry = this.getTimeToExpiry(token);
    return timeToExpiry > 0 && timeToExpiry < bufferMinutes * 60;
  }

  static isValidFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      // Try to decode header and payload
      JSON.parse(atob(parts[0]));
      JSON.parse(atob(parts[1]));
      return true;
    } catch {
      return false;
    }
  }
}
