import React,{useState} from 'react'
import WHeader from '../../../components/welcome/WHeader';
const durations = [6, 12, 24, 36];
const tv = 0;

const paymentMethods = [
  { name: "Carte Visa", logo: "visa.png" },
  { name: "Orange Money", logo: "orange.png" },
  { name: "MTN Money", logo: "mtn.png" },
  { name: "Moov Money", logo: "moov.png" },
  { name: "Wave", logo: "wave.png" },
];

const defaultPlan = {
  title: "Acteur social",
  price: 19000,
  description: "Plan premium, avec visibilité et actions renforcées",
};
const PaiementPage = () => {
    const [selectedDuration, setSelectedDuration] = useState(6);
    const [selectedPayment, setSelectedPayment] = useState(null);
  
    const totalHT = defaultPlan.price * selectedDuration;
    const totalTTC = totalHT + tv;
  
    return (
        <div className="flex flex-col justify-between w-max-screen bg-purple-100 relative overflow-hidden">
         <WHeader />
      <main className="min-h-screen bg-white p-6 md:p-12 max-w-4xl mx-auto rounded-md shadow-md w-full  mt-24">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Paiement - {defaultPlan.title}
        </h1>
  
        {/* Durée d'abonnement */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Choisissez la durée d’abonnement :
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {durations.map((d) => (
              <label
                key={d}
                className="flex items-center gap-2 border px-4 py-2 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="duration"
                  checked={selectedDuration === d}
                  onChange={() => setSelectedDuration(d)}
                />
                <span>{d} mois</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Récapitulatif montant */}
        <div className="bg-gray-50 border rounded-md p-4 mb-8">
          <div className="flex justify-between mb-2">
            <span>Total HT</span>
            <span>{totalHT.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>TVA</span>
            <span>{tv.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total TTC</span>
            <span>{totalTTC.toLocaleString()} FCFA</span>
          </div>
        </div>
  
        {/* Moyens de paiement */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Choisissez un moyen de paiement :
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <label
                key={method.name}
                className={`border p-4 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 ${
                  selectedPayment === method.name
                    ? "ring-2 ring-purple-600"
                    : ""
                }`}
                onClick={() => setSelectedPayment(method.name)}
              >
                <img
                  src={`/payment/${method.logo}`}
                  alt={method.name}
                  className="w-16 h-12 object-contain mb-2"
                />
                <span className="text-sm text-center">{method.name}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Actions */}
        <div className="mt-10 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="text-purple-700 border border-purple-700 px-4 py-2 rounded hover:bg-purple-50"
          >
            Retour
          </button>
  
          <button
            className="bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 disabled:opacity-50"
            disabled={!selectedPayment}
          >
            Payer {totalTTC.toLocaleString()} FCFA
          </button>
        </div>
      </main>
      </div>
    );
}

export default PaiementPage
