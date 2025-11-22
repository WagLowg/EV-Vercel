-- ============================================
-- TEST DATA SETUP - MANAGER DASHBOARD
-- ============================================

-- 1. TẠO 2 MANAGERS (Center 1 & Center 2)
-- ============================================

-- Manager Center 1
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at,
  updated_at
) VALUES (
  'Nguyễn Văn Quản Lý',
  'manager1@evservice.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: manager123
  '0901234567',
  'manager',
  1,
  NOW(),
  NOW()
);

-- Manager Center 2
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at,
  updated_at
) VALUES (
  'Trần Thị Quản Lý',
  'manager2@evservice.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: manager123
  '0902345678',
  'manager',
  2,
  NOW(),
  NOW()
);

-- ============================================
-- 2. TẠO STAFF CHO MỖI CENTER
-- ============================================

-- Staff Center 1
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at,
  updated_at
) VALUES (
  'Lê Văn Nhân Viên 1',
  'staff1@evservice.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: staff123
  '0903456789',
  'staff',
  1,
  NOW(),
  NOW()
);

-- Staff Center 2
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at,
  updated_at
) VALUES (
  'Phạm Thị Nhân Viên 2',
  'staff2@evservice.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: staff123
  '0904567890',
  'staff',
  2,
  NOW(),
  NOW()
);

-- ============================================
-- 3. TẠO TECHNICIANS CHO MỖI CENTER
-- ============================================

-- Technician Center 1
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at,
  updated_at
) VALUES (
  'Hoàng Văn Kỹ Thuật 1',
  'tech1@evservice.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: tech123
  '0905678901',
  'technician',
  1,
  NOW(),
  NOW()
);

-- Technician Center 2
INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at,
  updated_at
) VALUES (
  'Vũ Thị Kỹ Thuật 2',
  'tech2@evservice.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: tech123
  '0906789012',
  'technician',
  2,
  NOW(),
  NOW()
);

-- ============================================
-- 4. TẠO CUSTOMERS (Không có centerId)
-- ============================================

INSERT INTO users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  center_id,
  created_at,
  updated_at
) VALUES 
(
  'Nguyễn Văn Khách',
  'customer1@test.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: customer123
  '0907890123',
  'customer',
  NULL,  -- Customer không có centerId
  NOW(),
  NOW()
),
(
  'Trần Thị Khách Hàng',
  'customer2@test.com',
  '$2a$10$X5wFuWd9FQqH8LqFqL.Jy.SZp9Zy9c0J5l8K2.R7B8wC1qH5vO4C6',  -- Password: customer123
  '0908901234',
  'customer',
  NULL,
  NOW(),
  NOW()
);

-- ============================================
-- 5. KIỂM TRA DỮ LIỆU
-- ============================================

-- Xem tất cả users vừa tạo
SELECT 
  id,
  full_name,
  email,
  role,
  center_id,
  phone
FROM users
WHERE email LIKE '%@evservice.com' OR email LIKE '%@test.com'
ORDER BY 
  CASE role
    WHEN 'manager' THEN 1
    WHEN 'staff' THEN 2
    WHEN 'technician' THEN 3
    WHEN 'customer' THEN 4
  END,
  center_id;

-- ============================================
-- 6. UPDATE USER HIỆN CÓ (OPTIONAL)
-- ============================================

-- Nếu đã có admin, chuyển thành manager
-- UPDATE users 
-- SET role = 'manager', center_id = 1 
-- WHERE email = 'admin@example.com';

-- Hoặc update theo ID
-- UPDATE users 
-- SET role = 'manager', center_id = 1 
-- WHERE id = 1;

-- ============================================
-- 7. HASH PASSWORD CHÍNH XÁC
-- ============================================

-- ⚠️ NOTE: Password hash trên chỉ là VÍ DỤ!
-- Bạn cần generate hash thật từ backend hoặc dùng tool:

-- Option A: Generate từ Java (Spring Boot)
-- BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
-- String hash = encoder.encode("manager123");

-- Option B: Generate từ online tool
-- https://bcrypt-generator.com/
-- Input: manager123
-- Rounds: 10
-- Copy hash vào SQL

-- Option C: Tạo từ backend API
-- POST /api/auth/register với password "manager123"
-- Sau đó UPDATE role và center_id

-- ============================================
-- 8. CREDENTIALS SUMMARY
-- ============================================

/*
=== LOGIN CREDENTIALS ===

Manager Center 1:
  Email: manager1@evservice.com
  Password: manager123
  Expected: Redirect to /manager, shows "Center #1"

Manager Center 2:
  Email: manager2@evservice.com
  Password: manager123
  Expected: Redirect to /manager, shows "Center #2"

Staff Center 1:
  Email: staff1@evservice.com
  Password: staff123
  Expected: Redirect to /staff

Staff Center 2:
  Email: staff2@evservice.com
  Password: staff123
  Expected: Redirect to /staff

Technician Center 1:
  Email: tech1@evservice.com
  Password: tech123
  Expected: Redirect to /technician

Technician Center 2:
  Email: tech2@evservice.com
  Password: tech123
  Expected: Redirect to /technician

Customer 1:
  Email: customer1@test.com
  Password: customer123
  Expected: Redirect to /home

Customer 2:
  Email: customer2@test.com
  Password: customer123
  Expected: Redirect to /home
*/

-- ============================================
-- 9. CLEANUP (Nếu cần xóa test data)
-- ============================================

-- DELETE FROM users WHERE email LIKE '%@evservice.com';
-- DELETE FROM users WHERE email LIKE '%@test.com';

-- ============================================
-- 10. VERIFY SETUP
-- ============================================

-- Count users by role
SELECT 
  role,
  center_id,
  COUNT(*) as total
FROM users
WHERE email LIKE '%@evservice.com' OR email LIKE '%@test.com'
GROUP BY role, center_id
ORDER BY 
  CASE role
    WHEN 'manager' THEN 1
    WHEN 'staff' THEN 2
    WHEN 'technician' THEN 3
    WHEN 'customer' THEN 4
  END,
  center_id;

-- Expected output:
-- role       | center_id | total
-- -----------|-----------|------
-- manager    | 1         | 1
-- manager    | 2         | 1
-- staff      | 1         | 1
-- staff      | 2         | 1
-- technician | 1         | 1
-- technician | 2         | 1
-- customer   | NULL      | 2
