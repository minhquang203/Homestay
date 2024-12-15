import { AiFillCar } from "react-icons/ai";
import {
  BiSolidDryer,
  BiSolidFirstAid,
  BiSolidFridge,
  BiSolidWasher,
  BiWifi,
  BiWorld,
} from "react-icons/bi";
import { BsPersonWorkspace, BsSnow } from "react-icons/bs";
import {
  FaFireExtinguisher,
  FaKey,
  FaPumpSoap,
  FaShower,
  FaSkiing,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { FaKitchenSet } from "react-icons/fa6";
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
    label: "Gần bãi biển",
    icon: <TbBeach />,
    description: "Chỗ nghỉ này gần bãi biển!",
  },
  {
    img: "assets/windmill_cat.webp",
    label: "Cối xay gió",
    icon: <GiWindmill />,
    description: "Chỗ nghỉ này có cối xay gió!",
  },
  {
    img: "assets/modern_cat.webp",
    label: "Thành phố nổi tiếng",
    icon: <MdOutlineVilla />,
    description: "Chỗ nghỉ này hiện đại!",
  },
  {
    img: "assets/countryside_cat.webp",
    label: "Nông thôn",
    icon: <TbMountain />,
    description: "Chỗ nghỉ này ở vùng nông thôn!",
  },
  {
    img: "assets/pool_cat.jpg",
    label: "Hồ bơi tuyệt vời",
    icon: <TbPool />,
    description: "Chỗ nghỉ này có hồ bơi tuyệt đẹp!",
  },
  {
    img: "assets/island_cat.webp",
    label: "Đảo",
    icon: <GiIsland />,
    description: "Chỗ nghỉ này nằm trên đảo!",
  },
  {
    img: "assets/lake_cat.webp",
    label: "Gần hồ",
    icon: <GiBoatFishing />,
    description: "Chỗ nghỉ này gần hồ!",
  },
  {
    img: "assets/skiing_cat.jpg",
    label: "Trượt tuyết",
    icon: <FaSkiing />,
    description: "Chỗ nghỉ này có hoạt động trượt tuyết!",
  },
  {
    img: "assets/castle_cat.webp",
    label: "Lâu đài",
    icon: <GiCastle />,
    description: "Chỗ nghỉ này là một lâu đài cổ!",
  },
  {
    img: "assets/cave_cat.jpg",
    label: "Hang động",
    icon: <GiCaveEntrance />,
    description: "Chỗ nghỉ này nằm trong một hang động!",
  },
  {
    img: "assets/camping_cat.jpg",
    label: "Cắm trại",
    icon: <GiForestCamp />,
    description: "Chỗ nghỉ này cung cấp hoạt động cắm trại!",
  },
  {
    img: "assets/arctic_cat.webp",
    label: "Vùng băng giá",
    icon: <BsSnow />,
    description: "Chỗ nghỉ này nằm ở vùng băng giá!",
  },
  {
    img: "assets/desert_cat.webp",
    label: "Sa mạc",
    icon: <GiCactus />,
    description: "Chỗ nghỉ này nằm trên sa mạc!",
  },
  {
    img: "assets/barn_cat.jpg",
    label: "Nhà kho",
    icon: <GiBarn />,
    description: "Chỗ nghỉ này là một nhà kho!",
  },
  {
    img: "assets/lux_cat.jpg",
    label: "Sang trọng",
    icon: <IoDiamond />,
    description: "Chỗ nghỉ này hoàn toàn mới và sang trọng!",
  },
];


export const facilities = [
  {
    name: "Bath tub",
    icon: <PiBathtubFill />,
  },
  {
    name: "Personal care products",
    icon: <FaPumpSoap />,
  },
  {
    name: "Outdoor shower",
    icon: <FaShower />,
  },
  {
    name: "Washer",
    icon: <BiSolidWasher />,
  },
  {
    name: "Dryer",
    icon: <BiSolidDryer />,
  },
  {
    name: "Hangers",
    icon: <PiCoatHangerFill />,
  },
  {
    name: "Iron",
    icon: <TbIroning3 />,
  },
  {
    name: "TV",
    icon: <PiTelevisionFill />,
  },
  {
    name: "Dedicated workspace",
    icon: <BsPersonWorkspace />
  },
  {
    name: "Air Conditioning",
    icon: <BsSnow />,
  },
  {
    name: "Heating",
    icon: <GiHeatHaze />,
  },
  {
    name: "Security cameras",
    icon: <GiCctvCamera />,
  },
  {
    name: "Fire extinguisher",
    icon: <FaFireExtinguisher />,
  },
  {
    name: "First Aid",
    icon: <BiSolidFirstAid />,
  },
  {
    name: "Wifi",
    icon: <BiWifi />,
  },
  {
    name: "Cooking set",
    icon: <FaKitchenSet />,
  },
  {
    name: "Refrigerator",
    icon: <BiSolidFridge />,
  },
  {
    name: "Microwave",
    icon: <MdMicrowave />,
  },
  {
    name: "Stove",
    icon: <GiToaster />,
  },
  {
    name: "Barbecue grill",
    icon: <GiBarbecue />,
  },
  {
    name: "Outdoor dining area",
    icon: <FaUmbrellaBeach />,
  },
  {
    name: "Private patio or Balcony",
    icon: <MdBalcony />,
  },
  {
    name: "Camp fire",
    icon: <GiCampfire />,
  },
  {
    name: "Garden",
    icon: <MdYard />,
  },
  {
    name: "Free parking",
    icon: <AiFillCar />,
  },
  {
    name: "Self check-in",
    icon: <FaKey />
  },
  {
    name: " Pet allowed",
    icon: <MdPets />
  }
];