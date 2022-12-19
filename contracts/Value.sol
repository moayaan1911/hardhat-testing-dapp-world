//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ValueContract {
    uint public balance;
    address public owner;
    event AddValue(uint value, uint balance);
    event SubValue(uint value, uint balance);

    constructor(uint _balance) {
        balance = _balance;
        owner = msg.sender;
    }

    function add(uint _value) public {
        // this function will ADD value to the balance
        balance += _value;
        emit AddValue(_value, balance);
    }

    function subtract(uint _value) public {
        // this function will SUBTRACT value from the balance ONLY IF it is called by the owner
        require(msg.sender == owner, "You are not the owner");
        balance -= _value;
        emit SubValue(_value, balance);
    }

    function getOwner() public view returns (address) {
        // this function will return the owner
        return owner;
    }
}
