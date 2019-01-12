pragma solidity ^0.4.24;

import "./CarRenter.sol";

contract CarHelper is CarRenter {
    function changeName(uint _carId, string _newName) external onlyOwnerOf(_carId) {
        cars[_carId].name = _newName;
    }
    // function changeInfo(uint _carId, string _newInfo) external onlyOwnerOf(_carId) {
    //     cars[_carId].info = _newInfo;
    // }
    function changeAge(uint _carId, uint8 _newAge) external onlyOwnerOf(_carId) {
        cars[_carId].age = _newAge;
    }
    // function changeRentaltime(uint _carId, uint32 _newRent) external onlyOwnerOf(_carId) {
    //     cars[_carId].rentTime = _newRent;
    // }
    function sqrt(uint x) returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    function changeLocation(uint _carId, uint16 _newX, uint16 _newY, bool crashed) external onlyOwnerOf(_carId) {
        if (cars[_carId].rentTime < now && cars[_carId].renter != cars[_carId].owner) {
            emit RentTimeExpired(_carId, addressToName[msg.sender]);
        } else {
            if (crashed) {
                cars[_carId].damage += 10;
                emit CarCrash(_carId, addressToName[msg.sender]); 
            }
            uint64 x_dist = cars[_carId].xlocate > _newX ? cars[_carId].xlocate - _newX : _newX - cars[_carId].xlocate;
            uint64 y_dist = cars[_carId].ylocate > _newY ? cars[_carId].ylocate - _newY : _newY - cars[_carId].ylocate; 
            // uint dist = (cars[_carId].xlocate - _newX) * (cars[_carId].xlocate - _newX) + (cars[_carId].ylocate - _newY) * (cars[_carId].ylocate - _newY);
            uint64 dist = (x_dist + y_dist);
            cars[_carId].xlocate = _newX;
            cars[_carId].ylocate = _newY;

            cars[_carId].oil = cars[_carId].oil + dist;
            emit CarMove(_carId, _newX, _newY);
        }
        // dist = sqrt(dist);
        // uint oil_used = uint(dist / typeToOil[cars[_carId].cartype]);
        // uint8 oil_used = uint8(dist / 100);
        // if (cars[_carId].oil < oil_used) {
        //     cars[_carId].oil = 0;
        // }
        // require(cars[_carId].oil > 0, "Run out of oil");
        // cars[_carId].oil = cars[_carId].oil - oil_used;
    }
    function getCarByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerCarCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < cars.length; i++) {
            if (carToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
contract CarOwnership is CarRenter, ERC721 {

    using SafeMath for uint256;

    mapping (uint => address) carApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerCarCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return carToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        // We do not have to transfer the ownership but some kind of accessibility? 
        ownerCarCount[_to] = ownerCarCount[_to].add(1);
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].sub(1);
        carToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require (carToOwner[_tokenId] == msg.sender || carApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        carApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

}
