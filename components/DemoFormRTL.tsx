"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitDemoRequest } from "@/app/actions/demo-request";
// Removed next-intl import

interface DemoFormRTLProps {
  onClose?: () => void;
}

export function DemoFormRTL({ onClose }: DemoFormRTLProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    employeeCount: ""
  });
  
  // Removed useTranslations - using static text

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

      alert('تم إرسال طلبك بنجاح!');
      onClose?.();
    } catch (error) {
      console.error('Error submitting demo request:', error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          طلب عرض توضيحي مجاني
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              الاسم الأول
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              className="mt-1"
              dir="rtl"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              الاسم الأخير
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              className="mt-1"
              dir="rtl"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="mt-1"
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            الهاتف
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="mt-1"
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">
            الشركة
          </Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
            className="mt-1"
            dir="rtl"
          />
        </div>

        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">
            البلد
          </Label>
          <Input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
            className="mt-1"
            dir="rtl"
          />
        </div>

        <div>
          <Label htmlFor="employeeCount" className="text-sm font-medium text-gray-700">
            عدد الموظفين
          </Label>
          <Select
            value={formData.employeeCount}
            onValueChange={(value) => setFormData({ ...formData, employeeCount: value })}
            required
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="اختر عدد الموظفين" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1-5 موظفين</SelectItem>
              <SelectItem value="6-20">6-20 موظف</SelectItem>
              <SelectItem value="21-50">21-50 موظف</SelectItem>
              <SelectItem value="51-100">51-100 موظف</SelectItem>
              <SelectItem value="100+">أكثر من 100 موظف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2 space-x-reverse"
        >
          {isSubmitting ? (
            <span>جاري الإرسال...</span>
          ) : (
            <>
              <span>إرسال الطلب</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
