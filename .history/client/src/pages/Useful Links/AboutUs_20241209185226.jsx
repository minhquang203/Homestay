import React from "react";
import "../../styles/AboutUs.scss
";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>Về chúng tôi</h1>
        <p>Homestay - Nơi bạn tìm thấy sự thoải mái, yên bình.</p>
      </div>

      <div className="about-content">
        <div className="about-img">
          <img
            src="https://via.placeholder.com/600x400" // Thay bằng hình ảnh thực tế
            alt="Homestay"
          />
        </div>

        <div className="about-text">
          <h2>Chúng tôi là ai?</h2>
          <p>
            Homestay của chúng tôi cung cấp một không gian ấm cúng và tiện nghi
            cho khách du lịch, những người muốn thư giãn và tận hưởng kỳ nghỉ
            trong một môi trường gần gũi như ở nhà. Với các phòng nghỉ rộng rãi,
            thoải mái, chúng tôi cam kết mang lại trải nghiệm tuyệt vời cho khách
            hàng.
          </p>

          <h2>Vì sao chọn Homestay của chúng tôi?</h2>
          <ul>
            <li>Vị trí tuyệt vời, gần các địa điểm du lịch nổi tiếng.</li>
            <li>Phòng nghỉ sạch sẽ, tiện nghi, đầy đủ trang thiết bị hiện đại.</li>
            <li>Đội ngũ nhân viên thân thiện và chuyên nghiệp.</li>
            <li>Giá cả hợp lý và phù hợp với nhu cầu của bạn.</li>
          </ul>

          <h2>Liên hệ với chúng tôi</h2>
          <p>
            Địa chỉ: 123 Đường ABC, Thành phố XYZ, Việt Nam
            <br />
            Email: contact@homestay.com
            <br />
            Số điện thoại: 0123456789
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
