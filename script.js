document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("meuFormulario");
  const nome = document.getElementById("nome");
  const date = document.getElementById("date");
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const confirmar = document.getElementById("confirmarSenha");
  const statusMsg = document.getElementById("statusMsg");

  const scriptURL = "https://script.google.com/macros/s/AKfycbw9RlKtFMd7oNBQzeT2p7khWdpKhyT67V6oFQYAq7dC1TCf6amlXS5p02R3pwT0qDeFVg/exec";

  // 🔤 Bloqueia números no campo nome
  nome.addEventListener("input", (e) => {
    const original = e.target.value;
    const apenasLetras = original.replace(/[0-9]/g, "");
    if (original !== apenasLetras) {
      e.target.value = apenasLetras;
      document.getElementById("nomeError").textContent = "Números não são permitidos.";
    } else {
      document.getElementById("nomeError").textContent = "";
    }
  });

  // ✅ Validação e envio
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valido = true;

    // limpa erros e mensagens
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    statusMsg.textContent = "";
    statusMsg.style.color = "";

    // 🧍‍♂️ Nome
    if (nome.value.trim().length < 3) {
      document.getElementById("nomeError").textContent = "O nome deve ter pelo menos 3 caracteres.";
      valido = false;
    }

    // 📅 Data de nascimento (mínimo 10 anos)
    const nascimento = new Date(date.value);
    if (isNaN(nascimento)) {
      document.getElementById("dateError").textContent = "Data inválida.";
      valido = false;
    } else {
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;

      if (idade < 10) {
        document.getElementById("dateError").textContent = "Você deve ter pelo menos 10 anos.";
        valido = false;
      }
    }

    // 📧 Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email.value)) {
      document.getElementById("emailError").textContent = "Digite um email válido.";
      valido = false;
    }

    // 🔐 Senha
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!senhaRegex.test(senha.value)) {
      document.getElementById("senhaError").textContent = "A senha deve ter ao menos 8 caracteres com letras e números.";
      valido = false;
    }

    // 🔁 Confirmar senha
    if (senha.value !== confirmar.value) {
      document.getElementById("confirmError").textContent = "As senhas não coincidem.";
      valido = false;
    }

    // 🚀 Se tudo estiver certo → Envia para Google Sheets
    if (valido) {
      statusMsg.textContent = "📤 Enviando dados...";
      statusMsg.style.color = "orange";

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.value,
            dataNascimento: date.value,
            email: email.value,
            senha: senha.value
          })
        });

        const result = await response.json();

        if (result.status === "success") {
          statusMsg.textContent = "✅ Cadastro enviado com sucesso!";
          statusMsg.style.color = "green";
          form.reset();
        } else {
          throw new Error("Erro no retorno do servidor.");
        }
      } catch (err) {
        statusMsg.textContent = "❌ Erro ao enviar dados. Tente novamente.";
        statusMsg.style.color = "red";
        console.error(err);
      }
    }
  });
});
