pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
import "./ownable.sol";
import "./safemath.sol";
import "./erc721.sol";

contract CarRenter is Ownable {
    using SafeMath for uint256;
    // using SafeMath32 for uint;
    using SafeMath16 for uint16;
    modifier onlyOwnerOf(uint _id) {
        require(msg.sender == cars[_id].renter);
        _;
    }

    // event NewCar(uint carId, string name, string info);
    event NewCar(uint carId, string owner);
    event CarCrash(uint carId, string owner);
    event CarMove(uint carId, uint new_X, uint new_Y);
    event RentCar(uint carId, string renter, string owner);
    event ReturnCar(uint carId, string renter, string owner);
    event RentTimeExpired(uint carId, string renter);
    event log(uint message);

    struct Car {
        string name;
        // string info;
        // string ownername;
        // string rentername;
        uint8 cartype;   // 0~4
        uint64 age;
        uint64 oil;
        uint64 damage;    // 0~100
        uint64 xlocate;
        uint64 ylocate;
        uint64 price;
        uint64 _id;
        uint rentTime;
        address owner;
        address renter;
    }

    Car[] public cars;

    uint public car_count = 0;
    mapping (uint => address) public carToOwner;
    mapping (address => uint) ownerCarCount;
    mapping (address => string) addressToName;
    mapping (uint8 => uint8) typeToOil;
    mapping (uint8 => uint8) typeToCapacity;
    mapping (uint => uint) carToRentTime;
    
    function initOiltype() internal {
        typeToCapacity[0] = 30;      // 小客車
        typeToCapacity[1] = 60;      // 跑車
        typeToCapacity[2] = 60;      // 休旅車
        typeToCapacity[3] = 150;     // 大卡車
        typeToCapacity[4] = 200;     // 坦克車

        typeToOil[0] = 20;
        typeToOil[1] = 10;
        typeToOil[2] = 12;
        typeToOil[3] = 8;
        typeToOil[4] = 1;
    }


    function is_Rented(uint id) public view returns (bool){
        return (cars[id].renter != cars[id].owner);
    }
    
    function addCar(string memory _name, uint8 _type, uint8 _age, uint16 _price, uint16 x_loc, uint16 y_loc) public {
        // Car memory newCar = Car("hi", "asdf", 21, 0, 0, 0, msg.sender, msg.sender, 0);
        // cars.push(newCar);
        // initOiltype();
        // uint8 oil_capacity = typeToOil[_type];
        Car memory newCar = Car(_name, _type, _age, 0, 0, x_loc, y_loc, _price, 0, now, msg.sender, msg.sender);
        uint id = cars.push(newCar) - 1;
        carToOwner[id] = msg.sender;
        cars[id]._id = uint16(id);
        ownerCarCount[msg.sender] = ownerCarCount[msg.sender].add(1);
        car_count += 1;
        // emit NewCar(id, _name, "123");
        emit NewCar(id, addressToName[msg.sender]);
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

    // function getInfoByID(uint id) external view returns(string) {
    //     return cars[id].info;
    // }

    function getLength() external view returns(uint) {
        return car_count;
    }
    function rentCar(uint id, uint64 rentTime)  payable {
        // require(msg.value == cars[id].price * (50 + rentTime)  * 1 finney);
        // cars[id].owner.transfer(value * 1 ether);
        cars[id].oil = 0;
        cars[id].renter = msg.sender;
        cars[id].rentTime = now + rentTime * 60;
        carToRentTime[id] = rentTime;
        emit RentCar(id, addressToName[msg.sender], addressToName[cars[id].owner]);
        // emit RentCar(id);
    }

    function returnCar(uint id) payable {
        uint szaboToOwner;
        uint szaboToRenter;
        if (cars[id].damage == 0 && now < cars[id].rentTime) {
            szaboToOwner = cars[id].price * carToRentTime[id] * 1000 + cars[id].oil * 10;
            szaboToRenter = cars[id].price * 50 * 1000 - cars[id].oil * 10;
            emit log(szaboToOwner);
            emit log(szaboToRenter);
            cars[id].owner.transfer(szaboToOwner * 1 szabo);
            cars[id].renter.transfer(szaboToRenter * 1 szabo);
        } else {
            szaboToOwner = cars[id].price * (carToRentTime[id] + 50) * 1000;
            emit log(szaboToOwner);
            cars[id].owner.transfer(szaboToRenter * 1 szabo);
        }
        cars[id].renter = cars[id].owner;
        cars[id].oil = 0;
        cars[id].damage = 0;
        emit ReturnCar(id, addressToName[msg.sender], addressToName[cars[id].owner]);
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
    function createCrash(uint _carId) external onlyOwnerOf(_carId) {
        cars[_carId].damage = 100;
        // uint id1 = rand % car_count;
        // uint id2 = rand % car_count;
        // uint random = uint(keccak256(abi.encodePacked(now))) % car_count;
        // uint id1 = 0;
        // uint id2 = 0;

        // for (uint i = 0; i < car_count-1; i++) {
        //     for ( uint j = i+1; j < car_count; j++) {
        //         if (cars[i].xlocate == cars[j].xlocate) {
        //             if (cars[i].ylocate == cars[j].ylocate) {
        //                 id1 = i;
        //                 id2 = j;
        //             }
        //         }
        //     }
        // }
        // require(id1 != id2, "no car at same location !!");

        emit CarCrash(_carId, addressToName[msg.sender]);
        // if (id2==0) {
        //     cars[id1].info = append(cars[id1].info, ", ", "Crash with Car # 0", "", "");
        // }
        // else{
        //     cars[id1].info = append(cars[id1].info, ", ", "Crash with Car # ", uintToString(id2), "");
        // }

        // if (id1==0) {
        //     cars[id2].info = append(cars[id2].info, ", ", "Crash with Car # 0", "", "");
        // }
        // else{
        //     cars[id2].info = append(cars[id2].info, ", ", "Crash with Car # ", uintToString(id1), "");
        // }
    }
    
}
