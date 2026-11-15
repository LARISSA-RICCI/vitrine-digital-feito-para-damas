# Vitrine Digital Feito para Damas

MVP acadêmico da disciplina Projeto de Software: uma vitrine de serviços de beleza e bem-estar para clientes do salão Feito para Damas, em Bebedouro/SP.

## Funcionalidades implementadas

- Catálogo de serviços agrupados por categoria.
- Links de consulta pelo WhatsApp com o nome do serviço.
- Localização, cópia de endereço e horários de atendimento.
- Indicador de funcionamento calculado no fuso America/Sao_Paulo.
- Galeria ampliada, navegação por teclado, fechamento com Escape e retorno do foco.
- Layout adaptável e respeito à preferência por movimento reduzido.

## Estrutura

- `index.html`: conteúdo, estrutura e imagens incorporadas como data URI.
- `css/style.css`: identidade visual, layout e estilos.
- `js/main.js`: catálogo, horários, navegação e galeria.
- `tests/estrutura.py`: integridade dos recursos, IDs, imagens e links.
- `tests/foco.cjs`: regressão do manipulador de teclado da galeria.

## Executar

Baixe ou clone o repositório mantendo as pastas. Abra `index.html` no navegador.
Opcionalmente, com Python 3 instalado, execute na raiz:

```sh
python -m http.server 8000
```

Acesse http://localhost:8000. O servidor acima apenas entrega arquivos estáticos.

## Verificar

Requer Python 3 e Node.js; os testes não dependem de pacotes adicionais.

```sh
python tests/estrutura.py
node --check js/main.js
node tests/foco.cjs
```

Os testes de foco executam o manipulador real com objetos controlados; não substituem uma avaliação em navegador e com tecnologias assistivas.
A validação visual em navegador não foi concluída neste ambiente.

## Limites e evolução acadêmica

Esta versão é um front-end estático. Não contém Flask, banco de dados, autenticação ou painel administrativo.
O clique de consulta abre o WhatsApp; não confirma nem salva um agendamento.

A evolução proposta para atender aos requisitos técnicos da atividade inclui Python/Flask, SQLite,
entidades Categoria e Serviço relacionadas e Usuário administrador com senha protegida por hash.
Esses componentes permanecem planejados e não devem ser apresentados como implementados.

## Validação com público-alvo

Planejar uma sessão com uma cliente real: localizar um serviço, iniciar uma consulta e encontrar endereço e horários.
Registrar conclusão, tempo por tarefa, dificuldades e satisfação. Nenhum teste com participante foi registrado neste repositório.
