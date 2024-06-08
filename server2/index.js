const express = require('express');
const cors = require('cors');
const path = require('path');
const pkg = require('@sendgrid/mail');

const app = express();
const port = 3001;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };

// Configurar middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    const allowedOrigin = 'http://localhost:5173';
    const origin = req.headers.origin;
    
    if (origin !== allowedOrigin) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
});

app.post('/email/sendMail', (req, res) => {
    const { email, name, horario } = req.body;
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        p {
            color: #666;
            line-height: 1.6;
        }
        .cta-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        .cta-button:hover {
            background-color: #0056b3;
        }
        .footer-image {
            display: block;
            margin: 20px auto;
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Hola ${name}!</h1>
        <p>Ya puede consultar el horario de su próxima partida en Padel Dapp</p>
        <p> Juega el ${horario}. </p>
        <p> A Ganar! </p>
        <p>
            <a href="https://www.ejemplo.com" class="cta-button">Visita la página</a>
        </p>
        <p>Saludos,<br>El equipo de Padel Dapp</p>
    </div>
    <img src="https://img.freepik.com/foto-gratis/arreglo-raquetas-pelotas-tenis_23-2149434236.jpg?t=st=1715009455~exp=1715010055~hmac=01ec0ebd94261321d87432fb08ab38bd7566733d848035de70481b8791c5e312" alt="Imagen de Ejemplo" class="footer-image">
</body>
</html>
`;
    console.log('hola');
    const msg = {
        to: email,
        from: "padeldapp@gmail.com",
        subject: "Nuevo horario de partida!",
        text: "Nuevo horario",
        html: emailHTML,
    };
    pkg.setApiKey(
        "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"
    );
    pkg
        .send(msg)
        .then(() => {
            console.log("Email sent");
            return res.status(200).json({ message: "Email sent" });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ message: "Error sending email" });
        });
});

app.post('/weather', (req, res) => {
    const { direccion } = req.body; 
    const apiKey = '598a45ea6dd5cf5f91f03b503538d27e';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${direccion}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json()) 
        .then(data => {
            res.json(data); 
        })
        .catch(error => {
            console.error(error); 
            res.status(500).json({ error: 'Algo salió mal' }); 
        });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
