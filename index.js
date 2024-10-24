const express = require('express');
const axios = require('axios');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const CryptoJS = require('crypto-js');



const app = express();
const PORT = 4005;

// Middleware para manejar CORS
app.use(cors());

// Middleware para registrar solicitudes HTTP
app.use(morgan('dev'));

// Middleware para manejar el contenido JSON
app.use(express.json());

// Ruta raíz




// Inicializa ConfigService según tu implementación



// Función para generar la firma HMAC-SHA512
const generateSignature = (timestamp, nonce, body) => {
    const payload = `${timestamp}\n${nonce}\n${body}\n`;
    return CryptoJS.HmacSHA512(
        payload,
        process.env.SECRET_KEY
    )
        .toString(CryptoJS.enc.Hex)
        .toUpperCase();
};

// Función para generar un nonce aleatorio
const generateNonce = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < length; i++) {
        nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonce;
};

// Función para crear un pedido en Binance Pay





app.post('/binance', async ({ body }, res) => {


    const url = "https://bpay.binanceapi.com/binancepay/openapi/v3/order"
    const timestamp = Date.now().toString();
    const nonce = generateNonce();



    const requestBody = {
        env: {
            terminalType: 'WEB',
        },
        orderTags: {
            ifProfitSharing: false,
        },
        merchantTradeNo: body.idOrden,
        orderAmount: body.cantidad,
        currency: body.divisa,
        description: 'very good Ice Cream',
        goodsDetails: [
            {
                goodsType: '01',
                goodsCategory: 'D000',
                referenceGoodsId: '7876763A3B',
                goodsName: 'Ice Cream',
                goodsDetail: 'Greentea ice cream cone',
            },
        ],
    };

    const body2 = JSON.stringify(requestBody);
    const signature = generateSignature(timestamp, nonce, body2);

    const headers = {
        'content-type': 'application/json',
        'BinancePay-Timestamp': timestamp,
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': process.env.API_KEY,
        'BinancePay-Signature': signature,
    };

    try {
        const response = await axios.post(url, body2, { headers });
        console.log(response)
        return res.status(200).json({ success: true, data: response?.data?.data })
    } catch (error) {
        console.log(error);
        throw new Error(`Error al hacer la solicitud: ${error.message}`);
    }

});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});