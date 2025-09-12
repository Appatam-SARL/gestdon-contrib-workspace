import dayjs from 'dayjs';
export const formatDate = (date: string, format = 'DD/MM/YYYY HH:mm') => {
  return dayjs(date).format(format);
};

/**
 * Calcule le nombre de jours restants jusqu'à une date donnée
 * @param endDate - Date de fin (string, Date ou timestamp)
 * @returns Nombre de jours restants (positif) ou jours écoulés (négatif)
 */
export const getDaysRemaining = (endDate: string | Date | number): number => {
  const end = new Date(endDate);
  const now = new Date();

  // Réinitialiser les heures pour ne compter que les jours
  now.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const timeDiff = end.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
};

/**
 * Formate le nombre de jours restants en texte lisible
 * @param days - Nombre de jours restants
 * @returns Texte formaté (ex: "5 jours", "1 jour", "Expiré")
 */
export const formatDaysRemaining = (days: number): string => {
  if (days > 0) {
    return days === 1 ? '1 jour' : `${days} jours`;
  } else if (days === 0) {
    return "Expire aujourd'hui";
  } else {
    return `Expiré depuis ${Math.abs(days)} jour${
      Math.abs(days) > 1 ? 's' : ''
    }`;
  }
};
