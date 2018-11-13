const StellarSdk = require('stellar-sdk');
var config = {
    dev: {
        mongodb: {
            uri: 'mongodb://127.0.0.1:27017/koupon'
        },
        issuer: {
            issuing: {
                public: 'GDM3GIFIA4THSDYAKEPWPYXMOZZDTJAXS65HN5ODXGVLIHNHTIFBYENC',
                secret: 'SCV5HCIXHNDHCKX3KQ5CYCVCRTSFCGH576YDXMFTEVHQYJ5LZHH4VX62',
            },
            distribute: {
                public: 'GD4ASUIVGCIFZ4D6SCUD7BGID6O2ASHTZVANGA3LBJCLZCHZYLZYCVZH',
                secret: 'SBURCT3GKIK7VCETO4HMPOEHYEJK5OGQRXPY5PBAATDUABAPGT6CWXVZ',
            },
        },
        asset: {
            code: 'kouponcoin'
        },
        coupon: {
            cost: "1",
            startingBalance: "100",
            escrowBalance: "3.5",
        },
        stellar: {
            network: 'test',
            server: 'https://horizon-testnet.stellar.org'
        },
        jwt: {
            secret: 'alohaciaohellonihaokonichiwasawasdee',
            expire: 36000 //second
        }
    }
};

module.exports = config[process.env.KOUPON_ENV] || config.dev;