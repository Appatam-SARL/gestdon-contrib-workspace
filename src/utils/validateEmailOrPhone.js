 const isValidEmail = (value) => {

    return value ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) :false;
  };
  let valieMessage = "";
  const isValidIvorianPhone = (value) => {
    return /^(\+225|00225)?\s?0[1-9](\s?\d{2}){4}$/.test(value.replace(/-/g, '').trim());
  };

  const checkEmailOrPhone = (input) => {
    let isValide = true;
    if (isValidEmail(input)) {
        isValide = true;
        valieMessage = "✅ C'est une adresse email valide.";
    } else if (isValidIvorianPhone(input)) {
        isValide = true;
        valieMessage = "📞 C'est un numéro de téléphone ivoirien valide.";
    } else {
        isValide = false;
        valieMessage="❌ Format non reconnu. Veuillez entrer une adresse email ou un numéro ivoirien valide.";
    }

    return isValide
  };

  export {isValidIvorianPhone, isValidEmail,checkEmailOrPhone,valieMessage};