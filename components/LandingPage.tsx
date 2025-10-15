"use client";

import { useState } from "react";
import { DemoForm } from "@/components/DemoForm";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <div className="bg-white">
      {/* Demo Form Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setShowDemoForm(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <DemoForm onClose={() => setShowDemoForm(false)} />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PF</span>
              </div>
              <span className="text-2xl font-bold text-black">PaieFacile</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#fonctionnalites" className="text-gray-600 hover:text-green-600 transition-colors">Fonctionnalités</a>
              <a href="#tarifs" className="text-gray-600 hover:text-green-600 transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors">Témoignages</a>
              <Button
                onClick={() => setShowDemoForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
              >
                <span>Commencer mon essai gratuit</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* 1. Hero Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="text-black order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                La paie de vos salariés, enfin simple et{" "}
                <span className="text-green-600 underline decoration-green-600 decoration-2">
                  100% conforme à la loi marocaine
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-600 leading-relaxed">
                Générez vos bulletins de paie en 3 clics, automatisez vos calculs CNSS & IGR, et évitez les erreurs coûteuses.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
                <Button
                  onClick={() => setShowDemoForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors shadow-lg flex items-center justify-center space-x-2 min-h-[48px] w-full sm:w-auto"
                >
                  <span>Commencer mon essai gratuit de 14 jours</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <p className="text-sm text-gray-500 text-center sm:text-left flex items-center justify-center sm:justify-start">
                  Aucune carte bancaire requise
                </p>
                </div>

            </div>
            
            {/* Demo Form */}
            <div className="flex justify-center order-1 lg:order-2 lg:-mt-8">
              <DemoForm />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Bar */}
      <section className="bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">Ils nous font confiance pour leur paie</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
              <div className="bg-white px-4 sm:px-6 py-3 rounded-lg shadow-sm w-full sm:w-auto">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">TechnoMaroc SARL</span>
          </div>
              <div className="bg-white px-4 sm:px-6 py-3 rounded-lg shadow-sm w-full sm:w-auto">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Atlas Distribution</span>
              </div>
              <div className="bg-white px-4 sm:px-6 py-3 rounded-lg shadow-sm w-full sm:w-auto">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">InnovateCasa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
              Le casse-tête de la paie, c'est terminé
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Dites adieu aux calculs complexes, aux erreurs coûteuses et au temps perdu
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2 text-sm sm:text-base">Calculs Complexes</h3>
                <p className="text-gray-600 text-sm sm:text-base">Ne perdez plus de temps avec les taux de la CNSS, l&apos;AMO et le barème de l&apos;IGR.</p>
            </div>
            
            <div className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2 text-sm sm:text-base">Risque d'Erreurs</h3>
                <p className="text-gray-600 text-sm sm:text-base">Une simple erreur peut coûter cher en pénalités. La conformité n&apos;est pas une option.</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2 text-sm sm:text-base">Temps Perdu</h3>
              <p className="text-gray-600 text-sm sm:text-base">Chaque heure passée sur Excel est une heure que vous ne consacrez pas à votre entreprise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Solution Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
              Découvrez PaieFacile.ma : La solution pensée pour les PME marocaines
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution complète qui transforme votre gestion de paie en 3 étapes simples
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Conformité Garantie</h3>
              <p className="text-gray-600 text-sm sm:text-base">Notre système est toujours à jour avec la loi marocaine. Dormez sur vos deux oreilles, vos calculs sont justes.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Simplicité Radicale</h3>
              <p className="text-gray-600 text-sm sm:text-base">Une interface claire et intuitive. Pas besoin d'être un expert-comptable pour gérer la paie de vos employés.</p>
            </div>
            
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Centralisation Totale</h3>
              <p className="text-gray-600 text-sm sm:text-base">Toutes les informations de vos salariés (contrats, congés, salaires) au même endroit, accessible partout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
              Générez vos fiches de paie en moins de 5 minutes
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Un processus simple en 3 étapes pour une paie parfaite
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-green-600">1</span>
                </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Ajoutez les informations de votre salarié</h3>
              <p className="text-gray-600 text-sm sm:text-base">Saisissez ou importez les données de base : nom, salaire, contrat, etc.</p>
              </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-green-600">2</span>
                </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Lancez le calcul automatique</h3>
              <p className="text-gray-600 text-sm sm:text-base">Le système calcule automatiquement CNSS, AMO, IGR selon la législation marocaine.</p>
            </div>
            
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-green-600">3</span>
                </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Téléchargez le bulletin de paie PDF</h3>
              <p className="text-gray-600 text-sm sm:text-base">Bulletin prêt à être envoyé, conforme et professionnel.</p>
              </div>
            </div>
            
          {/* Demo Video Placeholder */}
          <div className="mt-12 sm:mt-16 bg-gray-50 rounded-lg p-6 sm:p-8 text-center border border-gray-200">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
                </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">Démonstration en 2 minutes</h3>
            <p className="text-gray-600 text-sm sm:text-base">Découvrez comment générer vos bulletins de paie en quelques clics</p>
                </div>
              </div>
      </section>

      {/* 6. Human Element Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">PF</span>
            </div>
            <blockquote className="text-lg sm:text-xl text-gray-700 italic mb-4 sm:mb-6">
              &ldquo;J&apos;ai créé PaieFacile.ma après avoir vu mes amis entrepreneurs se noyer dans la complexité de la paie. Mon but est de vous redonner du temps pour ce qui compte vraiment : votre business.&rdquo;
            </blockquote>
            <div className="text-black font-semibold text-sm sm:text-base">Mohamed Amine, Fondateur</div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
              Questions Fréquemment Posées
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="border-b border-gray-200 pb-4 sm:pb-6">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3">Mes données sont-elles en sécurité ?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Oui, nous utilisons un chiffrement de niveau bancaire et nos serveurs sont hébergés au Maroc pour garantir la conformité avec la législation locale.</p>
              </div>
            
            <div className="border-b border-gray-200 pb-4 sm:pb-6">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3">Le logiciel est-il vraiment toujours à jour avec la loi marocaine ?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Absolument. Notre équipe d&apos;experts suit en permanence les évolutions législatives et met à jour automatiquement tous les taux et barèmes.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4 sm:pb-6">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3">Que se passe-t-il si j&apos;ai besoin d&apos;aide ?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Notre support WhatsApp est disponible du lundi au vendredi de 9h à 18h. Nous répondons généralement en moins de 2 heures.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4 sm:pb-6">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3">Est-ce que ça fonctionne pour mon secteur d&apos;activité (BTP, Services, etc.) ?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Oui, PaieFacile s&apos;adapte à tous les secteurs d&apos;activité au Maroc. Nous avons des configurations spécifiques pour le BTP, les services, le commerce, etc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Prêt à dire adieu au stress de la paie ?
          </h2>
          <p className="text-lg sm:text-xl text-green-50 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Rejoignez les centaines de PME marocaines qui ont choisi la sérénité. 
            Commencez votre essai gratuit maintenant.
          </p>
          <Button
            onClick={() => setShowDemoForm(true)}
            className="bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-50 transition-colors shadow-lg mb-4 flex items-center justify-center space-x-2 mx-auto w-full sm:w-auto min-h-[48px]"
          >
            <span>Commencer mon essai gratuit de 14 jours</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
          <p className="text-green-100 text-sm">Sans carte bancaire, sans engagement</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PF</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold">PaieFacile</span>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                La solution de paie automatisée pour les PME marocaines. 
                Conformité garantie, simplicité assurée.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Produit</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>📧 contact@paiefacile.ma</li>
                    <li>📞 +212 720 101 817</li>
                <li>📍 Casablanca, Maroc</li>
              </ul>
            </div>
          </div>
          
          <hr className="border-gray-800 my-6 sm:my-8" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 PaieFacile. Tous droits réservés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Conditions d'utilisation</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
