/**
 * Bank Logo Helper
 * Returns the appropriate bank logo path based on bank name.
 * Logos should be placed in public/assets/
 */

export function getBankLogo(bankName: string): string | null {
  const normalized = bankName.toLowerCase().trim();
  
  const bankLogos: Record<string, string> = {
    'bcp': '/assets/bcp.png',
    'banco de crédito': '/assets/bcp.png',
    'banco de credito': '/assets/bcp.png',
    'banco de crédito del perú': '/assets/bcp.png',
    'banco de crédito del perú (bcp)': '/assets/bcp.png',
    
    'bbva': '/assets/bbva.png',
    'bbva continental': '/assets/bbva.png',
    'bbva perú': '/assets/bbva.png',
    'bbva peru': '/assets/bbva.png',
    
    'interbank': '/assets/interbank.png',
    
    'scotiabank': '/assets/scotiabank.png',
    
    'falabella': '/assets/falabella.webp',
    'banco falabella': '/assets/falabella.webp',
    
    'pichincha': '/assets/pichincha.png',
    'banco pichincha': '/assets/pichincha.png',
  };
  
  return bankLogos[normalized] || null;
}

export function hasBankLogo(bankName: string): boolean {
  return getBankLogo(bankName) !== null;
}
