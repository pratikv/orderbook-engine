
exports.OrderPrice = {
    INVALID_LEVEL_PRICE: 0,
    MARKET_ORDER_PRICE: 0,
    MARKET_ORDER_BID_SORT_PRICE: 0xffffffff,
    MARKET_ORDER_ASK_SORT_PRICE: 0,
    PRICE_UNCHANGED: 0,
    SIZE_UNCHANGED: 0
};

exports.OrderState = {
    os_new: 0,
    os_accepted: 1,
    os_complete: 2,
    os_cancelled: 3,
    os_rejected: 4
};

exports.OrderCondition = {
    oc_no_conditions: 0,
    oc_all_or_none: 1,
    oc_immediate_or_cancel: 2,
    oc_all_or_none: 2
};

exports.OrderEvent = {
    accept: 'accept',
    reject: 'reject',
    fill: 'fill',
    cancel: 'cancel',
    cancel_reject: 'cancel_reject',
    replace: 'replace',
    replace_reject: 'replace_reject',
    book_update: 'book_update',
    trade: 'trade'
};

exports.FillFlags = {
    ff_neither_filled: 0,
    ff_inbound_filled: 1,
    ff_matched_filled: 2,
    ff_both_filled: 4
};

