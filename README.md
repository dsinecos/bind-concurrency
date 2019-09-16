## Objective

The library provides an API to preserve order when performing asynchronous operations. The library covers the scenario where one needs both serial and concurrent operations depending upon the data. 

For example if bids are being made on multiple items and need to persisted on the Database, it is required that bids for an item be processed serially, however bids for different items can be processed concurrently or in parallel.

Bind-Concurrency allows to achieve this for objects which satisfy the required interfaces.

## API and Usage

[X] To be completed

## LICENSE

MIT