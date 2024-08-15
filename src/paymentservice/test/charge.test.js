const { expect } = require('chai');
const charge = require('../charge.js');

describe('Charge Function', function() {
    it('should process a valid VISA card', function() {
        const request = {
            amount: {
                currency_code: 'USD',
                units: 100,
                nanos: 0
            },
            credit_card: {
                credit_card_number: '4111111111111111', // VISA test card number
                credit_card_expiration_year: new Date().getFullYear() + 1,
                credit_card_expiration_month: new Date().getMonth() + 1
            }
        };
        const result = charge(request);
        expect(result).to.have.property('transaction_id');
    });

    it('should throw InvalidCreditCard error for an invalid card', function() {
        const request = {
            amount: {
                currency_code: 'USD',
                units: 100,
                nanos: 0
            },
            credit_card: {
                credit_card_number: '1234567890123456', // Invalid card number
                credit_card_expiration_year: new Date().getFullYear() + 1,
                credit_card_expiration_month: new Date().getMonth() + 1
            }
        };
        expect(() => charge(request)).to.throw('Credit card info is invalid');
    });

    it('should throw UnacceptedCreditCard error for AMEX card', function() {
        const request = {
            amount: {
                currency_code: 'USD',
                units: 100,
                nanos: 0
            },
            credit_card: {
                credit_card_number: '378282246310005', // AMEX test card number
                credit_card_expiration_year: new Date().getFullYear() + 1,
                credit_card_expiration_month: new Date().getMonth() + 1
            }
        };
        expect(() => charge(request)).to.throw('Sorry, we cannot process amex credit cards. Only VISA or MasterCard is accepted.');
    });

    it('should throw ExpiredCreditCard error for an expired card', function() {
        const request = {
            amount: {
                currency_code: 'USD',
                units: 100,
                nanos: 0
            },
            credit_card: {
                credit_card_number: '4111111111111111', // VISA test card number
                credit_card_expiration_year: new Date().getFullYear() - 1,
                credit_card_expiration_month: new Date().getMonth() + 1
            }
        };
        expect(() => charge(request)).to.throw(/expired/);
    });
});
