To run orderMatcherUnitTest->

Refer to input file - "test-input-orders.json"
(Add orders as per your test case)

run "orderMatcherUnitTest" File as - 

node orderMatcherUnitTest.js

(note: while running this command, you should be inside the unit-test folder)


After successful Run, you can file below files in the same directory as output.

1. test-output-asks-orders.json  [all pending sell orders in system]
2. test-output-bids-orders.json [all pending buy orders in system]
3. test-output-matched-orders [all matched orders, available when at least one order is matched]