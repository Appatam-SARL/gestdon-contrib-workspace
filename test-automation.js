/**
 * Script de test automatisé pour GestDon Contrib
 * 
 * Instructions d'utilisation :
 * 1. Ouvrir la console du navigateur (F12)
 * 2. Copier-coller ce script
 * 3. Appeler les fonctions de test selon vos besoins
 * 
 * Exemple : testDonForm() pour tester le formulaire de don
 */

// Données de test
const testData = {
  don: {
    title: "Don de matériel médical",
    description: "Matériel médical pour le centre de santé communautaire",
    montant: "100000",
    devise: "XOF",
    type: "Par nature",
    donorFullname: "Pierre Martin",
    donorPhone: "+33612345678",
    observation: "Livraison urgente prévue le 15/12/2024"
  },
  audience: {
    title: "Réunion de coordination communautaire",
    description: "Réunion avec les membres de la communauté pour discuter des projets futurs",
    locationOfActivity: "Salle communautaire principale, Abidjan",
    startDate: "2024-12-20T10:00:00",
    endDate: "2024-12-20T12:00:00"
  },
  report: {
    step1: {
      name: "Rapport mensuel - Décembre 2024",
      description: "Rapport détaillé des activités du mois de décembre 2024"
    },
    step2: {
      action: "Organiser une formation sur la gestion communautaire",
      responsibleFirstName: "Sophie",
      responsibleLastName: "Bernard",
      dueDate: "2025-01-15"
    }
  },
  validation: {
    startDate: "2024-12-20T10:00:00",
    endDate: "2024-12-20T12:00:00"
  },
  rejection: {
    motif: "Informations incomplètes. Veuillez fournir plus de détails."
  },
  representative: {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@test.com",
    phone: "+33612345678"
  }
};

/**
 * Fonction utilitaire pour remplir un champ de formulaire
 */
function fillField(selector, value) {
  const field = document.querySelector(selector);
  if (field) {
    // Simuler les événements pour React Hook Form
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(field, value);
    } else {
      field.value = value;
    }
    
    // Déclencher les événements React
    const event = new Event("input", { bubbles: true });
    field.dispatchEvent(event);
    
    const changeEvent = new Event("change", { bubbles: true });
    field.dispatchEvent(changeEvent);
    
    console.log(`✓ Champ rempli : ${selector} = ${value}`);
    return true;
  } else {
    console.error(`✗ Champ non trouvé : ${selector}`);
    return false;
  }
}

/**
 * Fonction utilitaire pour cliquer sur un bouton
 */
function clickButton(selector) {
  const button = document.querySelector(selector);
  if (button) {
    button.click();
    console.log(`✓ Bouton cliqué : ${selector}`);
    return true;
  } else {
    console.error(`✗ Bouton non trouvé : ${selector}`);
    return false;
  }
}

/**
 * Test du formulaire de création de don
 */
