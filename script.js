// Produtos guardados pela administração (este bloco é reescrito ao descarregar o script.js).
const EXTRAS_SALVOS = [];

function app() {
  // ====== CONFIGURAÇÃO (edite aqui) ======
  // Número com indicativo do país, sem "+" nem espaços.
  const NUMERO_WHATSAPP = "258872562649";
  const MOEDA = "MT";
  // Senha da administração. Só protege a sua vista do site: quem a descobrir
  // não consegue mudar o site publicado, apenas o que vê no seu próprio navegador.
  const SENHA = "Ligado@2026";

  // Fotos: coloque-as na pasta "imagens" e escreva o nome do ficheiro em "imagem".
  const PRODUTOS = [
    { nome: "Carregador 20W com cabos", categoria: "Carregamento", preco: 850, descricao: "Duas entradas (USB e USB-C PD), com cabos incluídos.", imagem: "carregador.jpg" },
    { nome: "Cabo USB-C 60W trançado", categoria: "Carregamento", preco: 300, descricao: "Carregamento rápido, cabo reforçado e resistente.", imagem: "cabo.jpg" },
    { nome: "Power bank magnético", categoria: "Carregamento", preco: 1800, descricao: "Carrega sem fios, encaixa magneticamente no telemóvel.", imagem: "powerbank.jpg" },
    { nome: "Auriculares Bluetooth", categoria: "Áudio", preco: 1200, descricao: "Sem fios, almofadas macias e microfone.", imagem: "auriculares.jpg" },
    { nome: "Samsung Galaxy Fit3", categoria: "Relógios", preco: 3500, descricao: "Pulseira inteligente com ecrã grande e monitor de sono.", imagem: "smartband.jpg" },
    { nome: "Capas de silicone iPhone", categoria: "Proteção", preco: 400, descricao: "Várias cores. Diga-nos o modelo do seu iPhone.", imagem: "capas.jpg" },
    { nome: "Rato sem fios com luz RGB", categoria: "Computador", preco: 550, descricao: "Recarregável, receptor USB e luzes coloridas.", imagem: "rato.jpg" },
    { nome: "Teclado gamer de uma mão", categoria: "Computador", preco: 900, descricao: "Teclas iluminadas, ideal para jogos no PC.", imagem: "teclado.jpg" }
  ];
  // =======================================

  const CHAVE = "ligado_produtos";
  const $ = id => document.getElementById(id);
  let categoriaAtual = "Todos";
  let fotoDados = "";

  const fmt = n => `${Number(n).toLocaleString("pt-PT")} ${MOEDA}`;
  const abrirWhats = texto =>
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");

  // ---------- Produtos extra (da administração) ----------
  // No navegador do administrador vale a lista guardada; para os visitantes vale EXTRAS_SALVOS.
  function lerExtras() {
    try {
      const v = localStorage.getItem(CHAVE);
      if (v !== null) return JSON.parse(v);
    } catch (e) {}
    return [...EXTRAS_SALVOS];
  }
  function guardarExtras(l) {
    try { localStorage.setItem(CHAVE, JSON.stringify(l)); return true; }
    catch (e) { return false; }
  }
  const todos = () => [...PRODUTOS, ...lerExtras()];

  // ---------- Loja ----------
  function criarCartao(p) {
    const cartao = document.createElement("article");
    cartao.className = "cartao";

    const foto = document.createElement("div");
    foto.className = "foto";
    const img = document.createElement("img");
    img.src = p.imagem.startsWith("data:") ? p.imagem : `imagens/${p.imagem}`;
    img.alt = p.nome;
    img.loading = "lazy";
    img.onerror = () => { foto.textContent = "Foto em breve"; };
    foto.appendChild(img);

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `<h3></h3><p></p><span class="preco"></span>`;
    info.querySelector("h3").textContent = p.nome;
    info.querySelector("p").textContent = p.descricao || "";
    info.querySelector(".preco").textContent = fmt(p.preco);

    const botao = document.createElement("button");
    botao.className = "botao";
    botao.type = "button";
    botao.textContent = "Pedir no WhatsApp";
    botao.addEventListener("click", () =>
      abrirWhats(`Olá! Tenho interesse neste produto: ${p.nome} (${fmt(p.preco)}). Ainda está disponível?`));
    info.appendChild(botao);

    cartao.append(foto, info);
    return cartao;
  }

  function mostrar(categoria) {
    categoriaAtual = categoria;
    $("grelha").replaceChildren(
      ...todos().filter(p => categoria === "Todos" || p.categoria === categoria).map(criarCartao)
    );
    $("filtros").querySelectorAll("button").forEach(b =>
      b.setAttribute("aria-pressed", String(b.textContent === categoria)));
  }

  function montar() {
    const lista = todos();
    const categorias = ["Todos", ...new Set(lista.map(p => p.categoria))];
    if (!categorias.includes(categoriaAtual)) categoriaAtual = "Todos";
    $("filtros").replaceChildren(...categorias.map(c => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = c;
      b.addEventListener("click", () => mostrar(c));
      return b;
    }));
    $("produto").replaceChildren(new Option("Nenhum em especial", ""));
    lista.forEach(p => $("produto").add(new Option(p.nome, p.nome)));
    mostrar(categoriaAtual);
  }

  $("formulario").addEventListener("submit", e => {
    e.preventDefault();
    const nome = $("nome").value.trim();
    const mensagem = $("mensagem").value.trim();
    if (!nome || !mensagem) {
      $("erro").textContent = "Escreva o seu nome e a mensagem antes de enviar.";
      return;
    }
    $("erro").textContent = "";
    const produto = $("produto").value ? `\nProduto: ${$("produto").value}` : "";
    abrirWhats(`Olá! Sou ${nome}.${produto}\n${mensagem}`);
  });

  // ---------- Menu (3 barras) ----------
  function fecharMenu() {
    $("menu").hidden = true;
    $("btnMenu").setAttribute("aria-expanded", "false");
  }
  $("btnMenu").addEventListener("click", () => {
    const abrir = $("menu").hidden;
    $("menu").hidden = !abrir;
    $("btnMenu").setAttribute("aria-expanded", String(abrir));
  });
  $("menu").addEventListener("click", e => { if (e.target.closest("a")) fecharMenu(); });
  $("abrirAdmin").addEventListener("click", e => {
    e.preventDefault();
    $("admin").hidden = false;
    $("admin").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- Administração ----------
  function estadoAdmin() {
    let entrou = false;
    try { entrou = sessionStorage.getItem("ligado_admin") === "1"; } catch (e) {}
    $("entrar").hidden = entrou;
    $("painel").hidden = !entrou;
    if (entrou) desenharLista();
  }

  $("formEntrar").addEventListener("submit", e => {
    e.preventDefault();
    if ($("senha").value === SENHA) {
      try { sessionStorage.setItem("ligado_admin", "1"); } catch (err) {}
      $("senha").value = "";
      $("erroSenha").textContent = "";
      estadoAdmin();
    } else {
      $("erroSenha").textContent = "Senha errada. Tente de novo.";
    }
  });

  $("sair").addEventListener("click", () => {
    try { sessionStorage.removeItem("ligado_admin"); } catch (err) {}
    $("admin").hidden = true;
    estadoAdmin();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Reduz a foto (máx. 800 px) para o ficheiro final não ficar pesado.
  function reduzir(ficheiro) {
    return new Promise((ok, falha) => {
      const leitor = new FileReader();
      leitor.onerror = falha;
      leitor.onload = () => {
        const im = new Image();
        im.onerror = falha;
        im.onload = () => {
          const k = Math.min(1, 800 / Math.max(im.width, im.height));
          const c = document.createElement("canvas");
          c.width = Math.round(im.width * k);
          c.height = Math.round(im.height * k);
          const x = c.getContext("2d");
          x.fillStyle = "#fff";
          x.fillRect(0, 0, c.width, c.height);
          x.drawImage(im, 0, 0, c.width, c.height);
          ok(c.toDataURL("image/jpeg", 0.8));
        };
        im.src = leitor.result;
      };
      leitor.readAsDataURL(ficheiro);
    });
  }

  $("pFoto").addEventListener("change", async () => {
    const f = $("pFoto").files[0];
    fotoDados = "";
    $("previa").hidden = true;
    if (!f) return;
    try {
      fotoDados = await reduzir(f);
      $("previa").src = fotoDados;
      $("previa").hidden = false;
    } catch (e) {
      $("erroProduto").textContent = "Não foi possível ler essa foto. Tente outra.";
    }
  });

  $("formProduto").addEventListener("submit", e => {
    e.preventDefault();
    $("okProduto").textContent = "";
    const nome = $("pNome").value.trim();
    const preco = parseFloat($("pPreco").value);
    if (!nome || !(preco >= 0) || !fotoDados) {
      $("erroProduto").textContent = "Preencha o nome, o preço e escolha uma foto.";
      return;
    }
    const lista = lerExtras();
    lista.push({
      id: "p" + Date.now(),
      nome,
      categoria: $("pCat").value.trim() || "Outros",
      preco,
      descricao: $("pDesc").value.trim(),
      imagem: fotoDados
    });
    if (!guardarExtras(lista)) {
      $("erroProduto").textContent = "Sem espaço no navegador. Apague produtos antigos e tente de novo.";
      return;
    }
    $("erroProduto").textContent = "";
    $("okProduto").textContent = "Produto guardado e já aparece na lista de produtos acima.";
    $("formProduto").reset();
    fotoDados = "";
    $("previa").hidden = true;
    montar();
    desenharLista();
  });

  function desenharLista() {
    const lista = lerExtras();
    if (!lista.length) {
      $("lista").textContent = "Ainda não adicionou nenhum produto.";
      return;
    }
    $("lista").replaceChildren(...lista.map(p => {
      const linha = document.createElement("div");
      linha.className = "item-admin";
      const img = document.createElement("img");
      img.src = p.imagem;
      img.alt = "";
      const txt = document.createElement("span");
      txt.textContent = `${p.nome} · ${p.preco} ${MOEDA}`;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "botao cinza";
      b.textContent = "Apagar";
      b.addEventListener("click", () => {
        if (!confirm(`Apagar "${p.nome}"?`)) return;
        guardarExtras(lerExtras().filter(x => x.id !== p.id));
        montar();
        desenharLista();
      });
      linha.append(img, txt, b);
      return linha;
    }));
  }


  $("ano").textContent = new Date().getFullYear();
  montar();
  estadoAdmin();
}

app();
