(function () {
  var menuBtn = document.getElementById("menu-btn");
  var navMobile = document.getElementById("nav-mobile");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (menuBtn && navMobile) {
    menuBtn.addEventListener("click", function () {
      var open = navMobile.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      
      var navbar = document.querySelector(".site-nav");
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      if (navbar) {
        if (open || winScroll > 20) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMobile.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        
        var navbar = document.querySelector(".site-nav");
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        if (navbar && winScroll <= 20) {
          navbar.classList.remove("scrolled");
        }
      });
    });
  }

  var form = document.getElementById("lead-form");
  var successEl = document.getElementById("form-success");

  /**
   * Ajuste COMMERCIAL_EMAIL para o endereço real da equipe comercial.
   * Para produção, substitua por envio via API/CRM (endpoint próprio).
   */
  var COMMERCIAL_EMAIL = "comercial@lappui.com.br";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fd = new FormData(form);
      var clinica = (fd.get("clinica") || "").toString().trim();
      var cidade = (fd.get("cidade") || "").toString().trim();
      var equipe = (fd.get("equipe") || "").toString().trim();
      var nome = (fd.get("nome") || "").toString().trim();
      var email = (fd.get("email") || "").toString().trim();
      var telefone = (fd.get("telefone") || "").toString().trim();
      var objetivo = (fd.get("objetivo") || "").toString().trim();
      var mensagem = (fd.get("mensagem") || "").toString().trim();

      var errorEl = document.getElementById("form-error");
      if (errorEl) errorEl.hidden = true;

      if (!clinica || !cidade || !equipe || !nome || !email || !telefone || !objetivo) {
        if (errorEl) {
          errorEl.textContent = "Preencha todos os campos obrigatórios.";
          errorEl.hidden = false;
        } else {
          alert("Preencha todos os campos obrigatórios.");
        }
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (errorEl) {
          errorEl.textContent = "Por favor, insira um endereço de e-mail válido.";
          errorEl.hidden = false;
        } else {
          alert("Por favor, insira um endereço de e-mail válido.");
        }
        return;
      }

      var phoneClean = telefone.replace(/\D/g, "");
      if (phoneClean.length < 10) {
        if (errorEl) {
          errorEl.textContent = "Por favor, insira um telefone válido com DDD (mínimo 10 dígitos).";
          errorEl.hidden = false;
        } else {
          alert("Por favor, insira um telefone válido com DDD (mínimo 10 dígitos).");
        }
        return;
      }

      var bodyText =
        "Lead — L'Appui (landing)\r\n\r\n" +
        "Clínica: " +
        clinica +
        "\r\n" +
        "Cidade/UF: " +
        cidade +
        "\r\n" +
        "Equipe: " +
        equipe +
        "\r\n" +
        "Nome: " +
        nome +
        "\r\n" +
        "E-mail: " +
        email +
        "\r\n" +
        "Telefone: " +
        telefone +
        "\r\n" +
        "Objetivo: " +
        objetivo +
        "\r\n" +
        "Mensagem: " +
        (mensagem || "(sem mensagem)");

      var submitBtn = form.querySelector("button[type='submit']");
      var btnTextEl = submitBtn ? submitBtn.querySelector(".btn-text") : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("loading");
        if (btnTextEl) btnTextEl.textContent = "Enviando...";
      }

      var subject = encodeURIComponent("[L'Appui] Demonstração — " + clinica);
      var body = encodeURIComponent(bodyText);
      var mailto =
        "mailto:" + COMMERCIAL_EMAIL + "?subject=" + subject + "&body=" + body;

      window.location.href = mailto;

      if (successEl) {
        successEl.hidden = false;
      }
    });
  }

  // Dashboard simulation views and content
  var dashViews = {
    auditoria: {
      title: "Painel de Auditoria",
      html: '<div class="audit-grid">' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Documentos vencidos</div>' +
            '    <div class="audit-stat-val alert">3</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Produtos a vencer</div>' +
            '    <div class="audit-stat-val warn">7</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Equipe regular</div>' +
            '    <div class="audit-stat-val ok">12</div>' +
            '  </div>' +
            '  <div class="audit-stat-chart">' +
            '    <div class="donut-chart-wrap">' +
            '      <svg class="donut-chart" viewBox="0 0 36 36">' +
            '        <circle class="donut-ring" cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.06)" stroke-width="3"></circle>' +
            '        <circle class="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--gold)" stroke-width="3" stroke-dasharray="82 18" stroke-dashoffset="25"></circle>' +
            '      </svg>' +
            '      <div class="donut-text">' +
            '        <strong>82%</strong>' +
            '        <span>Regular</span>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="alerts-list">' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot red"></span>' +
            '    <span class="alert-text">Alvará sanitário vencido</span>' +
            '    <span class="alert-tag red">Urgente</span>' +
            '  </div>' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot amber"></span>' +
            '    <span class="alert-text">Manutenção laser — 5 dias</span>' +
            '    <span class="alert-tag amber">Atenção</span>' +
            '  </div>' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot amber"></span>' +
            '    <span class="alert-text">Consentimento pendente</span>' +
            '    <span class="alert-tag amber">Atenção</span>' +
            '  </div>' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot green"></span>' +
            '    <span class="alert-text">Estoque radiofrequência ok</span>' +
            '    <span class="alert-tag green">Regular</span>' +
            '  </div>' +
            '</div>'
    },
    prontuario: {
      title: "Painel de Prontuário",
      html: '<div class="audit-grid">' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Prontuários ativos</div>' +
            '    <div class="audit-stat-val ok">142</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Termos pendentes</div>' +
            '    <div class="audit-stat-val alert">5</div>' +
            '  </div>' +
            '</div>' +
            '<div class="alerts-list">' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot red"></span>' +
            '    <span class="alert-text">Termo de Criolipólise ausente — Maria O.</span>' +
            '    <span class="alert-tag red">Urgente</span>' +
            '  </div>' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot amber"></span>' +
            '    <span class="alert-text">Assinatura pendente anamnese — João P.</span>' +
            '    <span class="alert-tag amber">Atenção</span>' +
            '  </div>' +
            '</div>'
    },
    agenda: {
      title: "Painel de Agenda",
      html: '<div class="audit-grid">' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Atendimentos hoje</div>' +
            '    <div class="audit-stat-val ok">18</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Encaixes solicitados</div>' +
            '    <div class="audit-stat-val warn">3</div>' +
            '  </div>' +
            '</div>' +
            '<div class="alerts-list">' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot amber"></span>' +
            '    <span class="alert-text">Conflito de salas: Sala 02 às 14:00</span>' +
            '    <span class="alert-tag amber">Atenção</span>' +
            '  </div>' +
            '</div>'
    },
    documentos: {
      title: "Painel de Documentos",
      html: '<div class="audit-grid">' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Documentos regulares</div>' +
            '    <div class="audit-stat-val ok">8</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Documentos vencidos</div>' +
            '    <div class="audit-stat-val alert">1</div>' +
            '  </div>' +
            '</div>' +
            '<div class="alerts-list">' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot red"></span>' +
            '    <span class="alert-text">Alvará de Funcionamento vence em 3 dias</span>' +
            '    <span class="alert-tag red">Crítico</span>' +
            '  </div>' +
            '</div>'
    },
    estoque: {
      title: "Painel de Estoque",
      html: '<div class="audit-grid">' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Lotes monitorados</div>' +
            '    <div class="audit-stat-val ok">34</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Produtos vencidos</div>' +
            '    <div class="audit-stat-val alert">2</div>' +
            '  </div>' +
            '</div>' +
            '<div class="alerts-list">' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot red"></span>' +
            '    <span class="alert-text">Lote Toxina Botulínica #2810 — Vencido</span>' +
            '    <span class="alert-tag red">Crítico</span>' +
            '  </div>' +
            '</div>'
    },
    profissionais: {
      title: "Painel de Profissionais",
      html: '<div class="audit-grid">' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Profissionais ativos</div>' +
            '    <div class="audit-stat-val ok">8</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Documentos pendentes</div>' +
            '    <div class="audit-stat-val warn">1</div>' +
            '  </div>' +
            '</div>' +
            '<div class="alerts-list">' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot amber"></span>' +
            '    <span class="alert-text">CRM/CRBM pendente — Dr. André L.</span>' +
            '    <span class="alert-tag amber">Atenção</span>' +
            '  </div>' +
            '</div>'
    },
    pagamentos: {
      title: "Painel de Pagamentos",
      html: '<div class="audit-grid">' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Faturamento mensal</div>' +
            '    <div class="audit-stat-val ok">R$ 48k</div>' +
            '  </div>' +
            '  <div class="audit-stat">' +
            '    <div class="audit-stat-label">Parcelas em atraso</div>' +
            '    <div class="audit-stat-val alert">4</div>' +
            '  </div>' +
            '  <div class="audit-stat-chart">' +
            '    <div class="donut-chart-wrap">' +
            '      <svg class="donut-chart" viewBox="0 0 36 36">' +
            '        <circle class="donut-ring" cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.06)" stroke-width="3"></circle>' +
            '        <circle class="donut-segment" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--green-mid)" stroke-width="3" stroke-dasharray="92 8" stroke-dashoffset="25"></circle>' +
            '      </svg>' +
            '      <div class="donut-text">' +
            '        <strong>92%</strong>' +
            '        <span>Adimplente</span>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="alerts-list">' +
            '  <div class="alert-row">' +
            '    <span class="alert-dot red"></span>' +
            '    <span class="alert-text">Inadimplência recorrente — Plano Facial</span>' +
            '    <span class="alert-tag red">Urgente</span>' +
            '  </div>' +
            '</div>'
    }
  };

  var navItems = document.querySelectorAll(".dash-nav-item[data-dash-nav]");
  var dashTitle = document.querySelector(".dash-title");

  if (navItems.length > 0 && dashTitle) {
    navItems.forEach(function (item) {
      item.addEventListener("click", function () {
        // Toggle active class
        navItems.forEach(function (el) { el.classList.remove("active"); });
        item.classList.add("active");

        var viewKey = item.getAttribute("data-dash-nav");
        var view = dashViews[viewKey];
        if (view) {
          dashTitle.textContent = view.title;

          // Remove old content elements (siblings of .dash-header)
          var dashMain = document.querySelector(".dash-main");
          var header = dashMain.querySelector(".dash-header");

          while (dashMain.lastChild && dashMain.lastChild !== header) {
            dashMain.removeChild(dashMain.lastChild);
          }

          // Append new content
          var contentContainer = document.createElement("div");
          contentContainer.innerHTML = view.html;

          while (contentContainer.firstChild) {
            dashMain.appendChild(contentContainer.firstChild);
          }
        }
      });
    });
  }

  // Risk Calculator Implementation
  var calculator = document.getElementById("risk-calculator");
  if (calculator) {
    var checkboxes = calculator.querySelectorAll("[data-risk-check]");
    var scoreVal = document.getElementById("risk-score-value");
    var levelLabel = document.getElementById("risk-level-label");
    var riskBar = document.getElementById("risk-bar");
    var riskFeedback = document.getElementById("risk-feedback");

    function updateCalculator() {
      var checkedCount = 0;
      checkboxes.forEach(function (cb) {
        if (cb.checked) checkedCount++;
      });

      var percentage = checkedCount * 20; // 5 checkboxes = 100%
      scoreVal.textContent = percentage + "%";

      if (riskBar) {
        riskBar.style.width = percentage + "%";
        riskBar.className = "risk-bar-fill"; // reset classes
      }

      var level = "Excelente";
      var feedback = "Sua clínica possui um controle excelente! Continue monitorando os vencimentos e processos para evitar qualquer surpresa operacional.";

      if (checkedCount === 1) {
        level = "Baixo";
        if (riskBar) riskBar.classList.add("low");
        feedback = "Atenção inicial: você possui uma pendência operacional que pode gerar gargalos. O L'Appui ajuda a automatizar esses alertas antes que afetem seu faturamento.";
      } else if (checkedCount === 2) {
        level = "Médio";
        if (riskBar) riskBar.classList.add("medium");
        feedback = "Risco moderado: acumular processos manuais em mais de uma área (como estoque e alvarás) aumenta as chances de falhas humanas e multas fiscais.";
      } else if (checkedCount >= 3 && checkedCount < 5) {
        level = "Alto";
        if (riskBar) riskBar.classList.add("high");
        feedback = "Risco elevado: múltiplos processos vitais dependem de controles manuais e isolados. Recomenda-se centralizar a gestão e as auditorias imediatamente.";
      } else if (checkedCount === 5) {
        level = "Crítico";
        if (riskBar) riskBar.classList.add("danger");
        feedback = "Risco crítico! Todos os pilares operacionais estão expostos a falhas. Você corre sério risco de sofrer com glosas de planos, produtos vencidos e autuações da vigilância.";
      }

      if (levelLabel) levelLabel.textContent = level;
      if (riskFeedback) riskFeedback.textContent = feedback;
    }

    checkboxes.forEach(function (cb) {
      cb.addEventListener("change", updateCalculator);
    });

    // Initialize
    updateCalculator();
  }

  // Floating label helper for input elements
  var formFields = document.querySelectorAll(".lead-form input, .lead-form select, .lead-form textarea");
  if (formFields.length > 0) {
    formFields.forEach(function (field) {
      function checkValue() {
        if (field.value && field.value.trim() !== "") {
          field.classList.add("has-value");
        } else {
          field.classList.remove("has-value");
        }
      }
      field.addEventListener("input", checkValue);
      field.addEventListener("change", checkValue);
      // Run once initially
      checkValue();
    });
  }

  // Pricing Switcher Logic
  var billingToggle = document.getElementById("billing-toggle");
  var priceEssencial = document.querySelector('[data-plan-price="essencial"]');
  var priceProfissional = document.querySelector('[data-plan-price="profissional"]');
  var priceIntegrada = document.querySelector('[data-plan-price="integrada"]');
  var monthlyLabel = document.getElementById("billing-monthly-label");
  var yearlyLabel = document.getElementById("billing-yearly-label");

  if (billingToggle && priceEssencial && priceProfissional && priceIntegrada) {
    billingToggle.addEventListener("change", function () {
      if (billingToggle.checked) {
        priceEssencial.textContent = "119";
        priceProfissional.textContent = "239";
        priceIntegrada.textContent = "479";
        if (monthlyLabel) monthlyLabel.classList.remove("active");
        if (yearlyLabel) yearlyLabel.classList.add("active");
      } else {
        priceEssencial.textContent = "149";
        priceProfissional.textContent = "299";
        priceIntegrada.textContent = "599";
        if (monthlyLabel) monthlyLabel.classList.add("active");
        if (yearlyLabel) yearlyLabel.classList.remove("active");
      }
    });
  }

  // Testimonials Carousel Logic
  var slides = document.querySelectorAll("[data-testimonial-slide]");
  var prevBtn = document.getElementById("prev-testimonial");
  var nextBtn = document.getElementById("next-testimonial");
  var dots = document.querySelectorAll("#carousel-dots .dot");
  var currentSlide = 0;
  var autoplayInterval = null;
  var AUTOPLAY_TIME = 6000;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    // Bounds check
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    // Toggle active classes
    slides.forEach(function (slide, i) {
      if (i === currentSlide) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    dots.forEach(function (dot, i) {
      if (i === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function startAutoplay() {
    resetAutoplay();
    var progressBar = document.querySelector('.carousel-progress-bar');
    if (progressBar) {
      progressBar.classList.remove("animating");
      var trigger = progressBar.offsetHeight; // trigger reflow
      progressBar.classList.add("animating");
    }

    autoplayInterval = setInterval(function () {
      showSlide(currentSlide + 1);
      if (progressBar) {
        progressBar.classList.remove("animating");
        var trigger = progressBar.offsetHeight; // trigger reflow
        progressBar.classList.add("animating");
      }
    }, AUTOPLAY_TIME);
  }

  function resetAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function handleManualNav(index) {
    showSlide(index);
    startAutoplay();
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", function () {
      handleManualNav(currentSlide + 1);
    });

    prevBtn.addEventListener("click", function () {
      handleManualNav(currentSlide - 1);
    });
  }

  if (dots.length > 0) {
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        handleManualNav(i);
      });
    });
  }

  // Start autoplay immediately on load
  if (slides.length > 0) {
    startAutoplay();
  }

  // Scroll Reveal Logic using IntersectionObserver
  if (typeof IntersectionObserver !== "undefined") {
    var revealElements = document.querySelectorAll("section, .cta-final");
    revealElements.forEach(function (el) {
      el.classList.add("scroll-reveal");
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // only reveal once
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Back to Top button logic
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ROI Calculator Implementation
  var billingInput = document.getElementById("roi-billing");
  var hoursInput = document.getElementById("roi-hours");
  var billingVal = document.getElementById("roi-billing-val");
  var hoursVal = document.getElementById("roi-hours-val");
  var savingsResult = document.getElementById("roi-savings");

  function formatCurrency(val) {
    return val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function updateRoi() {
    if (!billingInput || !hoursInput) return;
    var billing = parseFloat(billingInput.value) || 0;
    var hours = parseFloat(hoursInput.value) || 0;

    var savings = (billing * 0.015) + (hours * 4 * 75);

    if (billingVal) {
      billingVal.textContent = "R$ " + formatCurrency(billing);
    }
    if (hoursVal) {
      hoursVal.textContent = hours + (hours === 1 ? " hora" : " horas");
    }
    if (savingsResult) {
      savingsResult.textContent = "R$ " + formatCurrency(savings);
    }

    // Set --slider-val dynamically for custom CSS range slider tracking
    var billingPct = ((billingInput.value - billingInput.min) / (billingInput.max - billingInput.min)) * 100;
    billingInput.style.setProperty("--slider-val", billingPct + "%");

    var hoursPct = ((hoursInput.value - hoursInput.min) / (hoursInput.max - hoursInput.min)) * 100;
    hoursInput.style.setProperty("--slider-val", hoursPct + "%");
  }

  if (billingInput && hoursInput) {
    billingInput.addEventListener("input", updateRoi);
    hoursInput.addEventListener("input", updateRoi);
    updateRoi();
  }

  // FAQ Accordion logic
  var faqQuestions = document.querySelectorAll(".faq-question");
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var isActive = item.classList.contains("active");

        // Close all items
        document.querySelectorAll(".faq-item").forEach(function (el) {
          el.classList.remove("active");
          var q = el.querySelector(".faq-question");
          if (q) q.setAttribute("aria-expanded", "false");
        });

        // Toggle active
        if (!isActive) {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // FAQ Search Filter Logic
  var faqSearch = document.getElementById("faq-search");
  var faqItems = document.querySelectorAll(".faq-item");
  if (faqSearch && faqItems.length > 0) {
    faqSearch.addEventListener("input", function () {
      var query = (faqSearch.value || "").toLowerCase().trim();
      faqItems.forEach(function (item) {
        var questionText = (item.querySelector(".faq-question")?.textContent || "").toLowerCase();
        var answerText = (item.querySelector(".faq-answer")?.textContent || "").toLowerCase();
        if (questionText.indexOf(query) !== -1 || answerText.indexOf(query) !== -1) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  }

  // Theme Switcher Logic
  var themeToggle = document.getElementById("theme-toggle");
  var currentTheme = "light";
  try {
    currentTheme = localStorage.getItem("theme") || "light";
  } catch (e) {}

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var theme = document.documentElement.getAttribute("data-theme");
      var nextTheme = theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      try {
        localStorage.setItem("theme", nextTheme);
      } catch (e) {}
    });
  }

  // Scroll Progress Bar & Nav Scroll Logic
  window.addEventListener("scroll", function () {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    var scrollBar = document.querySelector(".nav-scroll-bar");
    if (scrollBar) {
      scrollBar.style.width = scrolled + "%";
    }

    // Toggle scrolled state on nav bar
    var navbar = document.querySelector(".site-nav");
    var navMobile = document.getElementById("nav-mobile");
    var menuOpen = navMobile ? navMobile.classList.contains("is-open") : false;
    if (navbar) {
      if (winScroll > 20 || menuOpen) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Toggle scroll indicator visibility
    var scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      if (winScroll > 100) {
        scrollIndicator.classList.add("hidden-scroll");
      } else {
        scrollIndicator.classList.remove("hidden-scroll");
      }
    }
  });

  // Stock Simulator Shelf Logic
  var shelfData = {
    botox: {
      name: "Toxina Botulínica (Botox)",
      code: "#BTX-2026",
      date: "12/06/2026",
      status: "Atenção (Vence em 7 dias)",
      statusClass: "warning",
      action: "Priorizar a aplicação deste lote nas sessões agendadas para esta semana ou transferir o item para uso imediato em cabine."
    },
    acid: {
      name: "Ácido Hialurônico (Preenchedor)",
      code: "#HYA-9912",
      date: "24/11/2027",
      status: "Seguro (Lote Regular)",
      statusClass: "success",
      action: "Produto em conformidade total. Armazenar em local seco e fresco de acordo com as especificações térmicas do fabricante."
    },
    serum: {
      name: "Sérum Hidratante Facial",
      code: "#SRM-4410",
      date: "10/05/2026",
      status: "Crítico (Vencido)",
      statusClass: "danger",
      action: "LOTE VENCIDO! Retirar do estoque clínico imediatamente. Descartar conforme regulamento da vigilância sanitária local."
    }
  };

  var shelfItems = document.querySelectorAll("[data-shelf-item]");
  var shelfName = document.getElementById("shelf-item-name");
  var shelfCode = document.getElementById("shelf-item-code");
  var shelfDate = document.getElementById("shelf-item-date");
  var shelfStatus = document.getElementById("shelf-item-status");
  var shelfAction = document.getElementById("shelf-item-action");

  if (shelfItems.length > 0) {
    shelfItems.forEach(function (item) {
      item.addEventListener("click", function () {
        shelfItems.forEach(function (el) { el.classList.remove("active"); });
        item.classList.add("active");

        var detailsPanel = document.getElementById("shelf-details-panel");
        if (detailsPanel) {
          detailsPanel.classList.remove("updating");
          var reflow = detailsPanel.offsetHeight; // trigger reflow
          detailsPanel.classList.add("updating");
          setTimeout(function () {
            detailsPanel.classList.remove("updating");
          }, 400);
        }

        var key = item.getAttribute("data-shelf-item");
        var data = shelfData[key];
        if (data) {
          if (shelfName) shelfName.textContent = data.name;
          if (shelfCode) shelfCode.textContent = data.code;
          if (shelfDate) shelfDate.textContent = data.date;
          if (shelfStatus) {
            shelfStatus.textContent = data.status;
            shelfStatus.className = "status-badge " + data.statusClass;
          }
          if (shelfAction) shelfAction.textContent = data.action;
        }
      });
    });
  }

  // Spotlight effect for interactive cards (modules, pains, pricing)
  var interactiveCards = document.querySelectorAll(".module-card, .pain-card, .price-card");
  if (interactiveCards.length > 0) {
    interactiveCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");
      });
    });
  }
})();