function testDonForm() {
  console.log("🧪 Test du formulaire de création de don...");
  
  // Attendre que le formulaire soit chargé
  setTimeout(() => {
    fillField('input[name="title"]', testData.don.title);
    fillField('textarea[name="description"]', testData.don.description);
    fillField('input[name="montant"]', testData.don.montant);
    
    // Sélectionner la devise
    const deviseSelect = document.querySelector('select[name="devise"]');
    if (deviseSelect) {
      deviseSelect.value = testData.don.devise;
      deviseSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    
    fillField('input[name="donorFullname"]', testData.don.donorFullname);
    fillField('input[name="donorPhone"]', testData.don.donorPhone);
    fillField('textarea[name="observation"]', testData.don.observation);
    
    console.log("✅ Formulaire de don rempli avec succès");
    console.log("⚠️ Cliquez manuellement sur 'Soumettre' pour tester la soumission");
  }, 1000);
}

/**
 * Test du formulaire de création d'audience
 */
function testAudienceForm() {
  console.log("🧪 Test du formulaire de création d'audience...");
  
  setTimeout(() => {
    fillField('input[name="title"]', testData.audience.title);
    fillField('textarea[name="description"]', testData.audience.description);
    fillField('input[name="locationOfActivity"]', testData.audience.locationOfActivity);
    
    // Remplir les dates
    const startDateInput = document.querySelector('input[type="datetime-local"][name="startDate"]');
    const endDateInput = document.querySelector('input[type="datetime-local"][name="endDate"]');
    
    if (startDateInput) {
      const startDate = new Date(testData.audience.startDate);
      startDateInput.value = startDate.toISOString().slice(0, 16);
      startDateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    
    if (endDateInput) {
      const endDate = new Date(testData.audience.endDate);
      endDateInput.value = endDate.toISOString().slice(0, 16);
      endDateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    
    console.log("✅ Formulaire d'audience rempli avec succès");
    console.log("⚠️ Cliquez manuellement sur 'Soumettre' pour tester la soumission");
  }, 1000);
}

/**
 * Test du formulaire de création de rapport - Étape 1
 */
function testReportFormStep1() {
  console.log("🧪 Test du formulaire de rapport - Étape 1...");
  
  setTimeout(() => {
    fillField('input[name="name"]', testData.report.step1.name);
    fillField('textarea[name="description"]', testData.report.step1.description);
    
    console.log("✅ Étape 1 remplie avec succès");
    console.log("⚠️ Cliquez manuellement sur 'Suivant' pour passer à l'étape 2");
  }, 1000);
}

/**
 * Test du formulaire de création de rapport - Étape 2
 */
function testReportFormStep2() {
  console.log("🧪 Test du formulaire de rapport - Étape 2...");
  
  setTimeout(() => {
    fillField('input[name="commitments.action"]', testData.report.step2.action);
    fillField('input[name="commitments.responsible.firstName"]', testData.report.step2.responsibleFirstName);
    fillField('input[name="commitments.responsible.lastName"]', testData.report.step2.responsibleLastName);
    
    const dueDateInput = document.querySelector('input[type="date"][name="commitments.dueDate"]');
    if (dueDateInput) {
      dueDateInput.value = testData.report.step2.dueDate;
      dueDateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    
    console.log("✅ Étape 2 remplie avec succès");
    console.log("⚠️ Cliquez manuellement sur 'Suivant' pour passer à l'étape 3");
  }, 1000);
}

/**
 * Test du formulaire de validation d'audience
 */
function testValidationForm() {
  console.log("🧪 Test du formulaire de validation d'audience...");
  
  setTimeout(() => {
    const startDateInput = document.querySelector('input[type="datetime-local"][name="startDate"]');
    const endDateInput = document.querySelector('input[type="datetime-local"][name="endDate"]');
    
    if (startDateInput) {
      const startDate = new Date(testData.validation.startDate);
      startDateInput.value = startDate.toISOString().slice(0, 16);
      startDateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    
    if (endDateInput) {
      const endDate = new Date(testData.validation.endDate);
      endDateInput.value = endDate.toISOString().slice(0, 16);
      endDateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    
    console.log("✅ Formulaire de validation rempli avec succès");
    console.log("⚠️ Cliquez manuellement sur 'Valider' pour tester la soumission");
  }, 1000);
}

/**
 * Test du formulaire de rejet d'audience
 */
function testRejectionForm() {
  console.log("🧪 Test du formulaire de rejet d'audience...");
  
  setTimeout(() => {
    fillField('textarea[name="motif"]', testData.rejection.motif);
    
    console.log("✅ Formulaire de rejet rempli avec succès");
    console.log("⚠️ Cliquez manuellement sur 'Rejeter' pour tester la soumission");
  }, 1000);
}

/**
 * Test du formulaire de représentant
 */
function testRepresentativeForm() {
  console.log("🧪 Test du formulaire de représentant...");
  
  setTimeout(() => {
    fillField('input[name="representative.firstName"]', testData.representative.firstName);
    fillField('input[name="representative.lastName"]', testData.representative.lastName);
    fillField('input[name="representative.email"]', testData.representative.email);
    fillField('input[name="representative.phone"]', testData.representative.phone);
    
    console.log("✅ Formulaire de représentant rempli avec succès");
    console.log("⚠️ Cliquez manuellement sur 'Enregistrer' pour tester la soumission");
  }, 1000);
}

/**
 * Vérifier les erreurs dans la console
 */
function checkConsoleErrors() {
  console.log("🔍 Vérification des erreurs dans la console...");
  
  // Cette fonction doit être appelée manuellement après avoir effectué des actions
  // Les erreurs seront visibles dans la console du navigateur
  
  console.log("✅ Vérifiez manuellement la console pour les erreurs JavaScript");
  console.log("✅ Vérifiez les warnings React");
  console.log("✅ Vérifiez les erreurs de réseau dans l'onglet Network");
}

/**
 * Test de validation des champs requis
 */
function testRequiredFields() {
  console.log("🧪 Test de validation des champs requis...");
  
  // Essayer de soumettre un formulaire vide
  const submitButton = document.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.click();
    console.log("✅ Tentative de soumission effectuée");
    console.log("⚠️ Vérifiez que les messages d'erreur s'affichent pour les champs requis");
  } else {
    console.log("⚠️ Aucun bouton de soumission trouvé");
  }
}

/**
 * Test de responsive - Simuler différentes tailles d'écran
 */
function testResponsive() {
  console.log("🧪 Test responsive...");
  console.log("📱 Instructions pour tester le responsive :");
  console.log("1. Ouvrez les outils de développement (F12)");
  console.log("2. Cliquez sur l'icône de responsive (Ctrl+Shift+M)");
  console.log("3. Testez avec les tailles suivantes :");
  console.log("   - Mobile : 375px x 667px");
  console.log("   - Tablet : 768px x 1024px");
  console.log("   - Desktop : 1920px x 1080px");
  console.log("4. Vérifiez que tous les éléments sont visibles et accessibles");
}

/**
 * Afficher toutes les fonctions disponibles
 */
function showHelp() {
  console.log("📚 Fonctions de test disponibles :");
  console.log("");
  console.log("testDonForm() - Remplit le formulaire de création de don");
  console.log("testAudienceForm() - Remplit le formulaire de création d'audience");
  console.log("testReportFormStep1() - Remplit l'étape 1 du formulaire de rapport");
  console.log("testReportFormStep2() - Remplit l'étape 2 du formulaire de rapport");
  console.log("testValidationForm() - Remplit le formulaire de validation d'audience");
  console.log("testRejectionForm() - Remplit le formulaire de rejet d'audience");
  console.log("testRepresentativeForm() - Remplit le formulaire de représentant");
  console.log("testRequiredFields() - Teste la validation des champs requis");
  console.log("testResponsive() - Affiche les instructions pour tester le responsive");
  console.log("checkConsoleErrors() - Vérifie les erreurs dans la console");
  console.log("showHelp() - Affiche cette aide");
  console.log("");
  console.log("💡 Exemple d'utilisation :");
  console.log("   testDonForm()");
}

// Afficher l'aide au chargement
console.log("✅ Script de test chargé !");
console.log("💡 Tapez showHelp() pour voir toutes les fonctions disponibles");

