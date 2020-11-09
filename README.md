<div align="center">

<kbd>
  <img src="./src/public/img/email.png" height="auto" width="160" alt="Velpac" />
</kbd>

# Email Performance App

<br>

## :email: Site para demonstrar desempenho de envio de email usando protocolos HTTP e SMTP.

</div>

<div align="center">

![version](https://img.shields.io/badge/version-1.0.0-green) ![npm](https://img.shields.io/npm/v/npm) ![node-current](https://img.shields.io/badge/nodejs-%3E%3D12.0.0-green) ![mongodb](https://img.shields.io/badge/mongodb-v4.0.5-darkgreen) ![mongoose](https://img.shields.io/badge/express-v4.17.1-yellow) ![bootstrap](https://img.shields.io/badge/bootstrap-v4.0-blueviolet) ![GitHub](https://img.shields.io/github/license/iglancardeal/velpac)

</div>

---

### Status do projeto

- Concluído :muscle:

### Tabela de conteúdos

<!--ts-->

- [Sobre](#sobre)
  - [Como é definido o protocolo de envio?](#protocolo-envio)
- [Features](#features)
- [Outlook nao recebe email](#outlook-issue)
- [Como usar localmente](#como-usar)
  - [Pré Requisitos](#como-usar)
    - [SendGrid](#sendgrid)
    - [Configurando arquivo `.env`](#env)
  - [Nao tenho mongodb instalado. E agora?🤔](#docker)
- [Tecnologias](#tecnologias)
- [Autor](#autor)
  <!--te-->

<p id="sobre"></p>

#### Sobre :coffee:

![tela-inicial](./src/public/img/email-app-home.png)

A idéia desde projeto surgiu durante a atividade final da desciplina de _Redes de Computadores II_, do curso de _Engenharia da Computação_, onde o projeto escolhido foi um servidor de envio de email, onde este servidor deve fornecer métricas de tempo de desempenho de envio de email baseado no tipo de protocolo enviado, no caso dois protocolos foram usados para enviar email, `SMTP`e `HTTP`.

Este projeto consiste de uma aplicação web para envio de email baseando em protocolos de comunicação **HTTP** e **SMTP**. Além de pode escolher qual protocolo deseja enviar o email, este app possui um contador de tempo (em milisegundos) para que possa ser feita a análise de performance de cada protocolo durante o envio. Oferece o resultado de tempo médio de envio para cada protocolo e por fim, com base em todos os emails enviados, exibe gráfico para se ter uma comparação geral da performance.

Veja, logo abaixo, imagem do formulário de envio de email:

![tela-inicial](./src/public/img/send-email.png)

<p id="#protocolo-envio"></p>

##### Como é definido o protocolo de envio?

Podemos escolher qual protocolo será usado no envio graças a biblioteca `nodemailer-sendgrid-transport`.
Código que define o protocolo de envio:

```javascript
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');

dotenv.config();

// para protocolo HTTP
exports.transport = nodemailer.createTransport(
  sendGrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  }),
);

// para protocolo SMTP
exports.transportOverSMTP = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});
```

E no `controller` da aplicação, verificamos o valor do input que escolhe o protocolo de envio, e assim fazemos o envio do email:

```javascript
if (protocol === 'HTTP') {
  transport.sendMail(sendEmailObject, (error, info) => {
    callback(error, info, 'HTTP');
  });
}

if (protocol === 'SMTP') {
  transportOverSMTP.sendMail(sendEmailObject, (error, info) => {
    callback(error, info, 'SMTP');
  });
}
```

Este site foi feito com as tecnologias: MongoDB, NodeJS e, principalmente, faz o uso da API SendGrid através do Nodemailer para envio de emails sob os protocolos HTTP e SMTP. Os emails submetidos pelo usuário, são enviados ao servidor NodeJS e este armazena dados do email como protocolo, data de envio e protocolo usado, no banco de dados MongoDB antes de os enviar através da API do SendGrid.

![esquema](./src/public/img/esquema.png)

Veja mais sobre protocolo a ser usado com **SendGrid** e **Nodemailer**:

- [Sending Email With Nodemailer and SendGrid](https://sendgrid.com/blog/sending-email-nodemailer-sendgrid/)

<p id="features"></p>

#### Features 📋

Nesta aplicação voçê pode:

- Enviar email escolhendo o protocolo a ser usado (`SMTP`/`HTTP`)

- Visualizar o histórico de envio, onde é informado:
  1. Data de envio
  2. Email de destino(Destino)  
  3. Protocolo usado no envio
  4. Status do envio onde:

      - <span style="color: yellow; text-shadow: 1px 1px 1px black">Pendente</span>:  Email foi entregue ao serviço do SendGrid, mas o mesmo ainda não foi entregue ao destinatário.

      - <span style="color: green; text-shadow: 1px 1px 1px black">Enviado</span>: Email entregue ao destinatário.

      - <span style="color: red; text-shadow: 1px 1px 1px black">Falha ao enviar</span>: Falhou ao enviar email.

  5. Tempo decorrigo do procedimento em milisegundos

   Exemplo de status de envio:

  ```
    Data envio: 09/11/2020 as 11:52 horas
    Destino: cubeleexuzz@gmail.com
    Protocolo: HTTP
    Status: Pendente
    Tempo decorrido: 0 milisegundos
  ```

- Visualizar os números de desempenho do tempo decorrido para cada protocolo. Os dados são exibidos em:

  - Gráfico:

    ![grafico](./src/public/img/grafico.png)

  - Histograma:

    ![histograma](./src/public/img/histograma.png)

  - Diagrama de caixa:

    ![caixa](./src/public/img/caixa.png)

#### Problema com Outlook 👾

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

#### OBS:

OUTLOOK NAO RECEBE EMAILs
I’ve seen the same thing it looks like providers are blocking the IP range of SendGrid’s “free” plans.

Assuming you authenticated your emails properly and followed SPF, dkim and DMARC then the only other solution is to upgrade your account to a dedicated IP and hope that range isn't blacklisted.
