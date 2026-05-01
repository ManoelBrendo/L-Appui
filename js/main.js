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
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMobile.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
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

      if (!clinica || !cidade || !equipe || !nome || !email || !telefone || !objetivo) {
        alert("Preencha todos os campos obrigatórios.");
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
})();
