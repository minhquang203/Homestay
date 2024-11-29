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
    label: "Tất cả", // Hiển thị tất cả các loại bất động sản
    icon: <BiWorld />,
  },
  {
    img: "assets/beach_cat.jpg", // Hình ảnh danh mục bãi biển
    label: "Bãi biển", // Tài sản gần bãi biển
    icon: <TbBeach />,
    description: "Tài sản này gần bãi biển!",
  },
  {
    img: "assets/windmill_cat.webp",
    label: "Cối xay gió", // Tài sản có cối xay gió
    icon: <GiWindmill />,
    description: "Tài sản này có cối xay gió!",
  },
  {
    img: "assets/modern_cat.webp",
    label: "Thành phố hiện đại", // Tài sản ở thành phố nổi bật
    icon: <MdOutlineVilla />,
    description: "Tài sản này rất hiện đại!",
  },
  {
    img: "assets/countryside_cat.webp",
    label: "Nông thôn", // Tài sản ở vùng quê
    icon: <TbMountain />,
    description: "Tài sản này nằm ở vùng nông thôn!",
  },
  {
    img: "assets/pool_cat.jpg",
    label: "Hồ bơi đẹp", // Tài sản có hồ bơi nổi bật
    icon: <TbPool />,
    description: "Tài sản này có hồ bơi tuyệt đẹp!",
  },
  {
    img: "assets/island_cat.webp",
    label: "Hòn đảo", // Tài sản nằm trên đảo
    icon: <GiIsland />,
    description: "Tài sản này nằm trên một hòn đảo!",
  },
  {
    img: "assets/lake_cat.webp",
    label: "Gần hồ", // Tài sản gần hồ nước
    icon: <GiBoatFishing />,
    description: "Tài sản này gần hồ nước!",
  },
  {
    img: "assets/skiing_cat.jpg",
    label: "Khu trượt tuyết", // Tài sản có khu vực trượt tuyết
    icon: <FaSkiing />,
    description: "Tài sản này có hoạt động trượt tuyết!",
  },
  {
    img: "assets/castle_cat.webp",
    label: "Lâu đài", // Tài sản là lâu đài
    icon: <GiCastle />,
    description: "Tài sản này là một lâu đài cổ kính!",
  },
  {
    img: "assets/cave_cat.jpg",
    label: "Hang động", // Tài sản nằm trong hang động
    icon: <GiCaveEntrance />,
    description: "Tài sản này nằm trong một hang động kỳ bí!",
  },
  {
    img: "assets/camping_cat.jpg",
    label: "Cắm trại", // Tài sản có hoạt động cắm trại
    icon: <GiForestCamp />,
    description: "Tài sản này cung cấp các hoạt động cắm trại!",
  },
  {
    img: "assets/arctic_cat.webp",
    label: "Bắc Cực", // Tài sản nằm ở Bắc Cực
    icon: <BsSnow />,
    description: "Tài sản này nằm trong môi trường Bắc Cực!",
  },
  {
    img: "assets/desert_cat.webp",
    label: "Sa mạc", // Tài sản nằm ở sa mạc
    icon: <GiCactus />,
    description: "Tài sản này nằm ở sa mạc!",
  },
  {
    img: "assets/barn_cat.jpg",
    label: "Nhà kho", // Tài sản nằm trong nhà kho
    icon: <GiBarn />,
    description: "Tài sản này nằm trong một nhà kho!",
  },
  {
    img: "assets/lux_cat.jpg",
    label: "Sang trọng", // Tài sản cao cấp
    icon: <IoDiamond />,
    description: "Tài sản này hoàn toàn mới và sang trọng!",
  },
];

// Các loại phòng
export const types = [
  {
    name: "Toàn bộ chỗ ở", // Dành cho khách muốn thuê toàn bộ không gian
    description: "Khách sẽ có toàn bộ chỗ ở cho riêng mình",
    icon: <FaHouseUser />,
  },
  {
    name: "Phòng riêng", // Thuê một hoặc nhiều phòng trong nhà
    description:
      "Khách sẽ có phòng riêng trong nhà, cùng với các khu vực chung",
    icon: <BsFillDoorOpenFill />,
  },
  {
    name: "Phòng chung", // Không gian chia sẻ với người khác
    description:
      "Khách sẽ ngủ trong một phòng hoặc khu vực chung có thể được chia sẻ với bạn hoặc những người khác",
    icon: <FaPeopleRoof />,
  },
];

// Các tiện nghi
export const facilities = [
  { name: "Bồn tắm", icon: <PiBathtubFill /> },
  { name: "Sản phẩm cá nhân", icon: <FaPumpSoap /> },
  { name: "Vòi sen ngoài trời", icon: <FaShower /> },
  { name: "Máy giặt", icon: <BiSolidWasher /> },
  { name: "Máy sấy", icon: <BiSolidDryer /> },
  { name: "Móc treo quần áo", icon: <PiCoatHangerFill /> },
  { name: "Bàn ủi", icon: <TbIroning3 /> },
  { name: "Ti vi", icon: <PiTelevisionFill /> },
  { name: "Không gian làm việc", icon: <BsPersonWorkspace /> },
  { name: "Điều hòa", icon: <BsSnow /> },
  { name: "Máy sưởi", icon: <GiHeatHaze /> },
  { name: "Camera an ninh", icon: <GiCctvCamera /> },
  { name: "Bình chữa cháy", icon: <FaFireExtinguisher /> },
  { name: "Bộ sơ cứu", icon: <BiSolidFirstAid /> },
  { name: "Wifi", icon: <BiWifi /> },
  { name: "Dụng cụ nấu ăn", icon: <FaKitchenSet /> },
  { name: "Tủ lạnh", icon: <BiSolidFridge /> },
  { name: "Lò vi sóng", icon: <MdMicrowave /> },
  { name: "Bếp nấu", icon: <GiToaster /> },
  { name: "Lò nướng thịt", icon: <GiBarbecue /> },
  { name: "Khu ăn uống ngoài trời", icon: <FaUmbrellaBeach /> },
  { name: "Ban công/Sân hiên", icon: <MdBalcony /> },
  { name: "Lửa trại", icon: <GiCampfire /> },
  { name: "Khu vườn", icon: <MdYard /> },
  { name: "Bãi đỗ xe miễn phí", icon: <AiFillCar /> },
  { name: "Tự nhận phòng", icon: <FaKey /> },
  { name: "Cho phép thú cưng", icon: <MdPets /> },
];
