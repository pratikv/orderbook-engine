

var OrderCondition = require('./types').OrderCondition;

/// @brief construct
function OrderTracker(order, conditions) {
	this.order_ = order;
	this.open_qty_ = order.open_qty();
	if (!conditions) {
		conditions = 0;
	}
	this.conditions_ = conditions;
	this.filled_cost_ = order.filled_cost();
	this.filled_remain_ = order.filled_remain();
}

/// @brief modify the order quantity
OrderTracker.prototype.change_qty = function(delta) {
	if ((delta < 0 && this.open_qty_ < Math.abs(delta))) {
		throw new Error('Replace size reduction larger than open quantity');
	}
	this.open_qty_ += delta;
};

/// @brief fill an order
/// @param qty the number of shares filled in this fill
OrderTracker.prototype.fill = function(qty, price) {
	if (qty > this.open_qty_) {
		throw new Error('Fill size larger than open quantity');
	}

	this.filled_cost_ += qty * price;
	if (this.order_.is_filled_limit() === true){
		this.filled_remain_ = (this.order_.filled_limit() - this.filled_cost_).toFixed(2);
	}
	this.open_qty_ -= qty;
};

/// @brief is there no remaining open quantity in this order?
OrderTracker.prototype.filled = function() {
	return this.open_qty_ === 0;
};

/// @brief get the total filled quantity of this order
OrderTracker.prototype.filled_qty = function() {
	return (this.order_.order_qty() - this.open_qty()).toFixed(2);
};

/// @brief get the open quantity of this order
OrderTracker.prototype.open_qty = function() {
	return this.open_qty_;
};

/// @brief get the order pointer
OrderTracker.prototype.ptr = function() {
	this.order_.open_qty_ = this.open_qty_;
	this.order_.filled_cost_ = this.filled_cost_;
	this.order_.filled_remain_ = this.filled_remain_;
	return this.order_;
};

/// @ brief is this order marked all or none?
OrderTracker.prototype.all_or_none = function() {
	return this.conditions_ & OrderCondition.oc_all_or_none;
};

/// @ brief is this order marked immediate or cancel?
OrderTracker.prototype.immediate_or_cancel = function() {
	return this.conditions_ &  OrderCondition.oc_immediate_or_cancel;
};

module.exports = OrderTracker;
