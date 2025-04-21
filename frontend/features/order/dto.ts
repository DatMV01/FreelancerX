export enum OrderStatus {
  UNPAID = "UNPAID", // 🟥 Đơn hàng chưa được thanh toán
  PENDING = "PENDING", // 🟡 Đơn hàng đã được tạo, đang chờ freelancer chấp nhận
  ACCEPTED = "ACCEPTED", // 🟢 Freelancer đã chấp nhận đơn, chuẩn bị bắt đầu
  IN_PROGRESS = "IN_PROGRESS", // 🔨 Freelancer đang thực hiện đơn hàng
  REVISION_REQUESTED = "REVISION_REQUESTED", // 🔄 Buyer yêu cầu chỉnh sửa/giao lại
  DELIVERED = "DELIVERED", // 📦 Freelancer đã gửi sản phẩm (chờ buyer phản hồi)
  COMPLETED = "COMPLETED", // ✅ Đơn hàng đã hoàn tất (buyer xác nhận hoặc tự động sau thời gian)
  CANCEL = "CANCEL",
}

export const orderStatus = Object.values(OrderStatus);
export const orderFreelancerStatus = orderStatus.filter((_) => _ !== "UNPAID");

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
