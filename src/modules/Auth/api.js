export const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'อีเมลนี้ ได้ลงทะเบียนในระบบแล้ว';
    case 'auth/invalid-email':
      return 'รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่อีกครั้ง';
    case 'auth/wrong-password':
      return 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่อีกครั้ง';
    case 'auth/weak-password':
      return 'รหัสผ่านง่ายเกินไป';
    case 'auth/too-many-requests':
      return 'พยายามเข้าสู่ระบบไม่สำเร็จหลายครั้งเกินไป โปรดลองอีกครั้งในภายหลัง';
    case 'auth/user-not-found':
      return 'ไม่พบผู้ใช้งานในระบบ กรุณาลงทะเบียน';
    case 'auth/popup-closed-by-user':
      return 'Popup ถูกปิดโดยผู้ใช้';
    case 'auth/network-request-failed':
      return 'การสื่อสารขัดข้อง';
    default:
      return error.message;
  }
};
