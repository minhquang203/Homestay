import {
  BiWorld
} from "react-icons/bi";
import { BsSnow } from "react-icons/bs";
import {
  FaSkiing
} from "react-icons/fa";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill
} from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";

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

