"use client";

import { Link } from "@/lib/navigation";

export function LandingPage() {
  return (
    <div className="bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">PaieFacile</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#fonctionnalites" className="text-gray-600 hover:text-teal-600 transition-colors">Fonctionnalités</a>
              <a href="#tarifs" className="text-gray-600 hover:text-teal-600 transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors">Témoignages</a>
              <Link href="/signup">
                <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  Démarrer l&apos;essai gratuit
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                La Paie Marocaine, <span className="text-teal-200">Enfin Simplifiée</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-teal-50 leading-relaxed">
                PaieFacile automatise les calculs complexes de la CNSS, de l&apos;IGR et des heures supplémentaires pour vous faire gagner du temps et vous garantir une conformité totale.
              </p>
              <div className="space-y-4">
                <Link href="/signup">
                  <button className="bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-50 transition-colors shadow-lg">
                    Démarrer mon essai de 14 jours (Gratuit)
                  </button>
                </Link>
                <p className="text-teal-100 text-sm">Aucune carte de crédit requise</p>
              </div>
            </div>
            
            <div className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
                <div className="bg-teal-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Bulletin de Paie</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Généré</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salaire Brut</span>
                      <span className="font-medium">15,000 MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CNSS (4.48%)</span>
                      <span className="font-medium text-red-600">-672 MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IGR</span>
                      <span className="font-medium text-red-600">-3,240 MAD</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Net à Payer</span>
                      <span className="text-teal-600">11,088 MAD</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm">
                  📄 Télécharger PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              La gestion de la paie vous coûte plus cher que vous ne le pensez
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les erreurs de paie peuvent coûter jusqu&apos;à 30,000 MAD d&apos;amendes par an à une PME marocaine
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🧮</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Calculs Manuels Erronés</h3>
              <p className="text-gray-600">Les heures supplémentaires mal calculées coûtent en moyenne 2,500 MAD/mois</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🏛️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pénalités CNSS</h3>
              <p className="text-gray-600">Déclarations incorrectes = amendes de 5,000 à 15,000 MAD</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">📅</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestion des Congés</h3>
              <p className="text-gray-600">Suivi complexe et erreurs dans les soldes de congés</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🧾</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Calcul IGR Complexe</h3>
              <p className="text-gray-600">Risque de redressement fiscal pour mauvais calculs</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⏰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Perte de Temps</h3>
              <p className="text-gray-600">20+ heures/mois perdues en calculs et paperasse</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">📁</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Documents Non Sécurisés</h3>
              <p className="text-gray-600">Risque de perte de données et non-conformité</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Découvrez PaieFacile : Votre Expert Paie Automatisé
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformez votre gestion de paie en 3 étapes simples
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ajoutez vos employés</h3>
              <p className="text-gray-600">Importez ou saisissez les informations de vos employés en quelques clics</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Entrez les variables du mois</h3>
              <p className="text-gray-600">Heures supplémentaires, primes, absences - tout est calculé automatiquement</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Générez les bulletins en 1 clic</h3>
              <p className="text-gray-600">Bulletins conformes, déclarations CNSS et archivage automatique</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tout ce dont vous avez besoin pour une paie sereine
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gagnez des heures précieuses</h3>
              <p className="text-gray-600">Automatisez les tâches répétitives et réduisez le temps de traitement de 90%</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Évitez les erreurs coûteuses</h3>
              <p className="text-gray-600">Calculs 100% conformes à la législation marocaine, mis à jour automatiquement</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Restez 100% conforme</h3>
              <p className="text-gray-600">Mises à jour automatiques des taux CNSS, IGR et réglementations</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bulletins de paie clairs</h3>
              <p className="text-gray-600">Générez des fiches de paie professionnelles conformes aux standards</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl">☁️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Centralisation & Sécurité</h3>
              <p className="text-gray-600">Archivez vos documents sur le cloud avec sécurité bancaire</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-teal-600 text-xl">🎧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Support d&apos;experts</h3>
              <p className="text-gray-600">Une équipe marocaine à votre écoute pour vous accompagner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ils nous font confiance pour leur paie
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                &quot;PaieFacile a transformé notre gestion administrative. Ce qui nous prenait des jours se fait maintenant en une heure. Indispensable pour une PME au Maroc.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-teal-600">KA</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Khalid Alami</div>
                  <div className="text-sm text-gray-600">DG, TechnoMaroc SARL</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                &quot;Fini les erreurs de calcul et les nuits blanches avant les déclarations CNSS. PaieFacile nous fait économiser 15,000 MAD par an en évitant les pénalités.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-teal-600">SB</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Samira Benali</div>
                  <div className="text-sm text-gray-600">RH, Atlas Distribution</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                &quot;Interface intuitive et support client exceptionnel. Même sans formation comptable, je gère la paie de mes 25 employés en toute sérénité.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-teal-600">YE</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Youssef El Fassi</div>
                  <div className="text-sm text-gray-600">Fondateur, InnovateCasa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tarifs Transparents, Sans Surprise
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez la formule qui correspond à votre entreprise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">299</span>
                <span className="text-gray-600"> MAD/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Jusqu&apos;à 10 employés</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Bulletins de paie illimités</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Calculs automatiques</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Support email</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Essayer gratuitement
                </button>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-teal-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium">Populaire</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Business</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">599</span>
                <span className="text-gray-600"> MAD/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Jusqu&apos;à 50 employés</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Gestion des congés</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Déclarations CNSS</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Support prioritaire</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors">
                  Essayer gratuitement
                </button>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">999</span>
                <span className="text-gray-600"> MAD/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Employés illimités</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">API & intégrations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Rapports avancés</span>
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-3">✓</span>
                  <span className="text-gray-600">Support dédié</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Essayer gratuitement
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Simplifiez votre paie dès aujourd&apos;hui
          </h2>
          <p className="text-xl text-teal-50 mb-8 max-w-3xl mx-auto">
            Rejoignez les centaines de PME marocaines qui ont choisi la sérénité. 
            Lancez votre essai gratuit de 14 jours maintenant.
          </p>
          <Link href="/signup">
            <button className="bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-50 transition-colors shadow-lg mb-4">
              Démarrer mon essai gratuit de 14 jours
            </button>
          </Link>
          <p className="text-teal-100 text-sm">Essai gratuit • Sans engagement • Sans carte de crédit</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">PaieFacile</span>
              </div>
              <p className="text-gray-400 mb-6">
                La solution de paie automatisée pour les PME marocaines. 
                Conformité garantie, simplicité assurée.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d&apos;aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contact@paiefacile.ma</li>
                <li>📞 +212 5 22 XX XX XX</li>
                <li>📍 Casablanca, Maroc</li>
              </ul>
            </div>
          </div>
          
          <hr className="border-gray-800 my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 PaieFacile. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Conditions d&apos;utilisation</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
