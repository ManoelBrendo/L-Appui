import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Helper to set up DOM and script execution
function loadDomAndScript() {
  const htmlPath = resolve(__dirname, '../index.html');
  const html = readFileSync(htmlPath, 'utf8');
  document.documentElement.innerHTML = html;

  const jsPath = resolve(__dirname, './main.js');
  const js = readFileSync(jsPath, 'utf8');

  // Evaluate script in the test environment context (shares global variables and mocks)
  new Function(js)();
}

describe("L'Appui Landing Page Tests (TDD)", () => {
  let mockLocation;

  beforeEach(() => {
    // Mock window.alert to prevent JSDOM throwing
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Stub global location and window.location
    mockLocation = {
      href: '',
      assign: vi.fn(),
      replace: vi.fn()
    };
    vi.stubGlobal('location', mockLocation);
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      configurable: true,
      writable: true
    });

    // Reset DOM and execute scripts
    loadDomAndScript();
  });

  describe("Mobile Menu Toggle", () => {
    it("should toggle the mobile navigation visibility on button click", () => {
      const menuBtn = document.getElementById("menu-btn");
      const navMobile = document.getElementById("nav-mobile");

      expect(navMobile.classList.contains("is-open")).toBe(false);
      expect(menuBtn.getAttribute("aria-expanded")).toBe("false");

      // First click: open menu
      menuBtn.click();
      expect(navMobile.classList.contains("is-open")).toBe(true);
      expect(menuBtn.getAttribute("aria-expanded")).toBe("true");

      // Second click: close menu
      menuBtn.click();
      expect(navMobile.classList.contains("is-open")).toBe(false);
      expect(menuBtn.getAttribute("aria-expanded")).toBe("false");
    });

    it("should close mobile navigation when a nav link is clicked", () => {
      const menuBtn = document.getElementById("menu-btn");
      const navMobile = document.getElementById("nav-mobile");
      
      // Open first
      menuBtn.click();
      expect(navMobile.classList.contains("is-open")).toBe(true);

      // Click on a link inside mobile nav
      const firstLink = navMobile.querySelector("a");
      firstLink.click();

      expect(navMobile.classList.contains("is-open")).toBe(false);
      expect(menuBtn.getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("Lead Capture Form", () => {
    it("should exist in the DOM with required fields", () => {
      const form = document.getElementById("lead-form");
      expect(form).not.toBeNull();

      expect(form.querySelector("[name='clinica']")).not.toBeNull();
      expect(form.querySelector("[name='cidade']")).not.toBeNull();
      expect(form.querySelector("[name='equipe']")).not.toBeNull();
      expect(form.querySelector("[name='nome']")).not.toBeNull();
      expect(form.querySelector("[name='email']")).not.toBeNull();
      expect(form.querySelector("[name='telefone']")).not.toBeNull();
      expect(form.querySelector("[name='objetivo']")).not.toBeNull();
    });

    it("should display the inline error banner if required fields are missing on submit", () => {
      const form = document.getElementById("lead-form");
      const errorEl = document.getElementById("form-error");

      // Submit with empty inputs
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      expect(errorEl.hidden).toBe(false);
      expect(errorEl.textContent).toContain("Preencha todos os campos obrigatórios.");
    });

    it("should successfully trigger mailto and show success message when filled correctly", () => {
      const form = document.getElementById("lead-form");
      const successEl = document.getElementById("form-success");

      // Fill in all required fields
      form.querySelector("[name='clinica']").value = "Clínica Harmonize";
      form.querySelector("[name='cidade']").value = "São Paulo/SP";
      form.querySelector("[name='equipe']").value = "5-10";
      form.querySelector("[name='nome']").value = "Dr. Silva";
      form.querySelector("[name='email']").value = "contato@harmonize.com";
      form.querySelector("[name='telefone']").value = "(11) 99999-9999";
      form.querySelector("[name='objetivo']").value = "Reduzir glosas e perdas de estoque";

      form.dispatchEvent(new Event('submit', { cancelable: true }));

      // Success container should be visible
      expect(successEl.hidden).toBe(false);
      
      // Should redirect to mailto URL
      const decodedHref = decodeURIComponent(mockLocation.href);
      expect(decodedHref).toContain("mailto:comercial@lappui.com.br");
      expect(decodedHref).toContain("Clínica Harmonize");
    });
  });

  describe("Interactive Dashboard Mockup", () => {
    it("should toggle active status of sidebar buttons on click", () => {
      const sidebarItems = document.querySelectorAll(".dash-nav-item[data-dash-nav]");
      expect(sidebarItems.length).toBeGreaterThan(0);

      const firstItem = document.querySelector(".dash-nav-item[data-dash-nav='auditoria']");
      const secondItem = document.querySelector(".dash-nav-item[data-dash-nav='prontuario']");

      expect(firstItem.classList.contains("active")).toBe(true);
      expect(secondItem.classList.contains("active")).toBe(false);

      // Click second item
      secondItem.click();

      expect(firstItem.classList.contains("active")).toBe(false);
      expect(secondItem.classList.contains("active")).toBe(true);
    });

    it("should dynamically update the dashboard main content depending on selected nav item", () => {
      const titleEl = document.querySelector(".dash-title");
      const prontuarioNav = document.querySelector(".dash-nav-item[data-dash-nav='prontuario']");
      const agendaNav = document.querySelector(".dash-nav-item[data-dash-nav='agenda']");

      expect(titleEl.textContent).toContain("Auditoria");

      // Click Prontuário
      prontuarioNav.click();
      expect(titleEl.textContent).toContain("Painel de Prontuário");

      // Click Agenda
      agendaNav.click();
      expect(titleEl.textContent).toContain("Painel de Agenda");
    });
  });

  describe("Audit Risk Calculator", () => {
    it("should calculate correct risk score and level based on checkboxes", () => {
      const calcContainer = document.getElementById("risk-calculator");
      expect(calcContainer).not.toBeNull();

      const scoreValue = document.getElementById("risk-score-value");
      const levelLabel = document.getElementById("risk-level-label");
      const riskBar = document.getElementById("risk-bar");

      // Initial state: nothing checked
      expect(scoreValue.textContent).toBe("0%");
      expect(levelLabel.textContent).toBe("Excelente");

      // Check 1 risk item
      const item1 = document.querySelector("[data-risk-check='alvara']");
      item1.checked = true;
      item1.dispatchEvent(new Event('change'));

      // 1 item checked: score should update, level should change to Baixo
      expect(scoreValue.textContent).not.toBe("0%");
      expect(levelLabel.textContent).toBe("Baixo");

      // Check all 5 risk items
      const allChecks = document.querySelectorAll("[data-risk-check]");
      allChecks.forEach(cb => {
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
      });

      expect(scoreValue.textContent).toBe("100%");
      expect(levelLabel.textContent).toBe("Crítico");
      expect(riskBar.classList.contains("danger")).toBe(true);
    });
  });

  describe("Pricing Switcher", () => {
    it("should toggle prices between monthly and discounted annual values", () => {
      const toggle = document.getElementById("billing-toggle");
      expect(toggle).not.toBeNull();

      const priceEssencial = document.querySelector('[data-plan-price="essencial"]');
      const priceProfissional = document.querySelector('[data-plan-price="profissional"]');
      const priceIntegrada = document.querySelector('[data-plan-price="integrada"]');

      // Default: Monthly
      expect(priceEssencial.textContent).toBe("149");
      expect(priceProfissional.textContent).toBe("299");
      expect(priceIntegrada.textContent).toBe("599");

      // Change to Annual
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));

      expect(priceEssencial.textContent).toBe("119");
      expect(priceProfissional.textContent).toBe("239");
      expect(priceIntegrada.textContent).toBe("479");

      // Return to Monthly
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));

      expect(priceEssencial.textContent).toBe("149");
      expect(priceProfissional.textContent).toBe("299");
      expect(priceIntegrada.textContent).toBe("599");
    });
  });

  describe("Testimonials Carousel", () => {
    it("should shift active testimonial slides when clicking buttons", () => {
      const slides = document.querySelectorAll('[data-testimonial-slide]');
      expect(slides.length).toBeGreaterThan(1);

      const prevBtn = document.getElementById("prev-testimonial");
      const nextBtn = document.getElementById("next-testimonial");
      expect(prevBtn).not.toBeNull();
      expect(nextBtn).not.toBeNull();

      // Slide 1 active initially
      expect(slides[0].classList.contains("active")).toBe(true);
      expect(slides[1].classList.contains("active")).toBe(false);

      // Click next
      nextBtn.click();
      expect(slides[0].classList.contains("active")).toBe(false);
      expect(slides[1].classList.contains("active")).toBe(true);

      // Click prev
      prevBtn.click();
      expect(slides[0].classList.contains("active")).toBe(true);
      expect(slides[1].classList.contains("active")).toBe(false);
    });

    it("should have a carousel progress bar and auto-play slides, resetting on manual interaction", () => {
      vi.useFakeTimers();
      
      // Reload DOM and script with fake timers enabled
      loadDomAndScript();

      const slides = document.querySelectorAll('[data-testimonial-slide]');
      const progressBar = document.querySelector('.carousel-progress-bar');
      const nextBtn = document.getElementById("next-testimonial");

      expect(progressBar).not.toBeNull();
      expect(slides.length).toBeGreaterThan(2);

      // Slide 0 active initially
      expect(slides[0].classList.contains("active")).toBe(true);

      // Advance 6 seconds
      vi.advanceTimersByTime(6000);
      expect(slides[1].classList.contains("active")).toBe(true);
      expect(slides[0].classList.contains("active")).toBe(false);

      // Click next manually (which should reset timer and move to slide 2)
      nextBtn.click();
      expect(slides[2].classList.contains("active")).toBe(true);

      // Advance by 3 seconds. It should STILL be on slide 2 because the timer was reset.
      vi.advanceTimersByTime(3000);
      expect(slides[2].classList.contains("active")).toBe(true);

      // Advance another 3 seconds (6 seconds total since click). It should now advance to slide 0.
      vi.advanceTimersByTime(3000);
      expect(slides[0].classList.contains("active")).toBe(true);

      vi.useRealTimers();
    });
  });

  describe("Back to Top Button", () => {
    it("should display the button when scrolled down and scroll to top on click", () => {
      const btn = document.getElementById("back-to-top");
      expect(btn).not.toBeNull();

      expect(btn.classList.contains("visible")).toBe(false);

      // Simulate scroll
      window.scrollY = 500;
      window.dispatchEvent(new Event('scroll'));

      expect(btn.classList.contains("visible")).toBe(true);

      // Simulate click
      const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      btn.click();
      expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });

  describe("FAQ Accordion", () => {
    it("should toggle accordion items open and closed on click", () => {
      const faqQuestions = document.querySelectorAll(".faq-question");
      const faqItems = document.querySelectorAll(".faq-item");
      expect(faqQuestions.length).toBeGreaterThan(1);

      // Default: first item is active, others are closed
      expect(faqItems[0].classList.contains("active")).toBe(true);
      expect(faqItems[1].classList.contains("active")).toBe(false);

      // Click second item
      faqQuestions[1].click();
      expect(faqItems[0].classList.contains("active")).toBe(false);
      expect(faqItems[1].classList.contains("active")).toBe(true);

      // Click second item again (collapses it)
      faqQuestions[1].click();
      expect(faqItems[1].classList.contains("active")).toBe(false);
    });
  });

  describe("ROI Calculator", () => {
    it("should calculate savings based on billing and audit hours inputs", () => {
      const billingInput = document.getElementById("roi-billing");
      const hoursInput = document.getElementById("roi-hours");
      const savingsResult = document.getElementById("roi-savings");

      expect(billingInput).not.toBeNull();
      expect(hoursInput).not.toBeNull();
      expect(savingsResult).not.toBeNull();

      // Set input values and trigger input events
      billingInput.value = "50000";
      billingInput.dispatchEvent(new Event("input"));

      hoursInput.value = "10";
      hoursInput.dispatchEvent(new Event("input"));

      // Savings = (50000 * 0.015) + (10 * 4 * 75) = 750 + 3000 = 3750
      expect(savingsResult.textContent).toContain("3.750");
    });
  });

  describe("Lead Form Loading State", () => {
    it("should transition to loading state upon valid submit", () => {
      const form = document.getElementById("lead-form");
      const submitBtn = form.querySelector("button[type='submit']");
      const spinner = form.querySelector(".submit-spinner");

      expect(submitBtn).not.toBeNull();
      expect(spinner).not.toBeNull();
      expect(submitBtn.disabled).toBe(false);
      expect(submitBtn.classList.contains("loading")).toBe(false);

      // Fill in all required fields
      form.querySelector("[name='clinica']").value = "Clínica TDD";
      form.querySelector("[name='cidade']").value = "Belo Horizonte/MG";
      form.querySelector("[name='equipe']").value = "3-5";
      form.querySelector("[name='nome']").value = "Alice TDD";
      form.querySelector("[name='email']").value = "alice@tdd.com";
      form.querySelector("[name='telefone']").value = "(31) 98888-8888";
      form.querySelector("[name='objetivo']").value = "Reduzir glosas e perdas de estoque";

      // Trigger submit
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      // Button should be disabled and show loading class/text
      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.classList.contains("loading")).toBe(true);
    });
  });

  describe("Theme Switcher", () => {
    it("should toggle the data-theme attribute on documentElement on button click", () => {
      const toggleBtn = document.getElementById("theme-toggle");
      expect(toggleBtn).not.toBeNull();

      // Check initial state (should be light or not set)
      expect(document.documentElement.getAttribute("data-theme")).not.toBe("dark");

      // Click: should become dark
      toggleBtn.click();
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

      // Click again: should become light
      toggleBtn.click();
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });
  });

  describe("Scroll Progress Bar", () => {
    it("should exist inside the site navigation bar", () => {
      const scrollBar = document.querySelector(".nav-scroll-bar");
      expect(scrollBar).not.toBeNull();
    });
  });

  describe("Stock Simulator Shelf", () => {
    it("should update detailed card status upon clicking shelf item", () => {
      const botoxItem = document.querySelector("[data-shelf-item='botox']");
      const serumItem = document.querySelector("[data-shelf-item='serum']");
      const shelfName = document.getElementById("shelf-item-name");
      const shelfStatus = document.getElementById("shelf-item-status");

      expect(botoxItem).not.toBeNull();
      expect(serumItem).not.toBeNull();
      expect(shelfName).not.toBeNull();
      expect(shelfStatus).not.toBeNull();

      // Click botox: name should contain "Botox"
      botoxItem.click();
      expect(shelfName.textContent).toContain("Botox");

      // Click serum: status should contain "Crítico" or "Vencido"
      serumItem.click();
      expect(shelfStatus.textContent).toMatch(/Crítico|Vencido/);
    });
  });

  describe("FAQ Search Filter", () => {
    it("should filter accordion items matching search input keywords", () => {
      const searchInput = document.getElementById("faq-search");
      expect(searchInput).not.toBeNull();

      const faqItems = document.querySelectorAll(".faq-item");
      expect(faqItems.length).toBeGreaterThan(1);

      // Initially, no items are hidden
      faqItems.forEach(item => {
        expect(item.classList.contains("hidden")).toBe(false);
      });

      // Type "prontuário" into the search
      searchInput.value = "prontuário";
      searchInput.dispatchEvent(new Event("input"));

      // The first item should remain visible; others should be filtered out (hidden)
      let hiddenCount = 0;
      faqItems.forEach(item => {
        if (item.classList.contains("hidden")) {
          hiddenCount++;
        }
      });
      expect(hiddenCount).toBeGreaterThan(0);
      expect(faqItems[0].classList.contains("hidden")).toBe(false);

      // Clear search
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));

      faqItems.forEach(item => {
        expect(item.classList.contains("hidden")).toBe(false);
      });
    });
  });
});
