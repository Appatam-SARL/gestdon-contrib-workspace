export const formatPrice = (amount: number): string => {
  return Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
  }).format(amount);
};
const montInFrenchMap = new Map();
montInFrenchMap.set('01', 'janv');
montInFrenchMap.set('02', 'fév');
montInFrenchMap.set('03', 'mars');
montInFrenchMap.set('04', 'avril');
montInFrenchMap.set('05', 'mai');
montInFrenchMap.set('06', 'juin');
montInFrenchMap.set('07', 'juil');
montInFrenchMap.set('08', 'août');
montInFrenchMap.set('09', 'sept');
montInFrenchMap.set('10', 'oct');
montInFrenchMap.set('11', 'nov');
montInFrenchMap.set('12', 'déc');

/**
 * Formate le nom de la période en français.
 * @param {string} periodName - Le nom de la période à formater.
 * @returns {string} Le nom de la période en français.
 */
export const formatPeriodName = (periodName: string) => {
  if (periodName.includes('month')) {
    const monthValue = periodName.replace('month ', '').split('-')[1];
    return montInFrenchMap.get(monthValue);
  }
  if (periodName.includes('hour')) {
    const hourValue = periodName.replace('hour', '') + 'h';
    return hourValue;
  }
  if (periodName.includes('day')) {
    const dayValue = periodName.replace('day', 'jour');
    return convertDateInDayWord(dayValue);
  }
  if (periodName.includes('week')) {
    const weekValue = periodName.replace('week', '');
    return weekValue;
  }
};

export function convertDateInDayWord(input: string): string {
  // Define the French day names
  const daysOfWeek: string[] = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ];

  // Extract the date part from the input string
  const datePart = input.split(' ')[1];

  // Create a Date object from the extracted date part
  const date = new Date(datePart);

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();

  // Return the corresponding French day name
  return daysOfWeek[dayOfWeek];
}

export const formatAmountWithSpaces = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
