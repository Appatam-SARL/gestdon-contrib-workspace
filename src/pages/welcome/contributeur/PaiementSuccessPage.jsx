import React,{ useRef } from 'react'
import { Button } from "flowbite-react";
import {QRCodeCanvas} from 'qrcode.react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import WHeader from '../../../components/welcome/WHeader';
const PaiementSuccessPage = () => {
    const receiptRef = useRef(null);
    const dataPaiement = {
        nomUtilisateur: "Jean KOUASSI",
        plan: "Acteur Social",
        duree: 12,
        prixUnitaire: 19000,
        tva: 0,
        numeroTransaction: "TXN-20250416-001",
        date: new Date().toLocaleDateString(),
      };
    
      const totalHT = dataPaiement.prixUnitaire * dataPaiement.duree;
      const totalTTC = totalHT + dataPaiement.tva;
    
      const qrData = JSON.stringify({
        transaction: dataPaiement.numeroTransaction,
        nom: dataPaiement.nomUtilisateur,
        montant: totalTTC,
      });
    
      const handlePrint = () => {
        const content = receiptRef.current?.innerHTML;
        const win = window.open("", "", "height=700,width=900");
        win?.document.write("<html><head><title>Reçu</title></head><body>");
        win?.document.write(content || "");
        win?.document.write("</body></html>");
        win?.document.close();
        win?.print();
      };
    
      const handleDownloadPDF = async () => {
        const element = receiptRef.current;
        if (!element) return;
    
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0); // auto height
        pdf.save("reçu-paiement.pdf");
      };
    
      const handleSendEmail = () => {
        // Simuler appel backend pour envoyer email
        console.log("Envoi de l’email avec les données :", {
          destinataire: "jean.kouassi@example.com",
          sujet: "Votre reçu de paiement",
          contenu: dataPaiement,
        });
        alert("Email envoyé à jean.kouassi@example.com (simulation)");
      };
  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600">🎉 Paiement réussi !</h1>
        <p className="text-gray-700 mt-2">Merci pour votre souscription, {dataPaiement.nomUtilisateur}.</p>
      </div>

      <div
        ref={receiptRef}
        className="bg-gray-50 p-6 rounded-md shadow-md w-full max-w-md print:text-black print:bg-white print:shadow-none"
      >
        <h2 className="text-xl font-semibold mb-4 text-purple-700">🧾 Reçu de Paiement</h2>
        <div className="text-sm space-y-2 text-gray-700">
          <p><strong>Transaction :</strong> {dataPaiement.numeroTransaction}</p>
          <p><strong>Date :</strong> {dataPaiement.date}</p>
          <p><strong>Nom :</strong> {dataPaiement.nomUtilisateur}</p>
          <p><strong>Plan :</strong> {dataPaiement.plan}</p>
          <p><strong>Durée :</strong> {dataPaiement.duree} mois</p>
          <p><strong>Prix unitaire :</strong> {dataPaiement.prixUnitaire.toLocaleString()} FCFA</p>
          <p><strong>Total HT :</strong> {totalHT.toLocaleString()} FCFA</p>
          <p><strong>TVA :</strong> {dataPaiement.tva.toLocaleString()} FCFA</p>
          <p className="font-bold text-lg"><strong>Total TTC :</strong> {totalTTC.toLocaleString()} FCFA</p>
        </div>

        <div className="mt-4 flex justify-center">
          <QRCodeCanvas value={qrData} size={100} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Button className="bg-purple-700 text-white cursor-pointer" onClick={handlePrint}>
          🖨️ Imprimer
        </Button>
        <Button variant="outline" className='cursor-pointer' onClick={handleDownloadPDF}>
          📥 Télécharger PDF
        </Button>
        <Button className="bg-green-600 text-white cursor-pointer hover:bg-green-700" onClick={handleSendEmail}>
          📧 Envoyer par Email
        </Button>
        <Button variant="outline" className="text-purple-700 border-1 border-purple-700 cursor-pointer bg-transparent hover:bg-purple-50" onClick={() => window.location.href = '/'}>
          Retour à l’accueil
        </Button>
      </div>
    </div>
  )
}

export default PaiementSuccessPage