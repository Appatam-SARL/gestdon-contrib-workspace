// emailUtils.js - Utility pour validation d'email

// Regex pour validation d'email (RFC 5322 simplifié)
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Types de domaines connus
const DOMAIN_TYPES: Record<string, string> = {
  'gmail.com': 'Google Gmail',
  'yahoo.com': 'Yahoo Mail',
  'yahoo.fr': 'Yahoo Mail France',
  'hotmail.com': 'Microsoft Hotmail',
  'outlook.com': 'Microsoft Outlook',
  'live.com': 'Microsoft Live',
  'orange.fr': 'Orange France',
  'free.fr': 'Free France',
  'sfr.fr': 'SFR France',
  'wanadoo.fr': 'Wanadoo France',
  'laposte.net': 'La Poste France',
  'icloud.com': 'Apple iCloud',
  'me.com': 'Apple Me',
};

// Corrections communes pour les erreurs de frappe
const COMMON_MISTAKES = {
  'gmail.co': 'gmail.com',
  'gmail.fr': 'gmail.com',
  'yahoo.co': 'yahoo.com',
  'hotmail.fr': 'hotmail.com',
  'outlook.fr': 'outlook.com',
};

/**
 * Valide une adresse email
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} - True si l'email est valide, false sinon
 */
export const validateEmail = (email: string) => {
  if (!email || typeof email !== 'string') return false;
  const trimmedEmail = email.trim();
  return EMAIL_REGEX.test(trimmedEmail);
};

/**
 * Extrait les informations d'une adresse email
 * @param {string} emailAddress - L'adresse email
 * @returns {object} - Objet contenant les informations de l'email
 */
export const extractEmailInfo = (emailAddress: string) => {
  if (!emailAddress || !emailAddress.includes('@')) {
    return {};
  }

  const [localPart, domain] = emailAddress.split('@');
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];

  return {
    localPart,
    domain,
    tld,
    provider: DOMAIN_TYPES[domain.toLowerCase()] || 'Autre fournisseur',
    length: emailAddress.length,
    isValid: validateEmail(emailAddress),
  };
};

/**
 * Obtient une suggestion pour corriger une adresse email invalide
 * @param {string} email - L'adresse email à analyser
 * @returns {string} - Suggestion de correction
 */
export const getEmailSuggestion = (email: string) => {
  if (!email) return 'Veuillez entrer une adresse email';

  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail.includes('@')) {
    return 'Il manque le symbole @ dans votre adresse';
  }

  if (trimmedEmail.endsWith('@')) {
    return 'Il manque le nom de domaine après @';
  }

  if (trimmedEmail.startsWith('@')) {
    return 'Il manque la partie locale avant @';
  }

  if (trimmedEmail.includes('..')) {
    return 'Évitez les points consécutifs';
  }

  // Vérifier les erreurs communes
  for (const [mistake, correction] of Object.entries(COMMON_MISTAKES)) {
    if (trimmedEmail.includes(mistake)) {
      return `Vouliez-vous dire ${trimmedEmail.replace(mistake, correction)} ?`;
    }
  }

  return 'Vérifiez le format de votre adresse email';
};

/**
 * Fonction complète de validation avec toutes les informations
 * @param {string} email - L'adresse email à valider
 * @returns {object} - Objet complet avec validation, infos et suggestions
 */
export const validateEmailComplete = (email: string) => {
  const isValid = validateEmail(email);
  const emailInfo = isValid ? extractEmailInfo(email.trim()) : {};
  const suggestion = !isValid ? getEmailSuggestion(email) : null;

  return {
    isValid,
    email: email.trim(),
    info: emailInfo,
    suggestion,
    errors: !isValid ? [suggestion] : [],
  };
};

/**
 * Valide plusieurs emails à la fois
 * @param {string[]} emails - Tableau d'adresses email
 * @returns {object[]} - Tableau d'objets de validation
 */
export const validateMultipleEmails = (emails: string) => {
  if (!Array.isArray(emails)) return [];

  return emails.map((email) => validateEmailComplete(email));
};

/**
 * Nettoie et normalise une adresse email
 * @param {string} email - L'adresse email à nettoyer
 * @returns {string} - Email nettoyé
 */
export const cleanEmail = (email: string) => {
  if (!email || typeof email !== 'string') return '';

  return email.trim().toLowerCase();
};

/**
 * Vérifie si un domaine est dans la liste des fournisseurs connus
 * @param {string} domain - Le domaine à vérifier
 * @returns {boolean} - True si le domaine est connu
 */
export const isKnownProvider = (domain: string) => {
  return Object.prototype.hasOwnProperty.call(
    DOMAIN_TYPES,
    domain.toLowerCase()
  );
};

// Export par défaut pour usage simple
export default {
  validate: validateEmail,
  validateComplete: validateEmailComplete,
  extractInfo: extractEmailInfo,
  getSuggestion: getEmailSuggestion,
  validateMultiple: validateMultipleEmails,
  clean: cleanEmail,
  isKnownProvider,
};
