import { AiFillCar } from "react-icons/ai";
import {
  BiSolidDryer,
  BiSolidFirstAid,
  BiSolidFridge,
  BiSolidWasher,
  BiWifi,
  BiWorld,
} from "react-icons/bi";
import { BsFillDoorOpenFill, BsPersonWorkspace, BsSnow } from "react-icons/bs";
import {
  FaFireExtinguisher,
  FaKey,
  FaPumpSoap,
  FaShower,
  FaSkiing,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { FaHouseUser, FaKitchenSet, FaPeopleRoof } from "react-icons/fa6";
import {
  GiBarbecue,
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCampfire,
  GiCastle,
  GiCaveEntrance,
  GiCctvCamera,
  GiForestCamp,
  GiHeatHaze,
  GiIsland,
  GiToaster,
  GiWindmill,
} from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import { MdBalcony, MdMicrowave, MdOutlineVilla, MdPets, MdYard } from "react-icons/md";
import {
  PiBathtubFill,
  PiCoatHangerFill,
  PiTelevisionFill,
} from "react-icons/pi";
import { TbBeach, TbIroning3, TbMountain, TbPool } from "react-icons/tb";

// Danh mục các loại bất động sản
export const categories = [
  {
    label: "All", // Tất cả các loại bất động sản
    icon: <BiWorld />,
  },
  {
    img: "assets/beach_cat.jpg", // Hình ảnh danh mục bãi biển
    label: "Beachfront", // Gần bãi biển
    icon: <TbBeach />,
    description: "Tài sản này gần bãi biển!",
  },
  {
    img: "assets/windmill_cat.webp",
    label: "Windmills", // Có cối xay gió
    icon: <GiWindmill />,
    description: "Tài sản này có cối xay gió!",
  },
  {
    img: "assets/modern_cat.webp",
    label: "Iconic cities", // Thành phố hiện đại
    icon: <MdOutlineVilla />,
    description: "Tài sản này rất hiện đại!",
  },
  {
    img: "assets/countryside_cat.webp",
    label: "Countryside", // Vùng nông thôn
    icon: <TbMountain />,
    description: "Tài sản này nằm ở vùng nông thôn!",
  },
  {
    img: "assets/pool_cat.jpg",
    label: "Amazing Pools", // Hồ bơi đẹp
    icon: <TbPool />,
    description: "Tài sản này có hồ bơi tuyệt đẹp!",
  },
  {
    img: "assets/island_cat.webp",
    label: "Islands", // Đảo
    icon: <GiIsland />,
    description: "Tài sản này nằm trên một hòn đảo!",
  },
  {
    img: "assets/lake_cat.webp",
    label: "Lakefront", // Gần hồ nước
    icon: <GiBoatFishing />,
    description: "Tài sản này gần hồ nước!",
  },
  {
    img: "assets/skiing_cat.jpg",
    label: "Ski-in/out", // Khu trượt tuyết
    icon: <FaSkiing />,
    description: "Tài sản này có hoạt động trượt tuyết!",
  },
  {
    img: "assets/castle_cat.webp",
    label: "Castles", // Lâu đài
    icon: <GiCastle />,
    description: "Tài sản này là một lâu đài cổ kính!",
  },
  {
    img: "assets/cave_cat.jpg",
    label: "Caves", // Hang động
    icon: <GiCaveEntrance />,
    description: "Tài sản này nằm trong một hang động kỳ bí!",
  },
  {
    img: "assets/camping_cat.jpg",
    label: "Camping", // Cắm trại
    icon: <GiForestCamp />,
    description: "Tài sản này cung cấp các hoạt động cắm trại!",
  },
  {
    img: "assets/arctic_cat.webp",
    label: "Arctic", // Bắc Cực
    icon: <BsSnow />,
    description: "Tài sản này nằm trong môi trường Bắc Cực!",
  },
  {
    img: "assets/desert_cat.webp",
    label: "Desert", // Sa mạc
    icon: <GiCactus />,
    description: "Tài sản này nằm ở sa mạc!",
  },
  {
    img: "assets/barn_cat.jpg",
    label: "Barns", // Nhà kho
    icon: <GiBarn />,
    description: "Tài sản này nằm trong một nhà kho!",
  },
  {
    img: "assets/lux_cat.jpg",
    label: "Luxury", // Sang trọng
    icon: <IoDiamond />,
    description: "Tài sản này hoàn toàn mới và sang trọng!",
  },
];

// Các loại phòng
export const types = [
  {
    name: "An entire place", // Toàn bộ chỗ ở
    description: "Khách sẽ có toàn bộ chỗ ở cho riêng mình",
    icon: <FaHouseUser />,
  },
  {
    name: "Room(s)", // Một phòng hoặc nhiều phòng
    description:
      "Khách sẽ có phòng riêng trong nhà, cùng với các khu vực chung",
    icon: <BsFillDoorOpenFill />,
  },
  {
    name: "A Shared Room", // Phòng chung
    description:
      "Khách sẽ ngủ trong một phòng hoặc khu vực chung có thể được chia sẻ với bạn hoặc những người khác",
    icon: <FaPeopleRoof />,
  },
];

// Các tiện nghi
export const facilities = [
  {
    name: "Bath tub", // Bồn tắm
    icon: <PiBathtubFill />,
  },
  {
    name: "Personal care products", // Sản phẩm chăm sóc cá nhân
    icon: <FaPumpSoap />,
  },
  {
    name: "Outdoor shower", // Vòi hoa sen ngoài trời
    icon: <FaShower />,
  },
  {
    name: "Washer", // Máy giặt
    icon: <BiSolidWasher />,
  },
  {
    name: "Dryer", // Máy sấy
    icon: <BiSolidDryer />,
  },
  {
    name: "Hangers", // Móc treo quần áo
    icon: <PiCoatHangerFill />,
  },
  {
    name: "Iron", // Bàn ủi
    icon: <TbIroning3 />,
  },
  {
    name: "TV", // Ti vi
    icon: <PiTelevisionFill />,
  },
  {
    name: "Dedicated workspace", // Không gian làm việc riêng
    icon: <BsPersonWorkspace />,
  },
  {
    name: "Air Conditioning", // Điều hòa không khí
    icon: <BsSnow />,
  },
  {
    name: "Heating", // Máy sưởi
    icon: <GiHeatHaze />,
  },
  {
    name: "Security cameras", // Camera an ninh
    icon: <GiCctvCamera />,
  },
  {
    name: "Fire extinguisher", // Bình chữa cháy
    icon: <FaFireExtinguisher />,
  },
  {
    name: "First Aid", // Bộ sơ cứu
    icon: <BiSolidFirstAid />,
  },
  {
    name: "Wifi", // Wifi
    icon: <BiWifi />,
  },
  {
    name: "Cooking set", // Bộ dụng cụ nấu ăn
    icon: <FaKitchenSet />,
  },
  {
    name: "Refrigerator", // Tủ lạnh
    icon: <BiSolidFridge />,
  },
  {
    name: "Microwave", // Lò vi sóng
    icon: <MdMicrowave />,
  },
  {
    name: "Stove", // Bếp nấu
    icon: <GiToaster />,
  },
  {
    name: "Barbecue grill", // Lò nướng thịt ngoài trời
    icon: <GiBarbecue />,
  },
  {
    name: "Outdoor dining area", // Khu vực ăn uống ngoài trời
    icon: <FaUmbrellaBeach />,
  },
  {
    name: "Private patio or Balcony", // Ban công hoặc sân hiên riêng
    icon: <MdBalcony />,
  },
  {
    name: "Camp fire", // Lửa trại
    icon: <GiCampfire />,
  },
  {
    name: "Garden", // Khu vườn
    icon: <MdYard />,
  },
  {
    name: "Free parking", // Đỗ xe miễn phí
    icon: <AiFillCar />,
  },
  {
    name: "Self check-in", // Tự làm thủ tục nhận phòng
    icon: <FaKey />,
  },
  {
    name: "Pet allowed", // Cho phép vật nuôi
    icon: <MdPets />,
  },
];
