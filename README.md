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
- `tests/test_vitrine.py`: verificações do conteúdo da página.
- `tests/interface.test.cjs`: oito testes de interface e integração em DOM simulado.
- `.github/workflows/testes.yml`: execução dos testes e publicação do relatório de cobertura.

## Executar

Baixe ou clone o repositório mantendo as pastas. Abra `index.html` no navegador.
Opcionalmente, com Python 3 instalado, execute na raiz:

```sh
python -m http.server 8000
```

Acesse http://localhost:8000. O servidor acima apenas entrega arquivos estáticos.

## Verificar

Requer Python 3 e Node.js 22. Instale as ferramentas de teste com `npm ci`.

```sh
python -m unittest discover -s tests -v
python tests/estrutura.py
node --check js/main.js
node tests/foco.cjs
npm run test:coverage
```

Os testes de foco executam o manipulador real com objetos controlados; não substituem uma avaliação em navegador e com tecnologias assistivas.
A validação visual em navegador não foi concluída neste ambiente.

## Cobertura automatizada

O comando `npm run test:coverage` usa V8/c8 para medir o código de produção
em `js/main.js`. O denominador inclui o arquivo inteiro, inclusive funções
não executadas. HTML, CSS, dependências e arquivos de teste ficam fora da medição.

Os testes carregam o HTML real e executam o JavaScript completo no jsdom.
Conferem catálogo e links de consulta, categorias, horários de Brasília,
galeria e teclado, cópia de endereço e navegação. APIs de navegador como
clipboard e IntersectionObserver são controladas pelos testes.

Abra `coverage/index.html` para consultar o relatório por linha. O arquivo
`coverage/coverage-summary.json` contém os totais de linhas, funções e caminhos
condicionais (branches). Para o campo percentual da atividade, utilize a métrica
`total.lines.pct`, identificando o escopo como `js/main.js`.

O GitHub Actions repete a medição, registra os percentuais no resumo da execução
e disponibiliza o artefato `cobertura-javascript`. O percentual de linhas e o de
branches são métricas distintas. A execução em DOM simulado não avalia renderização
visual nem substitui validação com leitor de tela ou com uma pessoa real.

## Limites e evolução acadêmica

Esta versão é um front-end estático. Não contém Flask, banco de dados, autenticação ou painel administrativo.
O clique de consulta abre o WhatsApp; não confirma nem salva um agendamento.

A evolução proposta para atender aos requisitos técnicos da atividade inclui Python/Flask, SQLite,
entidades Categoria e Serviço relacionadas e Usuário administrador com senha protegida por hash.
Esses componentes permanecem planejados e não devem ser apresentados como implementados.

## Validação com público-alvo

Planejar uma sessão com uma cliente real: localizar um serviço, iniciar uma consulta e encontrar endereço e horários.
Registrar conclusão, tempo por tarefa, dificuldades e satisfação. Nenhum teste com participante foi registrado neste repositório.

