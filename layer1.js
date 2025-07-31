// انتظار تحميل DOM
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من دعم localStorage
    if (!window.localStorage) {
        console.error('متصفحك لا يدعم localStorage');
        return;
    }

    // الحصول على جميع بطاقات نوع العقار
    const propertyCards = document.querySelectorAll('.property-card');

    // إضافة مستمع الأحداث لكل بطاقة
    propertyCards.forEach(card => {
        // مستمع حدث النقر
        card.addEventListener('click', handlePropertyTypeSelection);
        
        // مستمع حدث لوحة المفاتيح (للوصولية)
        card.addEventListener('keypress', function(e) {
            // التحقق من مفتاح Enter أو Space
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePropertyTypeSelection.call(this, e);
            }
        });
    });

    // دالة معالجة اختيار نوع العقار
    function handlePropertyTypeSelection(e) {
        // منع السلوك الافتراضي
        e.preventDefault();

        // الحصول على نوع العقار من البيانات
        const propertyType = this.getAttribute('data-type');
        
        if (!propertyType) {
            console.error('لم يتم تحديد نوع العقار');
            return;
        }

        // إضافة تأثير بصري للنقر
        this.style.transform = 'scale(0.95)';
        
        // إرجاع التأثير بعد وقت قصير
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // حفظ نوع العقار في localStorage
        try {
            localStorage.setItem('selectedPropertyType', propertyType);
            
            // حفظ وقت الاختيار (اختياري)
            localStorage.setItem('selectionTime', new Date().toISOString());
            
            // إظهار رسالة نجاح سريعة (اختياري)
            showSuccessMessage(propertyType);
            
            // الانتقال إلى صفحة اختيار الموقع بعد تأخير قصير
            setTimeout(() => {
                window.location.href = 'choose-location.html';
            }, 300);
            
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
            alert('حدث خطأ في حفظ اختيارك. يرجى المحاولة مرة أخرى.');
        }
    }

    // دالة إظهار رسالة النجاح (اختيارية)
    function showSuccessMessage(type) {
        // إنشاء عنصر الرسالة
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = type === 'houses' ? 'تم اختيار المنازل' : 'تم اختيار الأراضي';
        
        // إضافة الرسالة للصفحة
        document.body.appendChild(message);
        
        // إظهار الرسالة بتأثير
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        // إخفاء وحذف الرسالة بعد ثانية
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 1000);
    }

    // التحقق من وجود اختيار سابق (اختياري)
    checkPreviousSelection();

    function checkPreviousSelection() {
        const previousSelection = localStorage.getItem('selectedPropertyType');
        if (previousSelection) {
            // يمكن إضافة مؤشر بصري للاختيار السابق
            const selectedCard = document.querySelector(`[data-type="${previousSelection}"]`);
            if (selectedCard) {
                selectedCard.classList.add('previously-selected');
            }
        }
    }

    // إضافة تأثيرات الحركة عند التمرير (اختياري)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // مراقبة البطاقات لتأثيرات الظهور
    propertyCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // تنظيف localStorage القديم (اختياري)
    cleanupOldData();

    function cleanupOldData() {
        const selectionTime = localStorage.getItem('selectionTime');
        if (selectionTime) {
            const timeDiff = new Date() - new Date(selectionTime);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            // حذف البيانات إذا مضى أكثر من 24 ساعة
            if (hoursDiff > 24) {
                localStorage.removeItem('selectedPropertyType');
                localStorage.removeItem('selectionTime');
            }
        }
    }
});

// إضافة CSS للرسالة النجاح ديناميكياً
const style = document.createElement('style');
style.textContent = `
    .success-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background-color: #4caf50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        z-index: 9999;
        transition: transform 0.3s ease;
    }
    
    .success-message.show {
        transform: translateX(-50%) translateY(0);
    }
    
    .previously-selected {
        position: relative;
    }
    
    .previously-selected::after {
        content: '✓';
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: #4caf50;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// دالة مساعدة للتحقق من دعم المتصفح
function checkBrowserSupport() {
    const features = {
        localStorage: typeof(Storage) !== "undefined",
        querySelector: !!document.querySelector,
        addEventListener: !!window.addEventListener
    };
    
    for (let feature in features) {
        if (!features[feature]) {
            console.warn(`متصفحك لا يدعم: ${feature}`);
        }
    }
    
    return Object.values(features).every(f => f);
}

// استدعاء التحقق من دعم المتصفح
if (!checkBrowserSupport()) {
    alert('متصفحك قديم. يرجى تحديث المتصفح للحصول على أفضل تجربة.');
}
