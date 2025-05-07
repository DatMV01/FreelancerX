export enum GigStatus2 {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  PAUSED = 'PAUSED',
  // PENDING_APPROVAL = 'PENDING_APPROVAL',
  REJECTED = 'REJECTED',
  //DELETED = 'DELETED',
  // REQUIRE_MODIFICATION = "REQUIRE_MODIFICATION",
}




export enum GigStatus {
  /** Gig đang hiển thị công khai và có thể được mua bởi khách hàng */
  ACTIVE = 'ACTIVE',

  /** Gig đang được soạn thảo, chưa sẵn sàng hiển thị công khai */
  DRAFT = 'DRAFT',

  /** Gig đã bị tạm dừng, không còn hiển thị với người dùng */
  PAUSED = 'PAUSED',

  /** Gig bị từ chối do vi phạm chính sách hoặc không đạt yêu cầu */
  REJECTED = 'REJECTED',
}
