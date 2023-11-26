export function validatePassword(password) {
  if (password.length < 6) {
    return 'Mật khẩu phải chứa ít nhất 6 ký tự.';
  }
  return null;
}

export function validatePhoneNumber(phoneNumber) {
  // Kiểm tra xem chuỗi số điện thoại bắt đầu bằng số 0 hoặc 1 (tuỳ theo quy định của quốc gia)
  if (!/^[0]/.test(phoneNumber)) {
    return 'Số điện thoại phải bắt đầu bằng số 0.';
  }

  // Kiểm tra xem số điện thoại có đúng 10 chữ số không
  if (phoneNumber.length !== 10) {
    return 'Số điện thoại phải có 10 chữ số.';
  }

  // Kiểm tra xem số điện thoại chỉ chứa chữ số và không chứa chữ cái và dấu '.'
  if (!/^[0-9]+$/.test(phoneNumber)) {
    return 'Số điện thoại chỉ được chứa số thứ tự';
  }

  // Nếu số điện thoại hợp lệ, trả về null
  return null;
}
