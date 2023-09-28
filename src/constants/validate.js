export function validatePassword(password) {
  if (password.length < 6) {
    return 'Mật khẩu phải chứa ít nhất 6 ký tự.';
  }
  return null;
}

export function validatePhoneNumber(phoneNumber) {
  if (!/^[01]/.test(phoneNumber)) {
    return 'Số điện thoại phải bắt đầu bằng số 0 hoặc 1.';
  }
  if (phoneNumber.length !== 10) {
    return 'Số điện thoại phải có 10 chữ số.';
  }

  // Kiểm tra xem chuỗi số điện thoại bắt đầu bằng số 0 hoặc 1 (tuỳ theo quy định của quốc gia)

  return null;
}
