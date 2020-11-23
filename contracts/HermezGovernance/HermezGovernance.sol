// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/AccessControl.sol";

/**
 * @dev Smart Contract in charge of managing Hermez's governance through access control by using roles
 */
contract HermezGovernance is Initializable, AccessControlUpgradeSafe {
    event ExecOk(bytes returnData);
    event ExecFail(bytes returnData);

    /**
     * @dev Initializer function (equivalent to the constructor)
     * @param communityCouncil Address in charge of handling all roles
     */
    function hermezGovernanceInitializer(address communityCouncil)
        public
        initializer
    {
        _setupRole(DEFAULT_ADMIN_ROLE, communityCouncil);
    }

    /**
     * @dev Function to grant a role to a desired account
     * @param role it should be the keccak256 of the destination address and the signature of the function to call
     * @param account account to grant access
     */
    function addRole(bytes32 role, address account) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "HermezGovernance::addRole: ONLY_DEFAULT_ADMIN_ROLE"
        );
        grantRole(role, account);
    }

    /**
     * @dev Function to revoke a role to a desired account
     * @param role it should be the keccak256 of the destination address and the signature of the function to call
     * @param account account to grant access
     */
    function removeRole(bytes32 role, address account) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "HermezGovernance::removeRole: ONLY_DEFAULT_ADMIN_ROLE"
        );
        revokeRole(role, account);
    }

    /**
     * @dev Function to execute a call. The msg.sender should have the role to be able to execute it
     * @param destination address to which the call will be made
     * @param value call value
     * @param data data of the call to make
     */
    function execute(
        address destination,
        uint256 value,
        bytes memory data
    ) external {
        // Decode the signature
        bytes4 dataSignature = abi.decode(data, (bytes4));
        bytes32 role = keccak256(abi.encodePacked(destination, dataSignature));
        require(
            hasRole(role, msg.sender),
            "HermezGovernance::execute: ONLY_ALLOWED_ROLE"
        );

        (bool succcess, bytes memory returnData) = destination.call{
            value: value
        }(data);
        if (succcess) {
            emit ExecOk(returnData);
        } else {
            emit ExecFail(returnData);
        }
    }
}
