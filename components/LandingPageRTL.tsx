"use client";

import Link from "next/link";
import { useState } from "react";
import { DemoFormRTL } from "@/components/DemoFormRTL";
import { Button } from "@/components/ui/button";
// Removed next-intl import

export function LandingPageRTL() {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const t = useTranslations('landing');

  return (
    <div className="bg-white" dir="rtl">
      {/* Demo Form Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setShowDemoForm(false)}
              className="absolute -top-4 -left-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <DemoFormRTL onClose={() => setShowDemoForm(false)} />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">باي فاسيل</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="#fonctionnalites" className="text-gray-600 hover:text-green-600 transition-colors">الميزات</a>
              <a href="#tarifs" className="text-gray-600 hover:text-green-600 transition-colors">الأسعار</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors">الشهادات</a>
              <Button
                onClick={() => setShowDemoForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2 space-x-reverse"
              >
                <span>{t('hero.bookDemo')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-gray-900">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('hero.title')}{" "}
                <span className="text-green-600 underline decoration-green-600 decoration-2">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-600 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              {/* Abstract illustrations */}
              <div className="flex items-center space-x-4 space-x-reverse mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.482 0z" />
                  </svg>
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Demo Form */}
            <div className="flex justify-center">
              <DemoFormRTL />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('features.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-green-600 text-xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('features.saveTime')}</h3>
              <p className="text-gray-600">{t('features.saveTimeDesc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-green-600 text-xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('features.avoidErrors')}</h3>
              <p className="text-gray-600">{t('features.avoidErrorsDesc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-green-600 text-xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('features.stayCompliant')}</h3>
              <p className="text-gray-600">{t('features.stayCompliantDesc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-green-600 text-xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('features.clearPayslips')}</h3>
              <p className="text-gray-600">{t('features.clearPayslipsDesc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-green-600 text-xl">☁️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('features.centralized')}</h3>
              <p className="text-gray-600">{t('features.centralizedDesc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-green-600 text-xl">🎧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('features.expertSupport')}</h3>
              <p className="text-gray-600">{t('features.expertSupportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('testimonials.title')}
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
                &quot;باي فاسيل غيرت إدارةنا الإدارية. ما كان يأخذ أياماً أصبح يتم في ساعة واحدة. لا غنى عنه للشركات الصغيرة والمتوسطة في المغرب.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center ml-4">
                  <span className="font-semibold text-green-600">خ.ع</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">خالد العلمي</div>
                  <div className="text-sm text-gray-600">مدير عام، تكنو ماروك</div>
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
                &quot;انتهت أخطاء الحساب والسهر قبل إعلانات CNSS. باي فاسيل يوفر لنا 15,000 درهم سنوياً بتجنب الغرامات.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center ml-4">
                  <span className="font-semibold text-green-600">س.ب</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">سميرة بن علي</div>
                  <div className="text-sm text-gray-600">موارد بشرية، أطلس للتوزيع</div>
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
                &quot;واجهة بديهية ودعم عملاء استثنائي. حتى بدون تدريب محاسبي، أدار رواتب 25 موظفاً بكل هدوء.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center ml-4">
                  <span className="font-semibold text-green-600">ي.ف</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">يوسف الفاسي</div>
                  <div className="text-sm text-gray-600">مؤسس، إينوفيت كازا</div>
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
              {t('pricing.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('pricing.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pricing.starter')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">299</span>
                <span className="text-gray-600"> درهم/شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">حتى 10 موظفين</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">كشوف رواتب غير محدودة</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">حسابات تلقائية</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">دعم بالبريد الإلكتروني</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  {t('pricing.tryFree')}
                </button>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-green-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">{t('pricing.popular')}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pricing.business')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">599</span>
                <span className="text-gray-600"> درهم/شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">حتى 50 موظف</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">إدارة الإجازات</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">إعلانات CNSS</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">دعم أولوية</span>
                </li>
              </ul>
              <Button
                onClick={() => setShowDemoForm(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
              >
                {t('hero.bookDemo')}
              </Button>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pricing.enterprise')}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">999</span>
                <span className="text-gray-600"> درهم/شهر</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">موظفين غير محدودين</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">API والتكاملات</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">تقارير متقدمة</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 ml-3">✓</span>
                  <span className="text-gray-600">دعم مخصص</span>
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  {t('pricing.tryFree')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-3xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Button
            onClick={() => setShowDemoForm(true)}
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors shadow-lg mb-4 flex items-center space-x-2 space-x-reverse mx-auto"
          >
            <span>{t('cta.bookDemo')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
          <p className="text-green-100 text-sm">{t('cta.freeTrial')}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">باي فاسيل</span>
              </div>
              <p className="text-gray-400 mb-6">
                حل الرواتب الآلي للشركات الصغيرة والمتوسطة المغربية. 
                ضمان التوافق، ضمان البساطة.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">المنتج</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">الميزات</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">الأسعار</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأمان</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأدلة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">التدريب</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">اتصل بنا</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contact@paiefacile.ma</li>
                <li>📞 +212 5 22 XX XX XX</li>
                <li>📍 الدار البيضاء، المغرب</li>
              </ul>
            </div>
          </div>
          
          <hr className="border-gray-800 my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 باي فاسيل. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">شروط الاستخدام</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">الخصوصية</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">الإشعارات القانونية</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
