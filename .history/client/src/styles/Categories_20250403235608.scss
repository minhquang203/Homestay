import { Link } from "react-router-dom";
import { categories } from "../data";
import "../styles/Categories.scss";

const Categories = () => {
  return (
    <div className="categories">
      <h1>Khám phá các danh mục hàng đầu</h1>
      <p>
        Tại HomeStayMove, chúng tôi cung cấp nhiều lựa chọn nhà nghỉ dưỡng phù hợp
        với mọi loại du khách. Từ biệt thự sang trọng đến căn hộ ấm cúng, mỗi
        chỗ nghỉ đều mang đến sự thoải mái và tiện nghi như ở nhà. Hãy đắm mình
        vào văn hóa địa phương và tạo ra những kỷ niệm khó quên tại điểm đến mơ
        ước của bạn. Với HomeStayMove , chuyến đi của bạn sẽ trở nên trọn vẹn hơn
        bao giờ hết.
      </p>

      <div className="categories_list">
        {categories?.slice(1, 7).map((category, index) => (
          <Link to={`/properties/category/${category.label}`}>
            <div className="category">
              <img src={category.img} alt={category.label} />
              <div className="overlay">
                <div className="category_text">
                  <div className="category_text_icon">
                    {category.icon}
                    <p>{category.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
