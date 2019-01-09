pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
import "./ownable.sol";
import "./safemath.sol";
import "./erc721.sol";

contract CarRenter is Ownable {
    using SafeMath for uint256;
    // using SafeMath32 for uint;
    using SafeMath16 for uint16;
    modifier onlyOwnerOf(uint _zombieId) {
        require(msg.sender == carToOwner[_zombieId]);
        _;
    }

    event NewCar(uint carId, string name, string info);
    event CarCrash(uint carId);

    struct Car {
        string name;
        string info;
        string cartype;
        uint age;     // 車齡
        uint price;
        // uint rentTime;
        // uint period;
        uint xlocate;
        uint ylocate;
        uint _id;
        uint oil;
        address owner;
        address renter;
    }

    Car[] public cars;

    uint public car_count = 0;
    mapping (uint => address) public carToOwner;
    mapping (address => uint) ownerCarCount;
    mapping (address => string) addressToName;
    mapping (string => uint) typeToOil;
    mapping (string => uint) typeToCapacity;
    
    function initOiltype() internal {
        typeToCapacity["小客車"] = 30;
        typeToCapacity["跑車"] = 60;
        typeToCapacity["休旅車"] = 60;
        typeToCapacity["大卡車"] = 150;
        typeToCapacity["坦克車"] = 200;

        typeToOil["小客車"] = 20;
        typeToOil["跑車"] = 10;
        typeToOil["休旅車"] = 12;
        typeToOil["大卡車"] = 8;
        typeToOil["坦克車"] = 1;
    }


    function is_Rented(uint id) public view returns (bool){
        return (cars[id].renter != cars[id].owner);
    }
    
    function addCar(string memory _name, string memory _info, string memory _type, uint _age, uint _price, uint x_loc, uint y_loc) public {
        // Car memory newCar = Car("hi", "asdf", 21, 0, 0, 0, msg.sender, msg.sender, 0);
        // cars.push(newCar);
        initOiltype();
        uint oil_capacity = typeToOil[_type];
        uint id = cars.push(Car(_name, _info, _type, _age, _price, x_loc, y_loc, 0, oil_capacity, msg.sender, msg.sender)) - 1;
        carToOwner[id] = msg.sender;
        cars[id]._id = id;
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].add(1);
        car_count += 1;
        emit NewCar(id, _name, _info);
    }

    function getAllCars() external view returns(Car[]) {
        return cars;
    }
    function getCarByID(uint id) external view returns(Car) {
        return cars[id];
    }
    function getNameByID(uint id) external view returns(string) {
        return cars[id].name;
    }
    function getNameByAddress(address addr) external returns(string) {
        return addressToName[addr];
    }

    function getInfoByID(uint id) external view returns(string) {
        return cars[id].info;
    }
    function getLength() external view returns(uint) {
        return car_count;
    }
    function rentCar(uint id) external payable {
        cars[id].renter = msg.sender;
        cars[id].owner.transfer(cars[id].price);
    }
    function returnCar(uint id) external {
        cars[id].renter = cars[id].owner;
    }
    function append(string a, string b, string c, string d, string e) internal pure returns (string) {
        return string(abi.encodePacked(a, b, c, d, e));
    }
    function enroll(string name) external {
        addressToName[msg.sender] = name;
    }
    function refuel(uint id) external {
        cars[id].oil = typeToCapacity[cars[id].cartype];
    }
    function uintToString(uint v) constant returns (string str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }
        bytes memory s = new bytes(i + 1);
        for (uint j = 0; j <= i; j++) {
            s[j] = reversed[i - j];
        }
        str = string(s);
    }
    function createCrash() external {
        // uint id1 = rand % car_count;
        // uint id2 = rand % car_count;
        // uint random = uint(keccak256(abi.encodePacked(now))) % car_count;
        uint id1 = 0;
        uint id2 = 0;

        for (uint i = 0; i < car_count-1; i++) {
            for ( uint j = i+1; j < car_count; j++) {
                if (cars[i].xlocate == cars[j].xlocate) {
                    if (cars[i].ylocate == cars[j].ylocate) {
                        id1 = i;
                        id2 = j;
                    }
                }
            }
        }
        require(id1 != id2, "no car at same location !!");

        if (id2==0) {
            cars[id1].info = append(cars[id1].info, ", ", "Crash with Car # 0", "", "");
        }
        else{
            cars[id1].info = append(cars[id1].info, ", ", "Crash with Car # ", uintToString(id2), "");
        }

        if (id1==0) {
            cars[id2].info = append(cars[id2].info, ", ", "Crash with Car # 0", "", "");
        }
        else{
            cars[id2].info = append(cars[id2].info, ", ", "Crash with Car # ", uintToString(id1), "");
        }
    }
    
}
