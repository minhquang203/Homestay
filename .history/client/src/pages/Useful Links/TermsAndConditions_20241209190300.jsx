import React from "react";
import { Link } from "react-router-dom";
import "../../styles/TermsAndConditions.scss"; // Nếu có sử dụng SCSS hoặc CSS

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Điều khoản và Điều kiện</h1>
        <p>
          Xin vui lòng đọc kỹ các điều khoản và điều kiện dưới đây trước khi sử
          dụng dịch vụ của chúng tôi.
        </p>
      </div>

      <div className="terms-content">
        <h2>1. Giới thiệu</h2>
        <p>
          Đây là các điều khoản và điều kiện áp dụng cho việc sử dụng dịch vụ
          của chúng tôi tại Homestay. Khi bạn truy cập hoặc sử dụng dịch vụ của
          chúng tôi, bạn đồng ý tuân thủ các điều khoản này.
        </p>

        <h2>2. Điều kiện sử dụng</h2>
        <p>
          - Bạn phải trên 18 tuổi để sử dụng dịch vụ của chúng tôi. <br />
          - Các thông tin cá nhân mà bạn cung cấp phải chính xác và đầy đủ.
        </p>

        <h2>3. Quyền và nghĩa vụ của người dùng</h2>
        <p>
          - Người dùng có trách nhiệm cung cấp thông tin chính xác khi đăng ký.
          <br />
          - Không được sử dụng dịch vụ cho mục đích vi phạm pháp luật hoặc hành
          vi không đúng đắn.
        </p>

        <h2>4. Chính sách thanh toán</h2>
        <p>
          Các khoản thanh toán phải được thực hiện trước khi sử dụng dịch vụ.
          <br />
          Chúng tôi chấp nhận các phương thức thanh toán qua thẻ tín dụng, thẻ
          ghi nợ hoặc chuyển khoản ngân hàng.
        </p>

        <h2>5. Chính sách bảo mật</h2>
        <p>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và không chia sẻ
          với bên thứ ba nếu không có sự đồng ý của bạn, trừ khi yêu cầu bởi
          pháp luật.
        </p>

        <h2>6. Thay đổi điều khoản</h2>
        <p>
          Chúng tôi có quyền thay đổi các điều khoản và điều kiện này bất kỳ
          lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang
          web của chúng tôi.
        </p>

        <div className="back-to-home">
          <Link to="/">Trở về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
