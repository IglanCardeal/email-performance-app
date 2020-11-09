# OBS:

OUTLOOK NAO RECEBE EMAILs
I’ve seen the same thing it looks like providers are blocking the IP range of SendGrid’s “free” plans.

Assuming you authenticated your emails properly and followed SPF, dkim and DMARC then the only other solution is to upgrade your account to a dedicated IP and hope that range isn't blacklisted.

<div align="center">
  <img src="./frontend/public/img/V.png" height="auto" width="160" alt="Velpac" />

# App envio de email

<br>

## :email: Site para demonstrar desempenho de envio de email usando protocolos HTTP e SMTP.

</div>

<div align="center">

![version](https://img.shields.io/badge/version-1.0.0-green) ![npm](https://img.shields.io/npm/v/npm) ![node-current](https://img.shields.io/badge/nodejs-%3E%3D12.0.0-green) ![bootstrap](https://img.shields.io/badge/bootstrap-v4.0-blueviolet) ![GitHub](https://img.shields.io/github/license/iglancardeal/velpac)

</div>

---

### Status do projeto

- Concluído :muscle:

- [:computer: **Veja o site online aqui**](https://velpac.herokuapp.com/)

### Tabela de conteúdos

<!--ts-->

- [Sobre](#sobre)
- [Onde está hospedada](#host)
- [Como usar localmente](#como-usar)
  - [Pré Requisitos](#como-usar)
- [Tecnologias](#tecnologias)
- [Autor](#autor)
  <!--te-->

#### Sobre :coffee:

<p id="sobre"></p>

![tela-inicial](./frontend/public/img/inicial.png)

Este site realiza a divulgação do projeto desenvolvido para gerenciar semáforos. Este projeto fez parte da avaliação de disciplina _Circuitos Elétricos_, onde foi usado uma aplicação feita usando NodeJS e Arduino para controlar, através de uma interface web, o tempo de um semáforo de uma avenida e uma faixa de pedestre.
Neste site, foi demonstrado o propósito do projeto:

- o problema;
- a solução demonstrada;
- como funciona;
- o esquemático do projeto no arduino;
- a arquitetura de comunicação da **interface/servidor/arduino**;
- os serviços oferecidos;
- a documentação;
- a equipe envolvida no projeto;
- contato da empresa(pseudo contato) e da equipe(contato real dos integrantes);

#### Onde está? :rocket:

<p id="host"></p>

Este site está hospedado na plataforma [Heroku](https://dashboard.heroku.com) de forma gratuita. A plataforma usa a branch `master` deste projeto para realizar o deploy da aplicação, ou seja, qualquer alteração nesta branch irá refletir na aplicação em produção.

#### Como usar localmente? :pushpin:

<p id="como-usar"></p>

Para usar localmente em sua máquina, voce deve ter instalado em sua máquina o [NodeJS](https://nodejs.org/en/) com uma versão minima recomendada `v12.0.0` e o [Git](https://git-scm.com).
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).
Para começar, faça o clone deste repositório. Digite o comando no terminal:

```bash
$ git clone https://github.com/IglanCardeal/velpac
```

Acesse a pasta do projeto:

```bash
$ cd velpac
```

Instale as dependências do projeto usando o `npm` ou `yarn` se preferir:

```bash
$ npm install
# ou
$ yarn install
```

Feito isso, execute o comando abaixo e o aplicativo será iniciado localmente como ambiente de desenvolvimento em sua máquina:

```bash
$ npm run dev
# ou
$ yarn dev
```

Agora abra seu navegador na URL `http://localhost:3000` e verá a página inicial do projeto.

#### Quais tecnologias foram usadas? :wrench:

<p id="tecnologias"></p>

- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/) (Framework web)
- [Ejs](https://ejs.co/) (Template engine)
- [Lazyload](https://www.npmjs.com/package/lazyload) (Otimizar carregamento de imagens)
- [Bootstrap](https://getbootstrap.com/) (Framework CSS)
- [Git](https://git-scm.com)
- [VSCode](https://code.visualstudio.com/)

#### Autor

<p id="autor"></p>

<a href="https://blog.rocketseat.com.br/author/thiago/">
 <img style="border-radius: 50%;" src="https://avatars1.githubusercontent.com/u/37749943?s=460&u=70f3bf022f3a0f28c332b1aa984510910818ef02&v=4" width="100px;" alt="iglan cardeal"/>

<b>Iglan Cardeal</b>
</a>

Desenvolvido e mantido por Iglan Cardeal :hammer:
Desenvolvedor NodeJS 💻 <br>
Entre em contato! 👋🏽

- cmtcardeal@outlook.com :email:
- Instagram [@cmtcardeal](https://www.instagram.com/cmtecardeal/)
- StackOverflow [Cmte Cardeal](https://pt.stackoverflow.com/users/95771/cmte-cardeal?tab=profile)


