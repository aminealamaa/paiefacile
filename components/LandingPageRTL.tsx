"use client";

// Removed unused Link import
import { useState } from "react";
import { DemoFormRTL } from "@/components/DemoFormRTL";
import { Button } from "@/components/ui/button";

export function LandingPageRTL() {
  const [showDemoForm, setShowDemoForm] = useState(false);

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
                <span>احجز عرض توضيحي</span>
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
                إدارة الرواتب{" "}
                <span className="text-green-600 underline decoration-green-600 decoration-2">
                  أصبحت سهلة
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-600 leading-relaxed">
                حل شامل لإدارة رواتب الموظفين في المغرب مع الامتثال الكامل للقوانين المحلية
              </p>
              
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
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">احجز عرض توضيحي مجاني</h3>
                <p className="text-gray-600">اكتشف كيف يمكن لـ باي فاسيل تبسيط إدارة الرواتب في 30 دقيقة</p>
              </div>
              
              <Button
                onClick={() => setShowDemoForm(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
              >
                احجز عرض توضيحي مجاني
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">الميزات الرئيسية</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              كل ما تحتاجه لإدارة رواتب موظفيك بكفاءة وامتثال كامل للقوانين المغربية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">حساب تلقائي</h3>
              <p className="text-gray-600">حساب الرواتب والضرائب والاستقطاعات تلقائياً وفقاً للقوانين المغربية</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">تقارير مفصلة</h3>
              <p className="text-gray-600">تقارير شاملة عن الرواتب والضرائب والاستقطاعات</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">أمان عالي</h3>
              <p className="text-gray-600">حماية كاملة لبيانات الموظفين والشركة</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">ابدأ اليوم</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            انضم إلى مئات الشركات التي تثق في باي فاسيل لإدارة رواتبها
          </p>
          <Button
            onClick={() => setShowDemoForm(true)}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            احجز عرض توضيحي مجاني
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">باي فاسيل</span>
              </div>
              <p className="text-gray-400 text-sm">
                حل شامل لإدارة الرواتب في المغرب
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">الشركة</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-colors">فريق العمل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الوظائف</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأخبار</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">المنتج</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">الميزات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأسعار</a></li>
                <li><a href="#" className="hover:text-white transition-colors">التكامل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأمان</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأدلة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">التدريب</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 باي فاسيل. جميع الحقوق محفوظة.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">شروط الاستخدام</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">الخصوصية</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">الإشعارات القانونية</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

