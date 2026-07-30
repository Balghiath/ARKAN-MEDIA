/* ==========================================================================
   Arkan Media (أركان ميديا) - Interactive JavaScript Engine
   Features: Preloader Splash Screen & Audio Engine, Dynamic Audio-Based Splash Duration,
             i18n Translation Engine, Theme Switcher, Package Tabs, Addons Calculator,
             YouTube Video Lightbox, Booking Form & Live WhatsApp Receipt Generator.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------------------------- */
  /* 1. Splash Screen Preloader (No Audio)                                        */
  /* -------------------------------------------------------------------------- */
  const preloader = document.getElementById("preloader");

  if (preloader) {
    const DEFAULT_SPLASH_MS = 5000;
    
    setTimeout(() => {
      preloader.classList.add("fade-out");
    }, DEFAULT_SPLASH_MS);
  }

  /* -------------------------------------------------------------------------- */
  /* 2. Theme Switcher (Dark / Light Mode)                                     */
  /* -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");

  function updateThemeUI(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("arkan_theme", theme);
    if (themeIcon) {
      themeIcon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  }

  // Set Initial Theme State
  const currentTheme = localStorage.getItem("arkan_theme") || "dark";
  updateThemeUI(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      updateThemeUI(newTheme);
      showToast(
        newTheme === "dark"
          ? "تم تفعيل الثيم الداكن (Obsidian Gold)"
          : "تم تفعيل الثيم الفاتح",
      );
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 3. i18n Translation Engine (Arabic / English)                              */
  /* -------------------------------------------------------------------------- */
  const langSwitcher = document.getElementById("langSwitcher");
  const langCode = document.getElementById("langCode");

  let currentLang = localStorage.getItem("arkan_lang") || "ar";

  function applyTranslations(lang) {
    const translations =
      lang === "en" ? window.enTranslations || {} : window.arTranslations || {};

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "en" ? "ltr" : "rtl");
    document.documentElement.setAttribute("data-lang", lang);
    localStorage.setItem("arkan_lang", lang);

    if (langCode) {
      langCode.textContent = lang === "ar" ? "EN" : "عربي";
    }

    // Helper to get nested translation value (e.g., "nav.home")
    function getNestedValue(obj, path) {
      return path
        .split(".")
        .reduce(
          (prev, curr) =>
            prev && prev[curr] !== undefined ? prev[curr] : null,
          obj,
        );
    }

    // Translate all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = getNestedValue(translations, key);
      if (val) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = val;
        } else if (el.tagName === "OPTION") {
          el.text = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Refresh dynamic calculator units when language changes
    if (typeof updateAddonsCalculator === "function") {
      updateAddonsCalculator();
    }
  }


  /* -------------------------------------------------------------------------- */
  /* 4. Mobile Menu Drawer Handler                                             */
  /* -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      mobileMenuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close mobile menu when clicking any nav link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 5. Smooth Scroll & Active Link Tracker                                    */
  /* -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });

    // Back to top button visibility
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  });

  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 6. YouTube Video Lightbox Modal (Fix Error 153 using youtube-nocookie.com)  */
  /* -------------------------------------------------------------------------- */
  const videoCards = document.querySelectorAll(".video-card");
  const videoModal = document.getElementById("videoModal");
  const videoModalClose = document.getElementById("videoModalClose");
  const youtubeIframe = document.getElementById("youtubeIframe");
  const modalYoutubeDirectLink = document.getElementById(
    "modalYoutubeDirectLink",
  );

  videoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const videoId = card.getAttribute("data-video-id");
      if (videoId && youtubeIframe && videoModal) {
        // Use privacy-enhanced domain for best compatibility on GitHub Pages (Error 153 is strictly due to file:/// testing)
        youtubeIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        if (modalYoutubeDirectLink) {
          modalYoutubeDirectLink.href = `https://youtube.com/watch?v=${videoId}`;
        }
        videoModal.classList.add("active");
      }
    });
  });

  function closeVideoModal() {
    if (videoModal && youtubeIframe) {
      videoModal.classList.remove("active");
      youtubeIframe.src = "";
    }
  }

  if (videoModalClose) {
    videoModalClose.addEventListener("click", closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 7. Packages Tabs Filtering & Quick Package Selection                       */
  /* -------------------------------------------------------------------------- */
  const tabBtns = document.querySelectorAll(".packages-filter-tabs .tab-btn");
  const packageCards = document.querySelectorAll(".package-card");
  const selectedPackageSelect = document.getElementById("selectedPackage");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      packageCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Date Enforcement Logic: Lock package select and buttons until date is picked
  const eventDateInput = document.getElementById("eventDate");
  const dateLockWarning = document.getElementById("dateLockWarning");
  const packagesDateNotice = document.getElementById("packagesDateNotice");
  const selectPkgBtns = document.querySelectorAll(".select-pkg-btn");

  // Save original button content for restoration
  selectPkgBtns.forEach((btn) => {
    if (!btn.hasAttribute("data-original-html")) {
      btn.setAttribute("data-original-html", btn.innerHTML);
    }
  });

  function handleDateLockState() {
    if (!selectedPackageSelect) return;
    const isEn = document.documentElement.getAttribute("data-lang") === "en";
    const hasDate = Boolean(eventDateInput && eventDateInput.value);
    selectedPackageSelect.disabled = !hasDate;

    if (dateLockWarning) {
      dateLockWarning.style.display = hasDate ? "none" : "block";
    }

    if (packagesDateNotice) {
      if (hasDate) {
        packagesDateNotice.style.background = "rgba(76, 217, 100, 0.15)";
        packagesDateNotice.style.borderColor = "#4cd964";
        packagesDateNotice.style.color = "#4cd964";
        packagesDateNotice.innerHTML = `
          <i class="fa-solid fa-circle-check" style="font-size: 1.1rem; color: #4cd964;"></i>
          <span>${isEn ? `Event date set: <strong>${eventDateInput.value}</strong>. Packages unlocked!` : `تم تحديد تاريخ الفعالية: <strong>${eventDateInput.value}</strong>. تم فتح الباقات بنجاح!`}</span>
        `;
      } else {
        packagesDateNotice.style.background = "rgba(220, 53, 69, 0.15)";
        packagesDateNotice.style.borderColor = "var(--brand-red)";
        packagesDateNotice.style.color = "#ff6b6b";
        packagesDateNotice.innerHTML = `
          <i class="fa-solid fa-lock" style="font-size: 1.1rem; color: var(--brand-red);"></i>
          <span data-i18n="packages.date_notice">${isEn ? "Important Notice: You must select the event date first in the booking form below to unlock available packages" : "ملاحظة هامة: يجب تحديد تاريخ الفعالية أولاً في نموذج الحجز بالأسفل لفتح باقات الأسعار المتاحة للحجز"}</span>
        `;
      }
    }

    // Update package card action buttons visually across all devices (Mobile / Tablet / Desktop)
    selectPkgBtns.forEach((btn) => {
      if (!hasDate) {
        btn.classList.add("btn-locked-state");
        btn.innerHTML = `<i class="fa-solid fa-lock" style="color: #ff6b6b; margin-left: 5px;"></i> <span>${isEn ? "Select Event Date First" : "حدد تاريخ الفعالية أولاً للحجز"}</span>`;
      } else {
        btn.classList.remove("btn-locked-state");
        const originalHtml = btn.getAttribute("data-original-html");
        if (originalHtml) {
          btn.innerHTML = originalHtml;
        }
      }
    });
  }

  if (eventDateInput) {
    ["change", "input", "blur", "focus", "keyup"].forEach((evt) => {
      eventDateInput.addEventListener(evt, handleDateLockState);
    });
    handleDateLockState();
  }

  // Package select button click & touch handler (Mobile, Tablet, Desktop)
  selectPkgBtns.forEach((btn) => {
    const handlePkgSelectClick = (e) => {
      const isEn = document.documentElement.getAttribute("data-lang") === "en";
      if (!eventDateInput || !eventDateInput.value) {
        e.preventDefault();
        e.stopPropagation();
        showToast(
          isEn
            ? "Please select the event date first in the booking form below to unlock packages!"
            : "الرجاء تحديد تاريخ الفعالية أولاً في نموذج الحجز بالأسفل لفتح إمكانية حجز الباقة!"
        );
        if (eventDateInput) {
          eventDateInput.focus();
          eventDateInput.classList.add("date-input-highlight");
          setTimeout(() => eventDateInput.classList.remove("date-input-highlight"), 3600);
          const yOffset = -120;
          const y = eventDateInput.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
        return false;
      }
      const pkgName = btn.getAttribute("data-package");
      if (selectedPackageSelect && pkgName) {
        for (let i = 0; i < selectedPackageSelect.options.length; i++) {
          if (
            selectedPackageSelect.options[i].value.includes(
              pkgName.split(" - ")[0],
            )
          ) {
            selectedPackageSelect.selectedIndex = i;
            break;
          }
        }
        updateEstimatedTotalPrice();
        showToast(`تم اختيار ${pkgName.split(" - ")[0]}`);
      }
    };

    btn.addEventListener("click", handlePkgSelectClick);
    btn.addEventListener("touchstart", (e) => {
      if (!eventDateInput || !eventDateInput.value) {
        handlePkgSelectClick(e);
      }
    }, { passive: false });
  });

  /* -------------------------------------------------------------------------- */
  /* 8. Interactive Addons Calculator & Dynamic Price Estimator                */
  /* -------------------------------------------------------------------------- */
  const addonInputs = document.querySelectorAll(".addon-input");
  const selectedAddonsList = document.getElementById("selectedAddonsList");
  const addonsCountEl = document.getElementById("addonsCount");
  const addonsTotalEl = document.getElementById("addonsTotal");
  const bookingEstimatedPriceEl = document.getElementById(
    "bookingEstimatedPrice",
  );

  let totalAddonsPrice = 0;
  let selectedAddons = [];

  function updateAddonsCalculator() {
    const isEn = document.documentElement.getAttribute("data-lang") === "en";
    selectedAddons = [];
    totalAddonsPrice = 0;

    addonInputs.forEach((input) => {
      if (input.checked) {
        const name = isEn
          ? input.getAttribute("data-name-en") ||
            input.getAttribute("data-name")
          : input.getAttribute("data-name");
        const price = parseInt(input.getAttribute("data-price"), 10) || 0;
        selectedAddons.push({ name, price });
        totalAddonsPrice += price;
      }
    });

    // Update Summary Box DOM
    if (selectedAddonsList) {
      if (selectedAddons.length === 0) {
        const emptyMsg = isEn
          ? "No add-ons selected yet (select from list above)."
          : "لم يتم اختيار إضافات بعد (يمكنك الاختيار من القائمة).";
        selectedAddonsList.innerHTML = `<p class="empty-msg">${emptyMsg}</p>`;
      } else {
        const currencySymbol = isEn ? "SAR" : "ر.س";
        selectedAddonsList.innerHTML = selectedAddons
          .map(
            (item) => `
          <div class="selected-addon-chip">
            <span>• ${item.name}</span>
            <strong class="text-gold">+${item.price} ${currencySymbol}</strong>
          </div>
        `,
          )
          .join("");
      }
    }

    const formAddonsListEl = document.getElementById("formAddonsList");
    const formAddonsDisplayEl = document.getElementById("formAddonsDisplay");
    if (formAddonsListEl && formAddonsDisplayEl) {
      if (selectedAddons.length > 0) {
        const currencySymbol = isEn ? "SAR" : "ر.س";
        formAddonsListEl.innerHTML = selectedAddons.map(item => `
            <li style="margin-bottom: 8px; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 5px;">
              <span>• ${item.name}</span>
              <strong style="color: var(--brand-gold);">+${item.price} ${currencySymbol}</strong>
            </li>
          `).join("");
      } else {
        formAddonsListEl.innerHTML = "";
        formAddonsDisplayEl.style.display = "none";
      }
    }

    const serviceUnit = isEn ? "Services" : "خدمات";
    const currencyUnit = isEn ? "SAR" : "ر.س";

    if (addonsCountEl) {
      addonsCountEl.textContent = `${selectedAddons.length} ${serviceUnit}`;
    }

    if (addonsTotalEl) {
      addonsTotalEl.textContent = `${totalAddonsPrice.toLocaleString()} ${currencyUnit}`;
    }

    updateEstimatedTotalPrice();
  }

  addonInputs.forEach((input) => {
    input.addEventListener("change", updateAddonsCalculator);
  });

  // Extract Package Base Price dynamically from selected dropdown option
  function getSelectedPackagePrice() {
    if (!selectedPackageSelect) return 3250;
    const val = selectedPackageSelect.value;
    const match = val.match(/(\d+[\d,]*)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ""), 10);
    }
    if (val.includes("900")) return 900;
    if (val.includes("1450")) return 1450;
    if (val.includes("2250")) return 2250;
    if (val.includes("3250")) return 3250;
    if (val.includes("4900")) return 4900;
    if (val.includes("8900")) return 8900;
    return 3250;
  }

  function updateEstimatedTotalPrice() {
    const isEn = document.documentElement.getAttribute("data-lang") === "en";
    const pkgBasePrice = getSelectedPackagePrice();
    const grandTotal = pkgBasePrice + totalAddonsPrice;
    const currencyUnit = isEn ? "SAR" : "ريال";
    if (bookingEstimatedPriceEl) {
      bookingEstimatedPriceEl.textContent = `${grandTotal.toLocaleString()} ${currencyUnit}`;
    }
  }

  if (selectedPackageSelect) {
    selectedPackageSelect.addEventListener("change", updateEstimatedTotalPrice);
  }

  // Initial calculation on page load
  updateEstimatedTotalPrice();

  const applyAddonsBtn = document.getElementById("applyAddonsBtn");
  const formAddonsDisplay = document.getElementById("formAddonsDisplay");
  const formAddonsList = document.getElementById("formAddonsList");

  if (applyAddonsBtn) {
    applyAddonsBtn.addEventListener("click", () => {
      const isEn = document.documentElement.getAttribute("data-lang") === "en";
      
      if (!eventDateInput || !eventDateInput.value) {
        showToast(
          isEn
            ? "Please select the event date first!"
            : "الرجاء تحديد تاريخ الفعالية أولاً!"
        );
        if (eventDateInput) {
          eventDateInput.focus();
          const yOffset = -100;
          const y = eventDateInput.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
        return;
      }

      if (formAddonsDisplay && formAddonsList) {
        if (selectedAddons.length > 0) {
          formAddonsDisplay.style.display = "block";
          const currencySymbol = isEn ? "SAR" : "ر.س";
          formAddonsList.innerHTML = selectedAddons.map(item => `
            <li style="margin-bottom: 8px; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 5px;">
              <span>• ${item.name}</span>
              <strong style="color: var(--brand-gold);">+${item.price} ${currencySymbol}</strong>
            </li>
          `).join("");
        } else {
          formAddonsDisplay.style.display = "none";
          formAddonsList.innerHTML = "";
        }
      }

      showToast(
        isEn
          ? "Add-ons applied, proceeding to booking"
          : "تم اعتماد الإضافات ومتابعة الحجز"
      );

      // Scroll to booking form
      const bookingFormEl = document.getElementById("bookingForm");
      if (bookingFormEl) {
        const yOffset = -80; 
        const y = bookingFormEl.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 9. Booking Form Handler & Live WhatsApp Receipt Modal                      */
  /* -------------------------------------------------------------------------- */
  const bookingForm = document.getElementById("bookingForm");
  const bookingModal = document.getElementById("bookingModal");
  const modalClose = document.getElementById("modalClose");
  const modalDoneBtn = document.getElementById("modalDoneBtn");
  const modalReceipt = document.getElementById("modalReceipt");
  const modalConfirmWhatsapp = document.getElementById("modalConfirmWhatsapp");

  let whatsappRedirectUrl = "";

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isEn = document.documentElement.getAttribute("data-lang") === "en";
      const name = document.getElementById("clientName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const date = document.getElementById("eventDate").value;
      const location = document.getElementById("eventLocation").value;
      const pkg = document.getElementById("selectedPackage").value;
      const notes = document.getElementById("bookingNotes").value.trim();
      const bankReceiptInput = document.getElementById("bankReceipt");
      const bankReceiptFile = bankReceiptInput && bankReceiptInput.files.length > 0 ? bankReceiptInput.files[0] : null;

      if (!name || !phone || !date) {
        showToast(
          isEn
            ? "Please fill in required fields (Name, Phone, Date)"
            : "يرجى تعبئة جميع الحقول المطلوبة (الاسم، الجوال، التاريخ)",
        );
        if (!date && eventDateInput) {
          eventDateInput.focus();
        }
        return;
      }

      if (!bankReceiptFile) {
        showToast(
          isEn
            ? "Please attach the bank transfer receipt image!"
            : "يرجى إرفاق صورة سند التحويل البنكي للتأكيد!",
        );
        if (bankReceiptInput) bankReceiptInput.focus();
        return;
      }

      const pkgBasePrice = getSelectedPackagePrice();
      const grandTotal = pkgBasePrice + totalAddonsPrice;
      const addonsText =
        selectedAddons.length > 0
          ? selectedAddons
              .map((a) => `- ${a.name} (${a.price} ${isEn ? "SAR" : "ر.س"})`)
              .join("\n")
          : isEn
            ? "No Add-ons"
            : "بدون إضافات";

      if (modalReceipt) {
        if (isEn) {
          modalReceipt.innerHTML = `
            <div style="margin-bottom: 12px; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px;">
              <p><strong>👤 Client Name:</strong> ${name}</p>
              <p><strong>📞 Phone Number:</strong> ${phone}</p>
              <p><strong>📅 Event Date:</strong> ${date}</p>
              <p><strong>📍 Event Location:</strong> ${location}</p>
            </div>
            <div style="margin-bottom: 12px; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px;">
              <p><strong>📦 Selected Package:</strong> <span style="color: var(--brand-gold);">${pkg}</span></p>
              <p><strong>➕ Selected Add-ons:</strong></p>
              <div style="font-size: 0.85rem; color: var(--text-secondary); margin-left: 10px;">
                ${selectedAddons.length > 0 ? selectedAddons.map((a) => `<p>• ${a.name} (+${a.price} SAR)</p>`).join("") : "<p>No add-ons selected</p>"}
              </div>
            </div>
            <div style="margin-bottom: 12px; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px;">
              <p><strong>📄 Bank Transfer Receipt:</strong> <span style="color: #4cd964;">File Selected (${bankReceiptFile.name})</span></p>
            </div>
            ${notes ? `<p style="margin-bottom: 10px;"><strong>📝 Notes:</strong> ${notes}</p>` : ""}
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--brand-gold); text-align: center; margin-top: 15px; padding: 10px; background: rgba(212,175,55,0.1); border-radius: 8px;">
              Estimated Base Cost: ${grandTotal.toLocaleString()} SAR
            </div>
            <div style="margin-top: 15px; padding: 12px 15px; background: rgba(220, 53, 69, 0.15); border: 1px solid var(--brand-red); border-radius: 8px; color: #ff6b6b; font-size: 0.88rem; line-height: 1.5; text-align: center;">
              <i class="fa-solid fa-triangle-exclamation" style="margin-right: 5px;"></i>
              <strong>IMPORTANT:</strong> Receipt attached in form. Please remember to <strong>manually attach your bank receipt image in the WhatsApp chat</strong> after it opens to complete booking.
            </div>
          `;
        } else {
          modalReceipt.innerHTML = `
            <div style="margin-bottom: 12px; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px;">
              <p><strong>👤 اسم العميل:</strong> ${name}</p>
              <p><strong>📞 رقم التواصل:</strong> ${phone}</p>
              <p><strong>📅 تاريخ المناسبة:</strong> ${date}</p>
              <p><strong>📍 مكان الحفل:</strong> ${location}</p>
            </div>
            <div style="margin-bottom: 12px; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px;">
              <p><strong>📦 الباقة المختارة:</strong> <span style="color: var(--brand-gold);">${pkg}</span></p>
              <p><strong>➕ الإضافات المختارة:</strong></p>
              <div style="font-size: 0.85rem; color: var(--text-secondary); margin-right: 10px;">
                ${selectedAddons.length > 0 ? selectedAddons.map((a) => `<p>• ${a.name} (+${a.price} ر.س)</p>`).join("") : "<p>لا يوجد إضافات</p>"}
              </div>
            </div>
            <div style="margin-bottom: 12px; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px;">
              <p><strong>📄 سند التحويل البنكي:</strong> <span style="color: #4cd964;">تم إرفاق الملف (${bankReceiptFile.name})</span></p>
            </div>
            ${notes ? `<p style="margin-bottom: 10px;"><strong>📝 ملاحظات:</strong> ${notes}</p>` : ""}
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--brand-gold); text-align: center; margin-top: 15px; padding: 10px; background: rgba(212,175,55,0.1); border-radius: 8px;">
              الإجمالي التقديري المبسط: ${grandTotal.toLocaleString()} ريال
            </div>
            <div style="margin-top: 15px; padding: 12px 15px; background: rgba(220, 53, 69, 0.15); border: 1px solid var(--brand-red); border-radius: 8px; color: #ff6b6b; font-size: 0.88rem; line-height: 1.5; text-align: center;">
              <i class="fa-solid fa-triangle-exclamation" style="margin-left: 5px;"></i>
              <strong>تنبيه هام جداً:</strong> تم إرفاق سند التحويل. نرجو منك <strong>إرسال صورة الحوالة يدوياً داخل محادثة الواتساب</strong> بعد الانتقال إليها لتأكيد الحجز.
            </div>
          `;
        }
      }

      const waText =
        `مرحباً شركة *أركان ميديا* 🎬🏼✨\nأود تأكيد حجز مبدئي لتغطية مناسبتي بالبيانات التالية:\n\n` +
        `👤 *الاسم:* ${name}\n` +
        `📞 *الجوال:* ${phone}\n` +
        `📅 *تاريخ المناسبة:* ${date}\n` +
        `📍 *المكان:* ${location}\n` +
        `📦 *الباقة:* ${pkg}\n` +
        `✨ *الإضافات:* \n${addonsText}\n` +
        `📎 *صورة سند التحويل البنكي:* مرفق في الطلب (${bankReceiptFile.name}) - وسأقوم بإرسال الصورة هنا في المحادثة يدوياً\n` +
        (notes ? `📝 *ملاحظات:* ${notes}\n` : "") +
        `\n💰 *إجمالي الفاتورة التقديرية:* ${grandTotal.toLocaleString()} ريال سعودي\n\n` +
        `أرجو إفادتي بتأكيد الحوافظ وتكلفة سفر الطاقم (إن وجدت). شكراً لكم!`;

      whatsappRedirectUrl = `https://wa.me/966553558449?text=${encodeURIComponent(waText)}`;

      if (bookingModal) {
        bookingModal.classList.add("active");
      }
    });
  }

  if (modalConfirmWhatsapp) {
    modalConfirmWhatsapp.addEventListener("click", () => {
      if (whatsappRedirectUrl) {
        window.open(whatsappRedirectUrl, "_blank");
      }
    });
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.remove("active");
    }
  }

  if (modalClose) modalClose.addEventListener("click", closeBookingModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener("click", closeBookingModal);

  if (bookingModal) {
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  // Initial translation apply (Moved here to ensure DOM variables are initialized)
  applyTranslations(currentLang);

  if (langSwitcher) {
    langSwitcher.addEventListener("click", (e) => {
      e.preventDefault();
      currentLang = currentLang === "ar" ? "en" : "ar";
      applyTranslations(currentLang);
      showToast(
        currentLang === "ar"
          ? "تم تحويل اللغة إلى العربية"
          : "Switched language to English"
      );
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 10. Toast Notification System                                              */
  /* -------------------------------------------------------------------------- */
  function showToast(message) {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-gold"></i> ${message}`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.4s ease";
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* -------------------------------------------------------------------------- */
  /* 11. 3D Aesthetic Engine (Scroll Reveal & Mouse Tilt)                      */
  /* -------------------------------------------------------------------------- */
  
  // A. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-3d');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, revealOptions);
  
  revealElements.forEach(el => {
    if (el.closest('#addons') || el.closest('#booking') || el.classList.contains('no-3d')) {
      el.classList.add('active');
      el.style.opacity = '1';
      el.style.transform = 'none';
    } else {
      revealOnScroll.observe(el);
    }
  });

  // B. 3D Hover & Touch Tilt Effect
  const cards3D = document.querySelectorAll('.glass-card');
  
  cards3D.forEach(card => {
    if (card.closest('#addons') || card.closest('#booking') || card.classList.contains('no-3d')) {
      card.style.transform = 'none';
      return;
    }

    // Shared tilt logic
    const handleTilt = (e) => {
      card.classList.remove('glass-card-3d-reset');
      card.classList.add('glass-card-3d-tilt');

      // Get bounding rect
      const rect = card.getBoundingClientRect();
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      
      if(x === undefined || y === undefined) return;

      // Calculate mouse/touch position relative to center of card
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = x - centerX;
      const mouseY = y - centerY;
      
      // Calculate rotation (max 12 degrees)
      const rotateX = ((mouseY / (rect.height / 2)) * -12).toFixed(2);
      const rotateY = ((mouseX / (rect.width / 2)) * 12).toFixed(2);
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const resetTilt = () => {
      card.classList.remove('glass-card-3d-tilt');
      card.classList.add('glass-card-3d-reset');
      card.style.transform = '';
    };

    // Mouse events
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
    
    // Touch events
    card.addEventListener('touchmove', handleTilt, { passive: true });
    card.addEventListener('touchend', resetTilt);
  });

  /* ======================================================================
     GALLERY CONTENT CONFIG — بيانات الصور والفيديوهات
     أضف أسماء الملفات هنا عند إضافة محتوى جديد
     الصور: images/<category>/<filename>
     الفيديو: promo/<category>/<filename>
     ====================================================================== */
  const GALLERY_DATA = {
    malika: {
      label: "ملكة",
      icon: "👑",
      path: "images/malika/",
      images: [
        "DSC090133.png","DSC09014.png","DSC09025.png","DSC09031.png",
        "DSC09046.png","DSC09069.png","DSC09085.png","MMK04021.png",
        "MMK04089.png","MMK04241.png","MMK04248.png","MMK04279.png",
        "MMK04284.png","MMK04393.png"
      ]
    },
    arsan: {
      label: "صور عرسان",
      icon: "💍",
      path: "images/arsan/",
      images: [
        "MMK02712.png","MMK02718.png","MMK02743.png","MMK02748.png",
        "untitled-105.png","untitled-34.png","untitled-60.png",
        "untitled-81.png","untitled-86.png"
      ]
    },
    hafla: {
      label: "حفل زفاف",
      icon: "💒",
      path: "images/hafla/",
      images: [
        "MMK02803.png","MMK02804.png","MMK02808.png","MMK02809.png",
        "MMK02815.png","MMK02816.png","MMK02853.png",
        "untitled-227.png","untitled-228.png","untitled-96.png"
      ]
    }
  };

  const PROMO_DATA = {
    e3lanat: {
      label: "إعلانات",
      path: "promo/e3lanat/",
      videos: [
        { file: "e3lanat 1.mp4", title: "إعلان 1" },
        { file: "e3lanat 2.mp4", title: "إعلان 2" }
      ]
    },
    hafla_zafaf: {
      label: "حفل زفاف",
      path: "promo/hafla_zafaf/",
      videos: [
        { file: "arkan.mov", title: "فيلم أركان - حفل زفاف" }
      ]
    },
    kibar_shakhsiyat: {
      label: "كبار الشخصيات",
      path: "promo/kibar_shakhsiyat/",
      videos: [
        { file: "dr Ibrahim.mp4", title: "د. إبراهيم" }
      ]
    },
    aflam: {
      label: "أفلام",
      path: "promo/aflam/",
      videos: [
        { file: "aflam.mp4", title: "فيلم أركان ميديا" }
      ]
    }
  };

  /* ======================================================================
     LIGHTBOX MANAGER
     ====================================================================== */
  const LightboxManager = (() => {
    let lb, img, counter, currentImages, currentIndex;

    const open = (images, index) => {
      currentImages = images;
      currentIndex = index;
      lb  = lb  || document.getElementById("lightbox");
      img = img || document.getElementById("lightbox-img");
      counter = counter || document.getElementById("lb-counter");
      if (!lb || !img) return;
      img.src = currentImages[currentIndex];
      lb.classList.add("open");
      updateCounter();
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      if (lb) lb.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => { if (img) img.src = ""; }, 320);
    };

    const prev = () => {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      img.src = currentImages[currentIndex];
      updateCounter();
    };

    const next = () => {
      currentIndex = (currentIndex + 1) % currentImages.length;
      img.src = currentImages[currentIndex];
      updateCounter();
    };

    const updateCounter = () => {
      if (counter) counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    };

    const init = () => {
      const lbEl = document.getElementById("lightbox");
      if (!lbEl) return;
      document.getElementById("lb-close").addEventListener("click", close);
      document.getElementById("lb-prev").addEventListener("click", prev);
      document.getElementById("lb-next").addEventListener("click", next);
      lbEl.addEventListener("click", e => { if (e.target === lbEl) close(); });
      document.addEventListener("keydown", e => {
        if (!lbEl.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") next();
        if (e.key === "ArrowRight") prev();
      });
    };

    return { init, open, close };
  })();

  /* ======================================================================
     PHOTO GALLERY MANAGER
     ====================================================================== */
  const PhotoGalleryManager = (() => {
    let currentCat = null;

    const buildCoverImages = () => {
      Object.keys(GALLERY_DATA).forEach(key => {
        const data = GALLERY_DATA[key];
        const frontEl = document.getElementById(`gcat-front-${key}`);
        const countEl = document.getElementById(`gcount-${key}`);
        if (!frontEl) return;

        if (countEl) {
          countEl.textContent = data.images.length ? `${data.images.length} صورة` : "لا توجد صور بعد";
        }

        if (data.images.length > 0) {
          const coverImg = document.createElement("img");
          coverImg.src = data.path + data.images[0];
          coverImg.alt = data.label;
          coverImg.className = "gcat-cover";
          frontEl.insertBefore(coverImg, frontEl.firstChild);
        } else {
          frontEl.classList.add("empty-cat");
          const msg = document.createElement("div");
          msg.className = "gcat-empty-msg";
          msg.innerHTML = `<span class="empty-icon">🖼️</span>ستُضاف الصور قريباً`;
          frontEl.insertBefore(msg, frontEl.querySelector(".gcat-front-overlay"));
        }
      });
    };

    const openCategory = catKey => {
      const data = GALLERY_DATA[catKey];
      if (!data) return;
      currentCat = catKey;

      const wrap = document.getElementById(`gcat-${catKey}`);
      if (!wrap) return;
      wrap.classList.add("flipping");

      setTimeout(() => {
        document.querySelectorAll(".gcat-flip-wrap").forEach(el => {
          if (el.id !== `gcat-${catKey}`) {
            el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
            el.style.opacity = "0";
            el.style.transform = "scale(0.9)";
            el.style.pointerEvents = "none";
          }
        });

        setTimeout(() => {
          const catsEl = document.getElementById("photo-cats");
          if (catsEl) catsEl.classList.add("g-hidden");

          renderPhotoGrid(data);

          const expanded = document.getElementById("photo-expanded");
          if (expanded) expanded.classList.add("active");
        }, 300);
      }, 380);
    };

    const renderPhotoGrid = data => {
      const iconEl  = document.getElementById("gexp-icon");
      const titleEl = document.getElementById("gexp-title");
      const countEl = document.getElementById("gexp-count");
      const grid    = document.getElementById("photo-grid");

      if (iconEl)  iconEl.textContent  = data.icon;
      if (titleEl) titleEl.textContent = data.label;
      if (countEl) countEl.textContent = `${data.images.length} صورة`;
      if (!grid) return;

      grid.innerHTML = "";

      if (data.images.length === 0) {
        grid.innerHTML = `<div class="gallery-empty-state"><span class="empty-big-icon">🖼️</span><p>لا توجد صور في هذه الفئة بعد.</p></div>`;
        return;
      }

      const allPaths = data.images.map(f => data.path + f);

      data.images.forEach((file, idx) => {
        const item = document.createElement("div");
        item.className = "gallery-photo-item";

        const img = document.createElement("img");
        img.src = data.path + file;
        img.alt = `${data.label} - ${idx + 1}`;
        img.loading = "lazy";

        const overlay = document.createElement("div");
        overlay.className = "photo-hover-overlay";

        const zoomIcon = document.createElement("span");
        zoomIcon.className = "photo-zoom-icon";
        zoomIcon.textContent = "🔍";
        overlay.appendChild(zoomIcon);

        item.appendChild(img);
        item.appendChild(overlay);
        item.addEventListener("click", () => LightboxManager.open(allPaths, idx));

        grid.appendChild(item);
      });
    };

    const closeCategory = () => {
      const expanded = document.getElementById("photo-expanded");
      if (expanded) expanded.classList.remove("active");

      const catsEl = document.getElementById("photo-cats");
      if (catsEl) catsEl.classList.remove("g-hidden");

      document.querySelectorAll(".gcat-flip-wrap").forEach(el => {
        el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        el.style.opacity = "1";
        el.style.transform = "";
        el.style.pointerEvents = "";
      });

      if (currentCat) {
        const wrap = document.getElementById(`gcat-${currentCat}`);
        if (wrap) wrap.classList.remove("flipping");
      }
      currentCat = null;
      const grid = document.getElementById("photo-grid");
      if (grid) grid.innerHTML = "";
    };

    const init = () => {
      buildCoverImages();
      document.querySelectorAll(".gcat-flip-wrap").forEach(el => {
        el.addEventListener("click", () => openCategory(el.getAttribute("data-cat")));
        el.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openCategory(el.getAttribute("data-cat"));
          }
        });
      });
      const closeBtn = document.getElementById("photo-close-btn");
      if (closeBtn) closeBtn.addEventListener("click", closeCategory);
    };

    return { init };
  })();

  /* ======================================================================
     PROMO GALLERY MANAGER
     ====================================================================== */
  const PromoGalleryManager = (() => {
    let currentPcat = null;
    let activeVideos = [];

    const buildPromoCounts = () => {
      Object.keys(PROMO_DATA).forEach(key => {
        const data = PROMO_DATA[key];
        const countEl = document.getElementById(`pvcount-${key}`);
        if (countEl) {
          countEl.textContent = data.videos.length ? `${data.videos.length} مقطع` : "لا توجد مقاطع بعد";
        }
      });
    };

    const openCategory = pcatKey => {
      const data = PROMO_DATA[pcatKey];
      if (!data) return;
      currentPcat = pcatKey;

      const wrap = document.querySelector(`[data-pcat="${pcatKey}"]`);
      if (wrap) wrap.classList.add("flipping");

      setTimeout(() => {
        document.querySelectorAll(".pcat-flip-wrap").forEach(el => {
          if (el.getAttribute("data-pcat") !== pcatKey) {
            el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
            el.style.opacity = "0";
            el.style.transform = "scale(0.9)";
            el.style.pointerEvents = "none";
          }
        });

        setTimeout(() => {
          const catsEl = document.getElementById("promo-cats");
          if (catsEl) catsEl.classList.add("p-hidden");

          renderVideoGrid(data);

          const expanded = document.getElementById("promo-expanded");
          if (expanded) expanded.classList.add("active");
        }, 300);
      }, 380);
    };

    const renderVideoGrid = data => {
      const titleEl = document.getElementById("pexp-title");
      const countEl = document.getElementById("pexp-count");
      const grid    = document.getElementById("promo-grid");

      if (titleEl) titleEl.textContent = data.label;
      if (countEl) countEl.textContent = `${data.videos.length} مقطع`;
      if (!grid) return;

      grid.innerHTML = "";
      activeVideos = [];

      if (data.videos.length === 0) {
        grid.innerHTML = `<div class="promo-empty-state"><span class="empty-vid-icon">🎬</span><p>لا توجد مقاطع في هذه الفئة بعد.</p></div>`;
        return;
      }

      data.videos.forEach((vid, idx) => {
        const card = document.createElement("div");
        card.className = "video-card";

        const playerWrap = document.createElement("div");
        playerWrap.className = "video-player-wrap";

        const video = document.createElement("video");
        video.src = data.path + vid.file;
        video.controls = true;
        video.preload = "metadata";
        video.setAttribute("playsinline", "");

        const overlay = document.createElement("div");
        overlay.className = "video-play-overlay";

        const playBtn = document.createElement("div");
        playBtn.className = "video-play-btn-big";
        playBtn.textContent = "▶";
        overlay.appendChild(playBtn);

        overlay.addEventListener("click", () => {
          overlay.classList.add("playing");
          video.play();
        });
        video.addEventListener("pause",  () => overlay.classList.remove("playing"));
        video.addEventListener("ended",  () => overlay.classList.remove("playing"));
        video.addEventListener("play",   () => {
          activeVideos.forEach(v => { if (v !== video && !v.paused) v.pause(); });
        });

        activeVideos.push(video);
        playerWrap.appendChild(video);
        playerWrap.appendChild(overlay);

        const info = document.createElement("div");
        info.className = "video-info";

        const titleDiv = document.createElement("div");
        titleDiv.className = "video-title";
        titleDiv.textContent = vid.title || vid.file.replace(/\.[^.]+$/, "");

        const metaDiv = document.createElement("div");
        metaDiv.className = "video-meta";
        metaDiv.textContent = `${data.label} • ${idx + 1}/${data.videos.length}`;

        info.appendChild(titleDiv);
        info.appendChild(metaDiv);
        card.appendChild(playerWrap);
        card.appendChild(info);
        grid.appendChild(card);
      });
    };

    const closeCategory = () => {
      activeVideos.forEach(v => { if (!v.paused) v.pause(); });
      activeVideos = [];

      const expanded = document.getElementById("promo-expanded");
      if (expanded) expanded.classList.remove("active");

      const catsEl = document.getElementById("promo-cats");
      if (catsEl) catsEl.classList.remove("p-hidden");

      document.querySelectorAll(".pcat-flip-wrap").forEach(el => {
        el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        el.style.opacity = "1";
        el.style.transform = "";
        el.style.pointerEvents = "";
      });

      if (currentPcat) {
        const sel = document.querySelector(`[data-pcat="${currentPcat}"]`);
        if (sel) sel.classList.remove("flipping");
      }
      currentPcat = null;
      const grid = document.getElementById("promo-grid");
      if (grid) grid.innerHTML = "";
    };

    const init = () => {
      buildPromoCounts();
      document.querySelectorAll(".pcat-flip-wrap").forEach(el => {
        el.addEventListener("click", () => openCategory(el.getAttribute("data-pcat")));
        el.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openCategory(el.getAttribute("data-pcat"));
          }
        });
      });
      const closeBtn = document.getElementById("promo-close-btn");
      if (closeBtn) closeBtn.addEventListener("click", closeCategory);
    };

    return { init };
  })();

  /* Init all gallery managers */
  LightboxManager.init();
  PhotoGalleryManager.init();
  PromoGalleryManager.init();

});
