# Vitrine Digital Feito para Damas

MVP acadêmico de apresentação dos serviços de beleza e bem-estar do salão **Feito para Damas**, em Bebedouro (SP), desenvolvido para a disciplina de Projeto de Software.

## Estado do projeto

- **Implementado:** página inicial responsiva em `index.html`, com identidade visual, apresentação dos serviços, informações do salão, localização e links de contato.
- **Verificação automatizada:** testes estáticos que conferem a estrutura HTML, as seções principais, os links e o conteúdo essencial.
- **Planejado para evolução:** API Python/Flask e base SQLite para catálogo dinâmico de categorias e serviços. **Esses componentes ainda não estão implementados neste repositório.**

A versão inicial foi preservada em um arquivo HTML independente, com estilos, scripts e imagens incorporados. A divisão do código em arquivos externos faz parte de uma etapa posterior de organização do projeto, sem necessidade de reconstruir o visual.

## Como visualizar

Abra `index.html` em um navegador. Os links de Instagram, WhatsApp e mapa exigem acesso à internet.

## Como testar

Com Python 3 instalado, na pasta raiz do projeto:

```bash
python -m unittest discover -s tests -v
```

A mesma verificação é executada automaticamente pelo GitHub Actions nos Pull Requests destinados à branch `main` e nos envios à própria `main`.

## Escopo acadêmico

O projeto preserva a continuidade das Experiências Práticas I e II. A Experiência Prática III contempla implementação verificável, versionamento, revisão via Pull Request, testes e registro das evidências. A validação com o salão deve ser documentada somente após sua realização.
