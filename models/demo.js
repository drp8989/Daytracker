const mongoose = require('mongoose');

// Create a schema for Buy Trade
const buyTradeSchema = new mongoose.Schema({
  SYMBOL: String,
  OPENDATE: Date,
  ENTRY: Number,
  EXIT: Number,
  ACTION: String,
  RETURN: Number,
  SIDE: String,
  QUANTITY: Number,
  SEGMENT: String,
  ORDER_EXECUTION_TIME: Date,
  EXPIRY_DATE: Date
});

// Create a schema for Sell Trade
const sellTradeSchema = new mongoose.Schema({
  SYMBOL: String,
  CLOSE_DATE: Date,
  ENTRY: Number,
  EXIT: Number,
  ACTION: String,
  RETURN: Number,
  SIDE: String,
  QUANTITY: Number,
  SEGMENT: String,
  ORDER_EXECUTION_TIME: Date,
  EXPIRY_DATE: Date
});

// Create a parent schema that includes Buy Trade and Sell Trade
const tradeSchema = new mongoose.Schema({
  buyTrade: buyTradeSchema,
  sellTrade: sellTradeSchema,
  SETUPS: String,
  MISTAKES: String,
  NOTES: String,
  SCREENSHOTS: String,
  OUTCOME: String
});

// Create a model for the Trade schema
const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;