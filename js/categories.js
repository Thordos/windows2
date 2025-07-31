document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".cards-grid");
  const loading = document.getElementById("loading");

  // رابط SheetBest الخاص بك (ممكن تغييره لاحقًا حسب نوع العقار)
  const SHEET_URL = "https://api.sheetbest.com/sheets/4da18501-a3c6-42af-9205-c9bd13a17233";

  // نوع العقار يتم استخراجه من رابط الصفحة
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type"); // 'houses' أو 'lands'

  if (!type) {
    container.innerHTML = "<p>لم يتم تحديد نوع العقار.</p>";
    return;
  }

  // تحميل البيانات من Google Sheet
  fetch(SHEET_URL)
    .then((res) => res.json())
    .then((data) => {
      const areas = new Set();

      // استخراج أسماء المناطق من العقارات الموجودة
      data.forEach((item) => {
        if (item.type === type && item.location) {
          areas.add(item.location);
        }
      });

      loading.style.display = "none";

      if (areas.size === 0) {
        container.innerHTML = "<p>لا توجد مناطق متاحة لهذا النوع حالياً.</p>";
        return;
      }

      // عرض الكروت
      areas.forEach((area) => {
        const card = document.createElement("div");
        card.className = "area-card";
        card.innerHTML = `
          <h3>${area}</h3>
          <p>اضغط لعرض العقارات في هذه المنطقة</p>
        `;
        card.onclick = () => {
          window.location.href = `properties.html?type=${type}&area=${encodeURIComponent(area)}`;
        };
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("حدث خطأ في تحميل البيانات:", err);
      loading.innerText = "فشل تحميل البيانات.";
    });
});
