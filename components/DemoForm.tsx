"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitDemoRequest } from "@/app/actions/demo-request";
import { trackDemoRequest } from "@/components/MetaPixel";

interface DemoFormProps {
  onClose?: () => void;
}

export function DemoForm({ onClose }: DemoFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    employeeCount: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('firstName', formData.firstName);
      formDataToSubmit.append('lastName', formData.lastName);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('company', formData.company);
      formDataToSubmit.append('country', formData.country);
      formDataToSubmit.append('employeeCount', formData.employeeCount);

      const result = await submitDemoRequest(formDataToSubmit);

      if (!result.success) {
        alert(result.error || "Une erreur s'est produite. Veuillez réessayer.");
        return;
      }
      
      // Track conversion with Meta Pixel
      trackDemoRequest({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        employeeCount: formData.employeeCount
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        country: "",
        employeeCount: ""
      });
      
      // Show success state instead of alert
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting demo request:', error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Demandez votre démonstration gratuite
        </h2>
        <p className="text-gray-600 text-lg">
          Découvrez comment PaieFacile peut simplifier la gestion de votre paie en 30 minutes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              Prénom *
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
              className="mt-1"
            />
          </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Nom *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="mt-1"
              />
          </div>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email professionnel *
              </Label>
              <Input
                id="email"
                type="email"
              placeholder="votre@entreprise.ma"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
              placeholder="+212 6 XX XX XX XX"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1"
              />
          </div>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
              Nom de l&apos;entreprise *
              </Label>
              <Input
                id="company"
                type="text"
              placeholder="Nom de votre entreprise"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Pays
              </Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner votre pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MA">Maroc</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="DZ">Algérie</SelectItem>
                <SelectItem value="TN">Tunisie</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
            </div>

            <div>
              <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700">
                Nombre d&apos;employés *
              </Label>
              <Select value={formData.employeeCount} onValueChange={(value) => handleInputChange("employeeCount", value)}>
                <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner le nombre d&apos;employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 employés</SelectItem>
              <SelectItem value="6-20">6-20 employés</SelectItem>
              <SelectItem value="21-50">21-50 employés</SelectItem>
                  <SelectItem value="51-100">51-100 employés</SelectItem>
              <SelectItem value="100+">Plus de 100 employés</SelectItem>
                </SelectContent>
              </Select>
        </div>

        <div className="text-center">
        <Button
          type="submit"
          disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg w-full md:w-auto"
          >
            {isSubmitting ? "Envoi en cours..." : "Demander ma démonstration gratuite"}
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            * Champs obligatoires. Aucun spam, promis !
          </p>
        </div>
      </form>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Merci pour votre demande !
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Votre demande de démonstration a été envoyée avec succès. 
              Notre équipe vous contactera dans les <strong>24 heures</strong> 
              pour planifier votre démo personnalisée.
            </p>

            {/* Next Steps */}
            <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-green-800 mb-2">Prochaines étapes :</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Vérifiez votre email pour la confirmation</li>
                <li>• Notre équipe vous contactera par téléphone</li>
                <li>• Démonstration personnalisée de 30 minutes</li>
                <li>• Accès gratuit pendant 14 jours</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Questions urgentes ? Contactez-nous directement :
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a href="mailto:contact@paiefacile.ma" className="text-green-600 hover:text-green-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  contact@paiefacile.ma
                </a>
                <span className="text-gray-300">|</span>
                <a href="tel:+212720101817" className="text-green-600 hover:text-green-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +212 720 101 817
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  onClose?.();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex-1"
              >
                Parfait, merci !
              </Button>
              <Button
                onClick={() => setShowSuccess(false)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold flex-1"
              >
                Demander une autre démo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}