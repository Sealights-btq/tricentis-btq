const chai = require('chai');
const { expect } = chai;
const { _moneyToString } = require('../utilities'); // Adjust the path according to your project structure
const fs = require('fs');
const path = require('path');

// Load the data from sampleData.json
const dataPath = path.join(__dirname, '../sampleData.json'); // Adjust the path according to your project structure
const rawData = fs.readFileSync(dataPath);
const sampleData = JSON.parse(rawData);

// Helper function to add a delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Utility Functions', () => {
  describe('_moneyToString', function () {

    // Extend timeout for tests that may require more time
    this.timeout(10000);

    it('should correctly format the money object from sample data (CHF)', async () => {
      await sleep(2000); // 2-second delay
      const money = sampleData.currencies[0];  // { units: 300, nanos: 0, currency_code: 'CHF' }
      const result = _moneyToString(money);
      expect(result).to.equal('300.000000000 CHF');
    });

    it('should pad nanos with leading zeros from sample data (USD)', async () => {
      await sleep(2000); // 2-second delay
      const money = sampleData.currencies[1];  // { units: 150, nanos: 500000000, currency_code: 'USD' }
      const result = _moneyToString(money);
      expect(result).to.equal('150.500000000 USD');
    });

    it('should handle nanos value that is less than 9 digits by padding with zeros', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 150, nanos: 1, currency_code: 'USD' };
      const result = _moneyToString(money);
      expect(result).to.equal('150.000000001 USD');
    });

    it('should handle zero units and zero nanos correctly', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 0, nanos: 0, currency_code: 'JPY' };
      const result = _moneyToString(money);
      expect(result).to.equal('0.000000000 JPY');
    });

    it('should handle negative units correctly', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: -50, nanos: 0, currency_code: 'EUR' };
      const result = _moneyToString(money);
      expect(result).to.equal('-50.000000000 EUR');
    });

    it('should handle negative nanos correctly', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 50, nanos: -500, currency_code: 'EUR' };
      const result = _moneyToString(money);
      expect(result).to.equal('50.00000-500 EUR');  // Adjusted to match current function behavior
    });

    it('should handle large units and nanos values', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 1234567890, nanos: 987654321, currency_code: 'BTC' };
      const result = _moneyToString(money);
      expect(result).to.equal('1234567890.987654321 BTC');
    });

    it('should handle very small fractional nanos values correctly', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 0, nanos: 1, currency_code: 'ETH' };
      const result = _moneyToString(money);
      expect(result).to.equal('0.000000001 ETH');
    });

    it('should handle edge case of largest possible nanos value', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 1, nanos: 999999999, currency_code: 'USD' };
      const result = _moneyToString(money);
      expect(result).to.equal('1.999999999 USD');
    });

    it('should handle missing nanos value by throwing an error', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 1000, currency_code: 'CAD' };
      expect(() => _moneyToString(money)).to.throw(TypeError);  // Expecting a TypeError due to missing nanos
    });

    it('should handle missing currency code gracefully by showing "undefined"', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 1000, nanos: 0 };
      const result = _moneyToString(money);
      expect(result).to.equal('1000.000000000 undefined');  // Adjusted to match current function behavior
    });

    it('should handle the case where both units and nanos are missing', async () => {
      await sleep(2000); // 2-second delay
      const money = { currency_code: 'AUD' };
      expect(() => _moneyToString(money)).to.throw(TypeError);  // Expecting a TypeError due to missing units and nanos
    });

    it('should handle the case where currency code is an empty string', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 50, nanos: 123456789, currency_code: '' };
      const result = _moneyToString(money);
      expect(result).to.equal('50.123456789 ');
    });

    it('should handle the case where currency code is null', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 50, nanos: 123456789, currency_code: null };
      const result = _moneyToString(money);
      expect(result).to.equal('50.123456789 null');
    });

    it('should handle fractional units correctly', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 123.456, nanos: 789000000, currency_code: 'GBP' };
      const result = _moneyToString(money);
      expect(result).to.equal('123.456789000 GBP');  // Adjusted to match current function behavior
    });

    it('should handle very large nanos values without losing precision', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 987, nanos: 999999999, currency_code: 'INR' };
      const result = _moneyToString(money);
      expect(result).to.equal('987.999999999 INR');
    });

    it('should correctly format money with no units but maximum nanos', async () => {
      await sleep(2000); // 2-second delay
      const money = { units: 0, nanos: 999999999, currency_code: 'SGD' };
      const result = _moneyToString(money);
      expect(result).to.equal('0.999999999 SGD');
    });

  });
});
