import React from "react";
import "./ServicesSection.css";

const services = [
  {
    title: "Bảo Dưỡng Định Kỳ",
    description:
      "Thay dầu, kiểm tra phanh, lọc gió, và các dịch vụ bảo dưỡng theo lịch trình nhà sản xuất",
    items: [
      "✓ Thay dầu động cơ",
      "✓ Kiểm tra hệ thống phanh",
      "✓ Thay lọc gió, lọc dầu",
      "✓ Kiểm tra lốp xe",
    ],
    iconClass: "blue-icon",
    iconPath:
      "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z",
  },
  {
    title: "Sửa Chữa Động Cơ",
    description:
      "Chẩn đoán và sửa chữa các vấn đề về động cơ với thiết bị hiện đại và kỹ thuật viên chuyên nghiệp",
    items: [
      "✓ Chẩn đoán lỗi động cơ",
      "✓ Sửa chữa hệ thống làm mát",
      "✓ Thay thế phụ tùng",
      "✓ Điều chỉnh động cơ",
    ],
    iconClass: "blue-icon",
    iconPath:
      "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
  },
  {
    title: "Hệ Thống Phanh & Lốp",
    description:
      "Kiểm tra, bảo dưỡng và thay thế hệ thống phanh cùng các dịch vụ về lốp xe",
    items: [
      "✓ Thay má phanh",
      "✓ Bảo dưỡng đĩa phanh",
      "✓ Cân bằng lốp",
      "✓ Thay lốp mới",
    ],
    iconClass: "orange-icon",
    iconPath:
      "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z",
  },
  {
    title: "Hệ Thống Điện",
    description:
      "Kiểm tra và sửa chữa hệ thống điện, bình ắc quy và các thiết bị điện tử trên xe",
    items: [
      "✓ Kiểm tra ắc quy",
      "✓ Sửa hệ thống đánh lửa",
      "✓ Thay bóng đèn",
      "✓ Chẩn đoán điện tử",
    ],
    iconClass: "green-icon",
    iconPath:
      "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z",
  },
  {
    title: "Điều Hòa & Làm Mát",
    description:
      "Bảo dưỡng hệ thống điều hòa không khí và hệ thống làm mát động cơ",
    items: [
      "✓ Nạp gas điều hòa",
      "✓ Vệ sinh dàn lạnh",
      "✓ Thay lọc gió điều hòa",
      "✓ Sửa máy nén khí",
    ],
    iconClass: "blue-icon",
    iconPath:
      "M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10 2.04,10.5 2.14,11H3.17C3.06,10.5 3,10 3,9.5A4.5,4.5 0 0,1 7.5,5A4.5,4.5 0 0,1 12,9.5C12,10 11.94,10.5 11.83,11H12.86C12.96,10.5 13,10 13,9.5A5.5,5.5 0 0,0 7.5,4M16.5,4A5.5,5.5 0 0,0 11,9.5C11,10 11.04,10.5 11.14,11H12.17C12.06,10.5 12,10 12,9.5A4.5,4.5 0 0,1 16.5,5A4.5,4.5 0 0,1 21,9.5C21,10 20.94,10.5 20.83,11H21.86C21.96,10.5 22,10 22,9.5A5.5,5.5 0 0,0 16.5,4M12,13L16,18H13V22H11V18H8L12,13Z",
  },
  {
    title: "Chăm Sóc Ngoại Thất",
    description:
      "Dịch vụ rửa xe, đánh bóng và bảo vệ ngoại thất xe hơi của bạn",
    items: [
      "✓ Rửa xe chuyên nghiệp",
      "✓ Đánh bóng sơn xe",
      "✓ Phủ ceramic",
      "✓ Vệ sinh nội thất",
    ],
    iconClass: "red-icon",
    iconPath:
      "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",
  },
];

const ServiceCard = ({ title, description, items, iconClass, iconPath }) => (
  <div className="service-card">
    <div className={`service-icon ${iconClass}`}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d={iconPath} />
      </svg>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <ul className="service-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const ServicesSection = ({ onNavigate }) => (
  <section id="services" className="services-section">
    {/* Header Section */}
    <div className="section-header">
      <h2 className="section-title">Dịch Vụ Của Chúng Tôi</h2>
      <p className="section-description">
        CarCare cung cấp đa dạng dịch vụ bảo dưỡng và sửa chữa xe hơi chuyên nghiệp.
        Đội ngũ kỹ thuật viên giàu kinh nghiệm cùng trang thiết bị hiện đại đảm bảo
        xe của bạn luôn trong tình trạng hoạt động tốt nhất.
      </p>
    </div>

    {/* Services Grid */}
    <div className="services-grid">
      {services.map((service) => (
        <ServiceCard key={service.title} {...service} />
      ))}
    </div>

    {/* Call to Action */}
    <div className="services-cta">
      <button
        className="cta-button primary"
        onClick={() => onNavigate && onNavigate("booking")}
      >
        Đặt Lịch Bảo Dưỡng Ngay
      </button>
      <p className="cta-text">Đặt lịch online - Tiện lợi và nhanh chóng</p>
    </div>
  </section>
);

export default ServicesSection;

