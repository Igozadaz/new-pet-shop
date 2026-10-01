/**
 * ==============================================================================
 * PATA & CIA - SCRIPT JAVASCRIPT PRINCIPAL
 * ==============================================================================
 * Este arquivo foi estruturado de forma didática, limpa e modular.
 * Perfeito para estudantes do 1º ano entenderem a lógica de manipulação do DOM,
 * eventos do navegador, validação de formulários e estados interativos.
 * ==============================================================================
 */

// Garante que todo o script execute apenas após o carregamento completo do HTML
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------------
   * 1. DADOS DOS PRODUTOS E CARRINHO (ESTADO DA APLICAÇÃO)
   * ----------------------------------------------------------------------------
   * Um array de objetos representando nosso carrinho de compras.
   */
  let carrinho = [];

  /* ----------------------------------------------------------------------------
   * 2. MENU MOBILE (ABRIR, FECHAR E ANIMAR ÍCONE)
   * ----------------------------------------------------------------------------
   */
  const btnMenuMobile = document.getElementById('btnMenuMobile');
  const menuMobileGaveta = document.getElementById('menuMobileGaveta');
  const linksMenu = document.querySelectorAll('.menu-link');

  if (btnMenuMobile && menuMobileGaveta) {
    // Alterna o estado do menu ao clicar no botão hambúrguer
    btnMenuMobile.addEventListener('click', () => {
      const estaAberto = menuMobileGaveta.classList.contains('aberto');
      
      if (estaAberto) {
        menuMobileGaveta.classList.remove('aberto');
        btnMenuMobile.classList.remove('ativo');
        btnMenuMobile.setAttribute('aria-expanded', 'false');
      } else {
        menuMobileGaveta.classList.add('aberto');
        btnMenuMobile.classList.add('ativo');
        btnMenuMobile.setAttribute('aria-expanded', 'true');
      }
    });

    // Fecha o menu mobile quando o usuário clica em qualquer link
    linksMenu.forEach(link => {
      link.addEventListener('click', () => {
        menuMobileGaveta.classList.remove('aberto');
        btnMenuMobile.classList.remove('ativo');
        btnMenuMobile.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------------------------
   * 3. CABEÇALHO COM SOMBRA AO ROLAR & INDICADOR DE SEÇÃO ATIVA
   * ----------------------------------------------------------------------------
   */
  const cabecalho = document.getElementById('cabecalho');
  const secoes = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Adiciona sombra quando rola mais de 50 pixels
    if (window.scrollY > 50) {
      cabecalho?.classList.add('rolado');
    } else {
      cabecalho?.classList.remove('rolado');
    }

    // Identifica qual seção está visível na tela e marca o link do menu como ativo
    const posicaoRolagem = window.scrollY + 100;

    secoes.forEach(secao => {
      const topoSecao = secao.offsetTop;
      const alturaSecao = secao.offsetHeight;
      const idSecao = secao.getAttribute('id');

      if (posicaoRolagem >= topoSecao && posicaoRolagem < topoSecao + alturaSecao) {
        linksMenu.forEach(link => {
          link.classList.remove('ativo');
          if (link.getAttribute('href') === `#${idSecao}`) {
            link.classList.add('ativo');
          }
        });
      }
    });
  });

  /* ----------------------------------------------------------------------------
   * 4. ROLAGEM SUAVE COM COMPENSAÇÃO DE ALTURA DO CABEÇALHO
   * ----------------------------------------------------------------------------
   */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (evento) => {
      const idAlvo = link.getAttribute('href');
      
      // Ignora links vazios ou apenas "#"
      if (!idAlvo || idAlvo === '#') return;

      const elementoAlvo = document.querySelector(idAlvo);
      if (elementoAlvo) {
        evento.preventDefault();
        const alturaCabecalho = cabecalho ? cabecalho.offsetHeight : 80;
        const posicaoElemento = elementoAlvo.getBoundingClientRect().top + window.pageYOffset;
        const posicaoFinal = posicaoElemento - (alturaCabecalho - 10);

        window.scrollTo({
          top: posicaoFinal,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ----------------------------------------------------------------------------
   * 5. BOTÕES "AGENDAR SERVIÇO": PREENCHE O FORMULÁRIO AUTOMATICAMENTE
   * ----------------------------------------------------------------------------
   */
  const botoesAgendarServico = document.querySelectorAll('.btn-agendar-servico');
  const campoServico = document.getElementById('formServico');

  botoesAgendarServico.forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.preventDefault();
      const nomeServico = botao.getAttribute('data-servico');

      if (campoServico && nomeServico) {
        campoServico.value = nomeServico;
      }

      // Rola até o formulário de contato
      const secaoContato = document.getElementById('contato');
      if (secaoContato) {
        const alturaCabecalho = cabecalho ? cabecalho.offsetHeight : 80;
        const destino = secaoContato.getBoundingClientRect().top + window.pageYOffset - (alturaCabecalho - 10);
        window.scrollTo({ top: destino, behavior: 'smooth' });

        // Foca no campo de nome
        setTimeout(() => {
          const campoNome = document.getElementById('formNome');
          if (campoNome) campoNome.focus();
        }, 500);
      }
    });
  });

  /* ----------------------------------------------------------------------------
   * 6. FILTRO DE PRODUTOS POR CATEGORIA
   * ----------------------------------------------------------------------------
   */
  const botoesFiltro = document.querySelectorAll('.btn-filtro');
  const cardsProdutos = document.querySelectorAll('.card-produto');

  botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
      // Remove a classe ativa de todos e adiciona no botão clicado
      botoesFiltro.forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');

      const categoriaSelecionada = botao.getAttribute('data-categoria');

      // Exibe ou oculta os produtos conforme a categoria
      cardsProdutos.forEach(card => {
        const categoriaCard = card.getAttribute('data-categoria');

        if (categoriaSelecionada === 'todos' || categoriaCard === categoriaSelecionada) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ----------------------------------------------------------------------------
   * 7. SISTEMA DE CARRINHO DE COMPRAS INTERATIVO
   * ----------------------------------------------------------------------------
   */
  const btnCarrinhoGatilho = document.getElementById('btnCarrinhoGatilho');
  const gavetaCarrinhoOverlay = document.getElementById('gavetaCarrinhoOverlay');
  const gavetaCarrinho = document.getElementById('gavetaCarrinho');
  const btnFecharCarrinho = document.getElementById('btnFecharCarrinho');
  const containerItensCarrinho = document.getElementById('gavetaItens');
  const elementoTotalCarrinho = document.getElementById('gavetaTotalValor');
  const contadorItensHeader = document.getElementById('carrinhoContador');
  const botoesAdicionar = document.querySelectorAll('.btn-add-carrinho');
  const btnFinalizarWhats = document.getElementById('btnFinalizarPedidoWhats');

  // Abre e fecha a gaveta do carrinho
  function alternarCarrinho(abrir) {
    if (abrir) {
      gavetaCarrinhoOverlay?.classList.add('aberto');
      gavetaCarrinho?.classList.add('aberto');
    } else {
      gavetaCarrinhoOverlay?.classList.remove('aberto');
      gavetaCarrinho?.classList.remove('aberto');
    }
  }

  btnCarrinhoGatilho?.addEventListener('click', () => alternarCarrinho(true));
  btnFecharCarrinho?.addEventListener('click', () => alternarCarrinho(false));
  gavetaCarrinhoOverlay?.addEventListener('click', () => alternarCarrinho(false));

  // Adiciona produto ao carrinho
  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      const nome = botao.getAttribute('data-nome');
      const preco = parseFloat(botao.getAttribute('data-preco'));
      const img = botao.getAttribute('data-img');

      // Verifica se o produto já existe no carrinho
      const itemExistente = carrinho.find(item => item.id === id);

      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        carrinho.push({ id, nome, preco, img, quantidade: 1 });
      }

      atualizarInterfaceCarrinho();
      exibirToast(`"${nome}" adicionado ao carrinho! 🐾`, 'sucesso');
      
      // Abre o carrinho após adicionar para mostrar a interação
      alternarCarrinho(true);
    });
  });

  // Atualiza os elementos visuais do carrinho
  function atualizarInterfaceCarrinho() {
    if (!containerItensCarrinho || !elementoTotalCarrinho || !contadorItensHeader) return;

    // Calcula quantidade total e valor total
    let totalItens = 0;
    let valorTotal = 0;

    carrinho.forEach(item => {
      totalItens += item.quantidade;
      valorTotal += item.preco * item.quantidade;
    });

    // Atualiza o contador de itens no topo
    contadorItensHeader.textContent = totalItens;

    // Atualiza o valor monetário total
    elementoTotalCarrinho.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

    // Renderiza a lista de itens
    if (carrinho.length === 0) {
      containerItensCarrinho.innerHTML = `
        <div class="carrinho-vazio-aviso">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Seu carrinho está vazio.</p>
          <span style="font-size: 0.85rem; color: #94a3b8;">Escolha os melhores produtos para seu pet!</span>
        </div>
      `;
      if (btnFinalizarWhats) {
        btnFinalizarWhats.style.opacity = '0.5';
        btnFinalizarWhats.style.pointerEvents = 'none';
      }
      return;
    }

    if (btnFinalizarWhats) {
      btnFinalizarWhats.style.opacity = '1';
      btnFinalizarWhats.style.pointerEvents = 'all';
    }

    let htmlItens = '';
    carrinho.forEach(item => {
      const subtotalItem = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
      htmlItens += `
        <div class="item-carrinho" data-id="${item.id}">
          <img src="${item.img}" alt="${item.nome}" class="item-carrinho-img">
          <div class="item-carrinho-info">
            <h4 class="item-carrinho-nome">${item.nome}</h4>
            <div class="item-carrinho-preco">R$ ${subtotalItem}</div>
            <div class="item-carrinho-qtd">
              <button class="btn-qtd btn-diminuir" data-id="${item.id}" title="Diminuir">-</button>
              <span>${item.quantidade}</span>
              <button class="btn-qtd btn-aumentar" data-id="${item.id}" title="Aumentar">+</button>
            </div>
          </div>
          <button class="item-carrinho-remover" data-id="${item.id}" title="Remover item">✕</button>
        </div>
      `;
    });

    containerItensCarrinho.innerHTML = htmlItens;

    // Adiciona ouvintes para os botões de + / - e remover
    containerItensCarrinho.querySelectorAll('.btn-aumentar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = carrinho.find(i => i.id === id);
        if (item) {
          item.quantidade += 1;
          atualizarInterfaceCarrinho();
        }
      });
    });

    containerItensCarrinho.querySelectorAll('.btn-diminuir').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = carrinho.find(i => i.id === id);
        if (item) {
          if (item.quantidade > 1) {
            item.quantidade -= 1;
          } else {
            carrinho = carrinho.filter(i => i.id !== id);
          }
          atualizarInterfaceCarrinho();
        }
      });
    });

    containerItensCarrinho.querySelectorAll('.item-carrinho-remover').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        carrinho = carrinho.filter(i => i.id !== id);
        atualizarInterfaceCarrinho();
        exibirToast('Item removido do carrinho.', 'aviso');
      });
    });
  }

  // Finalizar pedido no WhatsApp
  btnFinalizarWhats?.addEventListener('click', () => {
    if (carrinho.length === 0) return;

    let mensagemWhats = 'Olá, equipe Pata & Cia! Gostaria de fazer o pedido dos seguintes itens:\n\n';
    let total = 0;

    carrinho.forEach(item => {
      const sub = (item.preco * item.quantidade).toFixed(2);
      mensagemWhats += `• ${item.quantidade}x ${item.nome} - R$ ${sub.replace('.', ',')}\n`;
      total += item.preco * item.quantidade;
    });

    mensagemWhats += `\n*Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}`;
    mensagemWhats += '\n\nComo posso prosseguir com o pagamento e entrega?';

    const urlWhats = `https://wa.me/5511999998888?text=${encodeURIComponent(mensagemWhats)}`;
    window.open(urlWhats, '_blank');
  });

  /* ----------------------------------------------------------------------------
   * 8. LIGHTBOX DA GALERIA DE FOTOS
   * ----------------------------------------------------------------------------
   */
  const itensGaleria = document.querySelectorAll('.item-galeria');
  const modalLightbox = document.getElementById('modalLightbox');
  const modalImg = document.getElementById('modalLightboxImg');
  const modalTitulo = document.getElementById('modalLightboxTitulo');
  const modalSubtitulo = document.getElementById('modalLightboxSubtitulo');
  const btnFecharLightbox = document.getElementById('modalLightboxFechar');

  itensGaleria.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const titulo = item.getAttribute('data-titulo') || 'Nosso Amigo Pet';
      const subtitulo = item.getAttribute('data-desc') || 'Pata & Cia Cuidado com Amor';

      if (img && modalLightbox && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        if (modalTitulo) modalTitulo.textContent = titulo;
        if (modalSubtitulo) modalSubtitulo.textContent = subtitulo;
        modalLightbox.classList.add('ativo');
        document.body.style.overflow = 'hidden'; // Impede rolagem de fundo
      }
    });
  });

  function fecharModal() {
    if (modalLightbox) {
      modalLightbox.classList.remove('ativo');
      document.body.style.overflow = ''; // Restaura rolagem
    }
  }

  btnFecharLightbox?.addEventListener('click', fecharModal);
  modalLightbox?.addEventListener('click', (e) => {
    if (e.target === modalLightbox) fecharModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });

  /* ----------------------------------------------------------------------------
   * 9. VALIDAÇÃO DO FORMULÁRIO DE CONTATO & AGENDAMENTO
   * ----------------------------------------------------------------------------
   */
  const formContato = document.getElementById('formContato');
  const inputNome = document.getElementById('formNome');
  const inputPet = document.getElementById('formPet');
  const inputTelefone = document.getElementById('formTelefone');
  const inputServico = document.getElementById('formServico');
  const inputMensagem = document.getElementById('formMensagem');

  // Máscara automática de telefone celular: (99) 99999-9999
  if (inputTelefone) {
    inputTelefone.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito
      if (valor.length > 11) valor = valor.slice(0, 11);

      if (valor.length > 6) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
      } else if (valor.length > 2) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
      } else if (valor.length > 0) {
        valor = `(${valor}`;
      }

      e.target.value = valor;
    });
  }

  // Função auxiliar para exibir erro de validação
  function definirErro(campo, mensagem) {
    campo.classList.remove('sucesso');
    campo.classList.add('erro');
    const elementoErro = campo.parentElement?.querySelector('.mensagem-erro');
    if (elementoErro) {
      elementoErro.textContent = mensagem;
      elementoErro.style.display = 'block';
    }
  }

  // Função auxiliar para marcar campo válido
  function definirSucesso(campo) {
    campo.classList.remove('erro');
    campo.classList.add('sucesso');
    const elementoErro = campo.parentElement?.querySelector('.mensagem-erro');
    if (elementoErro) {
      elementoErro.textContent = '';
      elementoErro.style.display = 'none';
    }
  }

  // Validação em tempo real ao digitar ou sair do campo (blur)
  [inputNome, inputPet, inputTelefone, inputServico, inputMensagem].forEach(campo => {
    if (!campo) return;
    
    campo.addEventListener('blur', () => {
      validarCampoIndividual(campo);
    });

    campo.addEventListener('input', () => {
      if (campo.classList.contains('erro')) {
        validarCampoIndividual(campo);
      }
    });
  });

  function validarCampoIndividual(campo) {
    const valor = campo.value.trim();

    if (campo === inputNome) {
      if (valor.length < 3) {
        definirErro(campo, 'Por favor, informe seu nome completo (mínimo 3 letras).');
        return false;
      }
      definirSucesso(campo);
      return true;
    }

    if (campo === inputPet) {
      if (valor.length < 2) {
        definirErro(campo, 'Informe o nome do seu bichinho de estimação.');
        return false;
      }
      definirSucesso(campo);
      return true;
    }

    if (campo === inputTelefone) {
      const digitos = valor.replace(/\D/g, '');
      if (digitos.length < 10 || digitos.length > 11) {
        definirErro(campo, 'Informe um telefone ou WhatsApp válido com DDD (ex: 11 99999-9999).');
        return false;
      }
      definirSucesso(campo);
      return true;
    }

    if (campo === inputServico) {
      if (!valor || valor === '') {
        definirErro(campo, 'Selecione qual serviço você deseja agendar.');
        return false;
      }
      definirSucesso(campo);
      return true;
    }

    if (campo === inputMensagem) {
      if (valor.length < 5) {
        definirErro(campo, 'Escreva uma breve mensagem ou observação sobre o pet.');
        return false;
      }
      definirSucesso(campo);
      return true;
    }

    return true;
  }

  // Submissão do formulário: Redireciona diretamente para o WhatsApp do Vendedor
  if (formContato) {
    formContato.addEventListener('submit', (e) => {
      e.preventDefault();

      const nomeValido = validarCampoIndividual(inputNome);
      const petValido = validarCampoIndividual(inputPet);
      const telValido = validarCampoIndividual(inputTelefone);
      const servicoValido = validarCampoIndividual(inputServico);
      const msgValida = validarCampoIndividual(inputMensagem);

      if (nomeValido && petValido && telValido && servicoValido && msgValida) {
        const btnEnviar = formContato.querySelector('button[type="submit"]');
        const textoOriginal = btnEnviar ? btnEnviar.innerHTML : 'Solicitar Agendamento no WhatsApp';

        const nome = inputNome.value.trim();
        const pet = inputPet.value.trim();
        const tipoPet = document.getElementById('formTipoPet') ? document.getElementById('formTipoPet').value : 'Pet';
        const telefone = inputTelefone.value.trim();
        const servico = inputServico.value.trim();
        const mensagem = inputMensagem.value.trim();

        // Monta a mensagem completa e formatada para o WhatsApp do vendedor
        let msgWhats = '🐾 *NOVA SOLICITAÇÃO DE AGENDAMENTO - PATA & CIA* 🐾\n\n';
        msgWhats += `👤 *Nome do Tutor(a):* ${nome}\n`;
        msgWhats += `🐶 *Nome do Pet:* ${pet} (${tipoPet})\n`;
        msgWhats += `📱 *Telefone/WhatsApp do Tutor:* ${telefone}\n`;
        msgWhats += `✂️ *Serviço Desejado:* ${servico}\n`;
        msgWhats += `📝 *Observações / Data Desejada:* ${mensagem}\n\n`;
        msgWhats += 'Olá! Acabei de preencher o formulário no site e gostaria de confirmar o agendamento!';

        const numeroVendedor = '5511999998888';
        const urlWhatsApp = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msgWhats)}`;

        // Feedback visual de carregamento
        if (btnEnviar) {
          btnEnviar.disabled = true;
          btnEnviar.innerHTML = `
            <svg class="anim-girar" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
            </svg>
            Abrindo WhatsApp do Vendedor...
          `;
        }

        exibirToast(`Tudo pronto, ${nome.split(' ')[0]}! Redirecionando para o WhatsApp do vendedor... 🐾`, 'sucesso');

        // Redireciona o cliente diretamente para o WhatsApp
        setTimeout(() => {
          window.open(urlWhatsApp, '_blank') || (window.location.href = urlWhatsApp);

          if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = textoOriginal;
          }

          // Limpa os campos do formulário
          formContato.reset();
          [inputNome, inputPet, inputTelefone, inputServico, inputMensagem].forEach(c => {
            c?.classList.remove('sucesso');
            c?.classList.remove('erro');
          });
        }, 700);

      } else {
        exibirToast('Por favor, preencha todos os campos obrigatórios corretamente antes de agendar.', 'erro');
      }
    });
  }

  /* ----------------------------------------------------------------------------
   * 10. NOTIFICAÇÕES TOAST VISUAIS (FEEDBACK AMIGÁVEL)
   * ----------------------------------------------------------------------------
   */
  const elementoToast = document.getElementById('toastNotificacao');
  let timeoutToast = null;

  function exibirToast(mensagem, tipo = 'sucesso') {
    if (!elementoToast) return;

    clearTimeout(timeoutToast);

    const icone = elementoToast.querySelector('.toast-icone');
    const texto = elementoToast.querySelector('.toast-texto');

    if (texto) texto.textContent = mensagem;

    elementoToast.className = 'toast-notificacao visivel';

    if (tipo === 'sucesso') {
      elementoToast.classList.add('sucesso');
      if (icone) icone.innerHTML = '🐾';
    } else if (tipo === 'erro') {
      elementoToast.style.background = '#ef4444';
      if (icone) icone.innerHTML = '⚠️';
    } else {
      elementoToast.style.background = 'var(--cor-azul-marinho)';
      if (icone) icone.innerHTML = 'ℹ️';
    }

    timeoutToast = setTimeout(() => {
      elementoToast.classList.remove('visivel');
    }, 4500);
  }

  /* ----------------------------------------------------------------------------
   * 11. SISTEMA COMPLETO DE CONTATO COM O VENDEDOR
   * ----------------------------------------------------------------------------
   */
  const modalVendedorOverlay = document.getElementById('modalVendedorOverlay');
  const btnFecharModalVendedor = document.getElementById('btnFecharModalVendedor');
  const btnVendedorTopo = document.getElementById('btnVendedorTopo');
  const btnMenuMobileVendedor = document.getElementById('btnMenuMobileVendedor');
  const btnDuvidasVendedorCarrinho = document.getElementById('btnDuvidasVendedorCarrinho');
  const botoesContatarVendedor = document.querySelectorAll('.btn-contatar-vendedor');
  const chipsDuvida = document.querySelectorAll('.chip-duvida');
  const msgVendedorInput = document.getElementById('msgVendedorInput');
  const btnEnviarWhatsAppVendedor = document.getElementById('btnEnviarWhatsAppVendedor');
  const btnAbrirChatAoVivo = document.getElementById('btnAbrirChatAoVivo');

  // Elementos do card de produto no modal do vendedor
  const modalVendedorProdutoCard = document.getElementById('modalVendedorProdutoCard');
  const modalVendedorProdutoImg = document.getElementById('modalVendedorProdutoImg');
  const modalVendedorProdutoNome = document.getElementById('modalVendedorProdutoNome');
  const modalVendedorProdutoPreco = document.getElementById('modalVendedorProdutoPreco');
  const modalVendedorProdutoRotulo = document.getElementById('modalVendedorProdutoRotulo');

  // Estado do produto atualmente em foco para o vendedor
  let produtoVendedorAtual = {
    nome: 'Atendimento Geral de Vendas',
    preco: '',
    img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80',
    tipo: 'geral'
  };

  // Abre a janela modal do vendedor
  function abrirModalVendedor(dadosProduto = null) {
    if (dadosProduto) {
      produtoVendedorAtual = dadosProduto;
      if (modalVendedorProdutoImg) modalVendedorProdutoImg.src = dadosProduto.img;
      if (modalVendedorProdutoNome) modalVendedorProdutoNome.textContent = dadosProduto.nome;
      if (modalVendedorProdutoPreco) {
        modalVendedorProdutoPreco.textContent = dadosProduto.preco ? `R$ ${dadosProduto.preco.replace('.', ',')}` : '';
      }
      if (modalVendedorProdutoRotulo) {
        modalVendedorProdutoRotulo.textContent = dadosProduto.tipo === 'carrinho' ? 'Itens do seu Carrinho' : 'Produto de Interesse';
      }
      if (modalVendedorProdutoCard) modalVendedorProdutoCard.style.display = 'flex';
    } else {
      produtoVendedorAtual = {
        nome: 'Dúvidas Gerais sobre Produtos e Serviços',
        preco: '',
        img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80',
        tipo: 'geral'
      };
      if (modalVendedorProdutoNome) modalVendedorProdutoNome.textContent = 'Dúvidas Gerais sobre Produtos e Serviços';
      if (modalVendedorProdutoPreco) modalVendedorProdutoPreco.textContent = 'Atendimento Online';
      if (modalVendedorProdutoRotulo) modalVendedorProdutoRotulo.textContent = 'Canal de Vendas & Consultoria';
    }

    if (msgVendedorInput && !msgVendedorInput.value) {
      msgVendedorInput.value = dadosProduto && dadosProduto.nome !== 'Dúvidas Gerais sobre Produtos e Serviços'
        ? `Olá, Beatriz! Gostaria de mais informações sobre o produto: ${dadosProduto.nome}.`
        : 'Olá, Beatriz! Gostaria de tirar algumas dúvidas com o setor de vendas.';
    }

    modalVendedorOverlay?.classList.add('ativo');
    document.body.style.overflow = 'hidden';
  }

  function fecharModalVendedor() {
    modalVendedorOverlay?.classList.remove('ativo');
    document.body.style.overflow = '';
  }

  btnFecharModalVendedor?.addEventListener('click', fecharModalVendedor);
  modalVendedorOverlay?.addEventListener('click', (e) => {
    if (e.target === modalVendedorOverlay) fecharModalVendedor();
  });

  // Abertura a partir do botão do topo
  btnVendedorTopo?.addEventListener('click', () => {
    abrirModalVendedor();
  });

  // Abertura a partir do menu mobile
  btnMenuMobileVendedor?.addEventListener('click', () => {
    menuMobileGaveta?.classList.remove('aberto');
    btnMenuMobile?.classList.remove('ativo');
    abrirModalVendedor();
  });

  // Abertura a partir de qualquer card de produto
  botoesContatarVendedor.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nome = btn.getAttribute('data-nome') || 'Produto Pata & Cia';
      const preco = btn.getAttribute('data-preco') || '';
      const img = btn.getAttribute('data-img') || '';

      abrirModalVendedor({
        nome,
        preco,
        img,
        tipo: 'produto'
      });
    });
  });

  // Abertura a partir do carrinho de compras
  btnDuvidasVendedorCarrinho?.addEventListener('click', () => {
    alternarCarrinho(false); // Fecha o carrinho
    
    let resumoItens = 'Carrinho de Compras';
    let totalCarrinho = '0,00';

    if (carrinho.length > 0) {
      const nomes = carrinho.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
      resumoItens = nomes.length > 60 ? nomes.slice(0, 57) + '...' : nomes;
      totalCarrinho = (carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0)).toFixed(2);
    }

    abrirModalVendedor({
      nome: resumoItens,
      preco: totalCarrinho,
      img: carrinho.length > 0 ? carrinho[0].img : 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=200&q=80',
      tipo: 'carrinho'
    });
  });

  // Chips de perguntas rápidas
  chipsDuvida.forEach(chip => {
    chip.addEventListener('click', () => {
      const textoDuvida = chip.getAttribute('data-duvida');
      if (msgVendedorInput && textoDuvida) {
        msgVendedorInput.value = textoDuvida;
        msgVendedorInput.focus();
        exibirToast('Pergunta preenchida! Clique em Conversar no WhatsApp ou no Chat.', 'aviso');
      }
    });
  });

  // Enviar para WhatsApp do Vendedor
  btnEnviarWhatsAppVendedor?.addEventListener('click', () => {
    const textoMensagem = msgVendedorInput ? msgVendedorInput.value.trim() : '';
    
    let mensagemFormatada = 'Olá, Beatriz! 🐾\n';
    mensagemFormatada += 'Estou no site da Pata & Cia e gostaria de falar com você sobre vendas.\n\n';

    if (produtoVendedorAtual && produtoVendedorAtual.nome) {
      mensagemFormatada += `*Item de Interesse:* ${produtoVendedorAtual.nome}\n`;
      if (produtoVendedorAtual.preco) {
        mensagemFormatada += `*Valor:* R$ ${produtoVendedorAtual.preco.replace('.', ',')}\n\n`;
      }
    }

    mensagemFormatada += `*Minha Mensagem:* ${textoMensagem || 'Gostaria de informações e condições de pagamento.'}`;

    const urlWhats = `https://wa.me/5511999998888?text=${encodeURIComponent(mensagemFormatada)}`;
    window.open(urlWhats, '_blank');

    exibirToast('Conectando ao WhatsApp da vendedora Beatriz... 🐾', 'sucesso');
    fecharModalVendedor();
  });

  /* ----------------------------------------------------------------------------
   * 12. CHAT AO VIVO FLUTUANTE COM A VENDEDORA (SIMULAÇÃO REALISTA)
   * ----------------------------------------------------------------------------
   */
  const chatVendedorJanela = document.getElementById('chatVendedorJanela');
  const btnFecharChatAoVivo = document.getElementById('btnFecharChatAoVivo');
  const chatJanelaMensagens = document.getElementById('chatJanelaMensagens');
  const chatDigitando = document.getElementById('chatDigitando');
  const chatInputTexto = document.getElementById('chatInputTexto');
  const btnEnviarMsgChat = document.getElementById('btnEnviarMsgChat');

  // Abre a janela de bate-papo
  function abrirChatAoVivo(mensagemInicial = '') {
    fecharModalVendedor();
    chatVendedorJanela?.classList.add('aberto');

    if (mensagemInicial && chatJanelaMensagens) {
      adicionarMensagemChat(mensagemInicial, 'cliente');
      simularRespostaVendedora(mensagemInicial);
    }

    setTimeout(() => {
      chatInputTexto?.focus();
    }, 400);
  }

  function fecharChatAoVivo() {
    chatVendedorJanela?.classList.remove('aberto');
  }

  btnAbrirChatAoVivo?.addEventListener('click', () => {
    const msg = msgVendedorInput ? msgVendedorInput.value.trim() : '';
    abrirChatAoVivo(msg);
  });

  btnFecharChatAoVivo?.addEventListener('click', fecharChatAoVivo);

  // Adiciona balão de mensagem no histórico do chat
  function adicionarMensagemChat(texto, autor = 'cliente') {
    if (!chatJanelaMensagens) return;

    const balao = document.createElement('div');
    balao.className = `chat-balao ${autor === 'cliente' ? 'chat-balao-cliente' : 'chat-balao-vendedor'}`;
    balao.textContent = texto;

    chatJanelaMensagens.appendChild(balao);
    chatJanelaMensagens.scrollTop = chatJanelaMensagens.scrollHeight;
  }

  // Resposta automática e inteligente da vendedora
  function simularRespostaVendedora(perguntaCliente) {
    if (!chatDigitando || !chatJanelaMensagens) return;

    chatDigitando.style.display = 'flex';
    chatJanelaMensagens.scrollTop = chatJanelaMensagens.scrollHeight;

    setTimeout(() => {
      chatDigitando.style.display = 'none';

      let resposta = '';
      const textoLower = perguntaCliente.toLowerCase();

      if (textoLower.includes('pronta entrega') || textoLower.includes('estoque')) {
        resposta = `Temos sim! Temos estoque disponível para retirada hoje mesmo na loja física ou entrega via motoboy express em até 3 horas na sua região. Gostaria que eu reserve uma unidade para você? 📦`;
      } else if (textoLower.includes('pix') || textoLower.includes('desconto')) {
        resposta = `Com certeza! Para pagamento à vista no Pix, oferecemos 5% de desconto especial em toda a linha da loja. Posso gerar sua chave de pagamento com o desconto aplicado agora mesmo! 🏷️`;
      } else if (textoLower.includes('frete') || textoLower.includes('entrega')) {
        resposta = `O frete é grátis para compras acima de R$ 150,00! Para valores menores, a taxa fixa de entrega expressa para toda a capital é de apenas R$ 12,00. Qual o seu bairro? 🚚`;
      } else if (textoLower.includes('filhote') || textoLower.includes('porte') || textoLower.includes('idade') || textoLower.includes('tamanho')) {
        resposta = `Essa é uma excelente pergunta! Temos opções específicas para cada fase e porte do pet. Qual é a raça e idade do seu amiguinho? Posso te recomendar a dosagem ou tamanho ideal! 🐶🐱`;
      } else if (produtoVendedorAtual && produtoVendedorAtual.nome && produtoVendedorAtual.nome !== 'Dúvidas Gerais sobre Produtos e Serviços') {
        resposta = `Perfeito! O produto "${produtoVendedorAtual.nome}" é um dos mais vendidos e elogiados pelos nossos clientes. Se quiser fechar agora, posso enviar o link do WhatsApp para confirmarmos seu endereço de entrega! 🐾`;
      } else {
        resposta = `Entendido perfeitamente! Fico feliz em te ajudar com isso. Se preferir mais agilidade para fotos dos produtos ou pagamento imediato, podemos continuar também pelo nosso WhatsApp (11) 99999-8888! Como prefere? 😊`;
      }

      adicionarMensagemChat(resposta, 'vendedor');
    }, 1200);
  }

  // Envio de nova mensagem pelo cliente no chat
  function processarEnvioMensagemChat() {
    if (!chatInputTexto) return;
    const texto = chatInputTexto.value.trim();
    if (!texto) return;

    adicionarMensagemChat(texto, 'cliente');
    chatInputTexto.value = '';
    simularRespostaVendedora(texto);
  }

  btnEnviarMsgChat?.addEventListener('click', processarEnvioMensagemChat);
  chatInputTexto?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processarEnvioMensagemChat();
    }
  });

});
