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

export const categories = [
  {
    label: "Tất cả",
    icon: <BiWorld />,
  },
  {
    img: "assets/beach_cat.jpg",
    label: "Gần biển",
    icon: <TbBeach />,
    description: "Tài sản này gần bãi biển!",
  },
  {
    img: "assets/windmill_cat.webp",
    label: "Cối xay gió",
    icon: <GiWindmill />,
    description: "Tài sản này có các cối xay gió!",
  },
  {
    img: "assets/modern_cat.webp",
    label: "Thành phố biểu tượng",
    icon: <MdOutlineVilla />,
    description: "Tài sản này hiện đại!",
  },
  {
    img: "assets/countryside_cat.webp",
    label: "Nông thôn",
    icon: <TbMountain />,
    description: "Tài sản này ở khu vực nông thôn!",
  },
  {
    img: "assets/pool_cat.jpg",
    label: "Hồ bơi đẹp",
    icon: <TbPool />,
    description: "Tài sản này có một hồ bơi tuyệt đẹp!",
  },
  {
    img: "assets/island_cat.webp",
    label: "Đảo",
    icon: <GiIsland />,
    description: "Tài sản này nằm trên đảo!",
  },
  {
    img: "assets/lake_cat.webp",
    label: "Gần hồ",
    icon: <GiBoatFishing />,
    description: "Tài sản này gần một hồ nước!",
  },
  {
    img: "assets/skiing_cat.jpg",
    label: "Trượt tuyết",
    icon: <FaSkiing />,
    description: "Tài sản này có hoạt động trượt tuyết!",
  },
  {
    img: "assets/castle_cat.webp",
    label: "Lâu đài",
    icon: <GiCastle />,
    description: "Tài sản này là một lâu đài cổ!",
  },
  {
    img: "assets/cave_cat.jpg",
    label: "Hang động",
    icon: <GiCaveEntrance />,
    description: "Tài sản này nằm trong một hang động huyền bí!",
  },
  {
    img: "assets/camping_cat.jpg",
    label: "Cắm trại",
    icon: <GiForestCamp />,
    description: "Tài sản này cung cấp hoạt động cắm trại!",
  },
  {
    img: "assets/arctic_cat.webp",
    label: "Bắc cực",
    icon: <BsSnow />,
    description: "Tài sản này nằm trong môi trường bắc cực!",
  },
  {
    img: "assets/desert_cat.webp",
    label: "Sa mạc",
    icon: <GiCactus />,
    description: "Tài sản này nằm ở sa mạc!",
  },
  {
    img: "assets/barn_cat.jpg",
    label: "Trang trại",
    icon: <GiBarn />,
    description: "Tài sản này nằm trong trang trại!",
  },
  {
    img: "assets/lux_cat.jpg",
    label: "Sang trọng",
    icon: <IoDiamond />,
    description: "Tài sản này hoàn toàn mới và sang trọng!",
  },
];

export const types = [
  {
    name: "Toàn bộ nơi ở",
    description: "Khách có toàn quyền sử dụng nơi ở",
    icon: <FaHouseUser />,
  },
  {
    name: "Phòng riêng",
    description: "Khách có phòng riêng và dùng chung khu vực khác",
    icon: <BsFillDoorOpenFill />,
  },
  {
    name: "Phòng chung",
    description: "Khách ở trong phòng chung hoặc khu vực chia sẻ",
    icon: <FaPeopleRoof />,
  },
];

export const facilities = [
  {
    name: "Bồn tắm",
    icon: <PiBathtubFill />,
  },
  {
    name: "Sản phẩm chăm sóc cá nhân",
    icon: <FaPumpSoap />,
  },
  {
    name: "Vòi sen ngoài trời",
    icon: <FaShower />,
  },
  {
    name: "Máy giặt",
    icon: <BiSolidWasher />,
  },
  {
    name: "Máy sấy",
    icon: <BiSolidDryer />,
  },
  {
    name: "Móc treo quần áo",
    icon: <PiCoatHangerFill />,
  },
  {
    name: "Bàn là",
    icon: <TbIroning3 />,
  },
  {
    name: "TV",
    icon: <PiTelevisionFill />,
  },
  {
    name: "Không gian làm việc riêng",
    icon: <BsPersonWorkspace />,
  },
  {
    name: "Điều hòa",
    icon: <BsSnow />,
  },
  {
    name: "Hệ thống sưởi",
    icon: <GiHeatHaze />,
  },
  {
    name: "Camera an ninh",
    icon: <GiCctvCamera />,
  },
  {
    name: "Bình chữa cháy",
    icon: <FaFireExtinguisher />,
  },
  {
    name: "Hộp sơ cứu",
    icon: <BiSolidFirstAid />,
  },
  {
    name: "Wifi",
    icon: <BiWifi />,
  },
  {
    name: "Bộ dụng cụ nấu ăn",
    icon: <FaKitchenSet />,
  },
  {
    name: "Tủ lạnh",
    icon: <BiSolidFridge />,
  },
  {
    name: "Lò vi sóng",
    icon: <MdMicrowave />,
  },
  {
    name: "Bếp nấu",
    icon: <GiToaster />,
  },
  {
    name: "Bếp nướng BBQ",
    icon: <GiBarbecue />,
  },
  {
    name: "Khu vực ăn ngoài trời",
    icon: <FaUmbrellaBeach />,
  },
  {
    name: "Ban công hoặc sân riêng",
    icon: <MdBalcony />,
  },
  {
    name: "Lửa trại",
    icon: <GiCampfire />,
  },
  {
    name: "Vườn",
    icon: <MdYard />,
  },
  {
    name: "Đỗ xe miễn phí",
    icon: <AiFillCar />,
  },
  {
    name: "Tự check-in",
    icon: <FaKey />,
  },
  {
    name: "Cho phép thú cưng",
    icon: <MdPets />,
  },
];
